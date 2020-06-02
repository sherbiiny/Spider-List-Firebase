<template>
  <main class="Login">
    <v-card elevation="2">
      <h1 class="indigo--text mb-10 display-1">Login</h1>
      <v-form @submit.prevent="login">
        <v-text-field v-model="email"  label="Email"></v-text-field>
        <v-text-field
            v-model="password"
            :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
            :type="show1 ? 'text' : 'password'"
            name="input-10-1"
            label="Password"
            hint="At least 6 characters"
            @click:append="show1 = !show1"
        ></v-text-field>
        <v-btn type="submit" class="indigo white--text px-7" :loading="loading">Login</v-btn>
      </v-form>
      <p class="grey--text mt-10 text-center">Don't have an account ? <router-link :to='{name: "Register"}'>Signup</router-link></p>
      <p class="pink--text text-center mt-10" v-if="feedback">{{ feedback }}</p>
    </v-card>
  </main>
</template>

<script>

import db from '@/Firebase'
import firebase from 'firebase/app'
import 'firebase/auth'

export default {
  data() {
    return {
      email: null,
      password: null,
      show1: false,
      feedback: null,
      loading: false
    }
  },

  methods: {
    login() {
      this.loading = true
      if(this.email && this.password) {
        firebase.auth().signInWithEmailAndPassword(this.email, this.password)
          .then(() => this.$router.push({name: 'Home'}))
          .catch(err => {
            console.log(err)
            this.feedback = err.message
            this.loading = false
          })
      }

      else {
        this.feedback = 'You must enter all fields'
        this.loading = false
      }
    }
  },
}
</script>

<style lang="scss">
@import '../assets/sass/config';


.Login {
  max-height: 100vh;

  .v-card {
    max-width: 450px;
    margin: 100px auto;
    padding: 80px 40px;

    .v-form {
      .v-text-field {
        margin: 50px auto;
      }
    }
  }
}
</style>