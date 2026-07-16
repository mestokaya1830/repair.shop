<template>
  <div class="repair-edit">
    <h1>Repair Edit</h1>

    <p v-if="loading">Loading...</p>

    <p v-if="error" class="form-error">
      {{ error }}
    </p>

    <form v-if="form" @submit.prevent="updateRepair">
      <div>
        <label> Estimated Completion Date </label>

        <input type="date" v-model="form.estimatedCompletionDate" />
      </div>

      <div>
        <label> Problem Category </label>

        <input v-model="form.problem.category" />
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

      <button type="submit" :disabled="loading">Update</button>
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
          `/repairs/${this.$route.params.id}/edit`,
        );

        this.form = response.data.repair;
      } catch (error) {
        this.error = error.response?.data?.message || "Failed to load repair";
      } finally {
        this.loading = false;
      }
    },

    async updateRepair() {
      try {
        this.loading = true;

        this.error = "";

        await api.patch(
          `/repairs/${this.$route.params.id}/update`,

          {
            estimatedCompletionDate: this.form.estimatedCompletionDate,

            problem: this.form.problem,
          },
        );

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
