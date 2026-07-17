<template>
  <section>
    <h2>Customer Information</h2>

    <div>
      <label> First Name </label>

      <input v-model="form.customer.firstName" type="text" />
    </div>
    <p v-if="errors['customer.firstName']" class="form-error">
      {{ errors["customer.firstName"] }}
    </p>

    <div>
      <label> Last Name </label>

      <input v-model="form.customer.lastName" type="text" />
    </div>
    <p v-if="errors['customer.lastName']" class="form-error">
      {{ errors["customer.lastName"] }}
    </p>
    <div>
      <label> Email </label>

      <input v-model="form.customer.email" type="email" />
    </div>
    <p v-if="errors['customer.email']"  class="form-error">
      {{ errors["customer.email"] }}
    </p>
    <div>
      <label> Phone </label>

      <input v-model="form.customer.phone" type="tel" />
    </div>
    <p v-if="errors['customer.phone']"  class="form-error">
      {{ errors["customer.phone"] }}
    </p>
    <div>
      <label> Company Name (optional) </label>

      <input v-model="form.customer.company" type="text" />
    </div>
  </section>
</template>

<script>
export default {
  name: "CustomerStep",

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
