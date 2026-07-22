<template>
  <section class="vue-remote">
    <h2>Vue remote</h2>
    <p>Loaded at runtime via Module Federation.</p>
    <button @click="count++">clicked {{ count }} times</button>
  </section>
</template>

<script>
export default {
  name: 'App',
  data() {
    return { count: 0 };
  },
};
</script>

<style scoped>
.vue-remote {
  padding: var(--space-6);
  font-family: var(--font-body);
  background: var(--surface-teal);
  border-radius: var(--radius-lg);
  color: var(--text-primary);
}
</style>