<template>
  <div class="customers-page">
    <h2>Customers</h2>

    <router-link to="/admin/customers/create"> Add Customer </router-link>

    <p v-if="loading">Loading...</p>

    <p v-if="error" class="form-error">
      {{ error }}
    </p>

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
            {{ customer.profile.firstName }}
            {{ customer.profile.lastName }}
          </td>

          <td>
            {{ customer.profile.email || "-" }}
          </td>

          <td>
            {{ customer.profile.phone }}
          </td>

          <td>
            <router-link :to="`/admin/customers/${customer._id}/details`">
              details
            </router-link>

            <router-link :to="`/admin/customers/${customer._id}/edit`">
              Edit
            </router-link>
          </td>
          <button @click="deleteCustomer(customer._id)">Delete</button>
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
        const response = await api.get("/customers");
        this.customers = response.data.customers;
      } catch (error) {
        this.error =
          error.response?.data?.message || "Failed to load customers";
      } finally {
        this.loading = false;
      }
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
