// UNREVIEWED AI-GENERATED Project service (as produced by Copilot)
import db from './projectModel.js';

export async function createProject(data) {
  const [id] = await db('projects').insert(data);
  return db('projects').where({ id }).first();
}

export async function updateStatus(id, status) {
  await db('projects').where({ id }).update({ status, updated_at: new Date().toISOString() });
  return db('projects').where({ id }).first();
}

export async function getByTeam(teamId) {
  return db('projects').where({ teamId });
}

export async function deleteProject(id) {
  return db('projects').where({ id }).del();
}
