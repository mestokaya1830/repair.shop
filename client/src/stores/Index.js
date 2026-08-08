import { createStore } from "vuex";
import VuexPersist from "vuex-persist";

const vuexLocalStorage = new VuexPersist({
  key: "vuex",
  storage: window.localStorage,

  reducer: (state) => ({
    auth: state.auth,
    tenant: {
      data: state.tenant.data,
    },
    invoice: {
      data: state.invoice.data,
    },
    repairs: {
      form: {
        ...state.repairs.form,
        device: {
          ...state.repairs.form.device,
          images: undefined,
        },
      },
      success: state.repairs.success,
    },
  }),
});

const repairsForm = () => ({
  customer: {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
  },

  device: {
    type: "",
    brand: "",
    model: "",
    serialNumber: "",
    purchaseDate: "",
  },

  problem: {
    category: "",
    description: "",
    startedAt: "",
    deviceWorking: "",
    notes: "",
  },

  shipping: {
    street: "",
    postalCode: "",
    city: "",
    country: "",
    contactMethod: "",
  },
});

const repairsModule = {
  namespaced: true,

  state: () => ({
    form: repairsForm(),

    success: {
      repairNumber: "",
      status: "",
      createdAt: "",
    },
  }),

  mutations: {
    setRepairs(state, payload) {
      state.form = payload;
    },

    setDeviceImages(state, payload) {
      state.form.device.images = payload;
    },

    setRepairSuccess(state, payload) {
      state.success = payload;
    },

    resetRepairs(state) {
      state.form = repairsForm();
    },

    resetRepairSuccess(state) {
      state.success = {
        repairNumber: "",
        status: "",
        createdAt: "",
      };
    },
  },
};

const invoiceModule = {
  namespaced: true,

  state: () => ({
    data: {
      invoiceNumber: "",
      date: "",
      serviceDate: "",
      paymentTerms: 14,

      currency: "EUR",
      vatType: "standard",

      status: "unpaid",

      repair: null,
      customer: null,

      workItems: [],

      totals: {
        net: 0,
        vat: 0,
        total: 0,
      },

      tenantId: null,
    },
  }),

  mutations: {
    setInvoice(state, payload) {
      state.data = payload;
    },

    resetInvoice(state) {
      state.data = {
        invoiceNumber: "",
        date: "",
        serviceDate: "",
        paymentTerms: 14,

        currency: "EUR",
        vatType: "standard",

        status: "unpaid",

        repair: null,
        customer: null,

        workItems: [],

        totals: {
          net: 0,
          vat: 0,
          total: 0,
        },

        tenantId: null,
      };
    },
  },
};


export default createStore({
  state: {
    auth: null
  },

  mutations: {
    setAuth(state, payload) {
      state.auth = payload;
    }
  },

  actions: {},
  getters: {},
  modules: {
    repairs: repairsModule,
    invoice: invoiceModule,
  },

  plugins: [vuexLocalStorage.plugin],
});