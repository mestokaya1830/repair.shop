import mongoose from 'mongoose';

const partInfoSchema = new mongoose.Schema({
  partNumber: { type: String, default: '' }, // Parça No / Kod
  name: { type: String, default: '' },       // Parça Adı
  brand: { type: String, default: '' },      // Marka
  unit: { type: String, default: 'pcs' },    // Adet, Saat vb.
  costPrice: { type: Number, default: 0 }    // Alış fiyatı (opsiyonel)
}, { _id: false });

const workItemSchema = new mongoose.Schema({
  workflowItemId: { 
    type: mongoose.Schema.Types.ObjectId, // veya String
    default: null 
  },
  title: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String, 
    default: '' 
  },
  quantity: { 
    type: Number, 
    required: true, 
    default: 1 
  },
  price: { 
    type: Number, 
    required: true, 
    default: 0 
  },
  vat: { 
    type: Number, 
    default: 0 
  },
  total: { 
    type: Number, 
    default: 0 
  },

  partInfo: partInfoSchema,

  workflowItem: {
    type: mongoose.Schema.Types.Mixed,
    default: null
  }
}, { _id: true });

// Fatura Ana Şeması
const invoicesModel = new mongoose.Schema({
  // repair: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'repairs', // Tamirat modelinizin adı
  //   default: null
  // },
  
  // customer: {
  //   firstName: { type: String, default: '' },
  //   lastName: { type: String, default: '' },
  //   company: { type: String, default: '' },
  //   address: { type: String, default: '' },
  //   postalCode: { type: String, default: '' },
  //   city: { type: String, default: '' }
  // },

  tenantId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'tenants',
    required: true 
  },

  serviceDate: { type: Date, default: null },
  date: { type: Date, default: Date.now },
  paymentTerms: { type: Number, default: 14 },

  vatType: { 
    type: String, 
    enum: ['standard', 'reverse_charge', 'small_business'], 
    default: 'standard' 
  },

  currency: { type: String, default: 'EUR' },

  workItems: [workItemSchema],

  totals: {
    net: { type: Number, default: 0 },
    vat: { type: Number, default: 0 },
    total: { type: Number, default: 0 }
  }
}, { 
  timestamps: true 
});

export default  mongoose.model('invoices', invoicesModel);