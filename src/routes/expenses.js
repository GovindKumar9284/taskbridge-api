import express from 'express';
import { createExpense, listExpensesByProject } from '../services/expenseService.js';
import { calculateBalances } from '../services/balanceService.js';
import jwtAuth from '../middleware/jwtAuth.js';

const router = express.Router();

// Create expense
router.post('/expenses', jwtAuth, async (req, res) => {
  try {
    const { projectId, payerId, amount, currency, participants } = req.body;
    const orgId = req.user.orgId;
    const expense = await createExpense({ projectId, payerId, amount, currency, participants, orgId });
    res.status(201).json(expense);
  } catch (err) {
    res.status(err.status || 400).json({ error: err.message });
  }
});

// List expenses
router.get('/expenses/:projectId', jwtAuth, async (req, res) => {
  const { projectId } = req.params;
  const orgId = req.user.orgId;
  const rows = await listExpensesByProject(projectId, orgId);
  res.json(rows);
});

// Get balances
router.get('/balances/:projectId', jwtAuth, async (req, res) => {
  const { projectId } = req.params;
  const orgId = req.user.orgId;
  const net = await calculateBalances(projectId, orgId);
  if (!net || Object.keys(net).length === 0) return res.status(404).json({});
  res.json(net);
});

// Prevent updates to expenses via API (immutability)
router.patch('/expenses/:id', jwtAuth, (req, res) => {
  res.status(405).json({ error: 'Expense records are immutable' });
});

export default router;
