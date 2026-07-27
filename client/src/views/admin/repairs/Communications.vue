<template>
  <div class="communications-page">
    <h2>Communications</h2>

    <p v-if="error" class="form-error">
      {{ error }}
    </p>

    <!-- ADD COMMUNICATION -->

    <div class="communication-form">
      <h3>Add Communication</h3>

      <select v-model="form.type">
        <option value="">Select Type</option>
        <option value="phone">Phone</option>
        <option value="email">Email</option>
        <option value="whatsapp">WhatsApp</option>
        <option value="note">Note</option>
      </select>

      <span v-if="errors.type" class="form-error">
        {{ errors.type }}
      </span>

      <input v-model="form.contactPerson" placeholder="Contact Person" />

      <span v-if="errors.contactPerson" class="form-error">
        {{ errors.contactPerson }}
      </span>

      <input v-model="form.subject" placeholder="Subject" />

      <span v-if="errors.subject" class="form-error">
        {{ errors.subject }}
      </span>

      <textarea v-model="form.message" placeholder="Message"></textarea>

      <span v-if="errors.message" class="form-error">
        {{ errors.message }}
      </span>

      <button @click="addCommunication">Save</button>
    </div>

    <hr />

    <!-- HISTORY -->

    <div class="communication-list">
      <h3>History</h3>

      <ul>
        <li v-for="item in communications" :key="item._id">
          <strong>
            {{ item.type }}
          </strong>

          -
          {{ item.contactPerson }}

          <br />

          {{ item.subject }}

          <br />

          {{ item.message }}

          <br />

          <small>
            {{ item.createdBy?.firstName }}
            {{ item.createdBy?.lastName }}

            -
            {{ formatDate(item.createdAt) }}
          </small>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { communicationSchema } from "@/validations/communications.schema.js";
import api from "@/api/axios.js";

export default {
  name: "Communications",

  data() {
    return {
      repair: null,

      communications: [],

      form: {
        type: "",
        contactPerson: "",
        subject: "",
        message: "",
      },

      errors: {},

      error: "",
    };
  },

  mounted() {
    this.getRepair();
    this.getCommunications();
  },

  methods: {
    async getRepair() {
      try {
        const response = await api.get(
          `/repairs/${this.$route.params.id}/details`,
        );

        this.repair = response.data.data;
      } catch (error) {
        this.error = error.response?.data?.message || "Failed to load repair";
      }
    },

    async getCommunications() {
      try {
        const response = await api.get(
          `/repairs/${this.$route.params.id}/communications`,
        );

        this.communications = response.data.data;
      } catch (error) {
        this.error =
          error.response?.data?.message || "Failed to load communications";
      }
    },

    async addCommunication() {
      this.errors = {};

      try {
        const data = {
          repairId: this.$route.params.id,

          customerId: this.repair.customer._id,

          deviceId: this.repair.device._id,

          ...this.form,
        };

        const result = communicationSchema.safeParse(data);

        if (!result.success) {
          result.error.issues.forEach((issue) => {
            this.errors[issue.path.join(".")] = issue.message;
          });

          return;
        }

        await api.post(
          `/repairs/${this.$route.params.id}/communications`,

          result.data,
        );

        this.form = {
          type: "",
          contactPerson: "",
          subject: "",
          message: "",
        };

        this.getCommunications();
      } catch (error) {
        this.error = error.response?.data?.message || "Communication failed";
      }
    },

    formatDate(date) {
      if (!date) return "";

      return new Date(date).toLocaleDateString();
    },
  },
};
</script>
