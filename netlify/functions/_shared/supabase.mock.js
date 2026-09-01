let state = {
  agents: [],
  deliveries: [],
  nextAgent: 1,
  nextDelivery: 1,
};

function pickFields(row, fieldExpr) {
  if (fieldExpr === "*" || !fieldExpr) return { ...row };
  return fieldExpr.split(",").map((s) => s.trim()).reduce((out, f) => { out[f] = row[f]; return out; }, {});
}

function applyPreds(rows, preds) {
  let out = rows;
  for (const [col, op, val] of preds) {
    out = out.filter((r) => (op === "eq" ? r[col] === val : op === "in" ? val.includes(r[col]) : true));
  }
  return out;
}

function newId(store) {
  const k = store === "agents" ? "nextAgent" : "nextDelivery";
  const id = String(state[k]);
  state[k] = state[k] + 1;
  return id;
}

function makeChain(table, store) {
  const preds = [];
  let op = null; // "select" | "update" | "delete" | "insert"
  let patch = null;
  let pendingInsert = null;
  let cols = "*";
  let order, asc, limit;

  const c = {
    select(cl) { op = op || "select"; cols = cl || "*"; return c; },
    eq(col, val) { preds.push([col, "eq", val]); return c; },
    in(col, val) { preds.push([col, "in", val]); return c; },
    order(col, o) { order = col; asc = o?.ascending; return c; },
    limit(n) { limit = n; return c; },
    insert(rows) { op = "insert"; pendingInsert = rows; return c; },
    update(p) { op = "update"; patch = p; return c; },
    delete() { op = "delete"; return c; },

    single() { return finish(true); },
    maybeSingle() { return finish(false, true); },
  };

  function finish(isSingle, isMaybe) {
    if (op === "insert") {
      const list = Array.isArray(pendingInsert) ? pendingInsert : [pendingInsert];
      const inserted = list.map((r) => {
        const row = { ...r, id: newId(store), created_at: new Date().toISOString() };
        state[store].push(row);
        return row;
      });
      return { data: pickFields(inserted[0], cols), error: null };
    }
    if (op === "update") {
      const matched = applyPreds(state[store], preds);
      matched.forEach((r) => Object.assign(r, patch));
      if (isSingle) {
        return { data: matched.length ? pickFields(matched[0], cols) : null, error: matched.length > 1 ? { code: "PGRST116" } : null };
      }
      return { data: matched.map((r) => pickFields(r, cols)), error: null };
    }
    if (op === "delete") {
      const targets = applyPreds(state[store], preds);
      const ids = new Set(targets.map((t) => t.id));
      state[store] = state[store].filter((r) => !ids.has(r.id));
      return { data: null, error: null };
    }
    // select
    let rows = applyPreds(state[store].slice(), preds);
    if (order) { const d = asc === false ? -1 : 1; rows = rows.slice().sort((a, b) => (a[order] > b[order] ? d : a[order] < b[order] ? -d : 0)); }
    if (limit) rows = rows.slice(0, limit);
    const result = rows.map((r) => pickFields(r, cols));
    if (isSingle) return { data: result[0] ?? null, error: result.length > 1 ? { code: "PGRST116" } : null };
    if (isMaybe) return { data: result[0] ?? null, error: null };
    return { data: result, error: null };
  }

  // Await without a terminal (e.g. `await supabase.from(t).select().in()`).
  c.then = (onFulfilled, onRejected) => {
    const listRes = finish(false, false);
    return onFulfilled ? onFulfilled(listRes) : listRes;
  };
  c.catch = () => {};

  return { ...c, _store: store };
}

export function getSupabaseAdmin() {
  return {
    from(table) {
      return makeChain(table, table);
    },
  };
}

// Test helpers ---------------------------------------------------------------
export function __mockReset() {
  state = { agents: [], deliveries: [], nextAgent: 1, nextDelivery: 1 };
}
export function __mockState() { return state; }
export function __seedAgent(name, username, phone, is_active = true) {
  const id = newId("agents");
  const agent = { id, name, username, phone, is_active, created_at: new Date().toISOString() };
  state.agents.push(agent);
  return agent;
}
export function __seedDelivery(over = {}) {
  const id = newId("deliveries");
  const del = {
    id, title: "Test", details: "", price: "0", customer_phone: "", agent_id: null,
    address: "", manager_note: "", status: "pending", accepted_at: null, delivered_at: null,
    created_at: new Date().toISOString(), ...over,
  };
  state.deliveries.push(del);
  return del;
}
