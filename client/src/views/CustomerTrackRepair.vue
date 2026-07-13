<template>
  <div class="track-page">
    <h1>Track Repair</h1>

    <div class="search-box">
      <input
        v-model="repairNumber"
        type="text"
        placeholder="Enter repair number"
      />

      <button @click="search" :disabled="loading">
        {{ loading ? "Searching..." : "Search" }}
      </button>
    </div>

    <p v-if="error" class="form-error">
      {{ error }}
    </p>

    <section v-if="repair" class="repair-result">
      <h2>Repair Information</h2>

      <div>
        <strong>Repair Number:</strong>
        {{ repair.repairNumber }}
      </div>

      <div>
        <strong>Status:</strong>
        {{ repair.status }}
      </div>

      <div v-if="repair.createdAt">
        <strong>Created:</strong>

        {{ formatDate(repair.createdAt) }}
      </div>

      <div v-if="repair.updatedAt">
        <strong>Last Update:</strong>

        {{ formatDate(repair.updatedAt) }}
      </div>

      <div v-if="repair.estimatedCompletionDate">
        <strong> Estimated Completion: </strong>

        {{ formatDate(repair.estimatedCompletionDate) }}
      </div>

      <hr />

      <h3>Device</h3>

      <p>
        <strong>Type:</strong>
        {{ repair.device.type }}
      </p>

      <p>
        <strong>Brand:</strong>
        {{ repair.device.brand }}
      </p>

      <p>
        <strong>Model:</strong>
        {{ repair.device.model }}
      </p>

      <hr />

      <h3>Repair Progress</h3>

      <ul class="status-history">
        <li v-for="(item, index) in repair.statusHistory" :key="index">
          <strong>
            {{ item.status }}
          </strong>

          <p v-if="item.note">
            {{ item.note }}
          </p>

          <small>
            {{ formatDate(item.createdAt) }}
          </small>
        </li>
      </ul>
    </section>
  </div>
</template>

<script>
import api from "@/api/axios.js";

export default {
  name: "TrackPage",

  data() {
    return {
      repairNumber: "",
      repair: null,
      loading: false,
      error: "",
    };
  },

  methods: {
    async search() {
      if (!this.repairNumber) {
        this.error = "Please enter repair number";

        return;
      }

      try {
        this.loading = true;
        this.error = "";
        this.repair = null;
        const response = await api.get(`/repair/track/${this.repairNumber}`);
        this.repair = response.data.data;
      } catch (error) {
        this.error = error.response?.data?.message || "Repair not found";
      } finally {
        this.loading = false;
      }
    },

    formatDate(date) {
      if (!date) return "-";

      return new Date(date).toLocaleString();
    },
  },
};
</script>
