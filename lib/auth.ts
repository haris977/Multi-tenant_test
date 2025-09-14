import jwt from 'jsonwebtoken'
import { NextApiRequest } from 'next'
import { User } from './models'
import { dbConnect } from './db'


const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret'


export function signToken(payload: object) {
return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' })
}


export function verifyToken(token: string) {
return jwt.verify(token, JWT_SECRET) as any
}


export async function getUserFromRequest(req: NextApiRequest) {
await dbConnect()
const auth = req.headers.authorization || req.query.token
if (!auth) return null
const token = typeof auth === 'string' && auth.startsWith('Bearer ') ? auth.slice(7) : String(auth)
try {
const decoded: any = verifyToken(token)
if (!decoded?.userId) return null
return await User.findById(decoded.userId).populate('tenant')
} catch (e) {
return null
}
}