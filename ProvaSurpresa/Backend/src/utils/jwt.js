import jwt from 'jsonwebtoken'

// JWT configuration
const KEY = process.env.JWT_SECRET
const EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h'

if (!KEY) {
  const env = process.env.NODE_ENV || 'development'
  if (env === 'production') {
    console.error('FATAL: JWT_SECRET must be set in production environment')
    process.exit(1)
  }
  else {
    console.warn('WARNING: using fallback JWT secret. Set JWT_SECRET in environment for better security.')
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

    // support Authorization: Bearer <token>
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