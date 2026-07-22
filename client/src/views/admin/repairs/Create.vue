<template>
  <div class="repair-request">
    <h1>Create Repair</h1>

    <!-- Customer -->
    <section class="repair-card">
      <h2>Customer Information</h2>

      <div>
        <label>Select Existing Customer</label>

        <select v-model="selectedCustomer" @change="selectCustomer">
          <option :value="null">-- New Customer --</option>

          <option
            v-for="customer in customers"
            :key="customer._id"
            :value="customer"
          >
            {{ customer.firstName }} {{ customer.lastName }}
          </option>
        </select>
      </div>

      <div>
        <label>First Name</label>

        <input
          v-model="form.customer.firstName"
          type="text"
          :readonly="selectedCustomer"
        />
      </div>

      <p v-if="errors['customer.firstName']" class="form-error">
        {{ errors["customer.firstName"] }}
      </p>

      <div>
        <label>Last Name</label>

        <input
          v-model="form.customer.lastName"
          type="text"
          :readonly="selectedCustomer"
        />
      </div>

      <p v-if="errors['customer.lastName']" class="form-error">
        {{ errors["customer.lastName"] }}
      </p>

      <div>
        <label>Email</label>

        <input
          v-model="form.customer.email"
          type="email"
          :readonly="selectedCustomer"
        />
      </div>

      <p v-if="errors['customer.email']" class="form-error">
        {{ errors["customer.email"] }}
      </p>

      <div>
        <label>Phone</label>

        <input
          v-model="form.customer.phone"
          type="tel"
          :readonly="selectedCustomer"
        />
      </div>

      <p v-if="errors['customer.phone']" class="form-error">
        {{ errors["customer.phone"] }}
      </p>

      <div>
        <label>Company Name</label>

        <input
          v-model="form.customer.company"
          type="text"
          :readonly="selectedCustomer"
        />
      </div>
    </section>

    <!-- Device -->
    <section class="repair-card">
      <h2>Device Information</h2>

      <div v-if="selectedCustomer">
        <label>Select Existing Device</label>

        <select v-model="selectedDevice" @change="selectDevice">
          <option :value="null">-- New Device --</option>

          <option v-for="device in devices" :key="device._id" :value="device">
            {{ device.brand }} {{ device.model }}
          </option>
        </select>
      </div>

      <div>
        <label>Device Type</label>

        <select v-model="form.device.type" :disabled="selectedDevice">
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
        <label>Brand</label>

        <input
          v-model="form.device.brand"
          type="text"
          :readonly="selectedDevice"
        />

        <p v-if="errors['device.brand']" class="form-error">
          {{ errors["device.brand"] }}
        </p>
      </div>

      <div>
        <label>Model</label>

        <input
          v-model="form.device.model"
          type="text"
          :readonly="selectedDevice"
        />

        <p v-if="errors['device.model']" class="form-error">
          {{ errors["device.model"] }}
        </p>
      </div>

      <div>
        <label>Serial Number</label>

        <input
          v-model="form.device.serialNumber"
          type="text"
          :readonly="selectedDevice"
        />
      </div>

      <div>
        <label>Purchase Date</label>

        <input
          v-model="form.device.purchaseDate"
          type="date"
          :readonly="selectedDevice"
        />
      </div>

      <div>
        <label>Device Photos</label>

        <input type="file" multiple accept="image/*" @change="handleImages" />

        <small> Maximum 5 images </small>
      </div>

      <div v-if="imagePreviews.length" class="image-preview-container">
        <div
          v-for="(image, index) in imagePreviews"
          :key="index"
          class="image-preview"
        >
          <img :src="image.url" :alt="image.name" />

          <button type="button" @click="removeImage(index)">×</button>
        </div>
      </div>
    </section>
    <!-- Problem -->
    <section class="repair-card">
      <h2>Problem Information</h2>

      <div>
        <label>Problem Category</label>

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
        <label> Problem Description </label>

        <textarea v-model="form.problem.description" rows="5"></textarea>

        <p v-if="errors['problem.description']" class="form-error">
          {{ errors["problem.description"] }}
        </p>
      </div>

      <div>
        <label> When did the problem start? </label>

        <input
          v-model="form.problem.startedAt"
          type="text"
          placeholder="Example: 2 days ago"
        />
      </div>

      <div>
        <label> Is the device currently working? </label>

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
        <label> Additional Notes </label>

        <textarea v-model="form.problem.notes" rows="3"></textarea>
      </div>
    </section>

    <!-- Shipping -->
    <section class="repair-card">
      <h2>Shipping Information</h2>

      <div>
        <label> Street Address </label>

        <input v-model="form.shipping.street" type="text" />

        <p v-if="errors['shipping.street']" class="form-error">
          {{ errors["shipping.street"] }}
        </p>
      </div>

      <div>
        <label> Postal Code </label>

        <input v-model="form.shipping.postalCode" type="text" />

        <p v-if="errors['shipping.postalCode']" class="form-error">
          {{ errors["shipping.postalCode"] }}
        </p>
      </div>

      <div>
        <label> City </label>

        <input v-model="form.shipping.city" type="text" />

        <p v-if="errors['shipping.city']" class="form-error">
          {{ errors["shipping.city"] }}
        </p>
      </div>

      <div>
        <label> Country </label>

        <input v-model="form.shipping.country" type="text" />

        <p v-if="errors['shipping.country']" class="form-error">
          {{ errors["shipping.country"] }}
        </p>
      </div>

      <div>
        <label> Preferred Contact Method </label>

        <select v-model="form.shipping.contactMethod">
          <option value="">Select</option>

          <option value="email">Email</option>

          <option value="phone">Phone</option>

          <option value="whatsapp">WhatsApp</option>
        </select>

        <p v-if="errors['shipping.contactMethod']" class="form-error">
          {{ errors["shipping.contactMethod"] }}
        </p>
      </div>
    </section>

    <button @click="submitRequest" :disabled="isSubmitting">
      {{ isSubmitting ? "Checking..." : "Review Request" }}
    </button>
  </div>
