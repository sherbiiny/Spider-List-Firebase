<template>
  <main class="List">
    <div v-if="loader" class="loader">
      <div class="ball"></div>
      <div class="ball"></div>
      <div class="ball"></div>
      <div class="ball"></div>
    </div>
    <Navbar />
    <v-tabs v-if="mobile" v-model="tab" color="indigo" vertical>
      <v-tab><v-icon small class="pink--text mr-5">fa fa-heart</v-icon> Favourites</v-tab>
      <v-tab><v-icon small class="mr-5">fa fa-list</v-icon> Watchlist</v-tab>
      <v-tab><v-icon small class="mr-5">fa fa-check</v-icon> Watched</v-tab>
    </v-tabs>

    <v-tabs v-if="!mobile" v-model="tab" color="indigo" centered>
      <v-tab><v-icon small class="pink--text mr-5">fa fa-heart</v-icon> Favourites</v-tab>
      <v-tab><v-icon small class="mr-5">fa fa-list</v-icon> Watchlist</v-tab>
      <v-tab><v-icon small class="mr-5">fa fa-check</v-icon> Watched</v-tab>
    </v-tabs>

    <v-tabs-items v-model="tab">

      <v-tab-item class="movies-container">
        <v-row>
          <p v-if="favs.length == 0">You havn't added any movies to your Favourites list yet!</p>
          <v-col md="6" lg="4" v-for="movie in favs" :key="movie.imdbID" class="col-12">
            <v-card class="movie">
              <img :src="movie.Poster" :alt="movie.Title">
              <div class="overlay">
                <v-menu>
                  <template v-slot:activator="{ on }">
                    <v-icon v-on='on'>fa fa-ellipsis-v</v-icon>
                  </template>
                  <v-list class="mylist white">
                    <v-list-item @click="watchlistIds.includes(movie.imdbID) ? watchlistMethod(movie, 'remove') : watchlistMethod(movie, 'add')">
                      <v-icon color="pink" class="mr-3" small>fa fa-list</v-icon>
                      {{watchlistIds.includes(movie.imdbID) ? 'Remove from' : 'Add to'}} Watchlist
                    </v-list-item>
                    <v-list-item @click="watchedIds.includes(movie.imdbID) ? watchedMethod(movie, 'remove') : watchedMethod(movie, 'add')">
                      <v-icon color="pink" class="mr-3" small>fa fa-check</v-icon>
                      {{watchedIds.includes(movie.imdbID) ? 'Remove from' : 'Add to'}} Watched
                    </v-list-item>
                    
                  </v-list>
                </v-menu>

                <v-icon v-if="!favsIds.includes(movie.imdbID)" large color="pink" :class="movie.imdbID" class="heart" @click="favouriteMethod(movie, 'add')">fa fa-heart-o</v-icon>
                <v-icon v-if="favsIds.includes(movie.imdbID)" large color="pink" :class="movie.imdbID" class="heart" @click="favouriteMethod(movie, 'remove')">fa fa-heart</v-icon>
                <v-btn class="indigo white--text movie-btn" router :to="{name: 'Movie', params: {movie_id: movie.imdbID}}">View More</v-btn>
              </div>
              <div class="content text-center">
                <router-link :to="{name: 'Movie', params: {movie_id: movie.imdbID}}">{{ movie.Title }}</router-link>
                <h4>{{ movie.Year }}</h4>
              </div>
            </v-card>
          </v-col>
        </v-row>
      </v-tab-item>

      <v-tab-item class="movies-container">
        <v-row>
          <p v-if="watchlist.length == 0">You havn't added any movies to your watchlist yet!</p>
          <v-col md="6" lg="4" v-for="movie in watchlist" :key="movie.imdbID" class="col-12">
            <v-card class="movie">
              <img :src="movie.Poster" :alt="movie.Title">
              <div class="overlay">
                <v-menu>
                  <template v-slot:activator="{ on }">
                    <v-icon v-on='on'>fa fa-ellipsis-v</v-icon>
                  </template>
                  <v-list class="mylist white">
                    <v-list-item @click="watchlistIds.includes(movie.imdbID) ? watchlistMethod(movie, 'remove') : watchlistMethod(movie, 'add')">
                      <v-icon color="pink" class="mr-3" small>fa fa-list</v-icon>
                      {{watchlistIds.includes(movie.imdbID) ? 'Remove from' : 'Add to'}} Watchlist
                    </v-list-item>
                    <v-list-item @click="watchedIds.includes(movie.imdbID) ? watchedMethod(movie, 'remove') : watchedMethod(movie, 'add')">
                      <v-icon color="pink" class="mr-3" small>fa fa-check</v-icon>
                      {{watchedIds.includes(movie.imdbID) ? 'Remove from' : 'Add to'}} Watched
                    </v-list-item>
                    
                  </v-list>
                </v-menu>

                <v-icon v-if="!favsIds.includes(movie.imdbID)" large color="pink" :class="movie.imdbID" class="heart" @click="favouriteMethod(movie, 'add')">fa fa-heart-o</v-icon>
                <v-icon v-if="favsIds.includes(movie.imdbID)" large color="pink" :class="movie.imdbID" class="heart" @click="favouriteMethod(movie, 'remove')">fa fa-heart</v-icon>
                <v-btn class="indigo white--text movie-btn" router :to="{name: 'Movie', params: {movie_id: movie.imdbID}}">View More</v-btn>
              </div>
              <div class="content text-center">
                <router-link :to="{name: 'Movie', params: {movie_id: movie.imdbID}}">{{ movie.Title }}</router-link>
                <h4>{{ movie.Year }}</h4>
              </div>
            </v-card>
          </v-col>
        </v-row>        
      </v-tab-item>

      <v-tab-item class="movies-container">
        <v-row>
          <p v-if="watched.length == 0">You havn't added any movies to your watched list yet!</p>
          <v-col md="6" lg="4" v-for="movie in watched" :key="movie.imdbID" class="col-12">
            <v-card class="movie">
              <img :src="movie.Poster" :alt="movie.Title">
              <div class="overlay">
                <v-menu>
                  <template v-slot:activator="{ on }">
                    <v-icon v-on='on'>fa fa-ellipsis-v</v-icon>
                  </template>
                  <v-list class="mylist white">
                    <v-list-item @click="watchlistIds.includes(movie.imdbID) ? watchlistMethod(movie, 'remove') : watchlistMethod(movie, 'add')">
                      <v-icon color="pink" class="mr-3" small>fa fa-list</v-icon>
                      {{watchlistIds.includes(movie.imdbID) ? 'Remove from' : 'Add to'}} Watchlist
                    </v-list-item>
                    <v-list-item @click="watchedIds.includes(movie.imdbID) ? watchedMethod(movie, 'remove') : watchedMethod(movie, 'add')">
                      <v-icon color="pink" class="mr-3" small>fa fa-check</v-icon>
                      {{watchedIds.includes(movie.imdbID) ? 'Remove from' : 'Add to'}} Watched
                    </v-list-item>
                    
                  </v-list>
                </v-menu>

                <v-icon v-if="!favsIds.includes(movie.imdbID)" large color="pink" :class="movie.imdbID" class="heart" @click="favouriteMethod(movie, 'add')">fa fa-heart-o</v-icon>
                <v-icon v-if="favsIds.includes(movie.imdbID)" large color="pink" :class="movie.imdbID" class="heart" @click="favouriteMethod(movie, 'remove')">fa fa-heart</v-icon>
                <v-btn class="indigo white--text movie-btn" router :to="{name: 'Movie', params: {movie_id: movie.imdbID}}">View More</v-btn>
              </div>
              <div class="content text-center">
                <router-link :to="{name: 'Movie', params: {movie_id: movie.imdbID}}">{{ movie.Title }}</router-link>
                <h4>{{ movie.Year }}</h4>
              </div>
            </v-card>
          </v-col>
        </v-row>
      </v-tab-item>

    </v-tabs-items>
    <v-snackbar v-model="snackbar" :timeout='3000'>
      {{ snackContent }}
      <v-icon @click="snackbar = false" class="pink--text ml-3" small>fa fa-close</v-icon>
    </v-snackbar>
  </main>
