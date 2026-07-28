<template>
  <div class="dashboard-container">
    <!-- YÜKLENİYOR DURUMU -->
    <div v-if="loading" class="text-center my-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading dashboard...</span>
      </div>
      <p class="mt-2 text-muted">Loading dashboard data...</p>
    </div>

    <!-- HATA DURUMU -->
    <div v-else-if="error" class="alert alert-danger my-4" role="alert">
      {{ error }}
      <button
        class="btn"
        @click="fetchDashboard"
      >
        Retry
      </button>
    </div>

    <!-- DASHBOARD İÇERİĞİ -->
    <div v-else class="dashboard-content">
      <!-- BAŞLIK -->
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 class="fw-bold mb-1">
            <i class="bi bi-speedometer2 me-2"></i>Dashboard
          </h2>
          <p class="text-muted mb-0">
            Overview of repairs, customers, and registered devices.
          </p>
        </div>
        <button class="btn" @click="fetchDashboard">
          <i class="bi bi-arrow-clockwise me-1"></i> Refresh
        </button>
      </div>

      <!-- 1. ÜST ÖZET KARTLARI -->
      <div class="row g-3 mb-4">
        <!-- Toplam Tamirat -> /admin/dashboard/details -->
        <div class="col-12 col-md-4">
          <router-link to="/admin/repairs" class="text-decoration-none">
            <div class="card metric-card border-0 shadow-sm">
              <div
                class="card-body d-flex align-items-center justify-content-between py-3"
              >
                <div>
                  <span class="text-muted small fw-semibold"
                    >TOTAL REPAIRS</span
                  >
                  <h3 class="fw-bold mb-0 mt-1 text-dark">
                    {{ stats.repairs?.total || 0 }}
                  </h3>
                </div>
                <div class="metric-icon bg-primary-subtle text-primary">
                  <i class="bi bi-wrench-adjustable"></i>
                </div>
              </div>
            </div>
          </router-link>
        </div>

        <!-- Toplam Müşteri -> /admin/customers -->
        <div class="col-12 col-md-4">
          <router-link to="/admin/customers" class="text-decoration-none">
            <div class="card metric-card border-0 shadow-sm">
              <div
                class="card-body d-flex align-items-center justify-content-between py-3"
              >
                <div>
                  <span class="text-muted small fw-semibold"
                    >TOTAL CUSTOMERS</span
                  >
                  <h3 class="fw-bold mb-0 mt-1 text-dark">
                    {{ stats.customers?.total || 0 }}
                  </h3>
                </div>
                <div class="metric-icon bg-success-subtle text-success">
                  <i class="bi bi-people"></i>
                </div>
              </div>
            </div>
          </router-link>
        </div>

        <!-- Toplam Cihaz -> /admin/devices -->
        <div class="col-12 col-md-4">
          <router-link to="/admin/devices" class="text-decoration-none">
            <div class="card metric-card border-0 shadow-sm">
              <div
                class="card-body d-flex align-items-center justify-content-between py-3"
              >
                <div>
                  <span class="text-muted small fw-semibold"
                    >REGISTERED DEVICES</span
                  >
                  <h3 class="fw-bold mb-0 mt-1 text-dark">
                    {{ stats.devices?.total || 0 }}
                  </h3>
                </div>
                <div class="metric-icon bg-info-subtle text-info">
                  <i class="bi bi-phone"></i>
                </div>
              </div>
            </div>
          </router-link>
        </div>
      </div>

      <!-- 2. TAMİRAT DURUM KARTLARI -->
      <div class="card border-0 shadow-sm mb-4">
        <div class="card-header bg-white py-3 border-0">
          <h5 class="fw-bold mb-0">
            <i class="bi bi-pie-chart me-2"></i>Repair Status Breakdown
          </h5>
        </div>
        <div class="card-body pt-0">
          <div class="row g-2">
            <div
              class="col-6 col-sm-4 col-md-3 col-lg"
              v-for="status in statusCards"
              :key="status.key"
            >
              <!-- Duruma göre filtrelenmiş detay sayfasına yönlendirir -->
              <router-link
                :to="{
                  path: '/admin/dashboard/details',
                  query: { status: status.statusValue },
                }"
                class="text-decoration-none"
              >
                <div class="status-box p-3 rounded-3 border text-center h-100">
                  <i :class="['bi', status.icon, status.textColor, 'fs-4']"></i>
                  <h4 class="fw-bold my-1 text-dark">
                    {{ stats.repairs?.[status.key] || 0 }}
                  </h4>
                  <span class="text-muted fs-7 d-block">{{
                    status.label
                  }}</span>
                </div>
              </router-link>
            </div>
          </div>
        </div>
      </div>

      <!-- 3. SON TAMİRATLAR TABLOSU -->
      <div class="card border-0 shadow-sm">
        <div
          class="card-header bg-white py-3 border-0 d-flex justify-content-between align-items-center"
        >
          <h5 class="fw-bold mb-0">
            <i class="bi bi-clock-history me-2"></i>Recent Repairs
          </h5>
          <router-link
            to="/admin/dashboard/details"
            class="btn btn-sm btn-link text-decoration-none"
          >
            View All
          </router-link>
        </div>

        <div class="table-responsive">
          <table class="table table-hover align-middle mb-0">
            <thead class="table-light">
              <tr>
                <th>Repair No</th>
                <th>Customer</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-if="!stats.recentRepairs || stats.recentRepairs.length === 0"
              >
                <td colspan="4" class="text-center text-muted py-4">
                  No recent repairs found.
                </td>
              </tr>
              <tr
                v-for="repair in stats.recentRepairs"
                :key="repair._id"
                class="clickable-row"
                @click="$router.push(`/admin/repairs/${repair._id}`)"
              >
                <td>
                  <span class="fw-semibold text-primary"
                    >#{{ repair.repairNumber || repair._id.slice(-6) }}</span
                  >
                </td>
                <td>
                  <span v-if="repair.customer">
                    {{ repair.customer.firstName }}
                    {{ repair.customer.lastName }}
                  </span>
                  <span v-else class="text-muted">Unassigned</span>
                </td>
                <td>
                  <span :class="['badge', getStatusBadgeClass(repair.status)]">
                    {{ repair.status }}
                  </span>
                </td>
                <td class="text-muted fs-7">
                  {{ formatDate(repair.createdAt) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from "@/api/axios.js";

export default {
  name: "Dashboard",
  data() {
    return {
      loading: true,
      error: null,
      stats: {
        repairs: {},
        customers: {},
        devices: {},
        recentRepairs: [],
      },
      statusCards: [
        {
          key: "pending",
          label: "Pending",
          icon: "bi-hourglass-split",
          textColor: "text-secondary",
          statusValue: "Pending",
        },
        {
          key: "received",
          label: "Received",
          icon: "bi-inbox",
          textColor: "text-info",
          statusValue: "Received",
        },
        {
          key: "diagnosing",
          label: "Diagnosing",
          icon: "bi-search",
          textColor: "text-primary",
          statusValue: "Diagnosing",
        },
        {
          key: "waitingApproval",
          label: "Waiting Approval",
          icon: "bi-pause-circle",
          textColor: "text-warning",
          statusValue: "WaitingApproval",
        },
        {
          key: "repairing",
          label: "Repairing",
          icon: "bi-tools",
          textColor: "text-primary",
          statusValue: "Repairing",
        },
        {
          key: "testing",
          label: "Testing",
          icon: "bi-check2-circle",
          textColor: "text-info",
          statusValue: "Testing",
        },
        {
          key: "ready",
          label: "Ready",
          icon: "bi-box-seam",
          textColor: "text-success",
          statusValue: "Ready",
        },
        {
          key: "delivered",
          label: "Delivered",
          icon: "bi-truck",
          textColor: "text-success",
          statusValue: "Delivered",
        },
        {
          key: "cancelled",
          label: "Cancelled",
          icon: "bi-x-circle",
          textColor: "text-danger",
          statusValue: "Cancelled",
        },
      ],
    };
  },
  mounted() {
    this.fetchDashboard();
  },
  methods: {
    async fetchDashboard() {
      try {
        this.loading = true;
        this.error = null;
        const response = await api.get("/dashboard");

        if (response.data && response.data.success) {
          this.stats = response.data.data;
        }
      } catch (err) {
        console.error("Error fetching dashboard:", err);
        this.error = "Failed to load dashboard data. Please try again.";
      } finally {
        this.loading = false;
      }
    },

    getStatusBadgeClass(status) {
      const classes = {
        Pending: "bg-secondary",
        Received: "bg-info text-dark",
        Diagnosing: "bg-primary",
        WaitingApproval: "bg-warning text-dark",
        Repairing: "bg-primary",
        Testing: "bg-info text-dark",
        Ready: "bg-success",
        Delivered: "bg-dark",
        Cancelled: "bg-danger",
      };
      return classes[status] || "bg-secondary";
    },

    formatDate(dateString) {
      if (!dateString) return "-";
      return new Date(dateString).toLocaleDateString("de-DE", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    },
  },
};
</script>