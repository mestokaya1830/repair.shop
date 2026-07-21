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

      <h3>Assigned Technician</h3>

      <p v-if="repair.assignedTo">
        Current:

        {{ repair.assignedTo?.firstName }}
        {{ repair.assignedTo?.lastName }}
      </p>

      <select v-model="selectedTechnician">
        <option value="">Select Technician</option>

        <option v-for="user in technicians" :key="user._id" :value="user._id">
          {{ use?.firstName }}
          {{ use?.lastName }}

          -
          {{ use?.position || user.role }}
        </option>
      </select>

      <button @click="assignRepair" :disabled="!selectedTechnician">
        Assign
      </button>

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
        {{ repair.customer?.firstName }}
        {{ repair.customer?.lastName }}
      </p>

      <p>
        {{ repair.customer?.phone }}
      </p>

      <p>
        {{ repair.customer?.email }}
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

      <div>
        <textarea
          v-model="workMessage"
          placeholder="Add work note..."
        ></textarea>

        <button @click="addWorkLog">Add Log</button>
      </div>

      <ul>
        <li v-for="log in repair.workLogs" :key="log._id">
          {{ log.message }}
          -
          {{ log.createdBy?.firstName }}

          {{ log.createdBy?.lastName }}
          -
          {{ formatDate(log.createdAt) }}
        </li>
      </ul>
      <button v-if="repair.status === 'Delivered'" @click="reopenRepair">
        Reopen Repair
      </button>
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
      technicians: [],
      selectedTechnician: "",
      workMessage: "",
      loading: false,
      error: "",
    };
  },

  mounted() {
    this.getRepair();
    this.getTechnicians();
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
    async getTechnicians() {
      try {
        const response = await api.get("/users");

        this.technicians = response.data.users.filter(
          (user) => user.role === "user",
        );
      } catch (error) {
        this.error =
          error.response?.data?.message || "Failed to load technicians";
      }
    },
    async assignRepair() {
      try {
        await api.patch(`/repairs/${this.repair._id}/assign`, {
          assignedTo: this.selectedTechnician,
        });

        this.getRepair();
      } catch (error) {
        this.error = error.response?.data?.message || "Assignment failed";
      }
    },
    async addWorkLog() {
      if (!this.workMessage) {
        return;
      }

      try {
        await api.patch(`/repairs/${this.repair._id}/work-log`, {
          message: this.workMessage,
        });

        this.workMessage = "";

        this.getRepair();
      } catch (error) {
        this.error = error.response?.data?.message || "Failed to add work log";
      }
    },
    async reopenRepair() {
      try {
        await api.patch(`/repairs/${this.repair._id}/reopen`);

        this.getRepair();
      } catch (error) {
        this.error = error.response?.data?.message || "Reopen failed";
      }
    },
  },
};
</script>