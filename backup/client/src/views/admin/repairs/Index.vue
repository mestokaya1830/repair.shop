<template>
  <div class="repair-page">
    <div class="page-header">
      <h2>Repairs</h2>

      <router-link to="/admin/repairs/create"> Create Repair </router-link>
    </div>

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
          <th>Date</th>
          <th>Actions</th>
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
            {{ formatDate(repair.createdAt) }}
          </td>

          <td>
            <router-link :to="`/admin/repairs/${repair._id}/details`">
              Details
            </router-link>

            |

            <router-link :to="`/admin/repairs/${repair._id}/edit`">
              Edit
            </router-link>

            |

            <button @click="deleteRepair(repair._id)">Delete</button>
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
  name: "RepairIndex",

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
        this.error = "";
        const response = await api.get("/repairs");

        this.repairs = response.data.repairs;
      } catch (error) {
        this.error = error.response?.data?.message || "Failed to load repairs";
      } finally {
        this.loading = false;
      }
    },

    async deleteRepair(id) {
      if (!confirm("Delete this repair?")) {
        return;
      }

      try {
        await api.delete(`/repairs/${id}/delete`);

        this.repairs = this.repairs.filter((repair) => repair._id !== id);
      } catch (error) {
        this.error = error.response?.data?.message || "Failed to delete repair";
      }
    },

    formatDate(date) {
      return new Date(date).toLocaleDateString();
    },
  },
};
</script>
