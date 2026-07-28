<template>
  <div class="invoices-container">
    <!-- SAYFA BAŞLIĞI -->
    <div class="header-section">
      <h2>Invoices</h2>
    </div>

    <!-- ARAMA VE FİLTRE BARI -->
    <div class="filter-card">
      <div class="search-box">
        <i class="bi bi-search search-icon"></i>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search invoice number, customer or repair ID..."
          @input="debounceSearch"
        />
      </div>
    </div>

    <!-- YÜKLENİYOR DURUMU -->
    <div v-if="loading" class="loading-state">
      <p>Loading invoices...</p>
    </div>

    <!-- BOŞ DURUM -->
    <div v-else-if="!invoices.length" class="empty-state">
      <i class="bi bi-receipt empty-icon"></i>
      <p>No invoices found.</p>
    </div>

    <!-- FATURA TABLOSU -->
    <div v-else class="table-responsive">
      <table class="invoice-table">
        <thead>
          <tr>
            <th>Invoice No</th>
            <th>Customer</th>
            <th>Repair ID</th>
            <th>VAT Type</th>
            <th>Invoice Date</th>
            <th>Due Date</th>
            <th class="right">Total</th>
            <th class="center">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="invoice in invoices" :key="invoice._id">
            <!-- 1. Fatura Numarası -->
            <td class="font-bold">
              {{ invoice.invoiceNumber || 'DRAFT' }}
            </td>

            <!-- 2. Müşteri -->
            <td>
              <div class="customer-info">
                <span class="customer-name">
                  {{ getCustomerName(invoice.customer) }}
                </span>
                <small v-if="invoice.customer?.city" class="text-muted">
                  {{ invoice.customer.city }}
                </small>
              </div>
            </td>

            <!-- 3. Tamirat ID -->
            <td>
              <span class="badge-subtle">
                #{{ invoice.repairId || invoice.repair || '-' }}
              </span>
            </td>

            <!-- 4. KDV Tipi -->
            <td>
              <span :class="['vat-badge', invoice.vatType]">
                {{ formatVatType(invoice.vatType) }}
              </span>
            </td>

            <!-- 5. Fatura Tarihi -->
            <td>{{ formatDate(invoice.date) }}</td>

            <!-- 6. Vade Tarihi -->
            <td>
              <span :class="{ 'text-danger': isOverdue(invoice.dueDate) }">
                {{ formatDate(invoice.dueDate) }}
              </span>
            </td>

            <!-- 7. Toplam Tutar -->
            <td class="right font-bold">
              {{ formatCurrency(invoice.totals?.total || 0, invoice.currency) }}
            </td>

            <!-- 8. Detay / Görüntüle Aksiyonu -->
            <td class="center">
              <button
                class="btn"
                title="View Invoice"
                @click="viewInvoice(invoice._id)"
              >
                <i class="bi bi-eye-fill"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- SAYFALAMA -->
    <div v-if="pagination.totalPages > 1" class="pagination-container">
      <button
        :disabled="pagination.page === 1"
        class="btn"
        @click="changePage(pagination.page - 1)"
      >
        Previous
      </button>

      <span>Page {{ pagination.page }} of {{ pagination.totalPages }}</span>

      <button
        :disabled="pagination.page === pagination.totalPages"
        class="btn"
        @click="changePage(pagination.page + 1)"
      >
        Next
      </button>
    </div>
  </div>
</template>

<script>
import api from "@/api/axios.js";

export default {
  name: "InvoiceList",
  inject: ["formatDate", "formatCurrency"],
  data() {
    return {
      invoices: [],
      loading: false,
      searchQuery: "",
      searchTimeout: null,
      pagination: {
        page: 1,
        limit: 10,
        totalPages: 1,
      },
    };
  },
  mounted() {
    this.fetchInvoices();
  },
  methods: {
    async fetchInvoices() {
      try {
        this.loading = true;
        const response = await api.get("/invoices", {
          params: {
            page: this.pagination.page,
            limit: this.pagination.limit,
            search: this.searchQuery,
          },
        });

        this.invoices = response.data.data || response.data.invoices || [];
        if (response.data.pagination) {
          this.pagination.totalPages = response.data.pagination.totalPages;
        }
      } catch (error) {
        console.error("Error fetching invoices:", error);
      } finally {
        this.loading = false;
      }
    },

    getCustomerName(customer) {
      if (!customer) return "Unknown Customer";
      if (customer.company) return customer.company;
      if (customer.firstName || customer.lastName) {
        return `${customer.firstName || ""} ${customer.lastName || ""}`.trim();
      }
      return "N/A";
    },

    formatVatType(type) {
      const map = {
        standard: "Standard VAT",
        reverse_charge: "Reverse Charge",
        small_business: "Small Business",
      };
      return map[type] || type || "Standard";
    },

    isOverdue(dueDate) {
      if (!dueDate) return false;
      return new Date(dueDate) < new Date();
    },

    debounceSearch() {
      clearTimeout(this.searchTimeout);
      this.searchTimeout = setTimeout(() => {
        this.pagination.page = 1;
        this.fetchInvoices();
      }, 400);
    },

    changePage(newPage) {
      this.pagination.page = newPage;
      this.fetchInvoices();
    },

    viewInvoice(id) {
      this.$router.push(`/admin/invoices/${id}/details`);
    },
  },
};
</script>
