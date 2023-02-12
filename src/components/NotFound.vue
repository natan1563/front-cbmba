<template>
  <v-container class="text-center">
    <h1 class="my-auto">
      404 - Página não encontrada.
    </h1>

    <router-link :to="{name: 'auth-user'}">
      Voltar para home
    </router-link>
  </v-container>
</template>