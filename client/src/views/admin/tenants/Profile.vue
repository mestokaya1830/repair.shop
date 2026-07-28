<template>
  <div v-if="$store.state.auth.role==='owner'">
    <div v-if="fetching">
      <p>Loading profile...</p>
    </div>

    <div v-else>
      <div>
        <h2>
          <i class="bi bi-building" aria-hidden="true"></i>
          Tenant Profile
        </h2>
        <p>Manage your company details and settings.</p>
      </div>

      <form @submit.prevent="submitForm">
        
        <!-- SECTION 1: GENERAL & CONTACT -->
        <div>
          <h3>General & Contact Information</h3>
          <div>
            <div>
              <label class="label" for="company">Company / Tenant Name *</label>
              <input
                id="company"
                v-model.trim="form.company"
                type="text"
                placeholder="e.g. Acme Repair Services"
                
              />
              <span v-if="errors['company']" class="error-message">
                {{ errors['company'] }}
              </span>
            </div>
            <div>
              <label class="label" for="firstName">Firstname *</label>
              <input
                id="firstName"
                v-model.trim="form.firstName"
                type="text"
                placeholder="e.g. Acme Repair Services"
              
              />
              <span v-if="errors['firstName']" class="error-message">
                {{ errors['firstName'] }}
              </span>
            </div>
            <div>
              <label class="label" for="lastName">Lastname *</label>
              <input
                id="lastName"
                v-model.trim="form.lastName"
                type="text"
                placeholder="e.g. Acme Repair Services"
              
              />
              <span v-if="errors['lastName']" class="error-message">
                {{ errors['lastName'] }}
              </span>
            </div>

            <div>
              <label class="label" for="email">Business Email</label>
              <input
                id="email"
                v-model.trim="form.email"
                type="email"
                placeholder="info@acmerepair.com"
              />
              <span v-if="errors['email']" class="error-message">
                {{ errors['email'] }}
              </span>
            </div>

            <div>
              <label class="label" for="phone">Phone Number</label>
              <input
                id="phone"
                v-model.trim="form.phone"
                type="text"
                placeholder="+1 555 123 4567"
              />
              <span v-if="errors['phone']" class="error-message">
                {{ errors['phone'] }}
              </span>
            </div>

            <div>
              <label class="label" for="website">Website</label>
              <input
                id="website"
                v-model.trim="form.website"
                type="url"
                placeholder="https://www.acmerepair.com"
              />
              <span v-if="errors['website']" class="error-message">
                {{ errors['website'] }}
              </span>
            </div>
          </div>
        </div>

        <!-- SECTION 2: ADDRESS -->
        <div>
          <h3>Address Details</h3>
          <div>
            <div>
              <label class="label" for="street">Street Address</label>
              <input
                id="street"
                v-model.trim="form.address.street"
                type="text"
                placeholder="Main Street 123"
              />
              <span v-if="errors['address.street']" class="error-message">
                {{ errors['address.street'] }}
              </span>
            </div>

            <div>
              <label class="label" for="postalCode">Postal Code</label>
              <input
                id="postalCode"
                v-model.trim="form.address.postalCode"
                type="text"
                placeholder="10115"
              />
              <span v-if="errors['address.postalCode']" class="error-message">
                {{ errors['address.postalCode'] }}
              </span>
            </div>

            <div>
              <label class="label" for="city">City</label>
              <input
                id="city"
                v-model.trim="form.address.city"
                type="text"
                placeholder="Berlin"
              />
              <span v-if="errors['address.city']" class="error-message">
                {{ errors['address.city'] }}
              </span>
            </div>

            <div>
              <label class="label" for="country">Country</label>
              <input
                id="country"
                v-model.trim="form.address.country"
                type="text"
                placeholder="Germany"
              />
              <span v-if="errors['address.country']" class="error-message">
                {{ errors['address.country'] }}
              </span>
            </div>
          </div>
        </div>

        <!-- SECTION 3: BILLING & TAX -->
        <div>
          <h3>Tax & Registration Details</h3>
          <div>
            <div>
              <label class="label" for="taxNumber">Tax Number (Steuernummer)</label>
              <input
                id="taxNumber"
                v-model.trim="form.billingDetails.taxNumber"
                type="text"
                placeholder="12/345/67890"
              />
              <span v-if="errors['billingDetails.taxNumber']" class="error-message">
                {{ errors['billingDetails.taxNumber'] }}
              </span>
            </div>

            <div>
              <label class="label" for="vatId">VAT ID (USt-IdNr)</label>
              <input
                id="vatId"
                v-model.trim="form.billingDetails.vatId"
                type="text"
                placeholder="DE123456789"
              />
              <span v-if="errors['billingDetails.vatId']" class="error-message">
                {{ errors['billingDetails.vatId'] }}
              </span>
            </div>

            <div>
              <label class="label" for="commercialRegister">Commercial Register No.</label>
              <input
                id="commercialRegister"
                v-model.trim="form.billingDetails.commercialRegister"
                type="text"
                placeholder="HRB 123456"
              />
              <span v-if="errors['billingDetails.commercialRegister']" class="error-message">
                {{ errors['billingDetails.commercialRegister'] }}
              </span>
            </div>
          </div>
        </div>

        <!-- SECTION 4: BANK DETAILS -->
        <div>
          <h3>Bank Credentials (For Invoices)</h3>
          <div>
            <div>
              <label class="label" for="accountHolder">Account Holder</label>
              <input
                id="accountHolder"
                v-model.trim="form.bankDetails.accountHolder"
                type="text"
                placeholder="Acme Services GmbH"
              />
              <span v-if="errors['bankDetails.accountHolder']" class="error-message">
                {{ errors['bankDetails.accountHolder'] }}
              </span>
            </div>

            <div>
              <label class="label" for="bankName">Bank Name</label>
              <input
                id="bankName"
                v-model.trim="form.bankDetails.bankName"
                type="text"
                placeholder="Deutsche Bank"
              />
              <span v-if="errors['bankDetails.bankName']" class="error-message">
                {{ errors['bankDetails.bankName'] }}
              </span>
            </div>

            <div>
              <label class="label" for="iban">IBAN</label>
              <input
                id="iban"
                v-model.trim="form.bankDetails.iban"
                type="text"
                placeholder="DE89 3704 0044 0532 0130 00"
              />
              <span v-if="errors['bankDetails.iban']" class="error-message">
                {{ errors['bankDetails.iban'] }}
              </span>
            </div>

            <div>
              <label class="label" for="bic">BIC / SWIFT</label>
              <input
                id="bic"
                v-model.trim="form.bankDetails.bic"
                type="text"
                placeholder="DBEKDEFFXXX"
              />
              <span v-if="errors['bankDetails.bic']" class="error-message">
                {{ errors['bankDetails.bic'] }}
              </span>
            </div>
          </div>
        </div>

        <!-- SECTION 5: BRANDING -->
        <div>
          <h3>Branding & Formatting</h3>
          <div>
            <div>
              <label class="label" for="currency">Default Currency / Locale</label>
              <select id="currency" v-model="form.currency">
                <option value="EUR.de-DE">EUR (€) - Germany</option>
                <option value="USD.en-US">USD ($) - United States</option>
                <option value="GBP.en-GB">GBP (£) - United Kingdom</option>
                <option value="TRY.tr-TR">TRY (₺) - Turkey</option>
              </select>
              <span v-if="errors['currency']" class="error-message">
                {{ errors['currency'] }}
              </span>
            </div>

            <div>
              <label class="label" for="logoUrl">Tenant Logo URL</label>
              <input
                id="logoUrl"
                v-model.trim="form.logoUrl"
                type="url"
                placeholder="https://example.com/logo.png"
              />
              <span v-if="errors['logoUrl']" class="error-message">
                {{ errors['logoUrl'] }}
              </span>
            </div>
          </div>
        </div>

        <!-- SAVE BUTTON -->
        <div>
          <button type="submit" class="btn" :disabled="loading">
            <i class="bi bi-floppy" aria-hidden="true"></i>
            <span>{{ loading ? 'Saving...' : 'Save Profile' }}</span>
          </button>
        </div>

      </form>
    </div>
  </div>
