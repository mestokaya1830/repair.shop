<template>
  <div v-if="loading" class="loading-state">
    <p>Loading invoice details...</p>
  </div>

  <div v-else-if="invoice" class="invoice-preview-container">
    <div class="printable">
      <!-- RECIPIENT & INVOICE DETAILS -->
      <div class="recipient">
        <!-- CUSTOMER ADDRESS SECTION -->
       <!-- CUSTOMER SECTION -->
<div v-if="invoice.customer">
  <div class="company-name-subtitle">
    {{
      invoice.customer.company ||
      `${invoice.customer.firstName || ""} ${invoice.customer.lastName || ""}`.trim()
    }}
  </div>

  <div class="label">
    {{ invoice.customer.street || "-" }}
  </div>

  <div class="label">
    {{ invoice.customer.postalCode || "" }}
    {{ invoice.customer.city || "" }}
  </div>

  <div class="label">
    {{ invoice.customer.country || "" }}
  </div>
</div>

<div v-else class="label">
  Customer details not provided
</div>

        <!-- SERVICE PROVIDER (TENANT) SECTION -->
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
        <!-- INVOICE DETAILS SECTION -->
<div class="recipient-details">
  <div class="recipient-title">
    <i
      class="bi bi-info-circle-fill icons"
      aria-hidden="true"
    ></i>

    Invoice Details
  </div>

  <div class="recipient-row">
    <span class="label">Invoice No:</span>

    <span class="meta-value font-bold">
      {{ invoice.invoiceNumber || "DRAFT" }}
    </span>
  </div>

  <div class="recipient-row">
    <span class="label">Repair No:</span>

    <span class="meta-value">
      {{ invoice.repair?.repairNumber || "-" }}
    </span>
  </div>

  <div v-if="invoice.serviceDate" class="recipient-row">
    <span class="label">Service Date:</span>

    <span class="meta-value">
      {{ formatDate(invoice.serviceDate) }}
    </span>
  </div>

  <div class="recipient-row">
    <span class="label">Invoice Date:</span>

    <span class="meta-value">
      {{ formatDate(invoice.date) }}
    </span>
  </div>

  <div class="recipient-row">
    <span class="label">Payment Terms:</span>

    <span class="meta-value">
      {{ invoice.paymentTerms }} days
    </span>
  </div>
</div>
      </div>

      <div class="intro-text">
        Dear Customer,<br />
        We hereby invoice you for the services rendered as follows:
      </div>

      <!-- WORK ITEMS TABLE -->
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

  <tbody v-if="invoice.workItems?.length">
    <tr
      v-for="(item, index) in invoice.workItems"
      :key="item._id || index"
    >
      <td>{{ index + 1 }}</td>

      <td>
        <div class="position-title">
          {{ item.title }}
        </div>

        <div
          v-if="item.description"
          class="position-description"
        >
          {{ item.description }}
        </div>
      </td>

      <td class="center">
        {{ item.quantity }}
      </td>

      <td class="right">
        {{ formatCurrency(item.price, invoice.currency) }}
      </td>

      <td class="right">
        {{
          invoice.vatType === "reverse_charge"
            ? "0%"
            : `${item.vat || 0}%`
        }}
      </td>

      <td class="right">
        {{ formatCurrency(item.total, invoice.currency) }}
      </td>
    </tr>
  </tbody>

  <tbody v-else>
    <tr>
      <td colspan="6" class="center">
        No invoice positions.
      </td>
    </tr>
  </tbody>
</table>

      <!-- SUMMARY SECTION -->
      <div class="summary-section">
        <div class="total-row">
          <span class="total-label">Subtotal (Net):</span>
          <span class="total-value">
            {{ formatCurrency(invoice.totals?.net, invoice.currency) }}
          </span>
        </div>

        <div class="total-row">
          <span class="total-label">VAT:</span>
          <span class="total-value">
            {{ formatCurrency(invoice.totals?.vat, invoice.currency) }}
          </span>
        </div>

        <div class="total-row subtotal">
          <span class="total-label">Total Amount (Gross):</span>
          <span class="total-value">
            {{ formatCurrency(invoice.totals?.total, invoice.currency) }}
          </span>
        </div>

        <!-- TAX LEGAL NOTES -->
        <div class="preview-section">
          <div v-if="invoice.vatType === 'small_business'" class="tax-note small-company">
            <i class="bi bi-info-square-fill" aria-hidden="true"></i> Exempt
            from VAT according to small business regulation.
          </div>

          <div v-else-if="invoice.vatType === 'reverse_charge'" class="tax-note">
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
      <!-- DİNAMİK ÖDEME STATUS BUTONU -->
      <button 
      class="btn"  
      :class="['btn', invoice.status === 'paid' ? 'btn-warning' : 'btn-success']"
        :disabled="statusLoading"
        @click="togglePaymentStatus"
      >
        <i 
          :class="['bi', invoice.status === 'paid' ? 'bi-x-circle-fill' : 'bi-check-circle-fill', 'btn-icons']" 
          aria-hidden="true"
        ></i>
        <span>
          {{ statusLoading ? 'Updating...' : (invoice.status === 'paid' ? 'Mark as Unpaid' : 'Mark as Paid') }}
        </span>
      </button>

      <button class="btn" @click="printDoc()">
        <i class="bi bi-printer-fill btn-icons" aria-hidden="true"></i>
        <span>Print PDF</span>
      </button>

      <router-link to="/admin/invoices" class="btn btn-secondary">
        <i class="bi bi-arrow-left-circle icons" aria-hidden="true"></i> Back
      </router-link>
    </div>
  </div>
</template>

<script>
import api from "@/api/axios.js";

export default {
  name: "InvoiceDetails",

  inject: [
    "formatCustomerId",
    "formatDate",
    "formatCurrency",
    "formatInvoiceId",
  ],

  data() {
    return {
      invoice: null,
      tenant: null,
      loading: true,
      statusLoading: false,
    };
  },

  mounted() {
    this.fetchInvoiceDetails();
  },

  methods: {
    async fetchInvoiceDetails() {
  try {
    this.loading = true;

    const invoiceId = this.$route.params.id;

    const response = await api.get(
      `/invoices/${invoiceId}/details`,
    );

    this.invoice = response.data.data || response.data;

    this.tenant = this.invoice.tenantId || null;
  } catch (error) {
    console.error(
      "Error fetching invoice details:",
      error,
    );
  } finally {
    this.loading = false;
  }
},

    async togglePaymentStatus() {
      if (!this.invoice) return;

      const newStatus =
        this.invoice.status === "paid"
          ? "unpaid"
          : "paid";

      try {
        this.statusLoading = true;

        const response = await api.patch(
          `/invoices/${this.invoice._id}/payment-status`,
          {
            status: newStatus,
          },
        );

        if (response.status === 200) {
          this.invoice.status = newStatus;
        }
      } catch (error) {
        console.error(
          "Status update error:",
          error,
        );
      } finally {
        this.statusLoading = false;
      }
    },

    printDoc() {
      window.print();
    },
  },
};
</script>

