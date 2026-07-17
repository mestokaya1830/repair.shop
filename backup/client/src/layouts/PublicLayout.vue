<template>

  <div class="layout">

    <PublicNavbar />

    <main>
      <router-view />
    </main>

    <Footer />

  </div>

</template>


<script>
import PublicNavbar from "@/components/navigation/PublicNavbar.vue";
import Footer from "@/components/Footer.vue";


export default {
  name: "PublicLayout",

  components: {
    PublicNavbar,
    Footer,
  },
};
</script>