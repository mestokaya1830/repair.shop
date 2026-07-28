<template>
  <div class="repair-request">
    <h1>Create Repair Request</h1>

    <!-- Customer -->
    <section class="repair-card">
      <h2>Customer Information</h2>
      <div>
        <label class="label"> First Name </label>

        <input v-model="form.customer.firstName" type="text" />
      </div>
      <p v-if="errors['customer.firstName']" class="form-error">
        {{ errors["customer.firstName"] }}
      </p>

      <div>
        <label class="label"> Last Name </label>

        <input v-model="form.customer.lastName" type="text" />
      </div>
      <p v-if="errors['customer.lastName']" class="form-error">
        {{ errors["customer.lastName"] }}
      </p>
      <div>
        <label class="label"> Email </label>

        <input v-model="form.customer.email" type="email" />
      </div>
      <p v-if="errors['customer.email']" class="form-error">
        {{ errors["customer.email"] }}
      </p>
      <div>
        <label class="label"> Phone </label>

        <input v-model="form.customer.phone" type="tel" />
      </div>
      <p v-if="errors['customer.phone']" class="form-error">
        {{ errors["customer.phone"] }}
      </p>

      <!-- Customer Street & Postal Code (Yeni Eklendi) -->
      <div>
        <label class="label"> Street (optional) </label>

        <input v-model="form.customer.street" type="text" />
      </div>
      <p v-if="errors['customer.street']" class="form-error">
        {{ errors["customer.street"] }}
      </p>

      <div>
        <label class="label"> Postal Code (optional) </label>

        <input v-model="form.customer.postalCode" type="text" />
      </div>
      <p v-if="errors['customer.postalCode']" class="form-error">
        {{ errors["customer.postalCode"] }}
      </p>

      <div>
        <label class="label"> Company Name (optional) </label>

        <input v-model="form.customer.company" type="text" />
      </div>
    </section>

    <!-- Device -->
    <section class="repair-card">
      <h2>Device Information</h2>
      <div>
        <label class="label">Device Type</label>

        <select v-model="form.device.type">
          <option value="">Select device type</option>
          <option value="laptop">Laptop</option>
          <option value="desktop">Desktop PC</option>
          <option value="macbook">MacBook</option>
          <option value="gaming-pc">Gaming PC</option>
          <option value="other">Other</option>
        </select>

        <p v-if="errors['device.type']" class="form-error">
          {{ errors["device.type"] }}
        </p>
      </div>

      <div>
        <label class="label">Brand</label>

        <input v-model="form.device.brand" type="text" />

        <p v-if="errors['device.brand']" class="form-error">
          {{ errors["device.brand"] }}
        </p>
      </div>

      <div>
        <label class="label">Model</label>

        <input v-model="form.device.model" type="text" />

        <p v-if="errors['device.model']" class="form-error">
          {{ errors["device.model"] }}
        </p>
      </div>

      <div>
        <label class="label"> Serial Number (optional) </label>

        <input v-model="form.device.serialNumber" type="text" />
      </div>

      <div>
        <label class="label"> Purchase Date (optional) </label>

        <input v-model="form.device.purchaseDate" type="date" />
      </div>
    </section>

    <!-- Problem -->
    <section class="repair-card">
      <h2>Problem Information</h2>
      <div>
        <label class="label"> Problem Category </label>
        <select v-model="form.problem.category">
          <option value="">Select category</option>
          <option value="hardware">Hardware</option>
          <option value="software">Software</option>
          <option value="virus">Virus / Malware</option>
          <option value="screen">Screen Damage</option>
          <option value="battery">Battery</option>
          <option value="power">Power Issue</option>
          <option value="other">Other</option>
        </select>
        <p v-if="errors['problem.category']" class="form-error">
          {{ errors["problem.category"] }}
        </p>
      </div>

      <div>
        <label class="label"> Problem Description </label>

        <textarea v-model="form.problem.description" rows="5"></textarea>
      </div>
      <p v-if="errors['problem.description']" class="form-error">
        {{ errors["problem.description"] }}
      </p>
      <div>
        <label class="label"> When did the problem start? </label>

        <input
          v-model="form.problem.startedAt"
          type="text"
          placeholder="Example: 2 days ago"
        />
      </div>

      <div>
        <label class="label"> Is the device currently working? </label>

        <select v-model="form.problem.deviceWorking">
          <option value="">Select</option>

          <option value="yes">Yes</option>

          <option value="no">No</option>

          <option value="partially">Partially</option>
        </select>
        <p v-if="errors['problem.deviceWorking']" class="form-error">
          {{ errors["problem.deviceWorking"] }}
        </p>
      </div>

      <div>
        <label class="label"> Additional Notes </label>

        <textarea v-model="form.problem.notes" rows="3"></textarea>
      </div>
    </section>

    <!-- Shipping -->
    <section class="repair-card">
      <h2>Shipping Information</h2>
      <div>
        <label class="label"> Street Address </label>

        <input v-model="form.shipping.street" type="text" />
      </div>
      <p v-if="errors['shipping.street']" class="form-error">
        {{ errors["shipping.street"] }}
      </p>
      <div>
        <label class="label"> Postal Code </label>

        <input v-model="form.shipping.postalCode" type="text" />
      </div>
      <p v-if="errors['shipping.postalCode']" class="form-error">
        {{ errors["shipping.postalCode"] }}
      </p>
      <div>
        <label class="label"> City </label>

        <input v-model="form.shipping.city" type="text" />
      </div>
      <p v-if="errors['shipping.city']" class="form-error">
        {{ errors["shipping.city"] }}
      </p>
      <div>
        <label class="label"> Country </label>

        <input v-model="form.shipping.country" type="text" />
      </div>
      <p v-if="errors['shipping.country']" class="form-error">
        {{ errors["shipping.country"] }}
      </p>
      <div>
        <label class="label"> Preferred Contact Method </label>
        <select v-model="form.shipping.contactMethod">
          <option value="">Select</option>
          <option value="email">Email</option>
          <option value="phone">Phone</option>
        </select>
      </div>
    </section>

    <!-- images -->
    <section class="repair-card">
      <div>
        <label class="label"> Device Photos (optional) </label>

        <input type="file" multiple accept="image/*" @change="handleImages" />

        <small> Maximum 5 images </small>
      </div>
      <div v-if="imagePreviews.length" class="image-preview-container">
        <h4>Selected Images</h4>

        <div
          v-for="(image, index) in imagePreviews"
          :key="index"
          class="image-preview"
        >
          <img :src="image.name" :alt="image.name" />

          <button type="button" class="btn" @click="removeImage(index)">X</button>
        </div>
      </div>
    </section>
    <p v-if="errors['shipping.contactMethod']" class="form-error">
      {{ errors["shipping.contactMethod"] }}
    </p>
    <button @click="reviewBtn" class="btn">Review Form</button>
  </div>
