<script setup lang="ts">
import { useRoute } from 'vue-router';

const route = useRoute();
</script>

<template>
  <h1>I'm a new event! {{ route.params.id }}</h1>
</template>

<style scoped></style>
