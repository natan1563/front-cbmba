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
          max-width="500px"
        >
          <v-card>
            <v-card-title>
              <span class="text-h5">Editar usuário</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-row>
                  <v-col
                    cols="12"
                    sm="6"
                    md="4"
                  >
                    <v-text-field
                      v-model="editedItem.name"
                      label="Nome completo"
                    ></v-text-field>
                  </v-col>
                  <v-col
                    cols="12"
                    sm="6"
                    md="4"
                  >
                    <v-text-field
                      v-model="editedItem.email"
                      label="E-mail"
                    ></v-text-field>
                  </v-col>
                  <v-col
                    cols="12"
                    sm="6"
                    md="4"
                  >
                    <v-text-field
                      v-model="editedItem.address.public_area"
                      label="Endereço"
                    ></v-text-field>
                  </v-col>
                  <v-col
                    cols="12"
                    sm="6"
                    md="4"
                  >
                    <v-text-field
                      v-model="editedItem.neighborhood"
                      label="Bairro"
                    ></v-text-field>
                  </v-col>
                  <v-col
                    cols="12"
                    sm="6"
                    md="4"
                  >
                    <v-select
                      v-model="editedItem.uf"
                      label="UF"
                    ></v-select>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="blue darken-1"
                text
                @click="close"
              >
                Cancel
              </v-btn>
              <v-btn
                color="blue darken-1"
                text
                @click="save"
              >
                Save
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog v-model="dialogDelete" max-width="500px">
          <v-card>
            <v-card-title class="text-h5">Are you sure you want to delete this item?</v-card-title>
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
</v-container>
</template>

<script>
import axios from 'axios'
import LoggedMixin from '@/mixins/LoggedMixin';

export default {
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
        email: 0,
        address: 0,
        neighborhood: 0,
        uf: 0,
        created_at: 0,
      },
      defaultItem: {
        name: '',
        email: 0,
        address: 0,
        neighborhood: 0,
        uf: 0,
        created_at: 0,
      },
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
    },

    filters: {
      formatDate(value) {
        return new Date(value).toLocaleDateString('brazil');
      }
    },

    methods: {
      initialize () {
        const token = localStorage.getItem('accessToken');
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
        });
      },

      editItem (item) {
        this.editedIndex = this.desserts.indexOf(item)
        this.editedItem = Object.assign({}, item)
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
        if (this.editedIndex > -1) {
          Object.assign(this.desserts[this.editedIndex], this.editedItem)
        } else {
          this.desserts.push(this.editedItem)
        }
        this.close()
      },

      doLogout () {
        const token = localStorage.getItem('accessToken');
        axios.delete('http://localhost:8000/api/auth', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        .then(response => {
          if ('error' in response)
            throw new Error(response.error)
        })
        .catch(err => {
          console.log(err)
        })
        .finally(() => {
          this.logout();
        });
      },

      logout() {
        this.$router.push({name: 'auth-user'})
        localStorage.removeItem('accessToken')
        this.$store.dispatch('SET_ACCESS_TOKEN', null);
      }
    },
  }
</script>