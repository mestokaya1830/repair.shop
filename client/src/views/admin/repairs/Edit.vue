<template>
  <div class="repair-edit">
    <h1>Repair Edit</h1>

    <p v-if="loading">Loading...</p>

    <p v-if="error" class="form-error">
      {{ error }}
    </p>

    <form v-if="form" @submit.prevent="updateRepair">
      <!-- GENERAL -->
      <h2>General</h2>

      <div>
        <label class="label">Status</label>

        <select v-model="form.status">
          <option value="Pending">Pending</option>
          <option value="Received">Received</option>
          <option value="Diagnosing">Diagnosing</option>
          <option value="WaitingApproval">Waiting Approval</option>
          <option value="Repairing">Repairing</option>
          <option value="Testing">Testing</option>
          <option value="Ready">Ready</option>
          <option value="Delivered">Delivered</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>

      <div>
        <label class="label"> Assigned Technician </label>
        <select v-model="form.assignedTo">
          <option value="">Select technician</option>
          <option v-for="user in technicians" :key="user._id" :value="user._id">
            {{ user.firstName }} {{ user.lastName }}
          </option>
        </select>
      </div>

      <div>
        <label class="label"> Estimated Completion Date </label>
        <input type="date" v-model="form.estimatedCompletionDate" />
      </div>

      <!-- PROBLEM -->

      <h2>Problem</h2>

      <div>
        <label class="label"> Category </label>
        <input v-model="form.problem.category" />
      </div>

      <div>
        <label class="label"> Description </label>
        <textarea v-model="form.problem.description" />
      </div>

      <div>
        <label class="label"> Device Working </label>

        <select v-model="form.problem.deviceWorking">
          <option value="">Select</option>
          <option value="yes">Yes</option>
          <option value="no">No</option>
        </select>
      </div>

      <div>
        <label class="label"> Started At </label>
        <input v-model="form.problem.startedAt" />
      </div>

      <div>
        <label class="label"> Notes </label>
        <textarea v-model="form.problem.notes" />
      </div>

      <!-- DIAGNOSIS -->

      <h2>Diagnosis</h2>

      <div>
        <label class="label"> Diagnosis </label>
        <textarea v-model="form.diagnosis" />
      </div>

      <div>
        <label class="label"> Solution </label>
        <textarea v-model="form.solution" />
      </div>

      <!-- APPROVAL -->

      <h2>Approval</h2>

      <div>
        <label class="label"> Status </label>

        <select v-model="form.approval.status">
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      <div>
        <label class="label"> Note </label>
        <textarea v-model="form.approval.note" />
      </div>

      <!-- RECEPTION -->

      <h2>Reception</h2>

      <h3>Current Reception</h3>
      <ul class="list">
          <li>
            Method: {{ form.reception.method }}
          </li>
          <li>
            Location: {{ form.reception.location }}
          </li>
          <li>
            Company: {{ form.reception.courierCompany }}
          </li>
          <li>
            Tracknumber: {{ form.reception.trackingNumber }}
          </li>
        
        </ul>
      <div>
        <label class="label"> Method </label>

        <select v-model="form.reception.method">
          <option value="">Select</option>
          <option value="courier">Courier</option>
          <option value="walk-in">Walk-in</option>
        </select>
      </div>

      <div>
        <label class="label"> Location </label>
        <input v-model="form.reception.location" />
      </div>

      <div>
        <label class="label"> Courier Company </label>
        <input v-model="form.reception.courierCompany" />
      </div>

      <div>
        <label class="label"> Tracking Number </label>
        <input v-model="form.reception.trackingNumber" />
      </div>
      <button type="submit" class="btn" :disabled="loading">Update Repair</button>
    </form>
  </div>
</template>

<script>
import api from "@/api/axios.js";

export default {
  name: "RepairEdit",

  data() {
    return {
      form: null,
      technicians: [],
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
          `/repairs/${this.$route.params.id}/edit`,
        );

        this.form = response.data.repair;
        this.form.estimatedCompletionDate = this.form.estimatedCompletionDate.split('T')[0];

        if (!this.form.approval) {
          this.form.approval = {
            status: "pending",
            note: "",
          };
        }

        if (!this.form.reception) {
          this.form.reception = {
            method: "",
            location: "",
            courierCompany: "",
            trackingNumber: "",
          };
        }
      } catch (error) {
        this.error = error.response?.data?.message || "Failed to load repair";
      } finally {
        this.loading = false;
      }
    },

    async getTechnicians() {
      try {
        const response = await api.get("/users", {
          params: {
            position: 'technician'
          }
        });
        this.technicians = response.data.data;
        
      } catch (error) {
        this.error =
          error.response?.data?.message || "Failed to load technicians";
      }
    },

    async updateRepair() {
      try {
        this.loading = true;
        this.error = "";

        await api.patch(
          `/repairs/${this.$route.params.id}/update`,

          {
            status: this.form.status,
            assignedTo: this.form.assignedTo,
            estimatedCompletionDate: this.form.estimatedCompletionDate,
            problem: this.form.problem,
            diagnosis: this.form.diagnosis,
            solution: this.form.solution,
            approval: this.form.approval,
            reception: this.form.reception,
          },
        );
console.log(this.form.reception)
        this.$router.push(`/admin/repairs/${this.$route.params.id}/details`);
      } catch (error) {
        this.error = error.response?.data?.message || "Failed to update repair";
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>
