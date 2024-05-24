<template>
  <div id="app">
    <!-- <keep-alive> -->
      <router-view />
    <!-- </keep-alive> -->
  </div>
</template>

<script>
import { getToken } from '@/utils/auth'
export default {
  name: 'App',
  mounted() {
    if (getToken()) {
      this.$store.dispatch('user/getMenuInfo');
    }
  }
}
</script>
