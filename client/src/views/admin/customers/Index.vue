<template>
  <div class="customers-page">
    <h2>Customers</h2>
    <p v-if="loading">Loading...</p>

    <router-link to="/admin/customers/create" class="nav-link">
        Add New Customer
      </router-link>

    <p v-if="error" class="form-error">
      {{ error }}
    </p>
    <div class="search-box">
      <input
        v-model="search"
        @keyup.enter="getCustomers"
        type="text"
        placeholder="Search customers..."
      />

      <button v-if="search" @click="clearSearch" type="button">×</button>

      <select v-model="source" @change="getCustomers">
        <option value="">All Sources</option>
        <option value="web">Web</option>
        <option value="admin">Admin</option>
      </select>

      <select v-model="active" @change="getCustomers">
        <option value="">All Status</option>

        <option value="true">Active</option>

        <option value="false">Inactive</option>
      </select>
      <div>
        <label>From</label>
        <input v-model="dateFrom" type="date" />

        <label>To</label>
        <input v-model="dateTo" type="date" />

        <button @click="getCustomers">Filter</button>
      </div>
    </div>

    <table v-if="customers.length">
      <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Phone</th>
          <th>Actions</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="customer in customers" :key="customer._id">
          <td>
            {{ customer.firstName }}
            {{ customer.lastName }}
          </td>

          <td>
            {{ customer.email || "-" }}
          </td>

          <td>
            {{ customer.phone }}
          </td>

          <td>
            <router-link :to="`/admin/customers/${customer._id}/details`">
              details
            </router-link>

            <router-link :to="`/admin/customers/${customer._id}/edit`">
              Edit
            </router-link>
          </td>
          <td>
            <button @click="deleteCustomer(customer._id)">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>

    <p v-else-if="!loading">No customers found.</p>
  </div>
</template>

<script>
import api from "@/api/axios.js";

export default {
  name: "CustomerIndex",

  data() {
    return {
      customers: [],
      search: "",
      source: "",
      dateFrom: "",
      dateTo: "",
      active: "",
      loading: false,
      error: "",
    };
  },

  mounted() {
    this.getCustomers();
  },

  methods: {
    async getCustomers() {
      try {
        this.loading = true;
        this.error = "";

        const response = await api.get("/customers", {
          params: {
            search: this.search || undefined,
            source: this.source || undefined,
            active: this.active || undefined,
            dateFrom: this.dateFrom || undefined,
            dateTo: this.dateTo || undefined,
          },
        });

        this.customers = response.data.data;
        console.log(this.customers)
      } catch (error) {
        console.error("error", error.response);

        this.error =
          error.response?.data?.message || "Failed to load customers";
      } finally {
        this.loading = false;
      }
    },
    clearSearch() {
      this.search = ""
      this.getCustomers()
    },
    async deleteCustomer(id) {
      const confirmDelete = confirm(
        "Are you sure you want to delete this customer?",
      );

      if (!confirmDelete) {
        return;
      }

      try {
        this.error = "";
        await api.delete(`/customers/${id}/delete`);
        await this.getCustomers();
      } catch (error) {
        this.error =
          error.response?.data?.message || "Failed to delete customer";
      }
    },
  },
};
</script>
