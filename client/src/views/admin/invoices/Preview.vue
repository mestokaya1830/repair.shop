<template>
  <div v-if="invoicePreview" class="invoice-preview-container">
    <div class="printable">
      <!-- RECIPIENT & INVOICE DETAILS -->
      <div class="recipient">
        <!-- CUSTOMER ADDRESS SECTION -->
        <div class="recipient-address">
          <div class="recipient-title">
            <i class="bi bi-person-fill icons" aria-hidden="true"></i>Recipient
          </div>

          <div v-if="invoicePreview.customer">
            <div class="company-name-subtitle">
              {{
                invoicePreview.customer.company ||
                invoicePreview.customer.firstName +
                  " " +
                  invoicePreview.customer.lastName
              }}
            </div>
            <div class="label">
              {{ invoicePreview.customer.address || "-" }}
            </div>
            <div class="label">
              {{ invoicePreview.customer.postalCode }}
              {{ invoicePreview.customer.city }}
            </div>
          </div>
          <div v-else class="label">Customer details not provided</div>
        </div>

        <div class="party-box tenant-box">
          <h3>Service Provider (Tenant)</h3>
          <div v-if="tenant" class="party-details">
            <p class="party-name">
              <strong>{{ tenant.company || tenant.name }}</strong>
            </p>
            <p v-if="tenant.email">{{ tenant.email }}</p>
            <p v-if="tenant.phone">{{ tenant.phone }}</p>
            <p v-if="tenant.address?.street">
              {{ tenant.address.street }}, {{ tenant.address.postalCode }}
              {{ tenant.address.city }}
            </p>
            <p v-if="tenant.billingDetails?.vatId">
              <strong>VAT ID:</strong> {{ tenant.billingDetails.vatId }}
            </p>
          </div>
        </div>
        <!-- INVOICE DETAILS SECTION -->
        <div class="recipient-details">
          <div class="recipient-title">
            <i class="bi bi-info-circle-fill icons" aria-hidden="true"></i
            >Invoice Details
          </div>

          <div class="recipient-row">
            <span class="label">Repair ID:</span>
            <span class="meta-value">{{ invoicePreview.repairId || "-" }}</span>
          </div>

          <div v-if="invoicePreview.serviceDate" class="recipient-row">
            <span class="label">Service Date:</span>
            <span class="meta-value">{{
              formatDate(invoicePreview.serviceDate)
            }}</span>
          </div>

          <div class="recipient-row">
            <span class="label">Invoice Date:</span>
            <span class="meta-value">{{
              formatDate(invoicePreview.date)
            }}</span>
          </div>

          <div class="recipient-row">
            <span class="label">Payment Terms:</span>
            <span class="meta-value"
              >{{ invoicePreview.paymentTerms || 14 }} Days</span
            >
          </div>
        </div>
      </div>

      <div class="intro-text">
        Dear Customer,<br />
        We hereby invoice you for the services rendered as follows:
      </div>

      <!-- WORK ITEMS TABLE -->
      <table class="positions-table">
        <thead>
          <tr>
            <th style="width: 5%">Pos.</th>
            <th style="width: 45%">Description</th>
            <th class="center" style="width: 10%">Qty</th>
            <th class="right" style="width: 13%">Unit Price</th>
            <th class="right" style="width: 12%">VAT</th>
            <th class="right" style="width: 15%">Total Price</th>
          </tr>
        </thead>

        <tbody
          v-if="invoicePreview.workItems && invoicePreview.workItems.length"
        >
          <tr
            v-for="(item, index) in invoicePreview.workItems"
            :key="item.workflowItemId || index"
          >
            <td>{{ index + 1 }}</td>
            <td>
              <div class="position-title">{{ item.title }}</div>
              <div v-if="item.description" class="position-description">
                {{ item.description }}
              </div>
              {{ item }}
            </td>
            <td class="center">{{ item.quantity }}</td>
            <td class="right">
              {{ formatCurrency(item.price, invoicePreview.currency) }}
            </td>
            <td class="right">
              {{
                invoicePreview.vatType === "reverse_charge"
                  ? "0%"
                  : (item.vat || 0) + "%"
              }}
            </td>
            <td class="right">
              {{
                formatCurrency(
                  item.total || calculateItemTotal(item),
                  invoicePreview.currency,
                )
              }}
            </td>
          </tr>
        </tbody>
      </table>

      <!-- SUMMARY SECTION -->
      <div class="summary-section">
        <div class="total-row">
          <span class="total-label">Subtotal (Net):</span>
          <span class="total-value">
            {{
              formatCurrency(
                invoicePreview.totals?.net,
                invoicePreview.currency,
              )
            }}
          </span>
        </div>

        <div class="total-row">
          <span class="total-label">VAT:</span>
          <span class="total-value">
            {{
              formatCurrency(
                invoicePreview.totals?.vat,
                invoicePreview.currency,
              )
            }}
          </span>
        </div>

        <div class="total-row subtotal">
          <span class="total-label">Total Amount (Gross):</span>
          <span class="total-value">
            {{
              formatCurrency(
                invoicePreview.totals?.total,
                invoicePreview.currency,
              )
            }}
          </span>
        </div>

        <!-- TAX LEGAL NOTES -->
        <div class="preview-section">
          <div
            v-if="invoicePreview.vatType === 'small_business'"
            class="tax-note small-company"
          >
            <i class="bi bi-info-square-fill" aria-hidden="true"></i> Exempt
            from VAT according to small business regulation.
          </div>

          <div
            v-else-if="invoicePreview.vatType === 'reverse_charge'"
            class="tax-note"
          >
            <i class="bi bi-arrow-repeat" aria-hidden="true"></i> Reverse charge
            – recipient is liable for VAT.
          </div>
        </div>
      </div>

      <!-- BANK INFORMATION -->
      <div v-if="tenant" class="preview-box">
        <div class="preview-box-title">
          <i class="bi bi-bank icons" aria-hidden="true"></i>Bank Details
        </div>
        <div class="preview-box-content">
          <span class="preview-box-label">Bank:</span>
          <span class="preview-box-value">{{ tenant.bank_name || "-" }}</span>
          <span class="preview-box-label">IBAN:</span>
          <span class="preview-box-value">{{ tenant.iban || "-" }}</span>
          <span class="preview-box-label">BIC:</span>
          <span class="preview-box-value">{{ tenant.bic || "-" }}</span>
        </div>
      </div>
    </div>

    <!-- ACTIONS -->
    <div class="sections btn-container">
      <button class="btn" :disabled="loading" @click="saveInvoice">
        <i class="bi bi-floppy-fill btn-icons" aria-hidden="true"></i>
        <span>{{ loading ? "Saving..." : "Save Invoice" }}</span>
      </button>
      <button @click="printDoc()" class="btn">Print PDF</button>
      <router-link to="/admin/invoices" class="btn btn-secondary">
        <i class="bi bi-arrow-left-circle icons" aria-hidden="true"></i> Back
      </router-link>
    </div>
  </div>
