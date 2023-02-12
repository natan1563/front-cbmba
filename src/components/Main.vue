<template>
  <v-container>
    <v-row class="text-center">
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
        class="mx-auto mt-5"
      >
        <section v-if="currentTab === 1">
          <Register/>
        </section>
        <section 
          class="mt-4"
          v-else-if="currentTab === 0"
        >
          <Login/>
        </section>
      </v-col>

    </v-row>
  </v-container>
</template>

<script>
import Register from "./forms/auth/Register";
import Login from "./forms/auth/Login";

  export default {
    name: 'Main',
    props: {
      currentTab: {
        type: Number,
        default: 0
      },
    },
    components: {
      Register,
      Login,
    },
    data: () => ({
      ecosystem: [
        {
          text: 'vuetify-loader',
          href: 'https://github.com/vuetifyjs/vuetify-loader',
        },
        {
          text: 'github',
          href: 'https://github.com/vuetifyjs/vuetify',
        },
        {
          text: 'awesome-vuetify',
          href: 'https://github.com/vuetifyjs/awesome-vuetify',
        },
      ],
      importantLinks: [
        {
          text: 'Documentation',
          href: 'https://vuetifyjs.com',
        },
        {
          text: 'Chat',
          href: 'https://community.vuetifyjs.com',
        },
        {
          text: 'Made with Vuetify',
          href: 'https://madewithvuejs.com/vuetify',
        },
        {
          text: 'Twitter',
          href: 'https://twitter.com/vuetifyjs',
        },
        {
          text: 'Articles',
          href: 'https://medium.com/vuetify',
        },
      ],
      whatsNext: [
        {
          text: 'Explore components',
          href: 'https://vuetifyjs.com/components/api-explorer',
        },
        {
          text: 'Select a layout',
          href: 'https://vuetifyjs.com/getting-started/pre-made-layouts',
        },
        {
          text: 'Frequently Asked Questions',
          href: 'https://vuetifyjs.com/getting-started/frequently-asked-questions',
        },
      ],
    }),
  }
</script>
