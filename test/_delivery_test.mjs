// Backend logic integration test for the delivery functions,
// running against an in-memory mock Supabase.
import { verifyDeliverySessionToken } from "../netlify/functions/_shared/deliveryAuth.js";
import deliveryApi from "../netlify/functions/delivery-api.js";
import { businessDayKey } from "../netlify/functions/delivery-api.js";
import deliveryAgents from "../netlify/functions/delivery-agents.js";
import deliveryLogin from "../netlify/functions/delivery-login.js";
import deliveryTrack from "../netlify/functions/delivery-track.js";
import { __mockReset, __seedAgent, __seedDelivery } from "../netlify/functions/_shared/supabase.mock.js";
import bcrypt from "bcryptjs";

process.env.SUPABASE_URL = "http://test";
process.env.SUPABASE_SERVICE_ROLE_KEY = "svc";
process.env.DELIVERY_SESSION_SECRET = "test-secret";
process.env.DELIVERY_MANAGER_PASSWORD = "manager123";
process.env.DELIVERY_USE_MOCK_SUPABASE = "true";
delete process.env.DELIVERY_AGENT_PASSWORD;

let pass = 0, fail = 0;
function assert(cond, msg) {
  if (cond) { pass++; console.log("  \u2713 " + msg); }
  else { fail++; console.log("  \u2717 " + msg); }
}

const wrap = (httpMethod, body, headers = {}) => ({
  httpMethod,
  body: body ? JSON.stringify(body) : null,
  headers: { authorization: headers.authorization || "" },
  path: "/xyz",
});

// The wrapped handlers return a web Response; parse it to { status, body }.
async function call(fnPromise) {
  const res = await fnPromise;
  return { status: res.status, body: await res.json() };
}

async function seedAgentFull(name, username, phone) {
  const agent = __seedAgent(name, username, phone);
  agent.password_hash = await bcrypt.hash("agent-pass", 10);
  return agent;
}

