<template>
  <section>
    <h2>Device Information</h2>

    <div>
      <label> Device Type </label>

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
      <label> Brand </label>

      <input v-model="form.device.brand" type="text" />
    </div>
    <p v-if="errors['device.brand']" class="form-error">
      {{ errors["device.brand"] }}
    </p>
    <div>
      <label> Model </label>

      <input v-model="form.device.model" type="text" />
    </div>
    <p v-if="errors['device.model']" class="form-error">
      {{ errors["device.model"] }}
    </p>
    <div>
      <label> Serial Number (optional) </label>

      <input v-model="form.device.serialNumber" type="text" />
    </div>

    <div>
      <label> Purchase Date (optional) </label>

      <input v-model="form.device.purchaseDate" type="date" />
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
};
</script>
