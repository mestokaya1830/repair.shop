<template>
  <div id="printable" class="repair-review">
    <div class="review-header">
      <h1>Repair Request Review</h1>

      <div class="request-info">
        <p>
          Request Number:
          <strong>
            {{ form.repairNumber }}
          </strong>
        </p>

        <p>
          Status:
          <strong>
            {{ form.status }}
          </strong>
        </p>

        <p>
          Created:
          <strong>
            {{ form.createdAt }}
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

      <button class="btn no-print" @click="editSection('customer')">
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

      <button class="btn no-print" @click="editSection('problem')">
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
    <div class="image-preview-container">
      <img
        v-for="(url, index) in imageUrls"
        :key="index"
        :src="url"
        class="image-preview"
      />
    </div>
    <div class="actions no-print">
      <button class="btn" @click="printDoc()">Print PDF</button>

      <button class="btn" @click="submitForm">Submit</button>
    </div>
  </div>
</template>

<script>
import { getImages } from "@/utils/image.storage";
import api from "@/api/axios";

export default {
  name: "RepairReview",

  data() {
    return {
      imageUrls: [],
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
      const images = await getImages();
      const formData = new FormData();

      images.forEach((item) => {
        formData.append("images", item);
      });
      formData.append("data", JSON.stringify(this.form));

      const response = await api.post("/repairs/create", formData);
      console.log(response.data);
    },
  },
};
</script>
