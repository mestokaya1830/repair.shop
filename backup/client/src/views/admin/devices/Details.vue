<template>
  <div class="device-detail">
    <h2>Device Detail</h2>

    <p v-if="loading">Loading...</p>

    <p v-if="error" class="form-error">
      {{ error }}
    </p>

    <div v-if="device">
      <div>
        <strong>Customer:</strong>

        {{ device.customer?.profile?.firstName }}
        {{ device.customer?.profile?.lastName }}
      </div>

      <div>
        <strong>Type:</strong>

        {{ device.type }}
      </div>

      <div>
        <strong>Brand:</strong>

        {{ device.brand }}
      </div>

      <div>
        <strong>Model:</strong>

        {{ device.model }}
      </div>

      <div>
        <strong>Serial Number:</strong>

        {{ device.serialNumber || "-" }}
      </div>

      <div>
        <strong>Purchase Date:</strong>

        {{ formatDate(device.purchaseDate) }}
      </div>

      <div>
        <strong>Warranty Until:</strong>

        {{ formatDate(device.warrantyUntil) }}
      </div>

      <div>
        <strong>Accessories:</strong>

        <span v-if="device.accessories?.length">
          {{ device.accessories.join(", ") }}
        </span>

        <span v-else> - </span>
      </div>

      <div>
        <strong>Notes:</strong>

        {{ device.notes || "-" }}
      </div>

      <router-link :to="`/admin/devices/${device._id}/edit`">
        Edit
      </router-link>
    </div>
  </div>
</template>

<script>
import api from "@/api/axios.js";

export default {
  name: "DeviceDetail",

  data() {
    return {
      device: null,

      loading: false,

      error: "",
    };
  },

  mounted() {
    this.getDevice();
  },

  methods: {
    async getDevice() {
      try {
        this.loading = true;
        const id = this.$route.params.id;
        const response = await api.get(`/devices/${id}/details`);

        this.device = response.data.device;
      } catch (error) {
        this.error = error.response?.data?.message || "Failed to load device";
      } finally {
        this.loading = false;
      }
    },

    formatDate(date) {
      if (!date) {
        return "-";
      }

      return new Date(date).toLocaleDateString();
    },
  },
};
</script>
