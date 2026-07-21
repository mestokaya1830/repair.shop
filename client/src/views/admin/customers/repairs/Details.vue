<template>
  <div class="repair-details">
    <h2>Repair Details</h2>

    <p v-if="loading">Loading...</p>

    <p v-if="error" class="form-error">
      {{ error }}
    </p>

    <div v-if="repair">
      <section class="repair-section">
        <h3>Repair Information</h3>

        <p>
          <strong>Repair Number:</strong>
          {{ repair.repairNumber }}
        </p>

        <p>
          <strong>Status:</strong>
          {{ repair.status }}
        </p>

        <p>
          <strong>Created:</strong>
          {{ formatDate(repair.createdAt) }}
        </p>
      </section>

      <section v-if="device" class="repair-section">
        <h3>Device</h3>

        <p>
          <strong>Brand:</strong>
          {{ device.brand }}
        </p>

        <p>
          <strong>Model:</strong>
          {{ device.model }}
        </p>

        <p>
          <strong>Type:</strong>
          {{ device.type }}
        </p>

        <router-link
          :to="`/admin/customers/${$route.params.id}/devices/${device._id}/details`"
          class="customer-details-link"
        >
          View Device
        </router-link>
      </section>

      <section v-if="customer" class="repair-section">
        <h3>Customer</h3>

        <p>
          {{ customer.profile.firstName }}
          {{ customer.profile.lastName }}
        </p>

        <p>
          {{ customer.profile.email }}
        </p>
      </section>

      <section class="repair-section">
        <h3>Problem</h3>

        <p>
          <strong>Category:</strong>
          {{ repair.problem.category }}
        </p>

        <p>
          <strong>Description:</strong>
          {{ repair.problem.description }}
        </p>

        <p>
          <strong>Device Working:</strong>
          {{ repair.problem.deviceWorking }}
        </p>

        <p>
          <strong>Notes:</strong>
          {{ repair.problem.notes || "-" }}
        </p>
      </section>

      <section v-if="repair.images?.length" class="repair-section">
        <h3>Images</h3>

        <div class="repair-images">
          <img
            v-for="image in repair.images"
            :key="image.filename"
            :src="image.path"
            alt="Repair image"
          />
        </div>
      </section>

      <section class="repair-section">
        <h3>Status History</h3>

        <div v-for="item in repair.statusHistory" :key="item._id">
          {{ item.status }}

          -
          {{ formatDate(item.createdAt) }}
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import api from "@/api/axios.js";

export default {
  name: "CustomerRepairDetails",

  data() {
    return {
      repair: null,
      customer: null,
      device: null,
      loading: false,
      error: "",
    };
  },

  mounted() {
    this.getRepair();
  },

  methods: {
    async getRepair() {
      try {
        this.loading = true;

        const response = await api.get(
          `/customers/${this.$route.params.id}/repairs/${this.$route.params.repairId}/details`,
        );
        const data = response.data.data;
        this.repair = data;
        this.customer = data.customer;
        this.device = data.device;
      } catch (error) {
        this.error = error.response?.data?.message || "Failed to load repair";
      } finally {
        this.loading = false;
      }
    },

    formatDate(date) {
      if (!date) return "-";

      return new Date(date).toLocaleDateString("de-DE");
    },
  },
};
</script>
