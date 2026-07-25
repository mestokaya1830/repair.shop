<template>
  <div id="printable" class="repair-review">
    <div class="review-header">
      <h1>Repair Request Review</h1>

      <div class="request-info">
        <p>
          Request Number:
          <strong>
            {{ form.repairNumber || "-" }}
          </strong>
        </p>

        <p>
          Status:
          <strong>
            {{ form.status || "Pending" }}
          </strong>
        </p>

        <p>
          Created:
          <strong>
            {{ form.createdAt || "-" }}
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

      <button
        class="actions no-print"
        @click="editSection('customer')"
        :disabled="submitting"
      >
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

      <button
        class="actions no-print"
        @click="editSection('device')"
        :disabled="submitting"
      >
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

      <button
        class="actions no-print"
        @click="editSection('problem')"
        :disabled="submitting"
      >
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

      <button
        class="actions no-print"
        @click="editSection('shipping')"
        :disabled="submitting"
      >
        Edit
      </button>
    </section>

    <div class="image-preview-container">
      <img
        v-for="(url, index) in imageUrls"
        :key="index"
        :src="url"
        class="image-preview"
      />
    </div>

    <div class="actions no-print">
      <button @click="printDoc">Print PDF</button>

      <button @click="submitForm" :disabled="submitting">
        {{ submitting ? "Submitting..." : "Submit" }}
      </button>
    </div>

    <p v-if="error" class="form-error">
      {{ error }}
    </p>
  </div>
</template>

<script>
import { getImages } from "@/utils/image.storage";
import api from "../../api/axios";

export default {
  name: "RepairReview",

  data() {
    return {
      imageUrls: [],

      submitting: false,

      error: "",
    };
  },

  computed: {
    form() {
      return this.$store.state.repairs.form;
    },
  },

  async mounted() {
    const images = await getImages();

    this.imageUrls = images.map((image) => URL.createObjectURL(image));
  },

  beforeUnmount() {
    this.imageUrls.forEach((url) => {
      URL.revokeObjectURL(url);
    });
  },

  methods: {
    editSection(section) {
      this.$router.push({
        name: "device-sending",

        hash: `#${section}`,
      });
    },

    printDoc() {
      window.print();
    },

    async submitForm() {
      if (this.submitting) {
        return;
      }

      try {
        this.submitting = true;

        this.error = "";

        const images = await getImages();

        const formData = new FormData();

        images.forEach((item) => {
          formData.append("images", item);
        });

        formData.append("data", JSON.stringify(this.form));

        const response = await api.post("/web/create", formData);

        this.$store.commit("repairs/setRepairSuccess", {
          repairNumber: response.data.data.repairNumber,

          status: response.data.data.status,

          createdAt: response.data.data.createdAt,
        });

        this.$store.commit("repairs/resetRepairs");

        this.$router.replace({
          name: "repair-success",
        });
      } catch (error) {
        this.error = error.response?.data?.message || "Repair request failed";
      } finally {
        this.submitting = false;
      }
    },
  },
};
</script>
