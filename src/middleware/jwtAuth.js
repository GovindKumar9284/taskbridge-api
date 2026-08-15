/**
 * Lightweight jwtAuth middleware for tests and local development.
 * - If header `x-test-user` is present, it should contain JSON: {"userId":"u1","orgId":"orgA"}
 * - Otherwise, accept Authorization: Bearer userId:orgId (simple format for demo only)
 */
export default function jwtAuth(req, res, next) {
  const testHeader = req.get('x-test-user');
  if (testHeader) {
    try {
      req.user = JSON.parse(testHeader);
      return next();
    } catch (e) {
      return res.status(400).json({ error: 'invalid x-test-user header' });
    }
  }

  const auth = req.get('authorization');
  if (!auth || !auth.startsWith('Bearer ')) return res.status(401).json({ error: 'missing token' });
  const token = auth.slice(7);
  // token format: userId:orgId for demo
  const [userId, orgId] = token.split(':');
  if (!userId || !orgId) return res.status(401).json({ error: 'invalid token format' });
  req.user = { userId, orgId };
  return next();
}
