<template>
  <div class="customer-edit">
    <h2>Customers Edit</h2>

    <p v-if="loading">Loading...</p>

    <p v-if="error" class="form-error">
      {{ error }}
    </p>

    <form v-if="form" @submit.prevent="updateCustomer">
      <div>
        <label>First Name</label>

        <input v-model="form.profile.firstName" type="text" />
      </div>

      <div>
        <label>Last Name</label>

        <input v-model="form.profile.lastName" type="text" />
      </div>

      <div>
        <label>Email</label>

        <input v-model="form.profile.email" type="email" />
      </div>

      <div>
        <label>Phone</label>

        <input v-model="form.profile.phone" type="text" />
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

      <button type="submit">Save</button>
    </form>
  </div>
</template>

<script>
import api from "@/api/axios.js";

export default {
  name: "CustomerEdit",

  data() {
    return {
      form: null,
      loading: false,
      error: "",
    };
  },

  mounted() {
    this.getCustomer();
  },

  methods: {
    async getCustomer() {
      try {
        this.loading = true;
        const response = await api.get(
          `/customers/${this.$route.params.id}/edit`,
        );
        this.form = response.data.customer;
      } catch (error) {
        this.error = error.response?.data?.message || "Failed to load customer";
      } finally {
        this.loading = false;
      }
    },

    async updateCustomer() {
      try {
        this.loading = true;
        this.error = "";
        const response = await api.patch(
          `/customers/${this.$route.params.id}/update`,
          this.form,
        );
        this.form = response.data.data;
        this.$router.push(`/customers/${this.$route.params.id}/edit`);
      } catch (error) {
        this.error =
          error.response?.data?.message || "Failed to update customer";
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>
