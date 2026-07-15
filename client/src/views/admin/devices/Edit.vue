<template>
  <div class="device-edit">
    <h2>Edit Device</h2>

    <p v-if="loading">Loading...</p>

    <p v-if="error" class="form-error">
      {{ error }}
    </p>

    <form v-if="form" @submit.prevent="updateDevice">
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

        <input v-model="form.serialNumber" type="text" />
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
        <label>Notes</label>

        <textarea v-model="form.notes"></textarea>
      </div>

      <button type="submit">Save</button>
    </form>
  </div>
</template>

<script>
import api from "@/api/axios.js";
import {updateDeviceSchema} from "@/validators/schemas.js";

export default {
  name: "DeviceEdit",

  data() {
    return {
      form: null,

      errors: {},

      loading: false,

      error: "",
    };
  },

  mounted() {
    this.getDevice();
  },

  methods: {
    async getDevice() {
      try {
        this.loading = true;

        const response = await api.get(
          `/devices/${this.$route.params.id}/details`,
        );

        this.form = response.data.device;
      } catch (error) {
        this.error = error.response?.data?.message || "Failed to load device";
      } finally {
        this.loading = false;
      }
    },

    async updateDevice() {
      this.errors = {};

      const result = updateDeviceSchema.safeParse(this.form);

      if (!result.success) {
        result.error.issues.forEach((issue) => {
          this.errors[issue.path.join(".")] = issue.message;
        });

        return;
      }

      try {
        this.loading = true;

        const response = await api.patch(
          `/devices/${this.$route.params.id}/update`,
          result.data,
        );

        this.form = response.data.data;

        this.$router.push(`/admin/devices/${this.form._id}/detail`);
      } catch (error) {
        this.error = error.response?.data?.message || "Update failed";
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>
