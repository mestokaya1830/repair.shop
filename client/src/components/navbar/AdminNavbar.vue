<template>
  <nav class="admin-navbar">
    <div class="logo">RepairService Admin</div>

    <div class="nav-links">
      <router-link to="/admin/dashboard" class="nav-link" active-class="active">
        Dashboard
      </router-link>

      <router-link to="/admin/repairs" class="nav-link" active-class="active">
        Repairs
      </router-link>


      <router-link to="/admin/customers" class="nav-link" active-class="active">
        Customers
      </router-link>

      <router-link to="/admin/devices" class="nav-link" active-class="active">
        Devices
      </router-link>

      <router-link to="/admin/invoices" class="nav-link" active-class="active">
        Invoices
      </router-link>

      <router-link to="/admin/users" class="nav-link" active-class="active">
        Users
      </router-link>

      <router-link to="/admin/dashboard/profile" class="nav-link" active-class="active">
        Profile
      </router-link>
     
      <router-link v-if="$store.state.auth.role==='owner'" to="/admin/tenants/profile" class="nav-link" active-class="active">
        Tenants Profile
      </router-link>

      <button @click="logout" class="logout-btn btn" type="button">Logout</button>
    </div>
  </nav>
</template>

<script>
export default {
  name: "AdminNavbar",

  methods: {
    logout() {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      this.$router.push("/auth/login");
    },
  },
};
</script>