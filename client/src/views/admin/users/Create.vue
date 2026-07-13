<template>
  <div class="admin-page">
    <h1>Add User</h1>

    <form @submit.prevent="submitUser">
      <h3>Account Information</h3>

      <div>
        <label> Email </label>

        <input v-model="form.email" type="email" />

        <p v-if="errors.email" class="form-error">
          {{ errors.email }}
        </p>
      </div>

      <div>
        <label> Password </label>

        <input v-model="form.password" type="password" />

        <p v-if="errors.password" class="form-error">
          {{ errors.password }}
        </p>
      </div>

      <hr />

      <h3>Profile Information</h3>

      <div>
        <label> First Name </label>

        <input v-model="form.profile.firstName" type="text" />
      </div>

      <div>
        <label> Last Name </label>

        <input v-model="form.profile.lastName" type="text" />
      </div>

      <div>
        <label> Phone </label>

        <input v-model="form.profile.phone" type="text" />
      </div>

      <div>
        <label> Position </label>

        <input
          v-model="form.profile.position"
          type="text"
          placeholder="Technician"
        />
      </div>

      <h3>Address</h3>

      <div>
        <label> Street </label>

        <input v-model="form.profile.address.street" type="text" />
      </div>

      <div>
        <label> City </label>

        <input v-model="form.profile.address.city" type="text" />
      </div>

      <div>
        <label> Postal Code </label>

        <input v-model="form.profile.address.postalCode" type="text" />
      </div>

      <div>
        <label> Country </label>

        <input v-model="form.profile.address.country" type="text" />
      </div>

      <div>
        <label>
          <input v-model="form.active" type="checkbox" />

          Active
        </label>
      </div>

      <button type="submit" :disabled="loading">
        {{ loading ? "Saving..." : "Create User" }}
      </button>
    </form>
  </div>
</template>

<script>
import api from "@/api/axios.js";
import {userSchema} from '@/validators/user.schema.js'
export default {
  name: "AddUser",
  data() {
    return {
      loading: false,
      errors: {},
      form: {
        email: "",
        password: "",
        profile: {
          firstName: "",
          lastName: "",
          phone: "",
          position: "",
          address: {
            street: "",
            city: "",
            postalCode: "",
            country: "",
          },
        },
        active: true,
      },
    };
  },

  methods: {
    async submitUser() {
      this.errors = {};
      const result = userSchema.safeParse(this.form)
       if (!result.success) {
        result.error.issues.forEach((error) => {
          this.errors[error.path.join(".")] = error.message;
        });

        return;
      }
      try {
        this.loading = true;
        console.log(this.form)
        await api.post("/users/create", this.form);
        this.$router.push("/admin/users");
      } catch (error) {
        this.errors = error.response?.data?.errors || {};
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>
