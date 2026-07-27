<template>
  <div class="repairs-detail-container p-4">
    
    <!-- 1. ÜST BAŞLIK VE FİLTRE BİLGİSİ -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h3 class="fw-bold mb-1">
          <i class="bi bi-tools me-2 text-primary"></i>Repair Records
        </h3>
        <p class="text-muted mb-0">
          Showing results for status: 
          <span class="badge bg-primary text-capitalize fs-6 ms-1">
            {{ currentStatus || 'All Statuses' }}
          </span>
        </p>
      </div>
    </div>

    <!-- 2. YÜKLENİYOR / HATA DURUMLARI -->
    <div v-if="loading" class="text-center my-5 py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <p class="mt-2 text-muted">Fetching repair records...</p>
    </div>

    <!-- 3. TABLO KARTI -->
    <div v-else class="card border-0 shadow-sm">
      <div class="card-body p-0">
        
        <div class="table-responsive">
          <table class="table table-hover align-middle mb-0">
            <thead class="table-light">
              <tr>
                <th class="ps-3">Repair No</th>
                <th>Customer</th>
                <th>Device</th>
                <th>Status</th>
                <th>Created Date</th>
                <th class="text-end pe-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              <!-- VERİ BULUNAMADI DURUMU -->
              <tr v-if="repairs && repairs.length === 0">
                <td colspan="6" class="text-center py-5 text-muted">
                  <i class="bi bi-inbox fs-1 d-block mb-2 text-secondary"></i>
                  No repair records found for status: <strong>{{ currentStatus || 'All' }}</strong>
                </td>
              </tr>

              <!-- TAMİRAT LİSTESİ -->
              <tr v-for="repair in repairs" :key="repair._id">
                <!-- Tamirat Numarası -->
                <td class="ps-3 fw-semibold text-primary">
                  #{{ repair.repairNumber || repair._id.slice(-6) }}
                </td>

                <!-- Müşteri Bilgisi -->
                <td>
                  <div v-if="repair.customer" class="d-flex flex-column">
                    <span class="fw-semibold">
                      {{ repair.customer.firstName }} {{ repair.customer.lastName }}
                    </span>
                    <small class="text-muted">{{ repair.customer.phone || repair.customer.email }}</small>
                  </div>
                  <span v-else class="text-muted italic">Unassigned</span>
                </td>

                <!-- Cihaz Bilgisi -->
                <td>
                  <div v-if="repair.device" class="d-flex flex-column">
                    <span>{{ repair.device.brand }} {{ repair.device.model }}</span>
                    <small class="text-muted">S/N: {{ repair.device.serialNumber || 'N/A' }}</small>
                  </div>
                  <span v-else class="text-muted">-</span>
                </td>

                <!-- Durum Badge -->
                <td>
                  <span :class="['badge', getStatusBadgeClass(repair.status)]">
                    {{ repair.status }}
                  </span>
                </td>

                <!-- Oluşturulma Tarihi -->
                <td class="text-muted small">
                  {{ formatDate(repair.createdAt) }}
                </td>

                <!-- İşlemler Butonu -->
                <td class="text-end pe-3">
                  <router-link 
                    :to="`/admin/repairs/${repair._id}/details`" 
                    class="btn btn-sm btn-outline-primary"
                  >
                    <i class="bi bi-eye me-1"></i> View Detail
                  </router-link>
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
import api from '@/api/axios.js'

export default {
  name: 'RepairsDetailList',
  data() {
    return {
      repairs: [],
      loading: true,
      error: null,
      currentStatus: this.$route.query.status || null,
    }
  },
  mounted() {
    this.fetchRepairs()
  },
  watch: {
    // Sayfa yenilenmeden URL üzerindeki status query değiştiğinde veriyi tekrar çeker
    '$route.query.status'(newStatus) {
      this.currentStatus = newStatus || null
      this.fetchRepairs()
    },
  },
  methods: {
    // Backend API'den filtrelenmiş veriyi çekme
    async fetchRepairs() {
      try {
        this.loading = true
        this.error = null

        // URL query parametrelerini hazırlıyoruz
        const params = {}
        if (this.currentStatus) {
          params.status = this.currentStatus
        }

        // GET /api/v1/repairs/details?status=Pending
        const response = await api.get('/dashboard/details', { params })

        if (response.data && response.data.success) {
          this.repairs = response.data.data.repairs
        }
      } catch (err) {
        console.error('Error fetching repair details:', err)
        this.error = 'Failed to load repair records. Please try again.'
      } finally {
        this.loading = false
      }
    },

    // Filtreyi Temizle (Tüm durumları getir)
    clearFilter() {
      this.$router.push({ path: '/admin/dashboard/details' })
    },

    // Status değerine göre Bootstrap rozet (badge) rengini belirleme
    getStatusBadgeClass(status) {
      const classes = {
        Pending: 'bg-secondary',
        Received: 'bg-info text-dark',
        Diagnosing: 'bg-primary',
        WaitingApproval: 'bg-warning text-dark',
        Repairing: 'bg-primary',
        Testing: 'bg-info text-dark',
        Ready: 'bg-success',
        Delivered: 'bg-dark',
        Cancelled: 'bg-danger',
      }
      return classes[status] || 'bg-secondary'
    },

    // Tarih Biçimlendirme
    formatDate(dateString) {
      if (!dateString) return '-'
      return new Date(dateString).toLocaleDateString('de-DE', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    },
  },
}
</script>