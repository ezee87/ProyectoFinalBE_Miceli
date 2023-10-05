import mongoose from 'mongoose'

const usersSchema = new mongoose.Schema({
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: false,
    unique: true,
  },
  age: {
    type: Number,
    required: true,
    default: 0
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: 'user',
    enum: ['user', 'admin', 'premium']
  },
  isGithub: {
    type: Boolean,
    required: true,
    default: false
  },
  prodCreator: {
    type: Boolean,
    default: false
  },
  documents: [{
    name: { type: String },
    reference: { type: String }
  }],
  lastConnection: { type: Date }
})

export const userModel = mongoose.model('Users', usersSchema)