</template>

<script>

import firebase from 'firebase/app'
import 'firebase/auth'
import db from '@/Firebase'
import axios from 'axios'
import $ from 'jquery'
import 'jquery.nicescroll'
import Navbar from '@/components/Navbar'


export default {
  components: {
    Navbar
  },

  data() {
    return {
      tab: null,
      watchlistIds: [],
      watchedIds: [],
      favsIds: [],
      watchlist: [],
      watched: [],
      favs: [],
      id: null,
      snackbar: false,
      snackContent: '',
      mobile: false,
      loader: true
    }
  },

  methods: {
    watchlistMethod(movie, status) {

      if(status == 'add') {
  
        db.collection('users').doc(this.id).get()
          .then(doc => {
            this.watchlistIds = doc.data().watchlist
            this.watchlistIds.push(movie.imdbID)
            this.watchlistIds = new Set(this.watchlistIds)
            this.watchlistIds = Array.from(this.watchlistIds)
            db.collection('users').doc(this.id).update({
              watchlist: this.watchlistIds
            })
          })

          this.snackContent = `${movie.Title} has been added to your watchlist`
          this.snackbar = true

      } else {
        const index = this.watchlistIds.indexOf(movie.imdbID);
        this.watchlistIds.splice(index, 1);
        db.collection('users').doc(this.id).update({
          watchlist: this.watchlistIds
        })

        this.snackContent = `${movie.Title} has been removed from your watchlist`
        this.snackbar = true
      }

    },

    watchedMethod(movie, status) {

      if(status == 'add') {

        db.collection('users').doc(this.id).get()
          .then(doc => {
            this.watchedIds = doc.data().watched
            this.watchedIds.push(movie.imdbID)
            this.watchedIds = new Set(this.watchedIds)
            this.watchedIds = Array.from(this.watchedIds)
            db.collection('users').doc(this.id).update({
              watched: this.watchedIds
            })
          })

          this.snackContent = `${movie.Title} has been added to your Watched list`
          this.snackbar = true

      } else {
        const index = this.watchedIds.indexOf(movie.imdbID);
        this.watchedIds.splice(index, 1);
        db.collection('users').doc(this.id).update({
          watched: this.watchedIds
        })

        this.snackContent = `${movie.Title} has been removed from your Watched list`
        this.snackbar = true
      }

    },

    favouriteMethod(movie, status) {

      if(status == 'add') {

        db.collection('users').doc(this.id).get()
          .then(doc => {
            this.favsIds = doc.data().favs
            this.favsIds.push(movie.imdbID)
            this.favsIds = new Set(this.favsIds)
            this.favsIds = Array.from(this.favsIds)
            db.collection('users').doc(this.id).update({
              favs: this.favsIds
            })
          })

          this.snackContent = `${movie.Title} has been added to your Favourites`
          this.snackbar = true

      } else {
        const index = this.favsIds.indexOf(movie.imdbID);
        this.favsIds.splice(index, 1);
        db.collection('users').doc(this.id).update({
          favs: this.favsIds
        })

        this.snackContent = `${movie.Title} has been removed from your Favourites`
        this.snackbar = true
      }

    },
  },

  mounted() {

    if($('body').innerWidth() < 600) this.mobile = true
    else this.mobile = false

    $('.v-tabs').removeClass('theme--light')

    onresize = () => {
      if($('body').innerWidth() < 600) this.mobile = true
      else this.mobile = false
      $('.v-tabs').removeClass('theme--light')
    }

    this.id = firebase.auth().currentUser.uid

    db.collection('users').doc(this.id).get()
      .then(doc => {
        this.watchedIds = doc.data().watched
        this.watchlistIds = doc.data().watchlist
        this.favsIds = doc.data().favs
        
        this.watchlist = []
        this.watchlistIds.forEach(id => {
          axios.get(`https://www.omdbapi.com?apikey=8899117d&i=${id}`)
            .then(response => this.watchlist.push(response.data))
        })
        
        this.watched = []
        this.watchedIds.forEach(id => {
          axios.get(`https://www.omdbapi.com?apikey=8899117d&i=${id}`)
            .then(response => this.watched.push(response.data))
        })

        this.favs = []
        this.favsIds.forEach(id => {
          axios.get(`https://www.omdbapi.com?apikey=8899117d&i=${id}`)
            .then(response => this.favs.push(response.data))
        })

        console.log(this.favs, this.watchlist, this.watched)

        setTimeout(() => this.loader = false, 2000)
      })
  }
}
</script>

