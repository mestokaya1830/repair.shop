<template>
  <div class="customer-page">
    <div class="customer-card">
      <h1>Edit Customer</h1>

      <div v-if="loading" class="loading-state">Loading customer data...</div>

      <form v-else @submit.prevent="updateCustomer">
        <!-- Name Info -->
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">First Name *</label>
            <input
              v-model="form.firstName"
              type="text"
              placeholder="First Name"
            />
            <p v-if="errors.firstName" class="form-error">
              {{ errors.firstName }}
            </p>
          </div>

          <div class="form-group">
            <label class="form-label">Last Name *</label>
            <input
              v-model="form.lastName"
              type="text"
              placeholder="Last Name"
            />
            <p v-if="errors.lastName" class="form-error">
              {{ errors.lastName }}
            </p>
          </div>
        </div>

        <!-- Contact Info -->
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Email *</label>
            <input v-model="form.email" type="email" placeholder="Email" />
            <p v-if="errors.email" class="form-error">{{ errors.email }}</p>
          </div>

          <div class="form-group">
            <label class="form-label">Phone *</label>
            <input v-model="form.phone" type="text" placeholder="Phone" />
            <p v-if="errors.phone" class="form-error">{{ errors.phone }}</p>
          </div>
        </div>

        <!-- Company -->
        <div class="form-group">
          <label class="form-label">Company</label>
          <input
            v-model="form.company"
            type="text"
            placeholder="Company Name"
          />
        </div>

        <!-- Address Info -->
        <div class="form-group">
          <label class="form-label">Street</label>
          <input v-model="form.street" type="text" placeholder="Street" />
        </div>

        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Postal Code</label>
            <input
              v-model="form.postalCode"
              type="text"
              placeholder="Postal Code"
            />
          </div>

          <div class="form-group">
            <label class="form-label">City</label>
            <input v-model="form.city" type="text" placeholder="City" />
          </div>

          <div class="form-group">
            <label class="form-label">Country</label>
            <input v-model="form.country" type="text" placeholder="Country" />
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label class="form-label"> Status </label>

            <select v-model="form.isActive">
              <option :value="true">Active</option>
              <option :value="false">Inactive</option>
            </select>

            <p v-if="errors.isActive" class="form-error">
              {{ errors.isActive }}
            </p>
          </div>
        </div>
        <p v-if="serverError" class="form-error global-error">
          {{ serverError }}
        </p>

        <button type="submit" class="submit-button" :disabled="loading">
          {{ loading ? "Updating..." : "Update Customer" }}
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import api from "@/api/axios.js";
import { customerSchema } from "@/validations/customers.schema.js";

export default {
  name: "CustomerEdit",
  data() {
    return {
      form: {
        isActive: true,
        firstName: "",
        lastName: "",
        phone: "",
        company: "",
        email: "",
        street: "",
        postalCode: "",
        city: "",
        country: "Germany",
      },
      loading: false,
      errors: {},
      serverError: "",
    };
  },

  mounted() {
    0;
    this.fetchCustomer();
  },

  methods: {
    async fetchCustomer() {
      try {
        this.loading = true;
        const res = await api.get(`/customers/${this.$route.params.id}/edit`);

        const customer = res.data.data;
        this.form = {
          isActive:
            typeof customer.isActive === "boolean" ? customer.isActive : true,
          firstName: customer.firstName || "",
          lastName: customer.lastName || "",
          phone: customer.phone || "",
          company: customer.company || "",
          email: customer.email || "",
          street: customer.street || "",
          postalCode: customer.postalCode || "",
          city: customer.city || "",
          country: customer.country || "Germany",
        };
      } catch (error) {
        this.serverError =
          error.response?.data?.message || "Failed to load customer details";
      } finally {
        this.loading = false;
      }
    },

    async updateCustomer() {
      try {
        this.errors = {};
        this.serverError = "";

        const result = customerSchema.safeParse(this.form);
        if (!result.success) {
          result.error.issues.forEach((error) => {
            this.errors[error.path.join(".")] = error.message;
          });
          return;
        }

        this.loading = true;
        await api.put(`/customers/${this.$route.params.id}/update`, this.form);

        this.$router.push("/admin/customers");
      } catch (error) {
        this.serverError =
          error.response?.data?.message || "Failed to update customer";
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>
