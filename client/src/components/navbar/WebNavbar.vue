<template>
  <header class="web-navbar">
    <div class="web-navbar-container">
      <router-link to="/" class="web-navbar-logo"> Logo and Name </router-link>
      <nav class="web-navbar-menu">
        <router-link to="/" class="web-navbar-link" exact-active-class="active"> Home </router-link>

        <router-link to="/device-sending" class="web-navbar-link" exact-active-class="active">
          Send Your Device
        </router-link>

        <router-link to="/device-tracking" class="web-navbar-link" exact-active-class="active">
          Device Tracking
        </router-link>

        <router-link to="/contact" class="web-navbar-link" exact-active-class="active">
          Contact
        </router-link>
      </nav>
    </div>
  </header>
</template>

<script>
export default {
  name: "WebNavbar",
};
</script>
