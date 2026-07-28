<template>
  <div class="login-page">
    <div class="login-card">
      <h1>Reset Password</h1>
      <form @submit.prevent="handleResetPassword">
        <div class="form-group">
          <label class="label"> Email </label>
          <input v-model="form.email" type="email" class="inputs" placeholder="Email" />
          <p v-if="errors.email" class="form-error">
            {{ errors.email }}
          </p>
        </div>

        <div class="form-group">
          <label class="label"> New Password </label>
          <input
            v-model="form.newPassword"
            type="password"
            class="inputs"
            placeholder="New Password"
          />
          <p v-if="errors.newPassword" class="form-error">
            {{ errors.newPassword }}
          </p>
        </div>
        <p v-if="serverError" class="form-error">
          {{ serverError }}
        </p>
        <button type="submit" class="btn submit-button" :disabled="loading">
          {{ loading ? "Resetting..." : "Reset Password" }}
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import api from "@/api/axios.js";
import { resetPasswordSchema } from "@/validations/auth.schema.js";

export default {
  name: "ResetPassword",
  data() {
    return {
      form: {
        email: "",
        newPassword: "",
      },
      loading: false,
      errors: {},
      serverError: ""
    };
  },

  methods: {
    async handleResetPassword() {
      try {
        this.errors = {};
        this.serverError = "";
        
        const result = resetPasswordSchema.safeParse(this.form);
        if (!result.success) {
          result.error.issues.forEach((error) => {
            this.errors[error.path.join(".")] = error.message;
          });
          return;
        }

        this.loading = true;
        await api.post("/auth/reset-password", this.form);
        
        this.$router.push("/auth/login");
      } catch (error) {
        this.serverError = error.response?.data?.message || "Failed to reset password";
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>