<template>
  <div class="devices-page">
    <h2>Devices</h2>

    <p v-if="loading">Loading...</p>

    <p v-if="error" class="form-error">
      {{ error }}
    </p>

    <table v-if="devices.length">
      <thead>
        <tr>
          <th>Customer</th>
          <th>Type</th>
          <th>Brand</th>
          <th>Model</th>
          <th>Serial Number</th>
          <th>Actions</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="device in devices" :key="device._id">
          <td>
            {{ device.customer?.firstName }}
            {{ device.customer?.lastName }}
          </td>

          <td>
            {{ device.type }}
          </td>

          <td>
            {{ device.brand }}
          </td>

          <td>
            {{ device.model }}
          </td>

          <td>
            {{ device.serialNumber || "-" }}
          </td>

          <td>
            <router-link :to="`/admin/devices/${device._id}/details`">
              Detail
            </router-link>

            <router-link :to="`/admin/devices/${device._id}/edit`">
              Edit
            </router-link>

            <button @click="deleteDevice(device._id)">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>

    <p v-else-if="!loading">No devices found</p>
  </div>
</template>

<script>
import api from "@/api/axios.js";

export default {
  name: "DevicesIndex",

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

        const response = await api.get("/devices");

        this.devices = response.data.devices;
      } catch (error) {
        this.error = error.response?.data?.message || "Failed to load devices";
      } finally {
        this.loading = false;
      }
    },

    async deleteDevice(id) {
      const confirmDelete = confirm(
        "Are you sure you want to delete this device?",
      );

      if (!confirmDelete) {
        return;
      }

      try {
        await api.delete(`/devices/${id}/delete`);

        await this.getDevices();
      } catch (error) {
        this.error = error.response?.data?.message || "Delete failed";
      }
    },
  },
};
</script>
