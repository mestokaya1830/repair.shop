<template>
  <div class="users-page">
    <div class="page-header">
      <h2>Users</h2>

      <router-link to="/admin/users/create" class="nav-link">
        Add New User
      </router-link>
    </div>

    <p v-if="loading">Loading users...</p>

    <p v-if="error" class="form-error">
      {{ error }}
    </p>

    <table v-if="users?.length">
      <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Phone</th>
          <th>Role</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="user in users" :key="user._id">
          <td>
            {{ user.profile.firstName }}
            {{ user.profile.lastName }}
          </td>

          <td>
            {{ user.email }}
          </td>

          <td>
            {{ user.profile.phone || "-" }}
          </td>

          <td>
            {{ user.role }}
          </td>

          <td>
            {{ user.active ? "Active" : "Inactive" }}
          </td>

          <td>
            <router-link
              :to="`/admin/users/${user._id}/details`"
              class="action-link"
            >
              detailss
            </router-link>

            <router-link
              :to="`/admin/users/${user._id}/edit`"
              class="action-link"
            >
              Edit
            </router-link>
          </td>
        </tr>
      </tbody>
    </table>

    <p v-else-if="!loading">No users found</p>
  </div>
</template>

<script>
import api from "@/api/axios.js";

export default {
  name: "UsersPage",

  data() {
    return {
      users: [],
      loading: false,
      error: "",
    };
  },

  mounted() {
    this.getUsers();
  },

  methods: {
    async getUsers() {
      try {
        this.loading = true;
        this.error = "";

        const response = await api.get("/users");
        this.users = response.data.users;
      } catch (error) {
        this.error = error.response?.data?.message || "Failed to load users";
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>
