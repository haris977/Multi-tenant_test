// lib/db.ts
import mongoose from "mongoose";

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/notes_saas";

declare global {
  // allow global `var` declarations in Node
  // eslint-disable-next-line no-var
  var _mongooseConnection: Promise<typeof mongoose> | undefined;
}

if (!global._mongooseConnection) {
  global._mongooseConnection = mongoose.connect(MONGODB_URI);
}

export const dbConnect = () => global._mongooseConnection!;
