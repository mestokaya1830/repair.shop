<template>
  <div class="login-page">
    <div class="login-card">
      <h1>Admin Login</h1>
      <form @submit.prevent="login">
        <div class="form-group">
          <label class="label"> Email </label>
          <input v-model="form.email" type="email" class="inputs" placeholder="Email" />
          <p v-if="errors.email" class="form-error">
            {{ errors.email }}
          </p>
        </div>

        <div class="form-group">
          <label class="label"> Password </label>
          <input
            v-model="form.password"
            type="password"
            class="inputs"
            placeholder="Password"
          />
          <p v-if="errors.password" class="form-error">
            {{ errors.password }}
          </p>
        </div>
        <p v-if="credentials" class="form-error">
          {{ credentials }}
        </p>
        <button type="submit" class="btn submit-button" :disabled="loading">
          {{ loading ? "Logging in..." : "Login" }}
        </button>
      </form>
     <router-link to="/auth/reset-password" class="forgot-password-link">
        Forgot Password?
      </router-link>
    </div>
  </div>
</template>

<script>
import api from "@/api/axios.js";
import { loginSchema } from "@/validations/auth.schema.js";

export default {
  name: "AdminLogin",
  data() {
    return {
      form: {
        email: "",
        password: "",
      },
      loading: false,
      errors: {},
      credentials: ""
    };
  },

  methods: {
    async login() {
      try {
        this.errors = {};
        const result = loginSchema.safeParse(this.form);
        if (!result.success) {
          result.error.issues.forEach((error) => {
            this.errors[error.path.join(".")] = error.message;
          });
          return;
        }
        const res = await api.post("/auth/login", this.form);
        const { token, user } = res.data;
        localStorage.setItem("token", token);
        this.$store.commit('setAuth', user)
        this.$router.push("/admin");
      } catch (error) {
        this.credentials = error.response?.data?.message || "Login failed";
      }
    },
  },
};
</script>
