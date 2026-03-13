<template>
  <header class="header">
    <div class="header-content">
      <h1 class="logo">
        <router-link to="/">Nogoth</router-link>
      </h1>
      <nav class="nav">
        <router-link to="/">Home</router-link>
        <a href="mailto:livingood@gmail.com">Email</a>
      </nav>
    </div>
  </header>
</template>

<style scoped>
.header {
  background: #f9f9f9;
  border-bottom: 2px solid #eee;
  padding: 1.5rem 0;
  margin-bottom: 2rem;
}

.header-content {
  max-width: 900px;
  margin: 0 auto;
  padding: 0 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  box-sizing: border-box;
}

.logo {
  margin: 0;
  font-size: 1.5rem;
}

.logo a {
  color: #333;
  text-decoration: none;
}

.logo a:hover {
  color: #007bff;
}

.nav {
  display: flex;
  gap: 1.5rem;
}

.nav a {
  color: #666;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s;
}

.nav a:hover {
  color: #007bff;
}

@media (max-width: 768px) {
  .header {
    padding: 1.5rem 0;
    margin-bottom: 1rem;
  }

  .header-content {
    flex-direction: column;
    gap: 1rem;
    max-width: none;
    padding: 0;
    margin: 0;
  }

  .logo {
    font-size: 1.2rem;
  }

  .nav {
    gap: 1rem;
    font-size: 0.9rem;
  }
}
</style>
