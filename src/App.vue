<template>
  <v-app>
    <v-app-bar
      app
      color="error"
      dark
    >
      <div class="d-flex align-center">
        <b class="title-text">CBMBA</b>        
      </div>

      <v-spacer></v-spacer>

      <v-tabs v-model="tab" right>
        <v-tab>Login</v-tab>
        <v-tab>Cadastro</v-tab>
      </v-tabs>
    </v-app-bar>

    <v-main>
      <Main
        :current-tab="tab"
      />
    </v-main>
  </v-app>
</template>

<script>
import Main from './components/Main';

export default {
  name: 'App',

  components: {
    Main,
  },

  data: () => ({
    tab: 0
  }),
};
</script>

<style>
  .title-text {
    font-family: 'LilitaOne', 'sans-serif';
    font-size: 28px;
  }
</style>
