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
    <div class="filters">
      <input v-model="filters.search" placeholder="Search..." />
      <button @click="getUsers">Search</button>

      <select v-model="filters.role" @change="getUsers">
        <option value="">All Roles</option>
        <option value="admin">Admin</option>
        <option value="user">User</option>
      </select>
      <select v-model="filters.position" @change="getUsers">
        <option value="">All Positions</option>
        <option value="Technician">Technician</option>
        <option value="Manager">Manager</option>
      </select>

      <select v-model="filters.isActive" @change="getUsers">
        <option value="">All Status</option>
        <option value="true">Active</option>
        <option value="false">Inactive</option>
      </select>

      <button @click="resetFilters">Reset</button>
    </div>
    <table v-if="users?.length">
      <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Phone</th>
          <th>Role</th>
          <th>Position</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="user in users" :key="user._id">
          <td>
            {{ user?.firstName }}
            {{ user?.lastName }}
          </td>

          <td>
            {{ user.email }}
          </td>

          <td>
            {{ user?.phone || "-" }}
          </td>

          <td>
            {{ user.role }}
          </td>

          <td>
            {{ user?.position || "-" }}
          </td>

          <td>
            {{ user.isActive ? "Active" : "Inactive" }}
          </td>

          <td>
            <router-link
              :to="`/admin/users/${user._id}/details`"
              class="action-link"
            >
              Details
            </router-link>

            <router-link
              :to="`/admin/users/${user._id}/edit`"
              class="action-link"
            >
              Edit
            </router-link>
            <button @click="deleteUser(user._id)">Delete</button>
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
      filters: {
        search: "",
        role: "",
        isActive: "",
        position: "",
      },
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
        const response = await api.get("/users", {
          params: this.filters,
        });

        this.users = response.data.data;
      } catch (error) {
        this.error = error.response?.data?.message || "Failed to load users";
      } finally {
        this.loading = false;
      }
    },
    async resetFilters() {
      this.filters = {
        search: "",
        role: "",
        isActive: "",
        position: "",
      };

      await this.getUsers();
    },
    async deleteUser(id) {
      const confirmDelete = confirm(
        "Are you sure you want to deactivate this user?",
      );

      if (!confirmDelete) {
        return;
      }

      try {
        await api.patch(`/users/${id}/delete`);

        await this.getUsers();
      } catch (error) {
        this.error = error.response?.data?.message || "Delete failed";
      }
    },
  },
};
</script>
