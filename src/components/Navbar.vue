<template>
  <header>
    <v-app-bar color="indigo" app class="Navbar white--text" height="65px" elevation="2">
      <v-app-bar-nav-icon @click="drawer = !drawer" class="ml-10 drawer-trigger" color="white"></v-app-bar-nav-icon>
      <v-toolbar-title class="brand">Spider List</v-toolbar-title>
      <v-spacer></v-spacer>
      <ul class="links">
        <v-list-item route to='/'>
          <v-icon small>fa fa-home</v-icon>
          Home
        </v-list-item>
        <v-list-item v-if="username" router to='/list'>
          <v-icon small>fa fa-bars</v-icon>
          {{ username }}'s List
        </v-list-item>
        <v-list-item v-if="!username" router to='/list'>
          <v-icon small>fa fa-bars</v-icon>
          My List
        </v-list-item>

        <v-list-item @click="signout">
          Signout
          <v-icon small class="ml-3 white--text">fa fa-sign-out</v-icon>
        </v-list-item>
      </ul>
    </v-app-bar>

    <v-navigation-drawer class="drawer v-navigation-drawer--fixed" width="300px" v-model="drawer">
      <v-icon @click="drawer = false">mdi-close</v-icon>
      <v-list>
        <v-list-item color="indigo" class="mt-10" router :to="{name: 'Home'}">
          <v-icon class="mr-3">fa fa-home</v-icon>
          Home
        </v-list-item>
        <v-list-item color="indigo" class="mt-3" router :to="{name: 'List'}">
          <v-icon class="mr-3">fa fa-list</v-icon>
          {{ username }}'s List
        </v-list-item>
        <v-list-item color="indigo" class="mt-3" @click="signout">
          <v-icon class="mr-3">fa fa-sign-out</v-icon>
          Signout
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <p class="made text-center">
      Completly made by <a href="https://twitter.com/MhmdZayat" target="_blank">Zayat</a>
    </p>
  </header>
</template>

<script>

import firebase from 'firebase/app'
import 'firebase/auth'
import db from '@/Firebase'

export default {

  data() {
    return {
      username: null,
      drawer: false
    }
  },

  mounted() {
    let id = firebase.auth().currentUser.uid
    db.collection('users').doc(id).get()
      .then(doc => {
        if(doc.data().username.length <= 5) this.username = doc.data().username
        else this.username = null
      })
  },

  methods: {
    signout() {
      firebase.auth().signOut()
        .then(() => this.$router.push({name: 'Login'}))
    }
  },
}
</script>

<style lang="scss">
@import '../assets/sass/config';

.made {
  position: absolute;
  color: #c1bbbb;
  bottom: 10px;
  width: 100%;
  left: 50%;
  transform: translateX(-50%);

  a {
    color: dodgerblue !important;
  }
}

.v-app-bar.v-app-bar--fixed {
  z-index: 51 !important;
}


@include mq(0px) {
  .Navbar {
    user-select: none;
  
    .links {
      margin-right: 100px;
      display: none !important;
  
      a {
        margin: 0 20px;
        color: #FFF !important;
        flex: none !important; 
  
        i {
          color: #FFF;
          position: relative;
          top: -1px;
          margin-right: 5px;
        }
      }
    }
  }

  .drawer {
    padding: 15px 10px;

    .mdi-close {
      position: absolute;
      right: 20px;
      top: 20px;
      color: #999;
      transition: .2s;

      &:hover {
        color: $secondary;
      }
    }
  }
}

@include mq($sm) {


}

@include mq($md) {

  .Navbar {
    .brand {
      font-size: 1.5rem;
      margin-left: 100px;
    }

    .links {
      display: flex !important;
    }

    .drawer-trigger {
      display: none !important;
    }
  }

}

@include mq($lg) {

  .Navbar {
    .brand {
      font-size: 1.8rem;
      margin-left: 100px;
    }
  }

}
</style>