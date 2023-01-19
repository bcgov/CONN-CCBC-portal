import { Router } from 'express';

const login = Router();

login.post('/api/login/:route', async (req: any, res) => {
  const { route } = req.params;

  req.logout(() => {
    req.session.destroy(async () => {
      res.clearCookie('connect.sid');
      res.redirect(307, route === 'multi-auth' ? '/login' : `/login?${route}`);
    });
  });
});

export default login;
