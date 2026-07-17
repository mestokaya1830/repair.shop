<template>
  <div class="web-layout">
    <WebNavbar />
    <main class="web-layout-content">
      <router-view />
    </main>
    <Footer />
  </div>
</template>

<script setup>
import WebNavbar from "@/components/navbar/WebNavbar.vue";
import Footer from "@/components/Footer.vue";
</script>
