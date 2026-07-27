<template>
  <div class="repair-details">
    <h1>Repair Details</h1>

    <p v-if="loading">Loading...</p>

    <p v-if="error" class="form-error">
      {{ error }}
    </p>

    <div v-if="repair">
      <!-- BASIC -->

      <section>
        <h3>Repair Information</h3>

        <p>
          Repair Number:
          {{ repair.repairNumber }}
        </p>

        <p>
          Status:
          {{ repair.status }}
        </p>

        <p>
          Source:
          {{ repair.source }}
        </p>
      </section>

      <hr />

      <!-- ASSIGN -->

      <section>
        <h3>Assigned Technician</h3>

        <p v-if="repair.assignedTo">
          Current:

          {{ repair.assignedTo.firstName }}

          {{ repair.assignedTo.lastName }}
        </p>

        <select v-model="selectedTechnician">
          <option value="">Select Technician</option>

          <option v-for="user in technicians" :key="user._id" :value="user._id">
            {{ user.firstName }}

            {{ user.lastName }}

            -
            {{ user.position || user.role }}
          </option>
        </select>

        <button @click="assignRepair" :disabled="!selectedTechnician">
          Assign
        </button>
      </section>

      <hr />

      <!-- STATUS -->

      <section>
        <h3>Status Actions</h3>

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
      </section>

      <hr />

      <!-- CUSTOMER -->

      <section>
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
      </section>

      <hr />

      <!-- DEVICE -->

      <section>
        <h3>Device</h3>

        <p>
          {{ repair.device?.brand }}

          {{ repair.device?.model }}
        </p>

        <p>
          Serial:

          {{ repair.device?.serialNumber }}
        </p>
      </section>

      <hr />

      <!-- PROBLEM -->

      <section>
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
          Notes:
          {{ repair.problem?.notes }}
        </p>
      </section>

      <hr />

      <!-- STATUS HISTORY -->

      <section>
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
      </section>

      <hr />

      <!-- WORK ITEMS -->

      <section>
        <h3>Work Items</h3>

        <div class="work-item-form">
          <input v-model="workItem.title" placeholder="Work title" />

          <textarea v-model="workItem.description" placeholder="Description" />

          <select v-model="workItem.type">
            <option value="service">Service</option>

            <option value="part">Part</option>
          </select>

          <input type="number" v-model.number="workItem.quantity" min="1" />

          <template v-if="workItem.type === 'part'">
            <input v-model="workItem.partInfo.name" placeholder="Part name" />

            <input v-model="workItem.partInfo.brand" placeholder="Brand" />

            <input v-model="workItem.partInfo.model" placeholder="Model" />

            <input
              v-model="workItem.partInfo.serialNumber"
              placeholder="Serial Number"
            />
          </template>

          <button @click="addWorkItem">Add Work Item</button>
        </div>

        <ul>
          <li v-for="item in repair.workItems" :key="item._id">
            {{ formatDate(item.date) }}

            -

            {{ item.type }}

            -

            {{ item.title }}

            <span> ({{ item.quantity }}) </span>

            <p>
              {{ item.description }}
            </p>

            <small v-if="item.partInfo">
              {{ item.partInfo.brand }}

              {{ item.partInfo.model }}
            </small>
          </li>
        </ul>
      </section>

      <hr />

      <!-- IMAGES -->

      <section>
        <h3>Images</h3>

        <div class="image-preview">
          <img
            v-for="item in repair.images"
            :key="item._id"
            :src="`http://localhost:4001/${item.path}`"
            alt="Repair Image"
          />
        </div>
      </section>

      <hr />

      <!-- INVOICE -->
      <button v-if="repair.status === 'Delivered'" @click="reopenRepair">
        Reopen Repair
      </button>
      <router-link :to="`/admin/repairs/${repair._id}/communications`">
        Communications
      </router-link>
      <button v-if="repair.status !== 'Ready'" disabled>Create Invoice</button>

      <router-link
        v-else
        :to="`/admin/invoices/${repair._id}/create`"
        class="nav-link"
      >
        Create Invoice
      </router-link>
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

      workItem: {
        type: "service",

        title: "",

        description: "",

        quantity: 1,

        partInfo: {
          name: "",
          brand: "",
          model: "",
          serialNumber: "",
          partNumber: "",
        },
      },

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

        this.repair = response.data.data;

        console.log(this.repair);
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
        const response = await api.get("/users", {
          params: {
            position: "technician",
          },
        });

        this.technicians = response.data.data;
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

    async addWorkItem() {
      if (!this.workItem.title) {
        this.error = "Work title is required";

        return;
      }

      try {
        await api.patch(`/repairs/${this.repair._id}/work-items`, {
          ...this.workItem,
        });

        this.workItem = {
          type: "service",

          title: "",

          description: "",

          quantity: 1,

          partInfo: {
            name: "",

            brand: "",

            model: "",

            serialNumber: "",

            partNumber: "",
          },
        };

        this.getRepair();
      } catch (error) {
        this.error = error.response?.data?.message || "Failed to add work item";
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
