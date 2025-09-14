# Multi-Tenant Notes SaaS (MongoDB, Vercel)


This is the MongoDB version of the project. It uses **Mongoose** with a shared-schema approach. All data is tagged with `tenant` (ObjectId ref).


## Tech
- Next.js API routes + frontend (Vercel)
- MongoDB (Atlas or local)
- Mongoose ODM
- JWT auth


## Setup
1. Set `MONGODB_URI` in `.env.local` (or Vercel project settings).
2. `npm install`
3. `npm run seed`
4. `npm run dev`


## Accounts
- admin@acme.test / password
- user@acme.test / password
- admin@globex.test / password
- user@globex.test / password

```
🔑 Step 1 – Open Login Page

Go to http://localhost:3000
.

You should see the login form.

👥 Step 2 – Login with Seeded Accounts

Use any of these (all passwords are password):

Acme Tenant

Admin → admin@acme.test

Member → user@acme.test

Globex Tenant

Admin → admin@globex.test

Member → user@globex.test

👉 Example:

Email: admin@acme.test

Password: password

Click Login.
If correct, you’ll be redirected to /notes.

📝 Step 3 – Manage Notes

On /notes:

You’ll see existing seeded notes (for Acme, “Acme Note 1”, “Acme Note 2”).

Try creating a new note:

Enter title + content.

Click Add Note.

It should appear in the list.

⚠ If tenant is on Free Plan, after 3 notes you’ll see an error or “Upgrade to Pro” message.

🚀 Step 4 – Upgrade to Pro

Only Admin users can upgrade.

While logged in as admin@acme.test, open browser console → run:

fetch("/api/tenants/acme/upgrade", {
  method: "POST",
  headers: {
    Authorization: "Bearer " + localStorage.getItem("token"),
  },
}).then(res => res.json()).then(console.log)


You should see:

{ "success": true, "tenant": { "slug": "acme", "plan": "pro" } }


Now you can create unlimited notes in Acme tenant.

❤️ Step 5 – Health Check

Open http://localhost:3000/api/health
.
It should return:

{ "status": "ok" }


That’s the full user flow ✅:

Login → Notes dashboard → Create/edit/delete notes → Test limit → Upgrade → Unlimited notes.
---