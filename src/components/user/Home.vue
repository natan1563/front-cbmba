<!-- eslint-disable vue/valid-v-slot -->
<template>
<v-container>
  <v-app-bar
    color="dark"
    dark
    class="mt-10"
  >
      <b class="title-text">Painel de usuários</b>    
      <v-spacer></v-spacer>    
      <v-btn 
        color="error"
        @click="doLogout"
      >
        Sair
      </v-btn>
  </v-app-bar>
  
  <v-data-table
    :headers="headers"
    :items="desserts"
    sort-by="created_at"
    class="elevation-1 mt-5"
    :items-per-page="5"
    :footer-props="{
      'items-per-page-text':'Usuários por página',
      pageText: '{0}-{1} de {2}'
    }"
  >
    <!-- Modals -->
    <template v-slot:top>
        <v-dialog
          v-model="dialog"
          max-width="800px"
          max-height="600px"
        >
          <validation-observer
            ref="observer"
          >
            <form @submit.prevent="save">
              <v-card>
                <v-card-title>
                  <div class="px-2">
                    <v-avatar
                      v-if="editedItem.avatar"
                      size="48"
                    >
                      <v-img
                        :lazy-src="`http://localhost:8000/api/avatar/${editedItem.avatar}`"
                        :src="`http://localhost:8000/api/avatar/${editedItem.avatar}`"
                      />
                    </v-avatar>

                  </div>
                  <span class="text-h5">{{ editedItem.name }}</span>
                </v-card-title>

                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col
                        cols="12"
                        sm="6"
                        md="4"
                      >
                        <validation-provider
                          v-slot="{ errors }"
                          name="Name"
                          rules="required|max:30"
                        >
                          <v-text-field
                            v-model="editedItem.name"
                            :counter="30"
                            label="Nome completo"
                            :error-messages="errors"
                            required
                          ></v-text-field>
                        </validation-provider>
                      </v-col>
                      <v-col
                        cols="12"
                        sm="6"
                        md="4"
                      >
                        <validation-provider
                          v-slot="{ errors }"
                          name="E-mail"
                          rules="required|email"
                        >
                          <v-text-field
                            v-model="editedItem.email"
                            :error-messages="errors"
                            label="E-mail"
                            required
                          ></v-text-field>
                        </validation-provider>
                      </v-col>

                      <v-col
                        cols="12"
                        sm="6"
                        md="4"
                      >
                        <validation-provider
                          v-slot="{ errors }"
                          name="CEP"
                          rules="required|max:9"
                        >
                          <v-text-field
                            v-model="editedItem.address.zipcode"
                            :error-messages="errors"
                            :counter="9"
                            label="CEP"
                            required
                          ></v-text-field>
                        </validation-provider>
                      </v-col>

                      <v-col
                        cols="12"
                        sm="6"
                        md="4"
                      >
                        <validation-provider
                          v-slot="{ errors }"
                          name="Logradouro"
                          rules="required"
                        >
                          <v-text-field
                            v-model="editedItem.address.public_area"
                            :error-messages="errors"
                            label="Logradouro"
                            required
                          ></v-text-field>
                        </validation-provider>
                      </v-col>

                      <v-col
                        cols="12"
                        sm="6"
                        md="4"
                      >
                        <validation-provider
                          v-slot="{ errors }"
                          name="Município"
                          rules="required|max:30"
                        >
                          <v-text-field
                            v-model="editedItem.address.locality"
                            :counter="30"
                            :error-messages="errors"
                            label="Município"
                            required
                          ></v-text-field>
                        </validation-provider>

                      </v-col>

                      <v-col
                        cols="12"
                        sm="6"
                        md="4"
                      >
                        <validation-provider
                          v-slot="{ errors }"
                          name="Bairro"
                          rules="required"
                        >
                          <v-text-field
                            v-model="editedItem.address.neighborhood"
                            :error-messages="errors"
                            label="Bairro"
                            required
                          ></v-text-field>
                        </validation-provider>
                      </v-col>

                      <v-col
                        cols="12"
                        sm="6"
                        md="4"
                      >
                        <validation-provider
                          v-slot="{ errors }"
                          name="UF"
                          rules="required|max:2"
                        >
                          <v-select
                            v-model="editedItem.address.uf"
                            :items="brazilianUFs"
                            :error-messages="errors"
                            label="UF"
                            data-vv-name="UF"
                            required
                          ></v-select>
                        </validation-provider>
                      </v-col>
                      
                      <v-col
                        cols="12"
                        sm="6"
                        md="4"
                      >
                        <v-file-input
                          v-model="editedItem.newAvatar"
                          :rules="fileRules"
                          accept="image/png, image/jpeg, image/bmp"
                          placeholder="Escolha um avatar"
                          prepend-icon="mdi-camera"
                          label="Avatar"
                        ></v-file-input>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card-text>

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn
                    color="blue darken-1"
                    text
                    @click.prevent="close"
                  >
                    Cancelar
                  </v-btn>
                  <v-btn
                    color="blue darken-1"
                    text
                    type="submit"
                  >
                    Atualizar
                  </v-btn>
                </v-card-actions>
              </v-card>
            </form>
          </validation-observer>
        </v-dialog>
        <v-dialog v-model="dialogDelete" max-width="500px">
          <v-card>
            <v-card-title class="text-h5">Tem certeza que deseja excluir esse usuário?</v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="closeDelete">Cancel</v-btn>
              <v-btn color="blue darken-1" text @click="deleteItemConfirm">OK</v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
    </template>

    <template v-slot:item.created_at="{ item }">
      <span>{{ item.created_at | formatDate }}</span>
    </template>

    <!-- eslint-disable-next-line vue/valid-v-slot -->
    <template v-slot:item.actions="{ item }">
      <v-icon
        small
        class="mr-2"
        @click="editItem(item)"
      >
        mdi-pencil
      </v-icon>
      <v-icon
        small
        @click="deleteItem(item)"
      >
        mdi-delete
      </v-icon>
    </template>
    <template v-slot:no-data>
     <v-progress-circular indeterminate></v-progress-circular>
    </template>
  </v-data-table>
  <ErrorSnackbar />