</template>

<script>
import { repairsSchema } from "@/validations/repairs.schema.js";
import api from "@/api/axios.js";
import { getImages, saveImage, deleteImage, clearImages } from "@/utils/image.storage";

export default {
  name: "RepairView",
  data() {
    return {
      errors: {},
      isSubmitting: false,
      currentImages: [],
      imagePreviews: [],
      maxImages: 5,
      form: JSON.parse(JSON.stringify(this.$store.state.repairs.form)),
    };
  },
  async created() {
    const images = await getImages();
    this.imagePreviews = images.map((file) => ({
      name: file.name,
      url: URL.createObjectURL(file),
    }));
  },
  async mounted() {
    this.fillDefaults();
  },
  methods: {
    async handleImages(event) {
      const files = Array.from(event.target.files);

      const newFiles = files.filter(
        (file) => !this.imagePreviews.some((p) => p.name === file.name),
      );

      if (this.imagePreviews.length + newFiles.length > this.maxImages) {
        alert("Maximum 5 images allowed");
        return;
      }

      for (const file of newFiles) {
        await saveImage(file);
        this.imagePreviews.push({
          name: file.name,
          url: URL.createObjectURL(file),
        });
      }

      event.target.value = "";
    },

    async removeImage(index) {
      const { name, url } = this.imagePreviews[index];
      URL.revokeObjectURL(url);
      await deleteImage(name);
      this.imagePreviews.splice(index, 1);
    },
    
    async reviewBtn() {
      this.errors = {};
      const result = repairsSchema.safeParse(this.form);

      if (!result.success) {
        result.error.issues.forEach((error) => {
          this.errors[error.path.join(".")] = error.message;
        });
        return;
      }

      this.$store.commit("repairs/setRepairs", this.form);
      this.$router.push("/admin/repairs/review");
    },
    
    // test data
    fillDefaults() {
      this.form = {
        customer: {
          firstName: "Ahmet",
          lastName: "Yılmaz",
          email: "ahmet.yilmaz@example.com",
          phone: "+90 532 123 45 67",
          street: "Atatürk Caddesi No: 42",
          postalCode: "34380",
          company: "Yılmaz Teknoloji Ltd. Şti.",
        },
        device: {
          type: "Laptop",
          brand: "Apple",
          model: "MacBook Pro 16",
          serialNumber: "C02G1234MD6R",
          purchaseDate: "2023-05-15",
          images: [],
        },
        problem: {
          category: "Donanım",
          description: "Cihaz şarj olmuyor ve fanlar yüksek sesle çalışıyor.",
          startedAt: "2024-01-10",
          deviceWorking: "Kısmen",
          notes: "Daha önce servise gitmedi.",
        },
        shipping: {
          street: "Atatürk Caddesi, No: 42 Daire: 5",
          postalCode: "34380",
          city: "İstanbul",
          country: "Türkiye",
          contactMethod: "E-posta",
        },
      };
    },
  },
};
</script>