import SharedExpense from '../models/SharedExpense.js';

/**
 * Calculates net balances for a project.
 * Returns an object mapping userId -> netAmount (positive = others owe this user).
 */
export async function calculateBalances(projectId, orgId) {
  const rows = await SharedExpense.query().where({ project_id: projectId, org_id: orgId });
  const net = {}; // userId -> number

  for (const r of rows) {
    const amount = Number(r.amount);
    let participants = r.participants;

    if (!participants || participants.length === 0) continue;

    // Detect if any absolute shares (>1) exist
    const hasAbsolute = participants.some(p => typeof p.share === 'number' && p.share > 1);

    if (hasAbsolute) {
      const absoluteSum = participants.filter(p => p.share && p.share > 1).reduce((s, p) => s + p.share, 0);
      const remainder = Math.max(0, amount - absoluteSum);
      const flexible = participants.filter(p => !p.share || p.share <= 1);
      const equalForFlexible = flexible.length ? remainder / flexible.length : 0;

      for (const p of participants) {
        const userId = p.userId;
        const shareAmt = (p.share && p.share > 1) ? p.share : equalForFlexible;
        net[userId] = (net[userId] || 0) - shareAmt;
      }
    } else {
      const totalFraction = participants.reduce((s, p) => s + ((typeof p.share === 'number' && p.share <= 1) ? p.share : 0), 0);
      if (totalFraction > 0) {
        for (const p of participants) {
          const frac = (typeof p.share === 'number' && p.share <= 1) ? p.share : 0;
          const shareAmt = frac * amount;
          net[p.userId] = (net[p.userId] || 0) - shareAmt;
        }
      } else {
        const per = amount / participants.length;
        for (const p of participants) {
          net[p.userId] = (net[p.userId] || 0) - per;
        }
      }
    }

    // Payer gets credit of full amount
    net[r.payer_id] = (net[r.payer_id] || 0) + amount;
  }

  // Round to cents
  Object.keys(net).forEach(k => { net[k] = Math.round((net[k] + Number.EPSILON) * 100) / 100; });
  return net;
}
