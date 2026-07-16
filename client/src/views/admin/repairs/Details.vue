<template>
  <div class="repair-details">
    <h1>Repair Details</h1>

    <p v-if="loading">Loading...</p>

    <p v-if="error" class="form-error">
      {{ error }}
    </p>

    <div v-if="repair">
      <h3>Repair Number</h3>
      <p>{{ repair.repairNumber }}</p>

      <h3>Status</h3>

      <p>
        {{ repair.status }}
      </p>

      <!-- Status Actions -->

      <div class="status-actions">
        <button
          v-if="repair.status === 'Pending'"
          @click="changeStatus('Received')"
        >
          Receive
        </button>

        <button
          v-if="repair.status === 'Received'"
          @click="changeStatus('Diagnosing')"
        >
          Start Diagnosis
        </button>

        <button
          v-if="repair.status === 'Diagnosing'"
          @click="changeStatus('Repairing')"
        >
          Start Repair
        </button>

        <button
          v-if="repair.status === 'Repairing'"
          @click="changeStatus('Testing')"
        >
          Start Testing
        </button>

        <button
          v-if="repair.status === 'Testing'"
          @click="changeStatus('Ready')"
        >
          Mark Ready
        </button>

        <button
          v-if="repair.status === 'Ready'"
          @click="changeStatus('Delivered')"
        >
          Deliver
        </button>
      </div>

      <hr />

      <h3>Customer</h3>

      <p>
        {{ repair.customer?.profile?.firstName }}
        {{ repair.customer?.profile?.lastName }}
      </p>

      <p>
        {{ repair.customer?.profile?.phone }}
      </p>

      <p>
        {{ repair.customer?.profile?.email }}
      </p>

      <hr />

      <h3>Device</h3>

      <p>
        {{ repair.device?.brand }}
        {{ repair.device?.model }}
      </p>

      <p>
        Serial:
        {{ repair.device?.serialNumber }}
      </p>

      <hr />

      <h3>Problem</h3>

      <p>
        Category:
        {{ repair.problem?.category }}
      </p>

      <p>
        Description:
        {{ repair.problem?.description }}
      </p>

      <p>
        Device Working:
        {{ repair.problem?.deviceWorking }}
      </p>

      <p>
        Notes:
        {{ repair.problem?.notes }}
      </p>

      <hr />

      <h3>Status History</h3>

      <ul>
        <li v-for="item in repair.statusHistory" :key="item._id">
          {{ item.status }}

          -

          {{ item.note }}

          -

          {{ item.changedBy?.name }}

          -

          {{ formatDate(item.createdAt) }}
        </li>
      </ul>

      <hr />

      <h3>Work Logs</h3>

      <ul>
        <li v-for="log in repair.workLogs" :key="log._id">
          {{ log.message }}

          -

          {{ formatDate(log.createdAt) }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import api from "@/api/axios.js";

export default {
  name: "RepairDetail",

  data() {
    return {
      repair: null,

      loading: false,

      error: "",
    };
  },

  mounted() {
    this.getRepair();
  },

  methods: {
    async getRepair() {
      try {
        this.loading = true;

        const response = await api.get(
          `/repairs/${this.$route.params.id}/details`,
        );

        this.repair = response.data.repair;
      } catch (error) {
        this.error = error.response?.data?.message || "Failed to load repair";
      } finally {
        this.loading = false;
      }
    },

    async changeStatus(status) {
      try {
        await api.patch(`/repairs/${this.repair._id}/status`, {
          status,

          note: `${status} status changed`,
        });

        this.getRepair();
      } catch (error) {
        this.error = error.response?.data?.message || "Status update failed";
      }
    },

    formatDate(date) {
      if (!date) return "";

      return new Date(date).toLocaleDateString();
    },
  },
};
</script>
