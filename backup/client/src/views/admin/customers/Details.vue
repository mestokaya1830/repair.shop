<template>
  <div class="customer-details">
    <h2>Customer details</h2>

    <p v-if="loading">Loading...</p>

    <p v-if="error" class="form-error">
      {{ error }}
    </p>

    <div v-if="customer">
      <h3>Personal Information</h3>

      <p>
        <strong>Name:</strong>
        {{ customer.profile.firstName }}
        {{ customer.profile.lastName }}
      </p>

      <p>
        <strong>Email:</strong>
        {{ customer.profile.email || "-" }}
      </p>

      <p>
        <strong>Phone:</strong>
        {{ customer.profile.phone }}
      </p>

      <h3>Address</h3>

      <p>
        {{ customer.profile.address.street || "-" }}
      </p>

      <p>
        {{ customer.profile.address.postalCode }}
        {{ customer.profile.address.city }}
      </p>

      <p>
        {{ customer.profile.address.country }}
      </p>

      <h3>Account</h3>

      <p>
        <strong>Status:</strong>
        {{ customer.active ? "Active" : "Inactive" }}
      </p>

      <p>
        <strong>Created At:</strong>
        {{ new Date(customer.createdAt).toLocaleDateString() }}
      </p>

      <router-link :to="`/admin/customers/${customer._id}/edit`">
        Edit Customer
      </router-link>
    </div>
  </div>
</template>

<script>
import api from "@/api/axios.js";

export default {
  name: "Customerdetails",

  data() {
    return {
      customer: null,
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
          `/customers/${this.$route.params.id}/details`,
        );
        this.customer = response.data.customer;
      } catch (error) {
        this.error = error.response?.data?.message || "Failed to load customer";
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>
