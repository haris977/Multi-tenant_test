import type { NextApiRequest, NextApiResponse } from 'next'
import bcrypt from 'bcryptjs'
import { dbConnect } from '../../../lib/db'
import { User } from '../../../lib/models'
import { signToken } from '../../../lib/auth'


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
res.setHeader('Access-Control-Allow-Origin', '*')
if (req.method !== 'POST') return res.status(405).end()


const { email, password } = req.body || {}
if (!email || !password) return res.status(400).json({ error: 'email and password required' })


await dbConnect()
const user = await User.findOne({ email }).populate('tenant')
if (!user) return res.status(401).json({ error: 'invalid credentials' })


const ok = await bcrypt.compare(password, user.password)
if (!ok) return res.status(401).json({ error: 'invalid credentials' })


const token = signToken({ userId: user._id })
res.json({ token, user: { id: user._id, email: user.email, role: user.role, tenant: { slug: user.tenant.slug, plan: user.tenant.plan } } })
}