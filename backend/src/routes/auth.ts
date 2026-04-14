import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { db, AdminUser } from '../db/database';
import { signToken, requireAuth, AuthedRequest } from '../middleware/auth';

const router = Router();

router.post('/login', (req: Request, res: Response) => {
  const { email, password } = req.body as { email?: string; password?: string };
  if (!email || !password) {
    return res.status(400).json({ error: 'Email e password obbligatorie' });
  }

  const user = db
    .prepare('SELECT * FROM admin_users WHERE email = ?')
    .get(email) as AdminUser | undefined;

  if (!user) {
    return res.status(401).json({ error: 'Credenziali non valide' });
  }

  const ok = bcrypt.compareSync(password, user.password_hash);
  if (!ok) {
    return res.status(401).json({ error: 'Credenziali non valide' });
  }

  const token = signToken({ id: user.id, email: user.email });
  return res.json({ token, user: { id: user.id, email: user.email } });
});

router.get('/me', requireAuth, (req: AuthedRequest, res: Response) => {
  return res.json({ user: req.user });
});

export default router;
