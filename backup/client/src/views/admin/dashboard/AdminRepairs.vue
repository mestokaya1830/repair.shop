<template>
  <div class="dashboard-repairs">
    <h1>Repairs</h1>

    <h3 v-if="$route.query.status">
      Status:
      {{ $route.query.status }}
    </h3>

    <p v-if="loading">Loading repairs...</p>

    <p v-if="error" class="form-error">
      {{ error }}
    </p>

    <table v-if="repairs.length">
      <thead>
        <tr>
          <th>Repair No</th>
          <th>Customer</th>
          <th>Device</th>
          <th>Technician</th>
          <th>Status</th>
          <th>Date</th>
          <th>Action</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="repair in repairs" :key="repair._id">
          <td>
            {{ repair.repairNumber }}
          </td>

          <td>
            {{ repair.customer?.profile?.firstName }}

            {{ repair.customer?.profile?.lastName }}
          </td>

          <td>
            {{ repair.device?.brand }}

            {{ repair.device?.model }}
          </td>

          <td>
            <span v-if="repair.assignedTo">
              {{ repair.assignedTo.profile.firstName }}

              {{ repair.assignedTo.profile.lastName }}
            </span>

            <span v-else> - </span>
          </td>

          <td>
            {{ repair.status }}
          </td>

          <td>
            {{ formatDate(repair.createdAt) }}
          </td>

          <td>
            <router-link :to="`/admin/dashboard/repairs/${repair._id}/details`">
              Details
            </router-link>
          </td>
        </tr>
      </tbody>
    </table>

    <p v-else-if="!loading">No repairs found</p>
  </div>
</template>

<script>
import api from "@/api/axios.js";

export default {
  name: "DashboardRepairs",

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

  watch: {
    "$route.query.status"() {
      this.getRepairs();
    },
  },

  methods: {
    async getRepairs() {
      try {
        this.loading = true;

        this.error = "";

        const params = {};

        if (this.$route.query.status) {
          params.status = this.$route.query.status;
        }

        const response = await api.get("/dashboard/repairs", {
          params,
        });

        this.repairs = response.data.repairs;
      } catch (error) {
        this.error = error.response?.data?.message || "Failed to load repairs";
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
