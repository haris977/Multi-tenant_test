import type { NextApiRequest, NextApiResponse } from 'next'
import { dbConnect } from '../../../../lib/db'
import { Tenant } from '../../../../lib/models'
import { getUserFromRequest } from '../../../../lib/auth'


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
res.setHeader('Access-Control-Allow-Origin', '*')
if (req.method !== 'POST') return res.status(405).end()


await dbConnect()
const user = await getUserFromRequest(req)
if (!user) return res.status(401).json({ error: 'unauthenticated' })
if (user.role !== 'admin') return res.status(403).json({ error: 'admin only' })


const { slug } = req.query
if (user.tenant.slug !== slug) return res.status(403).json({ error: 'cannot upgrade other tenant' })


user.tenant.plan = 'pro'
await user.tenant.save()


res.json({ success: true, tenant: { slug: user.tenant.slug, plan: user.tenant.plan } })
}