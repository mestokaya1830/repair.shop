<template>
  <div class="invoice-create-page">
    <header class="page-header">
      <h1>Create Invoice</h1>

      <router-link to="/admin/invoices" class="btn btn-secondary">
        Back
      </router-link>
    </header>

    <form @submit.prevent="submitPreview">
      <!-- BASIC INFORMATION -->

      <section class="sections">
        <h2 class="sections-title">Invoice Information</h2>

        <div class="form-row">
          <div class="form-group">
            <label class="form-label"> Invoice Date </label>

            <input v-model="invoice.date" type="date" class="inputs" />
          </div>

          <div class="form-group">
            <label class="form-label"> Service Date </label>

            <input v-model="invoice.serviceDate" type="date" class="inputs" />
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label class="form-label"> Payment Terms (Days) </label>

            <input
              v-model.number="invoice.paymentTerms"
              type="number"
              class="inputs"
            />
          </div>
        </div>
      </section>

      <!-- REPAIR INFORMATION -->

      <section class="sections">
        <h2 class="sections-title">Repair Information</h2>

        <div class="info-grid">
          <div class="info-item">
            <label class="form-label"> Repair Number </label>

            <div class="readonly-value">
              {{ invoice.repairNumber || "-" }}
            </div>
          </div>

          <div class="info-item">
            <label class="form-label"> Status </label>

            <div class="readonly-value">
              {{ invoice.status || "-" }}
            </div>
          </div>

          <div class="info-item">
            <label class="form-label"> Device </label>

            <div class="readonly-value">
              {{ invoice.device?.brand }}

              {{ invoice.device?.model }}
            </div>
          </div>

          <div class="info-item">
            <label class="form-label"> Serial Number </label>

            <div class="readonly-value">
              {{ invoice.device?.serialNumber || "-" }}
            </div>
          </div>
        </div>
      </section>

      <!-- CUSTOMER INFORMATION -->

      <section class="sections">
        <h2 class="sections-title">Customer Information</h2>

        <div class="info-grid">
          <div class="info-item">
            <label class="form-label"> Name </label>

            <div class="readonly-value">
              {{ invoice.customer?.firstName }}

              {{ invoice.customer?.lastName }}
            </div>
          </div>

          <div class="info-item">
            <label class="form-label"> Email </label>

            <div class="readonly-value">
              {{ invoice.customer?.email || "-" }}
            </div>
          </div>

          <div class="info-item">
            <label class="form-label"> Address </label>

            <div class="readonly-value">
              {{ invoice.customer?.address || "-" }}
            </div>
          </div>

          <div class="info-item">
            <label class="form-label"> City </label>

            <div class="readonly-value">
              {{ invoice.customer?.postalCode }}

              {{ invoice.customer?.city }}
            </div>
          </div>
        </div>
      </section>

      <!-- TAX SETTINGS -->

      <section class="sections">
        <h2 class="sections-title">Tax Settings</h2>

        <div class="form-row">
          <div class="form-group">
            <label class="form-label"> Currency </label>

            <select v-model="invoice.currency.code" class="inputs">
              <option value="EUR">EUR</option>

              <option value="CHF">CHF</option>

              <option value="USD">USD</option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label"> VAT </label>

            <select v-model="invoice.vatType" class="inputs">
              <option value="standard">Standard VAT</option>

              <option value="small_business">Small Business</option>

              <option value="reverse_charge">Reverse Charge</option>
            </select>
          </div>
        </div>
      </section>

      <!-- WORKFLOW POSITIONS -->

      <section class="sections">
        <h2 class="sections-title">Invoice Items</h2>

        <div v-if="invoice.positions?.length">
          <div
            v-for="(item, index) in invoice.positions"
            :key="item.workItemId"
            class="position-item"
          >
            <div class="positions-header">
              <span> Position {{ index + 1 }} </span>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label class="form-label"> Work </label>

                <div class="readonly-value">
                  {{ item.title }}
                </div>
              </div>

              <div class="form-group">
                <label class="form-label"> Description </label>

                <div class="readonly-value">
                  {{ item.description || "-" }}
                </div>
              </div>
              <!-- PART INFORMATION -->

<div v-if="item.type === 'part' && item.partInfo">

  <h4>Part Information</h4>

  <p>
    Name:
    {{ item.partInfo.name || "-" }}
  </p>

  <p>
    Brand:
    {{ item.partInfo.brand || "-" }}
  </p>

  <p>
    Model:
    {{ item.partInfo.model || "-" }}
  </p>

  <p>
    Serial Number:
    {{ item.partInfo.serialNumber || "-" }}
  </p>

  <p>
    Part Number:
    {{ item.partInfo.partNumber || "-" }}
  </p>

