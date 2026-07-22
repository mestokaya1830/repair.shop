import { defineStore } from "pinia";

export const repairStore = defineStore("repair", {
  state: () => ({
    form: {
      customer: {
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        company: ""
      },

      device: {
        type: "",
        brand: "",
        model: "",
        serialNumber: "",
        purchaseDate: "",
        images: []
      },

      problem: {
        category: "",
        description: "",
        startedAt: "",
        deviceWorking: "",
        notes: ""
      },

      shipping: {
        street: "",
        postalCode: "",
        city: "",
        country: "",
        contactMethod: ""
      },
    },
  }),

  actions: {
    updateForm(data) {
      this.form = {
        ...this.form,
        ...data,
      };
    },
    createRequestInfo() {
      this.repairNumber = "REQ-" + Date.now();
      this.createdAt = new Date().toLocaleDateString();
    },

    resetForm() {
      this.$reset();
    },
  },
});
