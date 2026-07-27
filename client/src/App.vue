<template>
  <div>
    <router-view />
  </div>
</template>

<script>
  export default {
    provide() {
      const year = new Date().getFullYear()
      return {
        formatInvoiceId(value){
          if(!value) return
          return `RE-${year}-${String(value).padStart(5, '0')}`
        }
      }
    }
  }
</script>