</template>

<script>
import api from "@/api/axios.js";

export default {
  name: "InvoicePreview",
  inject: [
    "formatCustomerId",
    "formatDate",
    "formatCurrency",
    "formatInvoiceId",
  ],
  data() {
    return {
      invoicePreview: null,
      tenant: null,
      loading: false,
    };
  },
  mounted() {
    this.getInvoicePreview();
  },
  methods: {
    getInvoicePreview() {
      const storeInvoice =
        this.$store.state.invoice?.invoice || this.$store.state.invoice;
      this.tenant = this.$store?.state.auth.tenant || null;
      this.invoicePreview = storeInvoice.data;
    },

    calculateItemTotal(item) {
      const net = Number(item.price || 0) * Number(item.quantity || 1);
      const vat = net * (Number(item.vat || 0) / 100);
      return net + vat;
    },


    printDoc() {
      window.print();
    },
   async saveInvoice() {
  if (!this.invoicePreview) return;

  try {
    this.loading = true;

    const tenant = this.$store.state.auth.tenant;

    if (!tenant?._id) {
      console.error("Tenant not found.");
      return;
    }

    this.invoicePreview.tenantId = tenant._id;

    const response = await api.post(
      "/invoices/create",
      this.invoicePreview,
    );

    if (response.status === 200 || response.status === 201) {
      this.$router.push("/admin/invoices");
    }
  } catch (error) {
    console.error("Invoice save error:", error);
  } finally {
    this.loading = false;
  }
}
  },
};
</script>
