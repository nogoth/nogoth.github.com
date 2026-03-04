<template>
  <footer class="footer">
    <div class="footer-content">
      <div class="footer-section">
        <h3>Contact</h3>
        <ul>
          <li>
            <a href="mailto:livingood@gmail.com">Email: livingood@gmail.com</a>
          </li>
        </ul>
      </div>

      <div class="footer-section">
        <h3>About</h3>
        <p>
          A modern blog built with Vue.js, exploring thoughts on code and technology.
        </p>
      </div>

      <div class="footer-credits">
        <p>
          Made with
          <a href="https://vuejs.org" target="_blank" rel="noopener noreferrer">Vue.js</a>
          •
          <a href="https://github.com/nogoth/nogoth.github.com" target="_blank" rel="noopener noreferrer">
            Source Code
          </a>
        </p>
        <p>&copy; {{ currentYear }} Nogoth. All rights reserved.</p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
const currentYear = new Date().getFullYear()
</script>

<style scoped>
.footer {
  background: #f9f9f9;
  border-top: 2px solid #eee;
  padding: 3rem 0 2rem;
  margin-top: 4rem;
}

.footer-content {
  max-width: 900px;
  margin: 0 auto;
  padding: 0 1rem;
}

.footer-section {
  margin-bottom: 2rem;
}

.footer-section h3 {
  margin: 0 0 1rem 0;
  font-size: 1rem;
  color: #333;
}

.footer-section ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-section li {
  margin-bottom: 0.5rem;
}

.footer-section a {
  color: #007bff;
  text-decoration: none;
}

.footer-section a:hover {
  text-decoration: underline;
}

.footer-section p {
  margin: 0;
  color: #666;
  font-size: 0.95rem;
  line-height: 1.6;
}

.footer-credits {
  border-top: 1px solid #ddd;
  padding-top: 2rem;
  text-align: center;
  color: #999;
  font-size: 0.9rem;
}

.footer-credits p {
  margin-bottom: 0.5rem;
}

.footer-credits a {
  color: #666;
}

.footer-credits a:hover {
  color: #007bff;
}

@media (max-width: 768px) {
  .footer {
    padding: 2rem 0 1.5rem;
    margin-top: 3rem;
  }

  .footer-section {
    margin-bottom: 1.5rem;
  }

  .footer-content {
    padding: 0 1rem;
  }
}
</style>
