<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <div class="d-flex align-center" @click="$router.push({ name: 'Home' })">
        <v-img
          alt="Vuetify Logo"
          class="shrink mr-2"
          contain
          src="https://cdn.vuetifyjs.com/images/logos/vuetify-logo-dark.png"
          transition="scale-transition"
          width="40"
        />

        <v-img
          alt="Vuetify Name"
          class="shrink mt-1 hidden-sm-and-down"
          contain
          min-width="100"
          src="https://cdn.vuetifyjs.com/images/logos/vuetify-name-dark.png"
          width="100"
        />
      </div>

      <v-spacer></v-spacer>

      <v-btn
        text
        v-if="$store.state.userInfo != null"
      >
        <span class="mr-2">{{ $store.state.userInfo.username }}</span>
      </v-btn>
      <v-btn text v-if="$store.state.userInfo != null" @click="logout()">
        <span>Logout</span>
      </v-btn>
    </v-app-bar>

    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: "App",

  data: () => ({
    //
  }),
  methods: {
    logout: function() {
      this.$store.commit("deleteUserInfo");
      this.$router.push({ name: 'LoginRegister' })
    }
  }
};
</script>
