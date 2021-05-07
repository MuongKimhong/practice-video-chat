<template>
  <div>
    <v-container>
      <v-row>
        <v-col cols="12" class="col-lg-4 col-md-5 col-sm-6 ml-auto mr-auto mt-5">
          <v-card elevation="5" class="mt-5 px-5 py-5">
              <h3 align="center">Login with existed account</h3>
              <div v-if="error" class="red">
                  <h3 class="white--text py-2 my-4" align="center">Username or password is incorrect</h3>
              </div>
              <v-text-field label="Username" required v-model="username"></v-text-field>
              <v-text-field label="Password" type="password" required v-model="password"></v-text-field>
              <v-btn class="col-12 text-capitalize" color="primary" @click="login()">Login</v-btn>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
const axios = require('axios')
import url from '../base.js'
export default {
  name: "LoginCard",
  data() {
    return {
        username: null,
        password: null,
        error: false
    }
  },
  methods: {
      login: function() {
          axios.post(url + 'users/login', {
              username: this.username,
              password: this.password
          })
          .then((response) => {
              this.$store.commit('getUserInfo', response.data['credentials'])
              this.$router.push({ name: 'Home' })
          })
          .catch(() => {
              this.error = true
          })
      }
  },
};
</script>

<style scoped>
</style>