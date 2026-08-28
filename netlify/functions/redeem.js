import { getAuthenticatedCustomer } from "./_shared/customer.js";
import { getSupabaseAdmin } from "./_shared/supabase.js";
import { withNetlifyResponse } from "./_shared/response.js";

async function handler(event) {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method not allowed." }),
      headers: { "Content-Type": "application/json" },
    };
  }

  try {
    const body = JSON.parse(event.body || "{}");
    const rewardId = Number(body.reward_id);
    if (!rewardId) {
      throw new Error("Invalid reward.");
    }

    const customer = await getAuthenticatedCustomer(event);
    const supabase = getSupabaseAdmin();

    const { data: reward, error: rewardError } = await supabase
      .from("rewards")
      .select("id, name, points_required, active")
      .eq("id", rewardId)
      .maybeSingle();

    if (rewardError || !reward) {
      throw new Error("Invalid reward.");
    }
    if (!reward.active) {
      throw new Error("Reward is no longer available.");
    }

    const { data: customerRow, error: customerError } = await supabase
      .from("customers")
      .select("points_balance")
      .eq("id", customer.id)
      .single();

    if (customerError || !customerRow) {
      throw new Error("Unable to load customer account.");
    }

    if (Number(customerRow.points_balance) < Number(reward.points_required)) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Insufficient points.", pointsBalance: Number(customerRow.points_balance) }),
        headers: { "Content-Type": "application/json" },
      };
    }

    const pointsUsed = Number(reward.points_required);
    const updatedBalance = Number(customerRow.points_balance) - pointsUsed;

    const { error: redemptionError } = await supabase.from("redemptions").insert([
      {
        customer_id: customer.id,
        reward_id: reward.id,
        points_used: pointsUsed,
      },
    ]);

    if (redemptionError) {
      throw new Error("Unable to redeem reward.");
    }

    const { error: transactionError } = await supabase.from("points_transactions").insert([
      {
        customer_id: customer.id,
        points: -pointsUsed,
        type: "redeemed",
        description: reward.name,
      },
    ]);

    if (transactionError) {
      throw new Error("Unable to update points history.");
    }

    const { error: balanceError } = await supabase
      .from("customers")
      .update({ points_balance: updatedBalance })
      .eq("id", customer.id);

    if (balanceError) {
      throw new Error("Unable to update customer balance.");
    }

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ok: true,
        pointsBalance: updatedBalance,
        reward: reward.name,
      }),
    };
  } catch (error) {
    return {
      statusCode: error.message === "Unauthorized" ? 401 : 400,
      body: JSON.stringify({ error: error.message || "Unable to redeem reward." }),
      headers: { "Content-Type": "application/json" },
    };
  }
}

export default withNetlifyResponse(handler);
