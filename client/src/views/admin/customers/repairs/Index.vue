<template>
  <div class="customer-repairs">
    <h2>Customer Repairs</h2>

    <p v-if="loading">Loading...</p>

    <p v-if="error" class="form-error">
      {{ error }}
    </p>

    <div v-if="repairs.length">
      <div v-for="repair in repairs" :key="repair._id" class="repair-item">
        <h3>
          {{ repair.repairNumber }}
        </h3>

        <p>
          <strong>Status:</strong>
          {{ repair.status }}
        </p>

        <p v-if="repair.device">
          <strong>Device:</strong>
          {{ repair.device.brand }}
          {{ repair.device.model }}
        </p>

        <p>
          <strong>Created:</strong>
          {{ new Date(repair.createdAt).toLocaleDateString() }}
        </p>

        <router-link
          :to="`/admin/customers/${$route.params.id}/repairs/${repair._id}/details`"
          class="customer-details-link"
        >
          View Repair
        </router-link>
      </div>
    </div>

    <p v-else-if="!loading">No repairs found.</p>
  </div>
</template>

<script>
import api from "@/api/axios.js";

export default {
  name: "CustomerRepairs",

  data() {
    return {
      repairs: [],
      loading: false,
      error: "",
    };
  },

  mounted() {
    this.getRepairs();
  },

  methods: {
    async getRepairs() {
      try {
        this.loading = true;

        const response = await api.get(
          `/customers/${this.$route.params.id}/repairs`,
        );

        this.repairs = response.data.data;
      } catch (error) {
        this.error = error.response?.data?.message || "Failed to load repairs";
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>
