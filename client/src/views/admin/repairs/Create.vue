<template>
  <div class="repair-create">
    <h1>Repair Create</h1>

    <p v-if="error" class="form-error">
      {{ error }}
    </p>

    <form @submit.prevent="createRepair">
      <!-- Customer -->

      <div>
        <label> Customer </label>

        <select v-model="form.customer" @change="getDevices">
          <option value="">Select Customer</option>

          <option
            v-for="customer in customers"
            :key="customer._id"
            :value="customer._id"
          >
            {{ customer.profile.firstName }}
            {{ customer.profile.lastName }}
          </option>
        </select>

        <span v-if="errors.customer" class="form-error">
          {{ errors.customer }}
        </span>
      </div>

      <!-- Device -->

      <div>
        <label> Device </label>

        <select v-model="form.device">
          <option value="">Select Device</option>

          <option
            v-for="device in devices"
            :key="device._id"
            :value="device._id"
          >
            {{ device.brand }}
            {{ device.model }}
          </option>
        </select>
      </div>

      <!-- Problem -->

      <div>
        <label> Category </label>
        <select v-model="form.problem.category">
          <option
            v-for="category in categories"
            :key="category"
            :value="category"
          >
            {{ category }}
          </option>
        </select>
      </div>

      <div>
        <label> Description </label>

        <textarea v-model="form.problem.description" />
      </div>

      <div>
        <label> Device Working </label>

        <select v-model="form.problem.deviceWorking">
          <option value="">Select</option>

          <option value="yes">Yes</option>

          <option value="no">No</option>
        </select>
      </div>

      <div>
        <label> Notes </label>

        <textarea v-model="form.problem.notes" />
      </div>

      <button type="submit" :disabled="loading">Save</button>
    </form>
  </div>
</template>

<script>
import api from "@/api/axios.js";
import { repairAdminSchema } from "@/validators/repairs.admin.schema.js";

export default {
  name: "RepairCreate",

  data() {
    return {
      customers: [],
      devices: [],

      categories: [
        "Hardware",
        "Software",
        "Screen",
        "Battery",
        "Charging",
        "Motherboard",
        "Keyboard",
        "Cooling",
        "Network",
        "Data Recovery",
        "Virus",
        "Other",
      ],

      form: {
        customer: "",
        device: "",

        problem: {
          category: "",
          description: "",
          deviceWorking: "",
          notes: "",
        },
      },

      errors: {},
      error: "",
      loading: false,
    };
  },

  mounted() {
    this.getCustomers();
  },

  methods: {
    async getCustomers() {
      try {
        const response = await api.get("/customers");

        this.customers = response.data.customers;
      } catch (error) {
        this.error =
          error.response?.data?.message || "Failed to load customers";
      }
    },

    async getDevices() {
      if (!this.form.customer) {
        this.devices = [];
        this.form.device = "";
        return; 
      }

      try {
        const response = await api.get(
          `/devices/customer/${this.form.customer}`,
        );

        this.devices = response.data.devices;
      } catch (error) {
        this.error = error.response?.data?.message || "Failed to load devices";
      }
    },

    async createRepair() {
      this.errors = {};
      this.error = "";
      const result = repairAdminSchema.safeParse(this.form);

      if (!result.success) {
        result.error.issues.forEach((err) => {
          this.errors[err.path.join(".")] = err.message;
        });

        return;
      }

      try {
        this.loading = true;
        const response = await api.post("/repairs/create", this.form);

        this.$router.push(`/admin/repairs/${response.data.data._id}/details`);
      } catch (error) {
        this.error = error.response?.data?.message || "Failed to create repair";
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>
