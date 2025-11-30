import jwt from 'jsonwebtoken'

// Prefer environment variable for secret; keep fallback for compatibility
const KEY = process.env.JWT_SECRET || 'borapracima'

if (!process.env.JWT_SECRET) {
  // warn in non-production environments only
  try {
    const env = process.env.NODE_ENV || 'development'
    if (env !== 'production') {
      console.warn('WARNING: using fallback JWT secret. Set JWT_SECRET in environment for better security.')
    }
  } catch (e) {
    // ignore
  }
}

const SECRET_KEY = KEY || 'borapracima'

export function generateToken(userInfo) {
  const payload = { ...userInfo }
  if (!payload.role) payload.role = 'user'
  return jwt.sign(payload, SECRET_KEY, { expiresIn: EXPIRES_IN })
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

    const signd = jwt.verify(token, SECRET_KEY)
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

      const signd = jwt.verify(token, SECRET_KEY)
    
      req.user = signd;
      if (checkRole) {
        // checkRole can be a function that returns true/false based on token payload
        const ok = checkRole(signd)
        const roleIsAdmin = (signd && (signd.role === 'admin' || (signd.role && signd.role.type === 'admin')))
        if (!ok && !roleIsAdmin) return resp.status(403).end()
      }
    
      next();
    }
    catch (err) {
      console.error('getAuthentication error:', err && err.stack ? err.stack : err)
      if (throw401) {
        resp.status(401).end();
      }
      else {
        next();
      }
    }
  }
}