async function main() {
  console.log("\n== Delivery functions integration test (mock Supabase) ==\n");

  __mockReset();

  // -- Manager login --
  const badManager = await call(deliveryLogin(wrap("POST", { role: "manager", password: "wrong" })));
  assert(badManager.status === 401, "manager rejects wrong password");
  const managerLogin = await call(deliveryLogin(wrap("POST", { role: "manager", password: "manager123" })));
  const managerToken = managerLogin.body.token;
  assert(!!managerToken, "manager login returns token");

  // -- Agent login --
  const agentA = await seedAgentFull("Alice", "alice", "96170000001");
  await seedAgentFull("Bob", "bob", "96170000002");
  const badAgent = await call(deliveryLogin(wrap("POST", { role: "delivery", username: "alice", password: "wrong" })));
  assert(badAgent.status === 401, "agent rejects wrong password");
  const missing = await call(deliveryLogin(wrap("POST", { role: "delivery", username: "nobody", password: "x" })));
  assert(missing.status === 401, "unknown agent rejected");
  const aliceLogin = await call(deliveryLogin(wrap("POST", { role: "delivery", username: "alice", password: "agent-pass" })));
  const aliceToken = aliceLogin.body.token;
  assert(!!aliceToken, "agent login returns token");

  // -- Session verification --
  const verified = verifyDeliverySessionToken(aliceToken);
  assert(verified && verified.role === "delivery" && verified.agentId === agentA.id && verified.phone === "96170000001", "agent token carries id + phone");
  assert(verifyDeliverySessionToken("garbage.token.here") === null, "invalid token rejected");
  assert(businessDayKey("2026-09-01T06:59:00Z") === "2026-08-31" && businessDayKey("2026-09-01T07:00:00Z") === "2026-09-01", "business day resets at 10 AM Beirut time");

  // -- Manager creates delivery, phone resolved server-side from agent account --
  const createRes = await call(deliveryApi(wrap("POST", {
    price: "15", agentId: agentA.id, customer_phone: "96170000009", address: "Baraachit",
  }, { authorization: `Bearer ${managerToken}` })));
  assert(createRes.status === 201, "manager creates delivery (201)");
  const createdDelivery = createRes.body.delivery;
  assert(createdDelivery.title === "Order 1", "delivery title starts at Order 1 with a new sequence");
  assert(createdDelivery.agent && createdDelivery.agent.phone === "96170000001", "delivery resolved to agent's phone server-side");
  assert(createdDelivery.delivery_fee === 150000, "delivery area returns its fixed delivery fee");
  assert(createdDelivery.status === "pending", "new delivery is pending");

  // -- Customer tracking only exposes order status information --
  const tracked = await call(deliveryTrack({ httpMethod: "GET", body: null, headers: {}, path: `/xyz?id=${createdDelivery.id}` }));
  assert(tracked.status === 200 && tracked.body.delivery.status === "pending", "customer can track delivery status");
  assert(tracked.body.delivery.price === "15", "tracking response includes order price");
  assert(!("customer_phone" in tracked.body.delivery) && !("address" in tracked.body.delivery), "tracking response hides private delivery details");

  // -- Manager list returns deliveries with agent info --
  const managerList = await call(deliveryApi(wrap("GET", null, { authorization: `Bearer ${managerToken}` })));
  assert(managerList.body.deliveries.length === 1, "manager lists 1 delivery");
  assert(managerList.body.deliveries[0].agent && managerList.body.deliveries[0].agent.name === "Alice", "manager sees agent name on delivery");
  assert(managerList.body.deliveries[0].delivery_fee === 150000, "manager list includes the delivery fee");

  // -- Manager can use a custom delivery area and fee --
  const customCreate = await call(deliveryApi(wrap("POST", {
    price: "20", agentId: agentA.id, address: "custom", custom_address: "Custom Village", delivery_fee: 275000,
  }, { authorization: `Bearer ${managerToken}` })));
  assert(customCreate.status === 201 && customCreate.body.delivery.address === "Custom Village", "manager creates a custom delivery area");
  assert(customCreate.body.delivery.delivery_fee === 275000, "custom delivery fee is saved in LL");

  // -- Agent can only see own deliveries --
  const bobLogin = await call(deliveryLogin(wrap("POST", { role: "delivery", username: "bob", password: "agent-pass" })));
  const bobToken = bobLogin.body.token;
  const aliceList = await call(deliveryApi(wrap("GET", null, { authorization: `Bearer ${aliceToken}` })));
  assert(aliceList.body.deliveries.length === 2, "agent sees their assigned deliveries");
  const bobList = await call(deliveryApi(wrap("GET", null, { authorization: `Bearer ${bobToken}` })));
  assert(bobList.body.deliveries.length === 0, "other agent sees no deliveries");

  // -- Agent cannot accept someone else's delivery --
  const bobAccept = await call(deliveryApi(wrap("PATCH", { id: createdDelivery.id, action: "accept" }, { authorization: `Bearer ${bobToken}` })));
  assert(bobAccept.status === 403, "agent cannot accept another's delivery");

  // -- Agent accepts own delivery --
  const acceptRes = await call(deliveryApi(wrap("PATCH", { id: createdDelivery.id, action: "accept" }, { authorization: `Bearer ${aliceToken}` })));
  assert(acceptRes.body.delivery.status === "accepted" && !!acceptRes.body.delivery.accepted_at, "agent accepts own delivery");

  // -- Cannot accept twice --
  const doubleAccept = await call(deliveryApi(wrap("PATCH", { id: createdDelivery.id, action: "accept" }, { authorization: `Bearer ${aliceToken}` })));
  assert(doubleAccept.status === 400, "cannot accept already-handled delivery");

  // -- Agent marks delivered --
  const deliverRes = await call(deliveryApi(wrap("PATCH", { id: createdDelivery.id, action: "delivered" }, { authorization: `Bearer ${aliceToken}` })));
  assert(deliverRes.body.delivery.status === "delivered" && !!deliverRes.body.delivery.delivered_at, "agent marks delivered");

  // -- Manager cannot cancel a delivered order --
  const cancelDelivered = await call(deliveryApi(wrap("PATCH", { id: createdDelivery.id, action: "cancel" }, { authorization: `Bearer ${managerToken}` })));
  assert(cancelDelivered.status === 400, "manager cannot cancel delivered order");

  // -- Manager cancels a pending order --
  const d2 = __seedDelivery({ title: "Second", agent_id: agentBIdOf("bob") });
  const cancelRes = await call(deliveryApi(wrap("PATCH", { id: d2.id, action: "cancel" }, { authorization: `Bearer ${managerToken}` })));
  assert(cancelRes.body.delivery.status === "cancelled", "manager cancels pending order");

  // -- Agent management: cannot be done by an agent --
  const agentTriesMgmt = await call(deliveryAgents(wrap("GET", null, { authorization: `Bearer ${aliceToken}` })));
  assert(agentTriesMgmt.status === 403, "agents cannot access admin agent API");

  // -- Manager creates an agent --
  const mkAgent = await call(deliveryAgents(wrap("POST", { name: "Carol", username: "carol", password: "carolpass", phone: "96170000003" }, { authorization: `Bearer ${managerToken}` })));
  assert(mkAgent.status === 201, "manager creates agent");
  assert(mkAgent.body.agent.phone === "96170000003", "phone normalized on create");

  // -- Manager updates agent phone & password --
  const upd = await call(deliveryAgents(wrap("PATCH", { id: mkAgent.body.agent.id, phone: "96175555555" }, { authorization: `Bearer ${managerToken}` })));
  assert(upd.body.agent.phone === "96175555555", "manager updates agent phone");

  // -- Normalize phone strips + and 00 --
  const mk2 = await call(deliveryAgents(wrap("POST", { name: "D", username: "dave", password: "xxxx", phone: "+961 70 123 456" }, { authorization: `Bearer ${managerToken}` })));
  assert(mk2.body.agent.phone === "96170123456", "phone fully normalized");

  // -- Manager deletes agent without pending deliveries --
  const delRes = await call(deliveryAgents({
    httpMethod: "DELETE", body: null,
    headers: { authorization: `Bearer ${managerToken}` },
    path: `/xyz?id=${mk2.body.agent.id}`,
  }));
  assert(delRes.status === 200, "manager deletes agent");

  // -- Manager cannot delete agent with pending deliveries --
  const busy = __seedAgent("Busy", "busy", "96179999999");
  __seedDelivery({ title: "Hanging", agent_id: busy.id, status: "pending" });
  const delBusy = await call(deliveryAgents({
    httpMethod: "DELETE", body: null,
    headers: { authorization: `Bearer ${managerToken}` },
    path: `/xyz?id=${busy.id}`,
  }));
  assert(delBusy.status === 400, "manager cannot delete agent with pending deliveries");

  // -- Unauthenticated rejected --
  const anon = await call(deliveryApi(wrap("GET", null, {})));
  assert(anon.status === 401, "unauthenticated request rejected");

  console.log(`\n${pass} passed, ${fail} failed`);
  process.exit(fail ? 1 : 0);
}

// Return the seeded id for a username (helper used before storing ids passed around).
import { __mockState } from "../netlify/functions/_shared/supabase.mock.js";
function agentBIdOf(username) {
  return __mockState().agents.find((a) => a.username === username).id;
}

main().catch((e) => { console.error("ERROR", e); process.exit(1); });