</template>

<script>
import api from '@/api/axios.js'
import { tenantsSchema } from '@/validations/tenants.schema.js'

export default {
  name: 'Profile',
  data() {
    return {
      fetching: true,
      loading: false,
      errors: {},
      form: {
        company: "",
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        website: '',
        logoUrl: '',
        currency: 'EUR.de-DE',
        address: {
          street: '',
          city: '',
          postalCode: '',
          country: '',
        },
        billingDetails: {
          taxNumber: '',
          vatId: '',
          commercialRegister: '',
        },
        bankDetails: {
          accountHolder: '',
          bankName: '',
          iban: '',
          bic: '',
        },
      },
    }
  },
  mounted() {
    this.fetchProfile()
  },
  methods: {
    async fetchProfile() {
      try {
        this.fetching = true
        const response = await api.get('/tenants')
        if (response.data) {
          this.form = {
            ...this.form,
            ...response.data,
            address: { ...this.form.address, ...(response.data.address || {}) },
            billingDetails: { ...this.form.billingDetails, ...(response.data.billingDetails || {}) },
            bankDetails: { ...this.form.bankDetails, ...(response.data.bankDetails || {}) },
          }
        }
      } catch (error) {
        console.log('No tenant profile found yet.')
      } finally {
        this.fetching = false
      }
    },

    async submitForm() {
      this.errors = {}

      const result = tenantsSchema.safeParse(this.form)

      if (!result.success) {
        result.error.issues.forEach((error) => {
          this.errors[error.path.join('.')] = error.message
        })
        return
      }

      try {
        this.loading = true
        await api.put('/tenants/update', this.form)
        alert('Profile saved successfully!')
      } catch (error) {
        console.error('Error saving tenant profile:', error)
        alert('Failed to save profile. Please try again.')
      } finally {
        this.loading = false
      }
    },
  },
}
</script>