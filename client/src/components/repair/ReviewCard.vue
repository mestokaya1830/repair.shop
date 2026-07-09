<template>
  <section>
    <h2>Review Your Request</h2>

    <div class="review-section">
      <h3>Customer Information</h3>

      <p>
        {{ form.customer.firstName }}
        {{ form.customer.lastName }}
      </p>

      <p>
        {{ form.customer.email }}
      </p>

      <p>
        {{ form.customer.phone }}
      </p>

      <p v-if="form.customer.company">
        {{ form.customer.company }}
      </p>
    </div>

    <div class="review-section">
      <h3>Device Information</h3>

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

      <p v-if="form.device.serialNumber">
        Serial Number:
        {{ form.device.serialNumber }}
      </p>
    </div>

    <div class="review-section">
      <h3>Repair Details</h3>

      <p>
        Category:
        {{ form.problem.category }}
      </p>

      <p>
        {{ form.problem.description }}
      </p>

      <p>
        Device Working:
        {{ form.problem.deviceWorking }}
      </p>
    </div>

    <div class="review-section">
      <h3>Shipping Information</h3>

      <p>
        {{ form.shipping.street }}
      </p>

      <p>
        {{ form.shipping.postalCode }}
        {{ form.shipping.city }}
      </p>

      <p>
        {{ form.shipping.country }}
      </p>
    </div>
  </section>
</template>

<script>
export default {
  name: "ReviewStep",

  props: {
    form: {
      type: Object,
      required: true,
    },
  },
};
</script>
