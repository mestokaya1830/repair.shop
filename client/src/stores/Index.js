import { createStore } from "vuex";
import VuexPersist from "vuex-persist";

const vuexLocalStorage = new VuexPersist({
  key: "vuex",
  storage: window.localStorage,

  // Reducer: Tüm modülleri dahil ediyoruz (sadece device.images hariç)
  reducer: (state) => ({
    // 1. Auth kalıcı
    auth: state.auth,

    // 2. Tenant kalıcı
    tenant: {
      data: state.tenant.data,
    },

    // 3. Invoice kalıcı
    invoice: {
      data: state.invoice.data,
    },

    // 4. Repairs kalıcı (images hariç tutularak)
    repairs: {
      form: {
        ...state.repairs.form,
        device: {
          ...state.repairs.form.device,
          images: undefined, // Resimleri storage kotasını doldurmaması için hariç tutuyoruz
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
      paymentStatus: "unpaid",
      repair: null,
      customer: null,
      items: [],
      netTotal: 0,
      vatTotal: 0,
      total: 0,
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
        paymentStatus: "unpaid",
        repair: null,
        customer: null,
        items: [],
        netTotal: 0,
        vatTotal: 0,
        total: 0,
      };
    },
  },
};

const tenantModule = {
  namespaced: true,

  state: () => ({
    data: null,
  }),

  mutations: {
    setTenant(state, payload) {
      state.data = payload;
    },

    resetTenant(state) {
      state.data = null;
    },
  },
};

export default createStore({
  state: {
    auth: null,
  },

  mutations: {
    setAuth(state, payload) {
      state.auth = payload;
    },
  },

  actions: {},
  getters: {},
  modules: {
    repairs: repairsModule,
    invoice: invoiceModule,
    tenant: tenantModule,
  },

  plugins: [vuexLocalStorage.plugin],
});