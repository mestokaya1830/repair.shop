<template>
  <div class="success-page">
    <h1>Repair Request Created</h1>
    <p>Thank you for your request.</p>

    <div class="request-box">
      <p>
        Request Number:
        <strong>
          {{ success.repairNumber }}
        </strong>
      </p>

      <p>
        Status:
        <strong>
          {{ success.status }}
        </strong>
      </p>

      <p>
        Created:
        <strong>
          {{ success.createdAt }}
        </strong>
      </p>
    </div>
    {{ success }}

    <router-link to="/track"> Track Repair </router-link>
  </div>
</template>

<script>
export default {
  name: "RepairSuccess",
  computed: {
    success() {
      return this.$store.state.repairs.success;
    },
  },
  mounted () {
    if (!this.success.repairNumber) {
    this.$router.replace("/");
  }
  }
};
</script>
