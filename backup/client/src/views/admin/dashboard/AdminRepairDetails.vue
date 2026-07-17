<template>
  <div class="admin-repair-details">
    <h1>Repair Details</h1>

    <p v-if="loading">Loading repair...</p>

    <p v-if="error" class="form-error">
      {{ error }}
    </p>

    <div v-if="repair">
      <!-- Repair Information -->

      <div class="dashboard-card">
        <h3>Repair Information</h3>

        <p>
          Repair No:
          {{ repair.repairNumber }}
        </p>

        <p>
          Status:
          {{ repair.status }}
        </p>

        <p>
          Created:
          {{ formatDate(repair.createdAt) }}
        </p>
      </div>

      <!-- Customer -->

      <div class="dashboard-card">
        <h3>Customer</h3>

        <p>
          {{ repair.customer?.profile?.firstName }}

          {{ repair.customer?.profile?.lastName }}
        </p>

        <p>
          {{ repair.customer?.email }}
        </p>
      </div>

      <!-- Device -->

      <div class="dashboard-card">
        <h3>Device</h3>

        <p>
          Brand:
          {{ repair.device?.brand }}
        </p>

        <p>
          Model:
          {{ repair.device?.model }}
        </p>

        <p>
          Serial:
          {{ repair.device?.serialNumber || "-" }}
        </p>
      </div>

      <!-- Technician -->

      <div class="dashboard-card">
        <h3>Technician</h3>

        <p v-if="repair.assignedTo">
          {{ repair.assignedTo.profile.firstName }}

          {{ repair.assignedTo.profile.lastName }}
        </p>

        <p v-else>Not assigned</p>
      </div>

      <!-- Status History -->

      <div class="dashboard-card">
        <h3>Status History</h3>

        <ul>
          <li v-for="item in repair.statusHistory" :key="item._id">
            {{ item.status }}

            -

            {{ item.note || "-" }}

            -

            {{ formatDate(item.createdAt) }}
          </li>
        </ul>
      </div>

      <!-- Work Logs -->

      <div class="dashboard-card">
        <h3>Work Logs</h3>

        <ul>
          <li v-for="log in repair.workLogs" :key="log._id">
            {{ log.message }}

            -

            {{ formatDate(log.createdAt) }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import api from "@/api/axios.js";

export default {
  name: "DashboardRepairDetails",

  data() {
    return {
      repair: null,

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

        this.error = "";

        const id = this.$route.params.id;

        const response = await api.get(`/dashboard/repairs/${id}/details`);

        this.repair = response.data.repair;
      } catch (error) {
        this.error = error.response?.data?.message || "Failed to load repair";
      } finally {
        this.loading = false;
      }
    },

    formatDate(date) {
      if (!date) return "-";

      return new Date(date).toLocaleDateString();
    },
  },
};
</script>
