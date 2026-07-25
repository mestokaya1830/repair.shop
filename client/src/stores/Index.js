import { createStore } from "vuex";
import VuexPersist from "vuex-persist";

const vuexLocalStorage = new VuexPersist({
  key: "vuex",
  storage: window.localStorage,
  reducer: (state) => ({
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

export default createStore({
  state: {
    auth: "",
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
  },

  plugins: [vuexLocalStorage.plugin],
});
