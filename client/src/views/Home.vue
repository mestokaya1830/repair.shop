<template>
  <div class="home">
    <!-- Hero Section -->
    <section class="hero">
      <h1>Professional Computer Repair Service</h1>

      <p>
        Send your damaged device to us and track your repair process online.
      </p>

      <router-link to="/repair-request"> Send Your Device </router-link>
    </section>

    <!-- How It Works -->
    <section class="how-it-works">
      <h2>How It Works</h2>

      <div class="steps">
        <div class="step">
          <h3>1. Create a Request</h3>

          <p>Tell us about your device and describe the problem.</p>
        </div>

        <div class="step">
          <h3>2. Send Your Device</h3>

          <p>Pack your device and send it safely to our service center.</p>
        </div>

        <div class="step">
          <h3>3. Repair Process</h3>

          <p>Our technicians diagnose and repair your device.</p>
        </div>

        <div class="step">
          <h3>4. Track Online</h3>

          <p>Follow the current status of your repair anytime.</p>
        </div>
      </div>
    </section>

    <!-- Features -->
    <section class="features">
      <h2>Why Choose Us</h2>

      <div>
        <h3>Experienced Technicians</h3>

        <p>Professional repair service by qualified specialists.</p>
      </div>

      <div>
        <h3>Transparent Process</h3>

        <p>Know the repair status at every step.</p>
      </div>

      <div>
        <h3>Secure Service</h3>

        <p>Your device and data are handled safely.</p>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: "HomeView",
};
</script>
