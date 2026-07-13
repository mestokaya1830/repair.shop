<template>
  <div class="user-detail-page">
    <h2>User Detail</h2>

    <p v-if="loading">Loading user...</p>

    <p v-if="error" class="form-error">
      {{ error }}
    </p>

    <section v-if="user">
      <h3>Profile</h3>

      <p>
        <strong>Name:</strong>
        {{ user.profile.firstName }}
        {{ user.profile.lastName }}
      </p>

      <p>
        <strong>Email:</strong>
        {{ user.email }}
      </p>

      <p>
        <strong>Phone:</strong>
        {{ user.profile.phone || "-" }}
      </p>

      <p>
        <strong>Position:</strong>
        {{ user.profile.position || "-" }}
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
  name: "UserDetail",

  data() {
    return {
      user: null,
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
        const response = await api.get(`/users/${id}/detail`);
        this.user = response.data.user;
        console.log(response)
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
