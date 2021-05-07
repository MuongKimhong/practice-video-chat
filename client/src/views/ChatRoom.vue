<template>
  <div>
    <v-row>

      <v-col cols="12" class="col-lg-9 col-md-8 col-sm-12" id="video-grids">
        <v-row id="video-grids-row">
        </v-row>
      </v-col>

      <v-col cols="12" class="col-lg-3 col-md-4 col-sm-12 mt-4 px-5">
        <div>
          <v-row>
            <span class="mt-2 mr-2">{{ $route.params.roomId }}</span>
            <v-btn v-if="$store.state.userInfo.token != $route.params.ownerToken"
                @click="$router.push({ name: 'Home' })">
              Leave
            </v-btn>
            <v-btn v-else @click="endCall()" class="text-lowercase px-1 ml-2">End call</v-btn>
          </v-row>
        </div>

        <div class="mt-5">
          <div style="height: 90%">
            <div v-for="message in messages" :key="message._id" class="my-2">
              <h5 class="">{{ message.senderName }}</h5>
              <v-chip>{{ message.message }}</v-chip>
            </div>
          </div>
          
          <v-footer>
            <v-row>
              <v-text-field label="message" v-model="message"></v-text-field>
              <v-btn class="px-2 mt-3" @click="addMessage()">send</v-btn>
            </v-row>
          </v-footer>
          
        </div>
        
      </v-col>
    </v-row>
  </div>
</template>

<script>
import io from "socket.io-client";
import url from "../base.js"
const axios = require("axios")

export default {
  name: "ChatRoom",
  data() {
    return {
      localPeer: { peerObject: null, peerId: null },
      remotePeers: [],
      socketConnection: null,
      stream: null,

      messages: [],
      message: null
    };
  },
  created: function () {
    // check room id first before let user in
    axios.post(url + 'chatrooms/check-room', {
      virtualId: this.$route.params.roomId,
      ownerToken: this.$route.params.ownerToken
    })
    .then((response) => {
      if (response.data['success']) this.openNewPeerConnection()
      this.getChatRoomMessages()
    })
    .catch(() => { this.$router.push({ name: 'Home' })})
  },
  beforeRouteLeave: function (to, from, next) {
    if (this.stream != null) {
      this.stream.getTracks().forEach(function(track) {
        if (track.readyState == 'live') {
            track.stop();
        }
      })
    }
    this.socketConnection.emit('disconnect-from-room')
    next()
  },
  methods: {
    openNewPeerConnection: function () {
      var self = this;
      this.localPeer["peerObject"] = new Peer();

      this.localPeer["peerObject"].on("open", function (peerId) {
        self.localPeer["peerId"] = peerId;
      });
    
      setTimeout(() => this.connectToSocketServer(), 2000);
    },

    connectToSocketServer: function () {
      var self = this
      const socket = io("http://localhost:3000");
      this.socketConnection = socket
      socket.emit("join-room", self.$route.params.roomId, self.localPeer["peerId"])

      socket.on('end-call-connection', function (value) {
        if (value) self.$router.push({ name: 'Home' })
      })

      socket.on('response-new-message', function (data) {
        self.messages.push(data)
      })

      navigator.mediaDevices.getUserMedia({ video: true, audio: false })
      .then((videoStream) => {
        this.stream = videoStream
        var video = document.createElement("video")
        const divElement = document.createElement('div')
        self.addVideoStreamToDOM(video, divElement, videoStream)
        
        // listening to call event from caller
        self.localPeer['peerObject'].on('call', function (callConnection) {
          callConnection.answer(videoStream)

          const video = document.createElement('video')
          const divElement = document.createElement('div')

          callConnection.on('stream', function (stream) {
            self.addVideoStreamToDOM(video, divElement, stream)            
          })
        })

        // listening to user-connected event from socket server
        socket.on('user-connected', function (userPeerId) {
          self.connectToNewUser(userPeerId, videoStream)
        })
      })

      socket.on('user-disconnected', function (id) {
        if (self.remotePeers[id]) self.remotePeers[id].close()
      })
    },

    // call to user that joined room with peer connection
    connectToNewUser: function (userPeerId, videoStream) {
      var self = this
      const callConnection = self.localPeer['peerObject'].call(userPeerId, videoStream)
      const video = document.createElement('video')
      const divElement = document.createElement('div')
      // get answerer video stream back
      callConnection.on('stream', function (stream) {
        self.addVideoStreamToDOM(video, divElement, stream)
      })

      // listening to close event from answerer
      callConnection.on('close', () => {
         video.remove() 
         divElement.remove()
      })

      self.remotePeers[userPeerId] = callConnection

    },

    // when user enter room, get user video stream and add it to DOM
    addVideoStreamToDOM: function (videoDOMElement, divElement, videoStream) {
      videoDOMElement.srcObject = videoStream
      videoDOMElement.muted = true
      videoDOMElement.style.width = "100%"      
      videoDOMElement.style.height = "200px"
      videoDOMElement.addEventListener('loadedmetadata', () => { videoDOMElement.play() })

      divElement.className = "col-12 col-lg-3 col-md-4 col-sm-6 mx-0 px-0"
      divElement.append(videoDOMElement)

      setTimeout(() => {
        document.getElementById('video-grids-row').append(divElement)
      }, 1200)
    },

    endCall: function () {
      this.socketConnection.emit('end-call')

      axios.post(url + 'chatrooms/delete-room', {
        virtualId: this.$route.params.roomId
      })
      .then(() => { this.$router.push({ name: 'Home' })})
    },

    getChatRoomMessages: function () {
      axios.get(url + 'chatrooms/get-chatroom-messages', {
        params: {
          roomVirtualId: this.$route.params.roomId
        }
      })
      .then((response) => {
        this.messages = response.data['messages']
      })
    },

    addMessage: function () {
      axios.post(url + 'chatrooms/add-new-message', {
        roomVirtualId: this.$route.params.roomId,
        senderToken: this.$store.state.userInfo.token,
        senderName: this.$store.state.userInfo.username,
        message: this.message
      })
      .then((response) => {
        this.message = null
        this.socketConnection.emit('new-message', response.data['message'])
      })
    }
  },
};
</script>

<style scoped>
</style>