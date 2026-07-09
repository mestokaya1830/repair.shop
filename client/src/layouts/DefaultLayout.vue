<template>

  <div class="layout">

    <Navbar />

    <main>
      <router-view />
    </main>

    <Footer />

  </div>

</template>


<script>
import Navbar from "@/components/Navbar.vue";
import Footer from "@/components/Footer.vue";


export default {
  name: "DefaultLayout",

  components: {
    Navbar,
    Footer,
  },
};
</script>