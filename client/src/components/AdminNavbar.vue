<template>
  <nav class="admin-navbar">
    <div class="logo">RepairService Admin</div>

    <div class="nav-links">
      <router-link to="/admin/dashboard" class="nav-link" active-class="active">
        Dashboard
      </router-link>

      <router-link to="/admin/customers" class="nav-link" active-class="active">
        Customers
      </router-link>

      <router-link to="/admin/devices" class="nav-link" active-class="active">
        Devices
      </router-link>

      <router-link to="/admin/repairs" class="nav-link" active-class="active">
        Repairs
      </router-link>

      <router-link to="/admin/users" class="nav-link" active-class="active">
        Users
      </router-link>

      <router-link to="/admin/settings" class="nav-link" active-class="active">
        Settings
      </router-link>

      <router-link
        to="/admin/users/profile"
        class="nav-link"
        active-class="active"
      >
        Profile
      </router-link>

      <button class="logout-btn" type="button">Logout</button>
    </div>
  </nav>
</template>

<script>
export default {
  name: "AdminNavbar",
};
</script>
