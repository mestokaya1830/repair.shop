<template>
  <div class="customer-create">
    <h2>Customers Create</h2>

    <p v-if="error" class="form-error">
      {{ error }}
    </p>

    <form @submit.prevent="createCustomer">
      <div>
        <label>First Name</label>

        <input v-model="form.profile.firstName" type="text" />

        <span class="form-error">
          {{ errors["profile.firstName"] }}
        </span>
      </div>

      <div>
        <label>Last Name</label>

        <input v-model="form.profile.lastName" type="text" />

        <span class="form-error">
          {{ errors["profile.lastName"] }}
        </span>
      </div>

      <div>
        <label>Email</label>

        <input v-model="form.profile.email" type="email" />

        <span class="form-error">
          {{ errors["profile.email"] }}
        </span>
      </div>

      <div>
        <label>Phone</label>

        <input v-model="form.profile.phone" type="text" />

        <span class="form-error">
          {{ errors["profile.phone"] }}
        </span>
      </div>

      <div>
        <label>Street</label>

        <input v-model="form.profile.address.street" type="text" />
      </div>

      <div>
        <label>Postal Code</label>

        <input v-model="form.profile.address.postalCode" type="text" />
      </div>

      <div>
        <label>City</label>

        <input v-model="form.profile.address.city" type="text" />
      </div>

      <div>
        <label>Country</label>

        <input v-model="form.profile.address.country" type="text" />
      </div>

      <button type="submit">Create</button>
    </form>
  </div>
</template>

<script>
import api from "@/api/axios.js";
import {customerCreateSchema} from "@/validators/customers.schema.js";

export default {
  name: "CustomerCreate",

  data() {
    return {
      form: {
        profile: {
          firstName: "",
          lastName: "",
          email: "",
          phone: "",

          address: {
            street: "",
            postalCode: "",
            city: "",
            country: "Germany",
          },
        },
      },

      errors: {},
      error: "",
      loading: false,
    };
  },

  methods: {
    async createCustomer() {
      this.errors = {};
      const result = customerCreateSchema.safeParse(this.form);

      if (!result.success) {
        result.error.issues.forEach((error) => {
          this.errors[error.path.join(".")] = error.message;
        });

        return;
      }

      try {
        this.loading = true;
        await api.post("/customers/create", result.data);
        this.$router.push("/admin/customers");
      } catch (error) {
        this.error =
          error.response?.data?.message || "Failed to create customer";
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>
