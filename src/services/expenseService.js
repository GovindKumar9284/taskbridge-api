import SharedExpense from '../models/SharedExpense.js';

/**
 * Create a shared expense.
 * participants: array of { userId, share }.
 * If shares are omitted, equal split is assumed.
 */
export async function createExpense({ projectId, payerId, amount, currency = 'USD', participants, orgId }) {
  if (!participants || !Array.isArray(participants) || participants.length === 0) {
    const err = new Error('participants required');
    err.status = 400;
    throw err;
  }

  const expense = await SharedExpense.query().insert({
    project_id: projectId,
    payer_id: payerId,
    amount: Number(amount).toFixed(2),
    currency,
    participants,
    org_id: orgId
  });

  return expense;
}

export async function listExpensesByProject(projectId, orgId) {
  return SharedExpense.query().where({ project_id: projectId, org_id: orgId }).orderBy('created_at', 'asc');
}
