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
  <ErrorSnackbar />
  </validation-observer>

</template>

<script>
  import { required, email } from 'vee-validate/dist/rules'
  import { extend, ValidationObserver, ValidationProvider, setInteractionMode } from 'vee-validate'
  import axios from 'axios'
  import ErrorSnackbar from '@/components/ErrorSnackbar';

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
      ErrorSnackbar
    },
    data: () => ({
      email: '',
      password: '',
    }),

    methods: {
      submit () {
        this.$refs.observer
        .validate()
        .then((isValid) =>{
          if (!isValid) {
            throw new Error('Por favor verifique os campos requeridos e tente novamente.');
          }

          const apiUrl = 'http://localhost:8000/api';
          axios.post(`${apiUrl}/auth`, {
            email: this.email,
            password: this.password
          })
          .then(response => {
            if (response.status !== 200)
              throw new Error('Email ou senha inválidos')

            const { data } = response;
            localStorage.setItem('accessToken', data?.authorization?.token)
            localStorage.setItem('userData', JSON.stringify(data?.user))

            this.$store.dispatch('SET_USER_DATA', data.user)
            this.$store.dispatch('SET_ACCESS_TOKEN', data?.authorization?.token)

            this.$router.push({name: 'home'});
          })
          .catch(error => {
            let errorMessage = 'Ocorreu um erro, por favor tente novamente.';
            if (error.response.status === 401)
              errorMessage = 'Email ou senha inválidos.';

            this.$root.$emit('active-snackbar', errorMessage)
          })
        })
      },
    }
  }
</script>