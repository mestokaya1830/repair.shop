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
      try {
        const response = await api.post("/auth/login", this.form)

        const { token, user } = response.data;

        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));

        if (user.role === "owner" || user.role === "admin") {
          this.$router.push("/admin");
        } else if (user.role === "user") {
          this.$router.push("/technician");
        }
      } catch (error) {
        this.error = error.response?.data?.message || "Login failed";
      }
    },
  },
};
</script>