</template>

<script>
import { repairSchema } from "@/validators/schemas.js";
import { repairStore } from "@/stores/repair.js";
import api from "@/api/axios.js";

export default {
  name: "RepairView",

  data() {
    return {
      errors: {},
      isSubmitting: false,
      imagePreviews: [],
      maxImages: 5,
      customers: [],
      selectedCustomer: null,
      devices: [],
      selectedDevice: null,
      store: repairStore(),
    };
  },

  computed: {
    form() {
      return this.store.form;
    },
  },

  mounted() {
    this.getCustomers();

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
    async getCustomers() {
      try {
        const response = await api.get("/customers");

        this.customers = response.data.data;
      } catch (error) {
        console.log(error);
      }
    },

    async selectCustomer() {
      this.selectedDevice = null;
      this.devices = [];

      if (!this.selectedCustomer) {
        this.form.customer = {
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          company: "",
        };

        this.form.shipping = {
          street: "",
          postalCode: "",
          city: "",
          country: "",
          contactMethod: "",
        };

        return;
      }

      this.form.customer = {
        firstName: this.selectedCustomer.firstName,
        lastName: this.selectedCustomer.lastName,
        email: this.selectedCustomer.email,
        phone: this.selectedCustomer.phone,
        company: this.selectedCustomer.company || "",
      };

      this.form.shipping = {
        street: this.selectedCustomer.street || "",
        postalCode: this.selectedCustomer.postalCode || "",
        city: this.selectedCustomer.city || "",
        country: this.selectedCustomer.country || "",
        contactMethod: "",
      };

      await this.getCustomerDevices();
    },

    async getCustomerDevices() {
      try {
        const response = await api.get(
          `/customers/${this.selectedCustomer._id}/devices`,
        );

        this.devices = response.data.data;
      } catch (error) {
        console.log(error);
      }
    },

    selectDevice() {
      if (!this.selectedDevice) {
        this.form.device = {
          type: "",
          brand: "",
          model: "",
          serialNumber: "",
          purchaseDate: "",
          images: [],
        };

        return;
      }

      this.form.device = {
        type: this.selectedDevice.type,
        brand: this.selectedDevice.brand,
        model: this.selectedDevice.model,
        serialNumber: this.selectedDevice.serialNumber || "",
        purchaseDate: this.selectedDevice.purchaseDate || "",
        images: [],
      };
    },

    handleImages(event) {
      const files = Array.from(event.target.files);
      if (this.form.device.images.length + files.length > this.maxImages) {
        alert("Maximum 5 images allowed");
        return;
      }
      files.forEach((file) => {
        const exists = this.form.device.images.some(
          (image) => image.name === file.name,
        );

        if (exists) {
          return;
        }
        this.form.device.images.push(file);
        this.imagePreviews.push({
          name: file.name,
          url: URL.createObjectURL(file),
        });
      });

      event.target.value = "";
    },

    removeImage(index) {
      URL.revokeObjectURL(this.imagePreviews[index].url);
      this.form.device.images.splice(index, 1);
      this.imagePreviews.splice(index, 1);
    },

    async submitRequest() {
      this.errors = {};

      const result = repairSchema.safeParse(this.form);

      if (!result.success) {
        result.error.issues.forEach((error) => {
          this.errors[error.path.join(".")] = error.message;
        });

        return;
      }

      const formData = new FormData();
      formData.append("data", JSON.stringify(result.data));

      this.form.device.images.forEach((image) => {
        formData.append("images", image);
      });

      formData.append("source", "office");
      try {
        this.isSubmitting = true;
        const response = await api.post("/repairs/create", formData);
        this.submitted = true;
        console.log(response.data);
      } catch (error) {
        console.log(error);
      } finally {
        this.isSubmitting = false;
      }
    },
  },
};
</script>
