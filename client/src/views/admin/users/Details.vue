<template>
  <div class="user-details-page">
    <h2>User Details</h2>

    <p v-if="loading">Loading user...</p>

    <p v-if="error" class="form-error">
      {{ error }}
    </p>

    <section v-if="user">
      <h3>Profile</h3>

      <p>
        <strong>Name:</strong>

        {{ user?.firstName }}

        {{ user?.lastName }}
      </p>

      <p>
        <strong>Email:</strong>

        {{ user?.email }}
      </p>

      <p>
        <strong>Phone:</strong>

        {{ user?.phone || "-" }}
      </p>

      <p>
        <strong>Position:</strong>

        {{ user?.position || "-" }}
      </p>

      <h3>Address</h3>

      <p>
        {{ user?.street || "-" }}
      </p>

      <p>
        {{ user?.postalCode || "-" }}

        {{ user?.city || "-" }}
      </p>

      <p>
        {{ user?.country || "-" }}
      </p>

      <h3>Account</h3>

      <p>
        <strong>Role:</strong>

        {{ user.role }}
      </p>

      <p>
        <strong>Status:</strong>

        {{ user.active ? "Active" : "Inactive" }}
      </p>

      <p>
        <strong>Created:</strong>

        {{ formatDate(user.createdAt) }}
      </p>

      <!-- Assigned Repairs -->

      <h3>Assigned Repairs</h3>

      <table v-if="repairs.length">
        <thead>
          <tr>
            <th>Repair No</th>
            <th>Customer</th>
            <th>Device</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="repair in repairs" :key="repair._id">
            <td>
              {{ repair.repairNumber }}
            </td>

            <td>
              {{ repair.customer?.firstName }}
              {{ repair.customer?.lastName }}
            </td>

            <td>
              {{ repair.device?.brand }}
              {{ repair.device?.model }}
            </td>

            <td>
              {{ repair.status }}
            </td>

            <td>
              <router-link :to="`/admin/repairs/${repair._id}/details`">
                View
              </router-link>
            </td>
          </tr>
        </tbody>
      </table>

      <p v-else>No assigned repairs</p>

      <div class="actions">
        <router-link :to="`/admin/users/${user._id}/edit`">
          Edit User
        </router-link>

        <router-link to="/admin/users"> Back </router-link>
      </div>
    </section>
  </div>
</template>

<script>
import api from "@/api/axios.js";

export default {
  name: "UserDetails",

  data() {
    return {
      user: null,
      repairs: [],
      loading: false,
      error: "",
    };
  },

  mounted() {
    this.getUser();
  },

  methods: {
    async getUser() {
      try {
        this.loading = true;

        const id = this.$route.params.id;

        const response = await api.get(`/users/${id}/details`);

        this.user = response.data.user;
        this.repairs = response.data.repairs;
      } catch (error) {
        this.error = error.response?.data?.message || "User not found";
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