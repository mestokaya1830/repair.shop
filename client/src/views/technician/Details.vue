<template>
  <div class="technician-repair-details">
    <h1>Repair Details</h1>

    <p v-if="loading">Loading...</p>

    <p v-if="error" class="form-error">
      {{ error }}
    </p>

    <section v-if="repair">
      <h3>Repair Number</h3>

      <p>
        {{ repair.repairNumber }}
      </p>

      <h3>Status</h3>

      <p>
        {{ repair.status }}
      </p>

      <!-- STATUS UPDATE -->

      <div class="status-update">
        <label> Change Status </label>

        <select v-model="newStatus">
          <option value="">Select Status</option>

          <option v-if="repair.status === 'Received'" value="Diagnosing">
            Diagnosing
          </option>

          <option v-if="repair.status === 'Diagnosing'" value="Repairing">
            Repairing
          </option>

          <option v-if="repair.status === 'Diagnosing'" value="WaitingApproval">
            Waiting Approval
          </option>

          <option v-if="repair.status === 'Repairing'" value="Testing">
            Testing
          </option>

          <option v-if="repair.status === 'Testing'" value="Ready">
            Ready
          </option>

          <option v-if="repair.status === 'Ready'" value="Delivered">
            Delivered
          </option>
        </select>

        <input v-model="statusNote" placeholder="Status note" />

        <button @click="updateStatus" :disabled="!newStatus">
          Update Status
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

      <!-- ADD WORK LOG -->

      <div class="work-log-form">
        <h4>Add Work Log</h4>

        <textarea
          v-model="workMessage"
          placeholder="Write work note..."
        ></textarea>

        <button @click="addWorkLog" :disabled="!workMessage">Add Log</button>
      </div>
    </section>
  </div>
</template>

<script>
import api from "@/api/axios.js";

export default {
  name: "TechnicianRepairDetails",

  data() {
    return {
      repair: null,
      loading: false,
      error: "",
      newStatus: "",
      statusNote: "",
      workMessage: "",
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
          `/technician/repairs/${this.$route.params.id}`,
        );

        this.repair = response.data.repair;
      } catch (error) {
        this.error = error.response?.data?.message || "Failed to load repair";
      } finally {
        this.loading = false;
      }
    },

    async updateStatus() {
      try {
        await api.patch(
          `/technician/repairs/${this.repair._id}/status`,

          {
            status: this.newStatus,
            note: this.statusNote,
          },
        );

        this.newStatus = "";
        this.statusNote = "";

        await this.getRepair();
      } catch (error) {
        this.error = error.response?.data?.message || "Status update failed";
      }
    },

    async addWorkLog() {
      try {
        await api.post(
          `/technician/repairs/${this.repair._id}/work-log`,

          {
            message: this.workMessage,
          },
        );

        this.workMessage = "";

        await this.getRepair();
      } catch (error) {
        this.error = error.response?.data?.message || "Work log failed";
      }
    },

    formatDate(date) {
      if (!date) return "-";

      return new Date(date).toLocaleDateString();
    },
  },
};
</script>
