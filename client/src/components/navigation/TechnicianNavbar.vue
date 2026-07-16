<template>
  <nav class="technician-navbar">
    <div class="logo">Repair Shop</div>

    <router-link to="/technician"> Dashboard </router-link>
    <router-link to="/technician/repairs"> My Repairs </router-link>
    <router-link to="/technician/profile"> Profile </router-link>

    <button @click="logout">Logout</button>
  </nav>
</template>

<script>
export default {
  name: "TechnicianNavbar",

  methods: {
    logout() {
      localStorage.removeItem("token");
      this.$router.push("/login");
    },
  },
};
</script>
