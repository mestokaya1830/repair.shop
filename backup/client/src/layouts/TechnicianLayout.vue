<template>
  <div class="technician-layout">
    <TechnicianNavbar />

    <main>
      <router-view />
    </main>
  </div>
</template>

<script>
import TechnicianNavbar from "@/components/navigation/TechnicianNavbar.vue";

export default {
  name: "TechnicianLayout",

  components: {
    TechnicianNavbar,
  },
};
</script>
