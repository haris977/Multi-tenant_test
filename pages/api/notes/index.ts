import type { NextApiRequest, NextApiResponse } from 'next'
import { dbConnect } from '../../../lib/db'
import { Note, Tenant } from '../../../lib/models'
import { getUserFromRequest } from '../../../lib/auth'


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
res.setHeader('Access-Control-Allow-Origin', '*')
if (req.method === 'OPTIONS') return res.status(200).end()


await dbConnect()
const user = await getUserFromRequest(req)
if (!user) return res.status(401).json({ error: 'unauthenticated' })


if (req.method === 'GET') {
const notes = await Note.find({ tenant: user.tenant._id }).sort({ createdAt: -1 })
return res.json(notes)
}


if (req.method === 'POST') {
const { title, content } = req.body || {}
if (!title) return res.status(400).json({ error: 'title required' })


const tenant = await Tenant.findById(user.tenant._id)
if (!tenant) return res.status(400).json({ error: 'tenant not found' })


if (tenant.plan === 'free') {
const count = await Note.countDocuments({ tenant: tenant._id })
if (count >= 3) return res.status(403).json({ error: 'note limit reached for Free plan' })
}


const note = await Note.create({ title, content: content || '', tenant: tenant._id })
return res.status(201).json(note)
}


res.status(405).end()
}