</div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label class="form-label"> Quantity </label>

                <div class="readonly-value">
                  {{ item.quantity }}
                </div>
              </div>

              <div class="form-group">
                <label class="form-label"> Price </label>

                <input
                  v-model.number="item.price"
                  type="number"
                  min="0"
                  step="0.01"
                  class="inputs"
                />
              </div>

              <div class="form-group">
                <label class="form-label"> VAT % </label>

                <select v-model.number="item.vat" class="inputs">
                  <option :value="0">0 %</option>

                  <option :value="7">7 %</option>

                  <option :value="19">19 %</option>
                </select>
              </div>

              <div class="form-group">
                <label class="form-label"> Total </label>

                <div class="readonly-value">{{ itemTotal(item) }} €</div>
              </div>
            </div>
          </div>
        </div>

        <p v-else>No completed workflow items found</p>
      </section>

      <!-- SUMMARY -->

      <section class="sections">
        <h2 class="sections-title">Summary</h2>

        <div class="summary">
          <p>
            Net:
            {{ summary.net }}
            €
          </p>

          <p>
            VAT:
            {{ summary.vat }}
            €
          </p>

          <p>
            Total:
            {{ summary.total }}
            €
          </p>
        </div>
      </section>

      <div class="btn-container">
        <button type="submit" class="btn btn-primary">Preview Invoice</button>
      </div>
    </form>
  </div>
</template>

<script>
import api from "@/api/axios.js";
import { invoicesSchema } from "@/validations/invoices.schema.js";

export default {
  name: "InvoiceCreate",

  data() {
    return {
      invoice: {
        repairId: "",

        repairNumber: "",
        status: "",

        device: null,
        customer: null,

        date: new Date().toISOString().split("T")[0],

        serviceDate: new Date().toISOString().split("T")[0],

        paymentTerms: 14,

        currency: {
          code: "EUR",
          locale: "de-DE",
        },

        vatType: "standard",

        positions: [],

        totals: {
          net: 0,
          vat: 0,
          total: 0,
        },
      },

      loading: false,

      errors: {},
    };
  },

  computed: {
    summary() {
      let net = 0;
      let vat = 0;

      this.invoice.positions.forEach((item) => {
        const price = Number(item.price || 0) * Number(item.quantity || 1);

        net += price;

        vat += price * (Number(item.vat || 0) / 100);
      });

      return {
        net: net.toFixed(2),

        vat: vat.toFixed(2),

        total: (net + vat).toFixed(2),
      };
    },
  },

  mounted() {
    this.loadRepair();
  },

  methods: {
    async loadRepair() {
      try {
        const repairId = this.$route.params.id;

        const response = await api.get(`/repairs/${repairId}/details`);

        const data = response.data.data;

        console.log(data);
        this.invoice = {
          ...this.invoice,

          repairId,

          repairNumber: data.repairNumber,

          status: data.status,

          device: data.device,

          customer: data.customer,

          positions: data.workItems.map((item) => ({
            workItemId: item._id,

            title: item.title,

            description: item.description || "",

            quantity: item.quantity || 1,

            type: item.type,

            partInfo: item.partInfo || null,

            price: 0,

            vat: this.invoice.vatType === "standard" ? 19 : 0,
          })),
        };
      } catch (error) {
        console.error("Load repair failed", error);
      }
    },

    itemTotal(item) {
      const net = Number(item.price || 0) * Number(item.quantity || 1);

      const vat = net * (Number(item.vat || 0) / 100);

      return (net + vat).toFixed(2);
    },

    updateVatByType() {
      this.invoice.positions.forEach((item) => {
        if (this.invoice.vatType !== "standard") {
          item.vat = 0;
        } else {
          item.vat = 19;
        }
      });
    },

    validate() {
      this.errors = {};

      if (!this.invoice.positions.length) {
        this.errors.positions = "No workflow items found";

        return false;
      }

      for (const item of this.invoice.positions) {
        if (item.price === null || item.price === undefined || item.price < 0) {
          this.errors.price = "Please enter all prices";

          return false;
        }
      }

      return true;
    },

    async submitPreview() {
      if (!this.validate()) {
        return;
      }

      const payload = {
        ...this.invoice,

        totals: {
          net: Number(this.summary.net),
          vat: Number(this.summary.vat),
          total: Number(this.summary.total),
        },
      };

      const result = invoicesSchema.safeParse(payload);

      if (!result.success) {
        result.error.issues.forEach((error) => {
          this.errors[error.path.join(".")] = error.message;
        });

        return;
      }

      this.$store.commit(
        "invoice/setInvoice",
        JSON.parse(JSON.stringify(payload)),
      );

      this.$router.push("/admin/invoices/preview");
    },
  },
};
</script>
