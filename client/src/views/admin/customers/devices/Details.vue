<template>
  <div class="device-details">
    <p v-if="loading">Loading...</p>

    <p v-if="error" class="form-error">
      {{ error }}
    </p>

    <div v-if="device">
      <h2>
        {{ device.brand }}
        {{ device.model }}
      </h2>

      <section class="details-section">
        <h3>Device Information</h3>

        <p>
          <strong>Type:</strong>
          {{ device.type || "-" }}
        </p>

        <p>
          <strong>Brand:</strong>
          {{ device.brand || "-" }}
        </p>

        <p>
          <strong>Model:</strong>
          {{ device.model || "-" }}
        </p>

        <p>
          <strong>Serial Number:</strong>
          {{ device.serialNumber || "-" }}
        </p>

        <p>
          <strong>Purchase Date:</strong>
          {{ formatDate(device.purchaseDate) }}
        </p>

        <p>
          <strong>Warranty Until:</strong>
          {{ formatDate(device.warrantyUntil) }}
        </p>
      </section>

      <section v-if="device.images?.length" class="details-section">
        <h3>Images</h3>

        <div class="device-images">
          <img
            v-for="image in device.images"
            :key="image.filename"
            :src="image.path"
            alt="Device image"
          />
        </div>
      </section>

      <section v-if="device.accessories?.length" class="details-section">
        <h3>Accessories</h3>

        <ul>
          <li v-for="item in device.accessories" :key="item">
            {{ item }}
          </li>
        </ul>
      </section>

      <section class="details-section">
        <h3>Notes</h3>

        <p>
          {{ device.notes || "-" }}
        </p>
      </section>

      <section v-if="customer" class="details-section">
        <h3>Customer</h3>

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

          {{ customer.profile.phone || "-" }}
        </p>
      </section>

      <section class="details-section">
        <h3>Repair History</h3>

        <div v-if="repairs.length">
          <div v-for="repair in repairs" :key="repair._id" class="repair-item">
            <strong>
              {{ repair.repairNumber }}
            </strong>

            -

            {{ repair.status }}

            <br />

            <small>
              {{ formatDate(repair.createdAt) }}
            </small>
          </div>
        </div>

        <p v-else>No repairs found.</p>
      </section>
    </div>
  </div>
</template>

<script>
import api from "@/api/axios.js";

export default {
  name: "CustomerDeviceDetails",

  data() {
    return {
      device: null,

      customer: null,

      repairs: [],

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

        const response = await api.get(
          `/customers/${this.$route.params.id}/devices/${this.$route.params.deviceId}/details`,
        );

        const data = response.data.data;

        this.device = data.device;

        this.customer = data.customer;

        this.repairs = data.repairs || [];
      } catch (error) {
        this.error = error.response?.data?.message || "Failed to load device";
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
