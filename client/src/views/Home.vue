<template>
  <div>
    <v-container>
      <v-row>
        <v-col cols=12 class="col-lg-4 col-md-5 col-sm-6 ml-auto mr-auto mt-5">
          <v-card elevation="5" class="mt-5 px-5 py-5">
            <div v-if="error" class="red">
                <h3 class="white--text py-2 my-4" align="center">Room id doesn't exist</h3>
            </div>
            <v-text-field label="Enter room id" type="text" v-model="roomId" required>
            </v-text-field>
            <v-btn class="col-12 text-capitalize" color="primary" @click="joinRoom()">Join room</v-btn>
          </v-card>
          <div align="center" class="mt-3" style="cursor: pointer">
            <v-btn text class="text-capitalize" @click="createNewRoom()">Create new room</v-btn>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
const axios = require('axios')
import baseUrl from '../base.js'
export default {
  name: 'Home',
  data() {
    return {
      roomId: null,
      error: false
    }
  },
  methods: {
    createNewRoom: function () {
      axios.post(baseUrl + 'chatrooms/create-new-room', {
        ownerToken: this.$store.state.userInfo.token
      }) 
      .then((response) => {
        this.$router.push({ name: 'ChatRoom', params: {
          roomId: response.data['virtualId'],
          ownerToken: response.data['ownerToken']
        } }) 
      })
    },
    joinRoom: function () {
      if (this.roomId == null) return;

      axios.post(baseUrl + 'chatrooms/join-room', {
        virtualId: this.roomId
      })
      .then((response) => {
        if (response.data.message) {
          this.$router.push({ name: 'ChatRoom', params: { roomId: this.roomId, ownerToken: response.data['token'] }})
        }
      })
      .catch(() => { this.error = true })
    }
  }
}
</script>