<style lang="scss">
@import '../assets/sass/config';

.List {
  margin-top: 100px;
  overflow-x: hidden;

  .loader {
    position: fixed;
    width: 100%;
    height: 100vh;
    background: #FAFAFA;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 50;
    top: 0;


    .ball {
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: crimson;
      margin: 0 3px;
      position: relative;
      animation: loader .8s linear infinite;

      &:nth-child(1) {
        animation-delay: .2s;
      }

      &:nth-child(2) {
        animation-delay: .4s;
      }

      &:nth-child(3) {
        animation-delay: .6s;
      }

      &:nth-child(4) {
        animation-delay: .8s;
      }
    }
  }

  p {
    font-size: 1rem;
    color: #4448;
    text-align: center;
    margin: 50px auto;
  }

  .movies-container {
    padding: 100px;
    padding-top: 50px;
  }

  .movie {
    margin: 50px auto;
    height: 400px;
    margin-bottom: 100px;
    max-width: 280px;

    &:hover {
      .overlay {
        display: block;
        opacity: 1;

        .heart, .movie-btn, .fa-ellipsis-v {
          visibility: visible
        }
      }
    }

    img {
      width: 100%;
      height: 100%;
    }

    .overlay {
      @include overlay;
      background: rgba($color: #000000, $alpha: .7);
      opacity: 0;
      transition: .3s;

      .fa-ellipsis-v {
        color: #FFF !important;
        cursor: pointer;
        position: absolute;
        right: 30px;
        top: 30px;
        visibility: hidden;
      }

      .heart {
        position: absolute;
        top: 40%;
        left: 50%;
        transform: translate(-50%, -50%);
        cursor: pointer;
        transition: .3s;
        visibility: hidden;

        &:active {
          transform: scale(.93) translate(-50%, -50%)
        }
      }

      .movie-btn {
        position: absolute;
        top: 65%;
        left: 50%;
        transform: translate(-50%, -50%);
        cursor: pointer;
        visibility: hidden;
      }
    }

    .content {
      a {
        font-size: 1.2em;
        color: #333;
        font-weight: 500;
        cursor: pointer;
      }

      h4 {
        color: #888;
      }
    }
  }
}

.theme--light.v-tabs > .v-tabs-bar .v-tab:not(.v-tab--active) {
  color: $primary !important;

  i {
    color: $primary !important;

    &.fa-heart {
      color: $secondary !important;
    }
  }
}

@media screen and (max-width: 600px) {
  .List {

    .v-tabs {
      max-width: 70%;
      margin: auto;
    }

    .movies-container {
      padding: 20px;
    }
  }
}

@keyframes loader {
  0% {
    top: 0;
  }

  50% {
    top: -10px
  }

  100% {
    top: 0;
  }
}

</style>