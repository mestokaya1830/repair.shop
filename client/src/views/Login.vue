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
        <p v-if="credentials" class="form-error">
          {{ credentials }}
        </p>
        <button type="submit" :disabled="loading">
          {{ loading ? "Logging in..." : "Login" }}
        </button>
      </form>
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
      loading: false,
      errors: {},
      credentials: "",
      form: {
        email: "",
        password: "",
      },
    };
  },

  methods: {
    async login() {
      try {
        // this.errors = {};
        // const result = loginSchema.safeParse(this.form);
        // if (!result.success) {
        //   result.error.issues.forEach((error) => {
        //     this.errors[error.path.join(".")] = error.message;
        //   });
        //   return;
        // }
        // const response = await api.post("/auth/login", this.form);
        // const { token, user } = response.data;
        // localStorage.setItem("token", token);
        // localStorage.setItem("user", JSON.stringify(user));
        // this.$router.push("/admin");
      } catch (error) {
        this.credentials = error.response?.data?.message || "Login failed";
      }
    },
  },
};
</script>
