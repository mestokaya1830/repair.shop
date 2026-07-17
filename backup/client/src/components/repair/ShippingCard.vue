<template>
  <section>
    <h2>Shipping Information</h2>

    <div>
      <label> Street Address </label>

      <input v-model="form.shipping.street" type="text" />
    </div>
    <p v-if="errors['shipping.street']" class="form-error">
      {{ errors["shipping.street"] }}
    </p>
    <div>
      <label> Postal Code </label>

      <input v-model="form.shipping.postalCode" type="text" />
    </div>
    <p v-if="errors['shipping.postalCode']" class="form-error">
      {{ errors["shipping.postalCode"] }}
    </p>
    <div>
      <label> City </label>

      <input v-model="form.shipping.city" type="text" />
    </div>
    <p v-if="errors['shipping.cisty']" class="form-error">
      {{ errors["shipping.cisty"] }}
    </p>
    <div>
      <label> Country </label>

      <input v-model="form.shipping.country" type="text" />
    </div>
    <p v-if="errors['shipping.country']" class="form-error">
      {{ errors["shipping.country"] }}
    </p>
    <div>
      <label> Preferred Contact Method </label>

      <select v-model="form.shipping.contactMethod">
        <option value="">Select</option>

        <option value="email">Email</option>

        <option value="phone">Phone</option>
      </select>
    </div>
  </section>
  <p v-if="errors['shipping.contactMethod']" class="form-error">
    {{ errors["shipping.contactMethod"] }}
  </p>
</template>

<script>
export default {
  name: "ShippingStep",

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
