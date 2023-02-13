<template>
  <validation-observer
    ref="observer"
  >
    <form @submit.prevent="submit">
      <validation-provider
        v-slot="{ errors }"
        name="Name"
        rules="required|max:30"
      >
        <v-text-field
          v-model="name"
          :counter="30"
          :error-messages="errors"
          label="Name"
          required
        ></v-text-field>
      </validation-provider>
      
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
        rules="required|confirmed:confirm|min:6"
      >
        <v-text-field
          v-model="password"
          :error-messages="errors"
          label="Senha"
          type="password"
          required
        ></v-text-field>
      </validation-provider>

      <validation-provider
        v-slot="{ errors }"
        name="Confirme sua senha"
        rules="required|min:6"
        vid="confirm"
      >
        <v-text-field
          v-model="password_confirm"
          :error-messages="errors"
          label="Confirme sua senha"
          type="password"
          required
        ></v-text-field>
      </validation-provider>


      <validation-provider
        v-slot="{ errors }"
        name="CEP"
        rules="required|max:9"
      >
        <v-text-field
          v-model="zipcode"
          :error-messages="errors"
          :counter="9"
          label="CEP"
          required
        ></v-text-field>
      </validation-provider>

      <validation-provider
        v-slot="{ errors }"
        name="Logradouro"
        rules="required"
      >
        <v-text-field
          v-model="public_area"
          :error-messages="errors"
          label="Logradouro"
          required
        ></v-text-field>
      </validation-provider>

      <validation-provider
        v-slot="{ errors }"
        name="Município"
        rules="required|max:30"
      >
        <v-text-field
          v-model="locality"
          :counter="30"
          :error-messages="errors"
          label="Município"
          required
        ></v-text-field>
      </validation-provider>

      <validation-provider
        v-slot="{ errors }"
        name="Bairro"
        rules="required"
      >
        <v-text-field
          v-model="neighborhood"
          :error-messages="errors"
          label="Bairro"
          required
        ></v-text-field>
      </validation-provider>

      <validation-provider
        v-slot="{ errors }"
        name="UF"
        rules="required|max:2"
      >
        <v-select
          v-model="uf"
          :items="brazilianUFs"
          :error-messages="errors"
          label="UF"
          data-vv-name="UF"
          required
        ></v-select>
      </validation-provider>

        <v-file-input
          v-model="avatar"
          :rules="fileRules"
          accept="image/png, image/jpeg, image/bmp"
          placeholder="Escolha um avatar"
          prepend-icon="mdi-camera"
          label="Avatar"
        ></v-file-input>

      <v-btn
        class="mr-4"
        type="submit"
      >
        <span v-if="!onRequest">Cadastrar</span>
        <v-progress-circular
          v-else
          indeterminate 
          :size="15"
        />
      </v-btn>
    </form>
    <ErrorSnackbar />
  </validation-observer>
</template>

<script>
  import { required, digits, email, min, max, confirmed } from 'vee-validate/dist/rules'
  import { extend, ValidationObserver, ValidationProvider, setInteractionMode } from 'vee-validate'

  import ErrorSnackbar from '@/components/ErrorSnackbar';
  import brazilianData from '@/assets/json/br-states-uf.json';
  import axios from 'axios';

  setInteractionMode('eager')

  extend('digits', {
    ...digits,
    message: '{_field_} precisa ter no mínimo {length} digits. ({_value_})',
  })

  extend('confirmed', {
    ...confirmed,
    message: '{_field_} precisa ser idêntico ao campo de confirmação de senha.',
  })

  extend('required', {
    ...required,
    message: '{_field_} não pode estar vazio.',
  })

  extend('max', {
    ...max,
    message: '{_field_} não pode ter mais de {length} caracteres.',
  })

  extend('min', {
    ...min,
    message: '{_field_} não pode ter menos de {length} caracteres',
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
      name: '',
      email: '',
      password: '',
      password_confirm: '',
      zipcode: '',
      public_area: '',
      locality: '',
      neighborhood: '',
      uf: null,
      avatar: null,
      brazilianUFs: [],
      fileRules: [
        value => !value || value.size < 2000000 || 'O tamanho da imagem tem que ser menor que 2 MB!',
      ],
      onRequest: false,
    }),

    created() {
      this.brazilianUFs = brazilianData.UF.map(item => {
        return item.sigla
      });
    },

    watch: {
      zipcode(newValue) {
          const cepMask = /([0-9]{4})-?([0-9]{4})/
          if (newValue && cepMask.test(newValue)) {
            const defaultRoute = "https://viacep.com.br/ws/{CEP}/json/";
            const endpoint = defaultRoute.replace('{CEP}', newValue);
            axios.get(endpoint.replace('-', ''))
                  .then(response => {
                    if (response.data) {
                      this.public_area = response.data?.logradouro
                      this.locality = response.data?.localidade
                      this.neighborhood = response.data?.bairro
                      this.uf = response.data?.uf
                    }
                });
          }
      }
    },
    methods: {
      submit () {
        this.onRequest = true;
        this.$refs.observer
        .validate()
        .then((isValid) =>{
          if (!isValid) {
            throw new Error('Por favor verifique os campos requeridos e tente novamente.');
          }

          const apiUrl = 'http://localhost:8000/api';
          const formData = new FormData();
          formData.append("name", this.name)
          formData.append("email", this.email)
          formData.append("password", this.password)
          formData.append("zipcode", this.zipcode)
          formData.append("public_area", this.public_area)
          formData.append("neighborhood", this.neighborhood)
          formData.append("locality", this.locality)
          formData.append("uf", this.uf)
  
          let headers = {};
          if (this.avatar) {
            formData.append("avatar", this.avatar)
            headers = { 'Content-Type': 'multipart/form-data' };
          }

          axios
            .post(`${apiUrl}/users`, formData, { headers })
            .then(response => {
              const { data } = response;
              if (data.error) {
                throw new Error(data.error)
              }

              localStorage.setItem('accessToken', data?.token)
              localStorage.setItem('userData', JSON.stringify(data?.user))

              this.$store.dispatch('SET_USER_DATA', data.user)
              this.$store.dispatch('SET_ACCESS_TOKEN', data.token)

              this.$router.push({name: 'home'})
            })
            .catch(error => {
              this.setError(error)
            })
            .finally(() => {
              this.onRequest = false;
            });
        })
        .catch(() => {
          this.onRequest = false;
        })
      },
      setError(error) {
        const defaultError = 'Ocorreu um erro inesperado, por favor tente novamente.';
        const errorMessage = error?.response?.data?.error || error?.message || defaultError
        this.$root.$emit('active-snackbar', errorMessage)
      }
    },
  }
</script>