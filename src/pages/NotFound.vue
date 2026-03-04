<template>
  <div class="not-found">
    <h2>404 - Page Not Found</h2>
    <p>Sorry, we couldn't find that page.</p>
    <router-link to="/">← Back to Home</router-link>
  </div>
</template>

<style scoped>
.not-found {
  max-width: 800px;
  margin: 4rem auto;
  padding: 3rem;
  text-align: center;
}

.not-found h2 {
  margin-top: 0;
  margin-bottom: 1rem;
}

.not-found p {
  margin-bottom: 2rem;
  font-size: 1.1rem;
}

.not-found a {
  padding: 0.75rem 1.5rem;
  font-weight: bold;
  border: 2px solid;
  border-radius: 4px;
  display: inline-block;
  transition: all 0.2s;
}

.not-found a:hover {
  transform: translate(-2px, -2px);
}
</style>
