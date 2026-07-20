<template>
  <div class="admin-layout">
    <AdminNavbar />
    <main class="admin-layout-content">
      <router-view />
    </main>
    <Footer />
  </div>
</template>

<script setup>
import AdminNavbar from "@/components/navbar/AdminNavbar.vue";
import Footer from "@/components/Footer.vue";
</script>