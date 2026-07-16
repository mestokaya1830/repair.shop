<template>
  <div class="technician-repairs">
    <h1>My Repairs</h1>

    <p v-if="loading">Loading...</p>

    <p v-if="error" class="form-error">
      {{ error }}
    </p>

    <table v-if="repairs.length">
      <thead>
        <tr>
          <th>Repair No</th>

          <th>Customer</th>

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
            {{ repair.customer?.profile?.firstName }}

            {{ repair.customer?.profile?.lastName }}
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
              Details
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
  name: "TechnicianRepairIndex",

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

  methods: {
    async getRepairs() {
      try {
        this.loading = true;

        const response = await api.get("/technician/repairs");

        this.repairs = response.data.repairs;
      } catch (error) {
        this.error = error.response?.data?.message || "Failed to load repairs";
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>
