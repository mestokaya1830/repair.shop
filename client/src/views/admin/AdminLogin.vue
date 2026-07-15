<template>
  <div class="login-page">
    <div class="login-card">
      <h1>Admin Login</h1>

      <form @submit.prevent="login">
        <div>
          <label> Email </label>

          <input v-model="form.email" type="email" placeholder="Email" />

          <p v-if="errors.email" class="form-error">
            {{ errors.email }}
          </p>
        </div>

        <div>
          <label> Password </label>

          <input
            v-model="form.password"
            type="password"
            placeholder="Password"
          />

          <p v-if="errors.password" class="form-error">
            {{ errors.password }}
          </p>
        </div>

        <button type="submit" :disabled="loading">
          {{ loading ? "Logging in..." : "Login" }}
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import api from "@/api/axios.js";
import { loginSchema } from "@/validators/schemas.js";

export default {
  name: "AdminLogin",

  data() {
    return {
      loading: false,
      errors: {},
      form: {
        email: "",
        password: "",
      },
    };
  },

  methods: {
    async login() {
      this.errors = {};

      const result = loginSchema.safeParse(this.form);
      if (!result.success) {
        result.error.issues.forEach((error) => {
          this.errors[error.path.join(".")] = error.message;
        });

        return;
      }

      try {
        this.loading = true;
        const response = await api.post("/auth/login", result.data);
        const token = response.data.token;
        localStorage.setItem("token", token);
        this.$router.push("/admin/dashboard");
      } catch (error) {
        console.log(error.response?.data);
      } finally {
        this.loading = false;
      }
    }
  },
};
</script>
