<template>

  <div class="layout">

    <AdminNavbar />

    <main>
      <router-view />
    </main>

    <Footer />

  </div>

</template>


<script>
import AdminNavbar from "@/components/AdminNavbar.vue";
import Footer from "@/components/Footer.vue";


export default {
  name: "DefaultLayout",

  components: {
    AdminNavbar,
    Footer,
  },
};
</script>