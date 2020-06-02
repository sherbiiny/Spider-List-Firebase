<template>
  <main class="Register">
    <v-card>
      <h1 class="indigo--text mb-10 display-1">Signup</h1>
      <v-form @submit.prevent="register">
        <v-text-field v-model="username"  label="Username"></v-text-field>
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
        <v-btn type="submit" class="indigo white--text px-7" :loading="loading">Register</v-btn>
      </v-form>
      <p class="grey--text mt-10 text-center">Have an account already ? <router-link :to='{name: "Login"}'>Login</router-link></p>
      <p class="pink--text text-center mt-10" v-if="feedback">{{ feedback }}</p>
    </v-card>
  </main>
</template>

<script>

import db from '@/Firebase'
import firebase from 'firebase/app'
import 'firebase/auth'
import slugify from 'slugify'

export default {
  data() {
    return {
      username: null,
      email: null,
      password: null,
      show1: false,
      feedback: null,
      slug: null,
      loading: false
    }
  },

  methods: {
    register() {
      this.loading = true
      if(this.username && this.email && this.password) {
        this.slug = slugify(this.username, {
          replacement: '-',
          remove: /[$*_+.()'"!-:@]/g,
          lower: true
        })

        firebase.auth().createUserWithEmailAndPassword(this.email, this.password)
          .then(cred => {
            let ref = db.collection('users').doc(cred.user.uid)
            ref.set({
              username: this.username,
              userID: cred.user.uid,
              watchlist: [],
              watched: [],
              favs: []
            })
          })
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


.Register {
  max-height: 100vh;
  max-width: 450px;
  margin: auto;

  .v-card {
    max-width: 500px;
    margin: 100px auto;
    padding: 80px 40px;

    .v-form {
      .v-text-field {
        margin: 30px auto;
      }
    }
  }
}
</style>