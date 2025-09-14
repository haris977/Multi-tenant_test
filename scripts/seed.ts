import bcrypt from 'bcryptjs'
import { dbConnect } from '../lib/db'
import { Tenant, User, Note } from '../lib/models'


async function main() {
await dbConnect()


await Note.deleteMany({})
await User.deleteMany({})
await Tenant.deleteMany({})


const acme = await Tenant.create({ slug: 'acme', name: 'Acme', plan: 'free' })
const globex = await Tenant.create({ slug: 'globex', name: 'Globex', plan: 'free' })


const pw = await bcrypt.hash('password', 10)


await User.insertMany([
{ email: 'admin@acme.test', password: pw, role: 'admin', tenant: acme._id },
{ email: 'user@acme.test', password: pw, role: 'member', tenant: acme._id },
{ email: 'admin@globex.test', password: pw, role: 'admin', tenant: globex._id },
{ email: 'user@globex.test', password: pw, role: 'member', tenant: globex._id }
])


await Note.create({ title: 'Acme Note 1', content: 'Hello from Acme 1', tenant: acme._id })
await Note.create({ title: 'Acme Note 2', content: 'Hello from Acme 2', tenant: acme._id })


console.log('Seed completed')
process.exit(0)
}


main()