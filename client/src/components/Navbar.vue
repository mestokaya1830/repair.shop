<template>
  <nav class="navbar">
    <div class="logo">RepairService</div>

    <div class="nav-links">
      <router-link to="/" class="nav-link" exact-active-class="active">
        Home
      </router-link>
      <router-link to="/repair" class="nav-link" active-class="active">
        Repair Request
      </router-link>

      <router-link to="/track" class="nav-link" active-class="active">
        Track Repair
      </router-link>

      <router-link to="/contact" class="nav-link" active-class="active">
        Contact
      </router-link>
    </div>
  </nav>
</template>

<script>
export default {
  name: "Navbar",
};
</script>
