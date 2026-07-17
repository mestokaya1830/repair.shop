<template>
  <section>
    <h2>Device Information</h2>

    <div>
      <label>Device Type</label>

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
      <label>Brand</label>

      <input v-model="form.device.brand" type="text" />

      <p v-if="errors['device.brand']" class="form-error">
        {{ errors["device.brand"] }}
      </p>
    </div>

    <div>
      <label>Model</label>

      <input v-model="form.device.model" type="text" />

      <p v-if="errors['device.model']" class="form-error">
        {{ errors["device.model"] }}
      </p>
    </div>

    <div>
      <label> Serial Number (optional) </label>

      <input v-model="form.device.serialNumber" type="text" />
    </div>

    <div>
      <label> Purchase Date (optional) </label>

      <input v-model="form.device.purchaseDate" type="date" />
    </div>

    <div>
      <label> Device Photos (optional) </label>

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
        <img :src="image.url" :alt="image.name" />

        <button type="button" @click="removeImage(index)">×</button>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: "DeviceStep",

  props: {
    form: {
      type: Object,
      required: true,
    },

    errors: {
      type: Object,
      default: () => ({}),
    },
  },

  data() {
    return {
      imagePreviews: [],

      maxImages: 5,
    };
  },

  methods: {
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
  },

  beforeUnmount() {
    this.imagePreviews.forEach((image) => {
      URL.revokeObjectURL(image.url);
    });
  },
};
</script>
