<template>
  <div>
      <div v-if="showLogin">
        <LoginCard />
      </div>

      <div v-else>
          <RegisterCard v-on:registerSuccessfully="smallTextClick()" />
      </div>

      <h5 align="center" @click="smallTextClick()" style="cursor: pointer">{{ smallText }}</h5>
  </div>
</template>

<script>
import LoginCard from "../components/LoginCard.vue";
import RegisterCard from "../components/RegisterCard"

export default {
  name: "LoginRegister",
  components: {
    LoginCard,
    RegisterCard
  },
  data() {
    return {
        showLogin: true,
        smallText: "Create new account"
    }
  },
  methods: {
      smallTextClick: function() {
          if (this.showLogin) {
              this.showLogin = false
              this.smallText = "Login with existed account"
          }
          else {
              this.showLogin = true
              this.smallText = "Create new account"
          }
          
      }
  },
};
</script>

<style scoped>
</style>
