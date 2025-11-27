import jwt from 'jsonwebtoken'

// Preferir variável de ambiente para a chave secreta; manter fallback por compatibilidade
const KEY = process.env.JWT_SECRET || 'borapracima'

if (!process.env.JWT_SECRET) {
  // avisar apenas em ambientes não-produtivos
  try {
    const env = process.env.NODE_ENV || 'development'
    if (env !== 'production') {
      console.warn('WARNING: using fallback JWT secret. Set JWT_SECRET in environment for better security.')
    }
  } catch (e) {
    // ignorar
  }
}

export function generateToken(userInfo) {
  const payload = { ...userInfo }
  if (!payload.role) payload.role = 'user'
  return jwt.sign(payload, KEY)
}

export function getTokenInfo(req) {
  try {
    let token = req.headers['x-access-token'] || req.query['x-access-token'];

    // suporte ao cabeçalho Authorization: Bearer <token>
    if (!token && req.headers['authorization']) {
      const auth = req.headers['authorization']
      if (auth.startsWith('Bearer ')) {
        token = auth.substring(7)
      }
      else {
        token = auth
      }
    }

    if (!token) return null

    const signd = jwt.verify(token, KEY)
    return signd
  }
  catch (err) {
    console.error('getTokenInfo error:', err && err.stack ? err.stack : err)
    return null;
  }
}

export function getAuthentication(checkRole, throw401 = true) {  
  return (req, resp, next) => {
    try {
      let token = req.headers['x-access-token'] || req.query['x-access-token'];

      if (!token && req.headers['authorization']) {
        const auth = req.headers['authorization']
        if (auth.startsWith('Bearer ')) token = auth.substring(7)
        else token = auth
      }

      if (!token) throw new Error('No token')

      const signd = jwt.verify(token, KEY)
    
      req.user = signd;
      if (checkRole) {
        // checkRole pode ser uma função que retorna true/false com base no payload do token
        const ok = checkRole(signd)
        const roleIsAdmin = (signd && (signd.role === 'admin' || (signd.role && signd.role.type === 'admin')))
        if (!ok && !roleIsAdmin) return resp.status(403).end()
      }
    
      next();
    }
    catch (err) {
      console.error('getAuthentication error:', err && err.stack ? err.stack : err)
      if (throw401) {
        let error = new Error();
        error.stack = 'Authentication Error: JWT must be provided';
        resp.status(401).end();
      }
      else {
        next();
      }
    }
  }
}