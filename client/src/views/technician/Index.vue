<template>
  <div class="technician-dashboard">
    <h1>Technician Dashboard</h1>

    <p v-if="loading">Loading...</p>

    <p v-if="error" class="form-error">
      {{ error }}
    </p>

    <div v-if="user" class="welcome-card">
      <h3>
        Welcome
        {{ user.profile.firstName }}
        {{ user.profile.lastName }}
      </h3>

      <p>Here you can manage your assigned repairs.</p>
    </div>

    <div class="stats">
      <div class="card">
        <h3>My Repairs</h3>

        <p>
          {{ stats.total }}
        </p>
      </div>

      <div class="card">
        <h3>Pending</h3>

        <p>
          {{ stats.pending }}
        </p>
      </div>

      <div class="card">
        <h3>Repairing</h3>

        <p>
          {{ stats.repairing }}
        </p>
      </div>

      <div class="card">
        <h3>Completed</h3>

        <p>
          {{ stats.completed }}
        </p>
      </div>
    </div>

    <h2>Recent Repairs</h2>

    <table v-if="repairs.length">
      <thead>
        <tr>
          <th>Repair No</th>

          <th>Device</th>

          <th>Status</th>

          <th>Action</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="repair in repairs" :key="repair._id">
          <td>
            {{ repair.repairNumber }}
          </td>

          <td>
            {{ repair.device?.brand }}
            {{ repair.device?.model }}
          </td>

          <td>
            {{ repair.status }}
          </td>

          <td>
            <router-link :to="`/technician/repairs/${repair._id}`">
              View
            </router-link>
          </td>
        </tr>
      </tbody>
    </table>

    <p v-else>No assigned repairs</p>
  </div>
</template>

<script>
import api from "@/api/axios.js";

export default {
  name: "TechnicianDashboard",

  data() {
    return {
      user: null,

      repairs: [],

      stats: {
        total: 0,
        pending: 0,
        repairing: 0,
        completed: 0,
      },

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
        const user = JSON.parse(localStorage.getItem("user"));
        this.user = user;
        const response = await api.get("/technician");
        this.repairs = response.data.repairs;
        this.stats = response.data.stats;
      } catch (error) {
        this.error =
          error.response?.data?.message || "Failed to load dashboard";
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>
