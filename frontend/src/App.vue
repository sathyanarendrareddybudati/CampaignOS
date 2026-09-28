<script setup>
import { ref } from 'vue'
import Dashboard from './components/Dashboard.vue'
import Login from './components/Login.vue'

const isAuthenticated = ref(false)
</script>

<template>
  <Dashboard v-if="isAuthenticated" />
  <Login v-else @login="isAuthenticated = true" />
</template>

<style>
body {
  margin: 0;
  padding: 0;
  background-color: #F8FAFC;
}
</style>
