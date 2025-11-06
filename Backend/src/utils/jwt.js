import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export function getAuthentication(checkRole, throw401 = true) {
  return (req, resp, next) => {
    try {
      let token = req.headers['x-access-token'];

      if (!token) {
        token = req.query['x-access-token'];
      }

      if (!token) {
        if (throw401) {
          return resp.status(401).json({ error: 'Token não fornecido' });
        } else {
          return next();
        }
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;

      if (checkRole && !checkRole(decoded)) {
        return resp.status(403).json({ error: 'Acesso não autorizado' });
      }

      next();
    } catch (err) {
      console.error(err);
      if (throw401) {
        return resp.status(401).json({ error: 'Token inválido ou expirado' });
      } else {
        next();
      }
    }
  };
}