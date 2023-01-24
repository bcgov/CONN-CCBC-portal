import { Router } from 'express';

const login = Router();

// API route which destroys current session before redirecting to the login route
// This fixes login bug that was affecting some users where they would get redirected after login
// but weren't logged or directed to the dashboard until they clicked login again

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
