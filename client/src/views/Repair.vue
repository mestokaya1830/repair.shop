<template>
  <div class="repair-request">
    <h1>Create Repair Request</h1>

    <div id="customer">
      <CustomerCard :form="form" :errors="errors" />
    </div>

    <div id="device">
      <DeviceCard :form="form" :errors="errors" />
    </div>

    <div id="problem">
      <ProblemCard :form="form" :errors="errors" />
    </div>

    <div id="shipping">
      <ShippingCard :form="form" :errors="errors" />
    </div>

    <button @click="submitRequest" :disabled="isSubmitting">
      {{ isSubmitting ? "Checking..." : "Review Request" }}
    </button>
  </div>
</template>

<script>
import CustomerCard from "@/components/repair/CustomerCard.vue";
import DeviceCard from "@/components/repair/DeviceCard.vue";
import ProblemCard from "@/components/repair/ProblemCard.vue";
import ShippingCard from "@/components/repair/ShippingCard.vue";

import { repairSchema } from "@/validators/repair.schemas.js";
import { repairStore } from "@/stores/repair.js";
import api from "../api/axios.js";

export default {
  name: "RepairView",

  components: {
    CustomerCard,
    DeviceCard,
    ProblemCard,
    ShippingCard,
  },

  data() {
    return {
      errors: {},
      isSubmitting: false,
      store: repairStore(),
    };
  },
  computed: {
    form() {
      return this.store.form;
    },
  },
  mounted() {
    if (this.$route.hash) {
      setTimeout(() => {
        const element = document.querySelector(this.$route.hash);

        if (element) {
          element.scrollIntoView({
            behavior: "smooth",
          });
        }
      }, 100);
    }
  },
  methods: {
    async submitRequest() {
      this.errors = {};
      const result = repairSchema.safeParse(this.form);

      // if (!result.success) {
      //   result.error.issues.forEach((error) => {
      //     this.errors[error.path.join(".")] = error.message;
      //   });

      //   return;
      // }

      console.log(this.form);
      const response = await api.post("/repair", this.form);

      if (!response.success) {
        console.error(response);
      }
      console.log("Created:", response.data);

      this.store.updateForm(this.form);
      this.$router.push({
        name: "repair-review",
      });
    },
  },
};
</script>