</v-container>
</template>

<script>
import axios from 'axios'
import LoggedMixin from '@/mixins/LoggedMixin';
import brazilianData from '@/assets/json/br-states-uf.json';

import { required, digits, email, min, max, confirmed } from 'vee-validate/dist/rules'
import { extend, ValidationObserver, ValidationProvider, setInteractionMode } from 'vee-validate'
import ErrorSnackbar from '../ErrorSnackbar';

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
    ValidationObserver,
    ValidationProvider,
    ErrorSnackbar
  },
    mixins: [LoggedMixin],
    data: () => ({
      dialog: false,
      dialogDelete: false,
      headers: [
        {
          text: 'Nome',
          align: 'center',
          sortable: false,
          value: 'name',
        },
        { 
          text: 'E-mail',
          align: 'center',
          value: 'email'
        },
        { 
          text: 'Endereço',
          align: 'center',
          value: 'address.public_area' 
        },
        { 
          text: 'Bairro', 
          align: 'center',
          value: 'address.neighborhood' 
        },
        {
          text: 'UF',
          align: 'center',
          value: 'address.uf' 
        },
        { 
          text: 'Data de criação',
          align: 'center',
          value: 'created_at' 
        },
        { 
          text: 'Ações',
          value: 'actions', 
          sortable: false 
        },
      ],
      desserts: [],
      editedIndex: -1,
      editedItem: {
        name: '',
        email: '',
        address: [],
        avatar: '',
        neighborhood: '',
        locality: '',
        uf: 0,
        created_at: 0,
        newAvatar: ''
      },
      defaultItem: {
        name: '',
        email: 0,
        address: 0,
        neighborhood: 0,
        uf: 0,
        created_at: 0,
      },
      brazilianUFs: [],
      fileRules: [
        value => !value || value.size < 2000000 || 'O tamanho da imagem tem que ser menor que 2 MB!',
      ],
    }),

    watch: {
      dialog (val) {
        val || this.close()
      },
      dialogDelete (val) {
        val || this.closeDelete()
      },
    },

    async created () {
      await this.isLogged()
      this.initialize()
       this.brazilianUFs = brazilianData.UF.map(item => {
        return item.sigla
      });
    },

    filters: {
      formatDate(value) {
        return new Date(value).toLocaleDateString('brazil');
      }
    },

    methods: {
      initialize () {
        const token = this.$store.getters.getUserToken || localStorage.getItem('accessToken');
        axios.get('http://localhost:8000/api/users', {
          headers: {
            Authorization: `Bearer ${token.trim()}`
          }
        })
        .then(response => {
          if ('error' in response.data) {
            throw new Error('Falha ao carregar os dados de usuários')
          }
          const users = response.data.data
          this.desserts = users;
        })
        .catch(error => {
          this.$root.$emit('active-snackbar', error.message)
        });
      },

      editItem (item) {
        this.editedIndex = this.desserts.indexOf(item)
        this.editedItem = Object.assign({newAvatar: null}, item)
        this.dialog = true
      },

      deleteItem (item) {
        this.editedIndex = this.desserts.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialogDelete = true
      },

      deleteItemConfirm () {
        this.desserts.splice(this.editedIndex, 1)
        this.closeDelete()
      },

      close () {
        this.dialog = false
        this.$nextTick(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        })
      },

      closeDelete () {
        this.dialogDelete = false
        this.$nextTick(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        })
      },

      save () {
        this.$refs.observer
        .validate()
        .then((isValid) => {
          if (!isValid) {
            throw new Error('Por favor verifique os campos requeridos e tente novamente.');
          }

          const formData = new FormData();
          formData.append("name", this.editedItem.name)
          formData.append("email", this.editedItem.email)
          formData.append("zipcode", this.editedItem.address.zipcode)
          formData.append("public_area", this.editedItem.address.public_area)
          formData.append("neighborhood", this.editedItem.address.neighborhood)
          formData.append("locality", this.editedItem.address.locality)
          formData.append("uf", this.editedItem.address.uf)

          const token = this.$store.getters.getUserToken || localStorage.getItem('accessToken');
          let headers = {
            'Authorization': `Bearer ${token}`
          };

          if (this.editedItem.newAvatar) {

            formData.append("avatar", this.editedItem.newAvatar)
            headers = Object.assign(headers, {
              'Content-Type': 'multipart/form-data',
            });

            console.log(headers);
          }
          
          axios
            .post(`http://localhost:8000/api/users/${this.editedItem.id}?_method=PUT`, formData, { headers })
            .then(response => {
              if ('error' in response)
                throw new Error(response.message)
              
              this.initialize()
              this.close()
            });
        })
        .catch(error => {
          this.$root.$emit('active-snackbar', error.message)
        })
      },

      doLogout () {
        const token = this.$store.getters.getUserToken || localStorage.getItem('accessToken');
        axios.delete('http://localhost:8000/api/auth', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        .then(response => {
          if ('error' in response)
            throw new Error(response.error)
        })
        .catch(error => {
          this.$root.$emit('active-snackbar', error.message)
        })
        .finally(() => {
          this.logout();
        });
      },

      logout() {
        this.$router.push({name: 'auth-user'})
        
        localStorage.removeItem('accessToken')
        localStorage.removeItem('userData')

        this.$store.dispatch('SET_ACCESS_TOKEN', null);
        this.$store.dispatch('SET_USER_DATA', null)

      },
    },
  }
</script>