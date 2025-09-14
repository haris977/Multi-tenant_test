import type { NextApiRequest, NextApiResponse } from 'next'
import { dbConnect } from '../../../lib/db'
import { Note } from '../../../lib/models'
import { getUserFromRequest } from '../../../lib/auth'


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
res.setHeader('Access-Control-Allow-Origin', '*')
if (req.method === 'OPTIONS') return res.status(200).end()


await dbConnect()
const user = await getUserFromRequest(req)
if (!user) return res.status(401).json({ error: 'unauthenticated' })


const { id } = req.query
const note = await Note.findById(id)
if (!note || String(note.tenant) !== String(user.tenant._id)) return res.status(404).json({ error: 'not found' })


if (req.method === 'GET') return res.json(note)


if (req.method === 'PUT') {
const { title, content } = req.body || {}
note.title = title ?? note.title
note.content = content ?? note.content
await note.save()
return res.json(note)
}


if (req.method === 'DELETE') {
await note.deleteOne()
return res.json({ success: true })
}


res.status(405).end()
}