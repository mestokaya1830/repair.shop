<template>
  <div class="dashboard-page">
    <h1>Dashboard</h1>

    <p v-if="loading">Loading dashboard...</p>

    <p v-if="error" class="form-error">
      {{ error }}
    </p>

    <!-- Statistics -->

    <div v-if="stats" class="stats-grid">
      <!-- Repairs -->

      <router-link to="/admin/dashboard/repairs" class="dashboard-card">
        <h3>Total Repairs</h3>

        <p>
          {{ stats.repairs.total }}
        </p>
      </router-link>

      <router-link
        to="/admin/dashboard/repairs?status=Pending"
        class="dashboard-card"
      >
        <h3>Pending</h3>

        <p>
          {{ stats.repairs.pending }}
        </p>
      </router-link>

      <router-link
        to="/admin/dashboard/repairs?status=Received"
        class="dashboard-card"
      >
        <h3>Received</h3>

        <p>
          {{ stats.repairs.received }}
        </p>
      </router-link>

      <router-link
        to="/admin/dashboard/repairs?status=Diagnosing"
        class="dashboard-card"
      >
        <h3>Diagnosing</h3>

        <p>
          {{ stats.repairs.diagnosing }}
        </p>
      </router-link>

      <router-link
        to="/admin/dashboard/repairs?status=WaitingApproval"
        class="dashboard-card"
      >
        <h3>Waiting Approval</h3>

        <p>
          {{ stats.repairs.waitingApproval }}
        </p>
      </router-link>

      <router-link
        to="/admin/dashboard/repairs?status=Repairing"
        class="dashboard-card"
      >
        <h3>Repairing</h3>

        <p>
          {{ stats.repairs.repairing }}
        </p>
      </router-link>

      <router-link
        to="/admin/dashboard/repairs?status=Testing"
        class="dashboard-card"
      >
        <h3>Testing</h3>

        <p>
          {{ stats.repairs.testing }}
        </p>
      </router-link>

      <router-link to="/admin/dashboard/repairs?status=Ready" class="dashboard-card">
        <h3>Ready</h3>

        <p>
          {{ stats.repairs.ready }}
        </p>
      </router-link>

      <router-link
        to="/admin/dashboard/repairs?status=Delivered"
        class="dashboard-card"
      >
        <h3>Delivered</h3>

        <p>
          {{ stats.repairs.delivered }}
        </p>
      </router-link>

      <router-link
        to="/admin/dashboard/repairs?status=Cancelled"
        class="dashboard-card"
      >
        <h3>Cancelled</h3>

        <p>
          {{ stats.repairs.cancelled }}
        </p>
      </router-link>

      <!-- Customers -->

      <router-link to="/admin/dashboard/customers" class="dashboard-card">
        <h3>Customers</h3>

        <p>
          {{ stats.customers }}
        </p>
      </router-link>

      <!-- Technicians -->

      <router-link to="/admin/dashboard/technicians" class="dashboard-card">
        <h3>Technicians</h3>

        <p>
          {{ stats.technicians }}
        </p>
      </router-link>

      <div class="dashboard-card">
        <h3>Admins</h3>

        <p>
          {{ stats.admins }}
        </p>
      </div>

      <div class="dashboard-card">
        <h3>Owners</h3>

        <p>
          {{ stats.owners }}
        </p>
      </div>
    </div>

    <hr />

    <!-- Recent Activity -->

    <h2>Recent Activity</h2>

    <ul v-if="recentActivity.length">
      <li v-for="item in recentActivity" :key="item.statusHistory._id">
        <strong>
          {{ item.repairNumber }}
        </strong>

        -

        {{ item.statusHistory.status }}

        -

        {{ item.statusHistory.note || "-" }}

        -

        {{ formatDate(item.statusHistory.createdAt) }}
      </li>
    </ul>

    <p v-else>No activity found</p>
  </div>
</template>

<script>
import api from "@/api/axios.js";

export default {
  name: "Dashboard",

  data() {
    return {
      stats: null,

      recentActivity: [],

      loading: false,

      error: "",
    };
  },

  mounted() {
    this.getDashboard();
  },

  methods: {
    async getDashboard() {
      try {
        this.loading = true;

        this.error = "";

        const response = await api.get("/dashboard");

        this.stats = response.data.stats;

        this.recentActivity = response.data.recentActivity;
      } catch (error) {
        this.error =
          error.response?.data?.message || "Failed to load dashboard";
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
