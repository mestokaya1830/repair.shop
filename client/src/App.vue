<template>
  <div>
    <router-view />
  </div>
</template>

<script>
export default {
  provide() {
    const year = new Date().getFullYear();
    return {
      formatInvoiceId(value) {
        if (!value) return;
        return `RE-${year}-${String(value).padStart(5, "0")}`;
      },
      formatCustomerId(value) {
        if (!value) return "";
        return `KU-${year}-${String(value).padStart(5, "0")}`;
      },
      formatDate(value) {
        if (!value) return "";
        try {
          const d = new Date(value);
          if (isNaN(d)) return "";
          return d.toLocaleDateString("de-DE", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          });
        } catch (error) {
          return error.message || "";
        }
      },
      formatValidDays(baseDate, validDays) {
        if (!baseDate || !validDays) return "";
        const d = new Date(baseDate);
        d.setDate(d.getDate() + Number(validDays));
        return d.toLocaleDateString("de-DE", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        });
      },
      formatCurrency(value, currency) {
        if (currency == undefined) {
          currency = "EUR.de-DE";
        }
        const num = parseFloat(value) || 0;
        const [curr, locale] = currency.split(".");
        return new Intl.NumberFormat(locale, {
          style: "currency",
          currency: curr,
        }).format(num);
      },
    };
  },
};
</script>
