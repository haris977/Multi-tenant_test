import { Schema, model, models } from 'mongoose'

const TenantSchema = new Schema({
  slug: { type: String, unique: true },
  name: String,
  plan: { 
    type: String, 
    enum: ['free', 'pro'], // allowed values
    default: 'free' 
  }
})

const UserSchema = new Schema({
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ['admin', 'member'] },
  tenant: { type: Schema.Types.ObjectId, ref: 'Tenant' }
})

const NoteSchema = new Schema({
  title: String,
  content: String,
  tenant: { type: Schema.Types.ObjectId, ref: 'Tenant' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
})

NoteSchema.pre('save', function (next) {
  this.updatedAt = new Date()
  next()
})

export const Tenant = models.Tenant || model('Tenant', TenantSchema)
export const User = models.User || model('User', UserSchema)
export const Note = models.Note || model('Note', NoteSchema)
