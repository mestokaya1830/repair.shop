<template>
  <div id="printable" class="repair-review">
    <div class="review-header">
      <h1>Repair Request Review</h1>

      <div class="request-info">
        <p>
          Request Number:
          <strong>
            {{ store.repairNumber }}
          </strong>
        </p>

        <p>
          Status:
          <strong>
            {{ store.status }}
          </strong>
        </p>

        <p>
          Created:
          <strong>
            {{ store.createdAt }}
          </strong>
        </p>
      </div>
    </div>

    <section class="review-card">
      <h2>Customer Information</h2>

      <p>
        Name:
        {{ form.customer.firstName }}
        {{ form.customer.lastName }}
      </p>

      <p>
        Email:
        {{ form.customer.email }}
      </p>

      <p>
        Phone:
        {{ form.customer.phone }}
      </p>

      <p>
        Company:
        {{ form.customer.company || "-" }}
      </p>

      <button class="actions no-print" @click="editSection('customer')">
        Edit
      </button>
    </section>

    <section class="review-card">
      <h2>Device Information</h2>

      <p>
        Type:
        {{ form.device.type }}
      </p>

      <p>
        Brand:
        {{ form.device.brand }}
      </p>

      <p>
        Model:
        {{ form.device.model }}
      </p>

      <p>
        Serial:
        {{ form.device.serialNumber || "-" }}
      </p>

      <button class="actions no-print" @click="editSection('device')">
        Edit
      </button>
    </section>

    <section class="review-card">
      <h2>Problem details</h2>

      <p>
        Category:
        {{ form.problem.category }}
      </p>

      <p>
        Description:
        {{ form.problem.description }}
      </p>

      <p>
        Device Working:
        {{ form.problem.deviceWorking }}
      </p>

      <button class="actions no-print" @click="editSection('problem')">
        Edit
      </button>
    </section>

    <section class="review-card">
      <h2>Shipping</h2>

      <p>
        Address:
        {{ form.shipping.street }}
      </p>

      <p>
        {{ form.shipping.postalCode }}
        {{ form.shipping.city }}
      </p>

      <p>
        {{ form.shipping.country }}
      </p>

      <button class="actions no-print" @click="editSection('shipping')">
        Edit
      </button>
    </section>
    <img
      v-for="image in form.device.images"
      :key="image.name"
      :src="URL.createObjectURL(image)"
    />
    <div class="actions no-print">
      <button @click="printDoc()">Print PDF</button>

      <button>Confirm Request</button>
    </div>
  </div>
</template>

<script>
import { repairStore } from "@/stores/repair.js";

export default {
  name: "RepairReview",

  data() {
    return {
      store: repairStore(),
    };
  },

  computed: {
    form() {
      return this.store.form;
    },
  },

  methods: {
    editSection(section) {
      this.$router.push({
        name: "repair",
        hash: `#${section}`,
      });
    },

    async printDoc() {
      window.print();
    },
  },
};
</script>
