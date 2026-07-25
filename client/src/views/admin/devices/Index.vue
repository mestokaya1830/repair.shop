<template>
  <div class="devices-page">
    <h2>Devices</h2>

    <p v-if="loading">Loading...</p>

    <p v-if="error" class="form-error">
      {{ error }}
    </p>

    <div class="filters">
      <input v-model="filters.search" placeholder="Search..." />
      <button @click="getDevices">Search</button>

      <select v-model="filters.type" @change="getDevices">
        <option value="">All Types</option>
        <option value="Laptop">Laptop</option>
        <option value="Desktop">Desktop</option>
        <option value="Phone">Phone</option>
        <option value="Tablet">Tablet</option>
      </select>

      <select v-model="filters.brand" @change="getDevices">
        <option value="">All Brands</option>
        <option value="Apple">Apple</option>
        <option value="Dell">Dell</option>
        <option value="HP">HP</option>
        <option value="Lenovo">Lenovo</option>
      </select>

      <button @click="resetFilters">Reset</button>
    </div>

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
      filters: {
        search: "",
        type: "",
        brand: "",
        customer: "",
      },
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

        const response = await api.get("/devices", {
          params: this.filters,
        });

        this.devices = response.data.devices;
      } catch (error) {
        this.error = error.response?.data?.message || "Failed to load devices";
      } finally {
        this.loading = false;
      }
    },
    async resetFilters() {
      this.filters = {
        search: "",
        type: "",
        brand: "",
        customer: "",
      };

      await this.getDevices();
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
