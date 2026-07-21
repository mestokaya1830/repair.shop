<template>
  <div class="customer-details">
    <h2>Customer Details</h2>

    <p v-if="loading">Loading...</p>

    <p v-if="error" class="form-error">
      {{ error }}
    </p>

    <div v-if="customer">
      <section class="customer-details-section">
        <h3>Personal Information</h3>

        <p>
          <strong>Name:</strong>
          {{ customer.firstName }}
          {{ customer.lastName }}
        </p>

        <p>
          <strong>Email:</strong>
          {{ customer.email || "-" }}
        </p>

        <p>
          <strong>Phone:</strong>
          {{ customer.phone || "-" }}
        </p>

        <p>
          <strong>Company:</strong>
          {{ customer.company || "-" }}
        </p>
      </section>

      <section class="customer-details-section">
        <h3>Address</h3>

        <p>
          {{ customer.address?.street || "-" }}
        </p>

        <p>
          {{ customer.address?.postalCode || "" }}
          {{ customer.address?.city || "" }}
        </p>

        <p>
          {{ customer.address?.country || "-" }}
        </p>
      </section>

      <section class="customer-details-actions">
        <router-link
          :to="`/admin/customers/${customer._id}/devices`"
          class="customer-details-link"
        >
          Devices
        </router-link>

        <router-link
          :to="`/admin/customers/${customer._id}/repairs`"
          class="customer-details-link"
        >
          Repairs
        </router-link>

        <router-link
          :to="`/admin/customers/${customer._id}/edit`"
          class="customer-details-link"
        >
          Edit Customer
        </router-link>
      </section>
    </div>
  </div>
</template>

<script>
import api from "@/api/axios.js";

export default {
  name: "CustomerDetails",

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

        this.customer = response.data.data;
      } catch (error) {
        this.error = error.response?.data?.message || "Failed to load customer";
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>
