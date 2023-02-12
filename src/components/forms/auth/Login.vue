<template>
  <validation-observer
    ref="observer"
  >
    <form @submit.prevent="submit">
      <validation-provider
        v-slot="{ errors }"
        name="E-mail"
        rules="required|email"
      >
        <v-text-field
          v-model="email"
          :error-messages="errors"
          label="E-mail"
          required
        ></v-text-field>
      </validation-provider>

      <validation-provider
        v-slot="{ errors }"
        name="Senha"
        rules="required"
      >
        <v-text-field
          v-model="password"
          :error-messages="errors"
          label="Senha"
          type="password"
          required
        ></v-text-field>
      </validation-provider>
      <v-btn
        class="mr-4"
        type="submit"
      >
        Entrar
      </v-btn>

    </form>
  </validation-observer>
</template>

<script>
  import { required, email } from 'vee-validate/dist/rules'
  import { extend, ValidationObserver, ValidationProvider, setInteractionMode } from 'vee-validate'
  // import axios from 'axios';

  setInteractionMode('eager')
  extend('required', {
    ...required,
    message: '{_field_} não pode estar vazio.',
  })

  extend('email', {
    ...email,
    message: 'Email must be valid',
  })

  export default {
    components: {
      ValidationProvider,
      ValidationObserver,
    },
    data: () => ({
      email: '',
      password: '',
    }),

    methods: {
      submit () {
        this.$refs.observer.validate()
      },
    },
  }
</script>