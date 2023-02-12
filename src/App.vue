<template>
  <v-app>
    <transition
      :name="'router'"
      mode="out-in"
      appear
    >
      <router-view></router-view>
    </transition>
  </v-app>
</template>

<script>

export default {
  name: 'App',

  data: () => ({
  }),
};
</script>

<style>
  .title-text {
    font-family: 'LilitaOne', 'sans-serif';
    font-size: 28px;
  }
</style>
