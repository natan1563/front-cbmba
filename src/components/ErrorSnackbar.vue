<template>
  <div class="text-center">
    <v-snackbar
      v-model="snackbar"
      multi-line
    >
      <b>{{ text }}</b>
      
      <template v-slot:action="{ attrs }">
        <v-btn
          color="red"
          text
          v-bind="attrs"
          @click="snackbar = false"
        >
          Fechar
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script>
  export default {
    data: () => ({
      snackbar: false,
      text: '',
    }),

    mounted () {
      this.$root.$on('active-snackbar', (text) => {
        this.snackbar = true;
        this.text = text;
      });
    },

    destroyed () {
      this.$root.$off('active-snackbar');
    },
  }
</script>