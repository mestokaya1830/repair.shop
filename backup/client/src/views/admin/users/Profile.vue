<template>
  <div class="profile-page">
    <h2>My Profile</h2>

    <p v-if="loading">Loading...</p>

    <p v-if="error" class="form-error">
      {{ error }}
    </p>

    <form v-if="form" @submit.prevent="updateProfile">
      <div>
        <label>First Name</label>
        <input v-model="form.profile.firstName" disabled />
      </div>

      <div>
        <label>Last Name</label>
        <input v-model="form.profile.lastName" disabled />
      </div>

      <div>
        <label>Email</label>
        <input v-model="form.email" disabled />
      </div>

      <div>
        <label>Role</label>
        <input v-model="form.role" disabled />
      </div>

      <div>
        <label>Position</label>
        <input v-model="form.profile.position" disabled />
      </div>

      <div>
        <label>City</label>
        <input v-model="form.profile.address.city" disabled />
      </div>

      <div>
        <label>Phone</label>

        <input v-model="form.profile.phone" type="text" />
      </div>

      <div>
        <label>New Password</label>

        <input v-model="password" type="password" />
      </div>

      <button type="submit">Save</button>
    </form>
  </div>
</template>

<script>
import api from "@/api/axios.js";

export default {
  name: "Profile",

  data() {
    return {
      form: null,

      password: "",

      loading: false,

      error: "",
    };
  },

  mounted() {
    this.getProfile();
  },

  methods: {
    async getProfile() {
      try {
        this.loading = true;

        const response = await api.get("/users/profile");

        this.form = response.data.user;
      } catch (error) {
        this.error = error.response?.data?.message || "Failed to load profile";
      } finally {
        this.loading = false;
      }
    },

    async updateProfile() {
      try {
        this.loading = true;

        this.error = "";

        const response = await api.patch("/users/profile/update", {
          profile: {
            phone: this.form.profile.phone,
          },

          password: this.password,
        });

        this.form = response.data.user;

        this.password = "";
      } catch (error) {
        this.error =
          error.response?.data?.message || "Failed to update profile";
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>
