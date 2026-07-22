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
import { usersUpdateSchema } from "@/validators/schemas.js";

export default {
  name: "EditUser",
  data() {
    return {
      user: null,
      form: {
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        street: "",
        city: "",
        postalCode: "",
        country: "",
        position: "",
        role: "",
        active: true,
      },
      loading: false,
      error: "",
      saving: false
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

        const response = await api.get(`/users/${id}/edit`);
        this.user = response.data.data;

        this.form = {
          firstName: response.data.data.firstName,
          lastName: response.data.data.lastName,
          phone: response.data.data.phone,
          street: response.data.data.street,
          city: response.data.data.city,
          postalCode: response.data.data.postalCode,
          country: response.data.data.country,
          position: response.data.data.position,
          role: response.data.data.role,
          active: response.data.data.active,
        };
      } catch (error) {
        this.error = error.response?.data?.message || "User not found";
      } finally {
        this.loading = false;
      }
    },

    async updateUser() {
      try {
        const result = usersUpdateSchema.safeParse(this.form);
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
