import mongoose from 'mongoose'

const tenantsC = new mongoose.Schema({
  company: {type: String, required: true},
  firstName: { type: String, required: true },  
  lastName: { type: String, required: true },  
  email: { type: String },
  phone: { type: String },
  website: { type: String },

  address: {
    street: String,
    city: String,
    postalCode: String,
    country: String
  },

  billingDetails: {
    taxNumber: String,
    vatId: String,
    commercialRegister: String
  },

  bankDetails: {
    bankName: String,
    iban: String,
    bic: String,
    accountHolder: String
  },

  logoUrl: String,
  currency: { type: String, default: 'EUR.de-DE' }
}, { timestamps: true });

export default mongoose.model('tanent', tenantsC)