<template>
  <section>
    <h2>Repair details</h2>

    <div>
      <label> Problem Category </label>

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
    </div>
    <p v-if="errors['problem.description']" class="form-error">
      {{ errors["problem.description"] }}
    </p>
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
</template>

<script>
export default {
  name: "ProblemStep",

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
