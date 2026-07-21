<template>
  <div class="customer-devices">
    <h2>Customer Devices</h2>

    <p v-if="loading">Loading...</p>

    <p v-if="error" class="form-error">
      {{ error }}
    </p>

    <div v-if="devices.length">
      <div v-for="device in devices" :key="device._id" class="device-item">
        <h3>{{ device.brand }} {{ device.model }}</h3>

        <p>
          <strong>Type:</strong>
          {{ device.type }}
        </p>

        <p>
          <strong>Serial Number:</strong>
          {{ device.serialNumber || "-" }}
        </p>

        <p>
          <strong>Purchase Date:</strong>
          {{ device.purchaseDate || "-" }}
        </p>

        <router-link
          :to="`/admin/customers/${$route.params.id}/devices/${device._id}/details`"
          class="customer-details-link"
        >
          View Device
        </router-link>
      </div>
    </div>

    <p v-else-if="!loading">No devices found.</p>
  </div>
</template>

<script>
import api from "@/api/axios.js";

export default {
  name: "CustomerDevices",

  data() {
    return {
      devices: [],
      loading: false,
      error: "",
    };
  },

  mounted() {
    this.getDevices();
  },

  methods: {
    async getDevices() {
      try {
        this.loading = true;

        const response = await api.get(
          `/customers/${this.$route.params.id}/devices`,
        );

        this.devices = response.data.data;
      } catch (error) {
        this.error = error.response?.data?.message || "Failed to load devices";
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>
