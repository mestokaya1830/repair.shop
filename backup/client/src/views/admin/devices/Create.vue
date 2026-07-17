<template>
  <div class="device-create">
    <h2>Create Device</h2>

    <p v-if="error" class="form-error">
      {{ error }}
    </p>

    <form @submit.prevent="createDevice">
      <div>
        <label>Customer</label>

        <select v-model="form.customer">
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

      <div>
        <label>Type</label>

        <input v-model="form.type" type="text" />

        <span v-if="errors.type" class="form-error">
          {{ errors.type }}
        </span>
      </div>

      <div>
        <label>Brand</label>

        <input v-model="form.brand" type="text" />

        <span v-if="errors.brand" class="form-error">
          {{ errors.brand }}
        </span>
      </div>

      <div>
        <label>Model</label>

        <input v-model="form.model" type="text" />

        <span v-if="errors.model" class="form-error">
          {{ errors.model }}
        </span>
      </div>

      <div>
        <label>Serial Number</label>

        <input v-model="form.serialNumber" />
      </div>

      <div>
        <label>Purchase Date</label>

        <input v-model="form.purchaseDate" type="date" />
      </div>

      <div>
        <label>Warranty Until</label>

        <input v-model="form.warrantyUntil" type="date" />
      </div>

      <div>
        <label>Accessories</label>

        <input
          v-model="accessory"
          @keyup.enter.prevent="addAccessory"
          placeholder="Press Enter"
        />

        <ul>
          <li v-for="(item, index) in form.accessories" :key="index">
            {{ item }}

            <button type="button" @click="removeAccessory(index)">X</button>
          </li>
        </ul>
      </div>

      <div>
        <label>Notes</label>

        <textarea v-model="form.notes"></textarea>
      </div>

      <button type="submit">Create</button>
    </form>
  </div>
</template>

<script>
import api from "@/api/axios.js";
import {deviceCreateSchema} from "@/validators/schemas.js";

export default {
  name: "DeviceCreate",

  data() {
    return {
      customers: [],
      accessory: "",
      form: {
        customer: "",
        type: "",
        brand: "",
        model: "",
        serialNumber: "",
        purchaseDate: "",
        warrantyUntil: "",
        accessories: [],
        notes: "",
      },

      errors: {},
      error: "",
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
        this.error = "Failed to load customers";
      }
    },

    addAccessory() {
      if (!this.accessory.trim()) {
        return;
      }

      this.form.accessories.push(this.accessory.trim());
      this.accessory = "";
    },

    removeAccessory(index) {
      this.form.accessories.splice(index, 1);
    },

    async createDevice() {
      this.errors = {};

      const result = deviceCreateSchema.safeParse(this.form);

      if (!result.success) {
        result.error.issues.forEach((issue) => {
          this.errors[issue.path.join(".")] = issue.message;
        });

        return;
      }

      try {
        const response = await api.post("/devices/create", result.data);

        this.$router.push(`/admin/devices/${response.data.data._id}/details`);
      } catch (error) {
        this.error = error.response?.data?.message || "Create failed";
      }
    },
  },
};
</script>
