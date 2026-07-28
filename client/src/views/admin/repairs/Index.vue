<template>
  <div class="repair-page">
    <div class="page-header">
      <h2>Repairs</h2>
    </div>
    <router-link to="/admin/repairs/create" class="nav-link">
      Add New Repair
    </router-link>
    <p v-if="loading">Loading...</p>

    <p v-if="error" class="form-error">
      {{ error }}
    </p>
    <div class="filters">
      <input
        v-model="filters.search"
        type="text"
        placeholder="Repair No / Customer"
      />
      <button @click="getRepairs" class="btn">Search</button>

      <select v-model="filters.status" @change="getRepairs">
        <option value="">All Status</option>
        <option value="Pending">Pending</option>
        <option value="Received">Received</option>
        <option value="Assigned">Assigned</option>
        <option value="Repairing">Repairing</option>
        <option value="Completed">Completed</option>
        <option value="Delivered">Delivered</option>
      </select>

      <select v-model="filters.source" @change="getRepairs">
        <option value="">All Sources</option>
        <option value="web">Web</option>
        <option value="office">Office</option>
      </select>

      <select v-model="filters.createdBy" @change="getRepairs">
        <option value="">All Users</option>

        <option v-for="user in users" :key="user._id" :value="user._id">
          {{ user.firstName }} {{ user.lastName }}
        </option>
      </select>

      <div class="date-filter">
        <label class="label">
          From
          <input type="date" v-model="filters.fromDate" />
        </label>

        <label class="label">
          To
          <input type="date" v-model="filters.toDate" />
        </label>
      </div>
      <button @click="resetFilters" class="btn">Reset</button>
    </div>
    <table v-if="repairs.length">
      <thead>
        <tr>
          <th>Repair No</th>
          <th>Customer</th>
          <th>Device</th>
          <th>Status</th>
          <th>Date</th>
          <th>Source</th>
          <th>Created By</th>
          <th>Actions</th>
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
            {{ formatDate(repair.createdAt) }}
          </td>
          <td>
            {{ repair.source }}
          </td>
          <td>
            <span v-if="repair.createdBy" class="user-link">
              {{ repair.createdBy.firstName }}
              {{ repair.createdBy.lastName }}
            </span>

            <span v-else> Web </span>
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

            <button class="btn" @click="deleteRepair(repair._id)">Delete</button>
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
      users: [],
      loading: false,
      error: "",
      filters: {
        search: "",
        status: "",
        source: "",
        createdBy: "",
        fromDate: "",
        toDate: "",
      },
    };
  },

  mounted() {
    this.getRepairs();
    this.getUsers();
  },

  methods: {
    async getRepairs() {
      try {
        this.loading = true;
        this.error = "";

        const params = {
          search: this.filters.search,
          status: this.filters.status,
          source: this.filters.source,
          createdBy: this.filters.createdBy,
          fromDate: this.filters.fromDate,
          toDate: this.filters.toDate,
        };
        const response = await api.get("/repairs", { params });

        this.repairs = response.data.repairs;
        console.log(this.repairs)
      } catch (error) {
        this.error = error.response?.data?.message || "Failed to load repairs";
      } finally {
        this.loading = false;
      }
    },
     async getUsers() {
      try {
        this.loading = true;
        this.error = "";
        const response = await api.get("/users");

        this.users = response.data.data;
      } catch (error) {
        this.error = error.response?.data?.message || "Failed to load users";
      } finally {
        this.loading = false;
      }
    },
    async deleteRepair(id) {
      if (!confirm("Delete this repair?")) {
        return;
      }

      try {
        await api.delete(`/repairs/${id}/remove`);

        this.repairs = this.repairs.filter((repair) => repair._id !== id);
      } catch (error) {
        this.error = error.response?.data?.message || "Failed to delete repair";
      }
    },

    formatDate(date) {
      return new Date(date).toLocaleDateString();
    },
    resetFilters() {
      this.filters = {
        search: "",
        status: "",
        source: "",
        createdBy: "",
        fromDate: "",
        toDate: "",
      };

      this.getRepairs();
    },
  },
};
</script>
