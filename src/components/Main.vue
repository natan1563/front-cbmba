<template>
  <v-container>
    <v-app-bar
      app
      color="error"
      dark
      class="d-block"
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

    <v-col cols="12" class="text-center mt-10">
      <v-col cols="12">
        <v-img
          :src="require('../assets/images/logo.png')"
          class="my-3"
          contain
          height="200"
        />
      </v-col>

      <v-col
        cols="8"
        class="mx-auto"
      >
        <section v-if="tab === 1">
          <Register/>
        </section>
        <section 
          class="mt-4"
          v-else-if="tab === 0"
        >
          <Login/>
        </section>
      </v-col>

    </v-col>
  </v-container>
</template>

<script>
import Register from "./forms/auth/Register";
import Login from "./forms/auth/Login";

  export default {
    name: 'Main',
    components: {
      Register,
      Login,
    },
    data: () => ({
      tab: 0
    }),
  }
</script>
