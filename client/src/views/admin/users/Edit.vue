<template>
  <div class="edit-user-page">
    <h2>Edit User</h2>

    <p v-if="loading">Loading...</p>

    <p v-if="error" class="form-error">
      {{ error }}
    </p>

    <form v-if="user" @submit.prevent="updateUser">
      <div>
        <label>First Name</label>
        <input v-model="form.firstName" type="text" />
      </div>

      <div>
        <label>Last Name</label>
        <input v-model="form.lastName" type="text" />
      </div>

      <div>
        <label>Email</label>
        <input :value="user.email" disabled />
      </div>

      <div>
        <label>Phone</label>
        <input v-model="form.phone" type="text" />
      </div>

      <div>
        <label>Position</label>
        <input v-model="form.position" type="text" />
      </div>

      <div>
        <label>Street</label>
        <input v-model="form.street" />
      </div>

      <div>
        <label>City</label>
        <input v-model="form.city" />
      </div>

      <div>
        <label>Postal Code</label>
        <input v-model="form.postalCode" />
      </div>

      <div>
        <label>Country</label>
        <input v-model="form.country" />
      </div>

      <div>
        <label>Status</label>
        <select v-model="form.active">
          <option :value="true">Active</option>
          <option :value="false">Inactive</option>
        </select>
      </div>

      <button type="submit" :disabled="saving">
        {{ saving ? "Saving..." : "Save Changes" }}
      </button>
    </form>
  </div>
</template>

<script>
import api from "@/api/axios.js";
import { updateUserSchema } from "@/validators/schemas.js";

export default {
  name: "EditUser",

  data() {
    return {
      user: null,
      loading: false,
      saving: false,
      error: "",
      form: {
        firstName: "",
        lastName: "",
        phone: "",
        position: "",
        street: "",
        city: "",
        postalCode: "",
        country: "",
        active: true,
      },
    };
  },

  mounted() {
    this.getUser();
  },

  methods: {
    async getUser() {
      try {
        this.loading = true;
        const id = this.$route.params.id;
        const response = await api.get(`/users/${id}/details`);
        this.user = response.data.data;
        this.form = response.data
      } catch (error) {
        this.error = error.response?.data?.message || "User not found";
      } finally {
        this.loading = false;
      }
    },

    async updateUser() {
      console.log(this.form);
      try {
        const result = updateUserSchema.safeParse(this.form);
        if (!result.success) {
          result.error.issues.forEach((error) => {
            this.errors[error.path.join(".")] = error.message;
          });

          return;
        }
        this.saving = true;
        const id = this.$route.params.id;
        await api.patch(`/users/${id}/update`, this.form);
        this.$router.push(`/admin/users/${id}/details`);
      } catch (error) {
        console.log(error);
        this.error = error.response?.data?.message || "Update failed";
      } finally {
        this.saving = false;
      }
    },
  },
};
</script>