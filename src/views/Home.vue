<template>
  <main id="Home">
    <Navbar />
    <v-container>
      <form @submit.prevent="getMovies" class="d-flex">
        <v-text-field 
          placeholder="Search a Movie..."
          clearable
          color="indigo"
          prepend-inner-icon="fa fa-search"
          class="search-bar"
          v-model="movieName"
          autocomplete='off'
          spellcheck="false"
          >
        </v-text-field>
      </form>

      <v-container v-if="movies.length == 0">
        <h1 class="text-center my-10 subtitle indigo--text">Popular movies you may like</h1>
        <v-row class="movies">
          <v-col md="6" lg="4" sm="6" class="col-12" v-for="(movie, i) in reco" :key='i'>
            <v-card class="movie">
              <img :src="movie.Poster" :alt="movie.Title">
              <div class="overlay">
                <v-menu>
                  <template v-slot:activator="{ on }">
                    <v-icon v-on='on'>fa fa-ellipsis-v</v-icon>
                  </template>
                  <v-list class="mylist white">
                    <v-list-item @click="watchlist.includes(movie.imdbID) ? watchlistMethod(movie, 'remove') : watchlistMethod(movie, 'add')">
                      <v-icon color="pink" class="mr-3" small>fa fa-list</v-icon>
                      {{watchlist.includes(movie.imdbID) ? 'Remove from' : 'Add to'}} Watchlist
                    </v-list-item>
                    <v-list-item @click="watched.includes(movie.imdbID) ? watchedMethod(movie, 'remove') : watchedMethod(movie, 'add')">
                      <v-icon color="pink" class="mr-3" small>fa fa-check</v-icon>
                      {{watched.includes(movie.imdbID) ? 'Remove from' : 'Add to'}} Watched
                    </v-list-item>
                    
                  </v-list>
                </v-menu>

                <v-icon v-if="!favs.includes(movie.imdbID)" large color="pink" :class="movie.imdbID" class="heart" @click="favouriteMethod(movie, 'add')">fa fa-heart-o</v-icon>
                <v-icon v-if="favs.includes(movie.imdbID)" large color="pink" :class="movie.imdbID" class="heart" @click="favouriteMethod(movie, 'remove')">fa fa-heart</v-icon>
                <div>
                  <v-icon>fa fa-star</v-icon>
                  <v-icon>fa fa-star</v-icon>
                  <v-icon>fa fa-star</v-icon>
                  <v-icon>fa fa-star</v-icon>
                  <v-icon>fa fa-star</v-icon>
                </div>
                <v-btn class="indigo white--text movie-btn" router :to="{name: 'Movie', params: {movie_id: movie.imdbID}}">View More</v-btn>
              </div>
              <div class="content text-center">
                <router-link :to="{name: 'Movie', params: {movie_id: movie.imdbID}}">{{ movie.Title }}</router-link>
                <h4>{{ movie.Year }}</h4>
              </div>
            </v-card>

          </v-col>          
        </v-row>
      </v-container>

      <v-row class="movies">
        <v-col md="6" lg="4" sm="6" class="col-12" v-for="(movie, i) in movies" :key='i'>
          <v-card class="movie">
            <img :src="movie.Poster" :alt="movie.Title">
            <div class="overlay">
              <v-menu>
                <template v-slot:activator="{ on }">
                  <v-icon v-on='on'>fa fa-ellipsis-v</v-icon>
                </template>
                <v-list class="mylist white">
                  <v-list-item @click="watchlist.includes(movie.imdbID) ? watchlistMethod(movie, 'remove') : watchlistMethod(movie, 'add')">
                    <v-icon color="pink" class="mr-3" small>fa fa-list</v-icon>
                    {{watchlist.includes(movie.imdbID) ? 'Remove from' : 'Add to'}} Watchlist
                  </v-list-item>
                  <v-list-item @click="watched.includes(movie.imdbID) ? watchedMethod(movie, 'remove') : watchedMethod(movie, 'add')">
                    <v-icon color="pink" class="mr-3" small>fa fa-check</v-icon>
                    {{watched.includes(movie.imdbID) ? 'Remove from' : 'Add to'}} Watched
                  </v-list-item>
                  
                </v-list>
              </v-menu>

              <v-icon v-if="!favs.includes(movie.imdbID)" large color="pink" :class="movie.imdbID" class="heart" @click="favouriteMethod(movie, 'add')">fa fa-heart-o</v-icon>
              <v-icon v-if="favs.includes(movie.imdbID)" large color="pink" :class="movie.imdbID" class="heart" @click="favouriteMethod(movie, 'remove')">fa fa-heart</v-icon>
              <v-btn class="indigo white--text movie-btn" router :to="{name: 'Movie', params: {movie_id: movie.imdbID}}">View More</v-btn>
            </div>
            <div class="content text-center">
              <router-link :to="{name: 'Movie', params: {movie_id: movie.imdbID}}">{{ movie.Title }}</router-link>
              <h4>{{ movie.Year }}</h4>
            </div>
          </v-card>

        </v-col>
      </v-row>
    </v-container>
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
import top from '../json/top.json'

export default {
  components: {
    Navbar
  },
  data() {
    return {
      movieName: null,
      movies: [],
      currentUserId: null,
      watchlist: [],
      watched: [],
      favs: [],
      snackbar: false,
      snackContent: null,
      recommendation: [],
      reco: [],
      top: top.top,
      planTwo: top.plan2,
    }
  },

  methods: {
    recommend() {
      this.top.forEach(movie => {
        let id = movie.substring(27, 36)
        this.recommendation.push(id)
      });


      for(let i = 0; i <= 10; i++) {
        let random = Math.floor(Math.random() * this.recommendation.length - 1)
        let selected = this.recommendation[random]
        this.recommendation.splice(random, 1)
        axios.get(`https://www.omdbapi.com?apikey=8899117d&i=${selected}`)
          .then(res => this.reco.push(res.data))
      }
    },

    plan2() {
      this.planTwo.forEach(movie => this.recommendation.push(movie.title));


      for(let i = 0; i <= 25; i++) {
        let random = Math.floor(Math.random() * this.recommendation.length - 1)
        let selected = this.recommendation[random]
        this.recommendation.splice(random, 1)
        axios.get(`https://www.omdbapi.com?apikey=8899117d&s=${selected}`)
          .then(res => {
            if(res.data.Search && res.data.Search.Poster !== 'N/A') this.reco.push(res.data.Search[0])
          })
      }

      console.log(this.reco)
    },

    async getMovies() {
       await axios.get(`https://www.omdbapi.com?apikey=8899117d&s=${this.movieName}`)
        .then(response => {
          this.movies = response.data.Search.filter(el => el.Poster !== 'N/A' && el.Plot !== 'N/A' && el.Type === 'movie')
        })
        .catch(err => console.log(err))
      $('form')[0].reset()
    },

    watchlistMethod(movie, status) {

      if(status == 'add') {
  
        db.collection('users').doc(this.currentUserId).get()
          .then(doc => {
            this.watchlist = doc.data().watchlist
            this.watchlist.push(movie.imdbID)
            this.watchlist = new Set(this.watchlist)
            this.watchlist = Array.from(this.watchlist)
            db.collection('users').doc(this.currentUserId).update({
              watchlist: this.watchlist
            })
          })

          this.snackContent = `${movie.Title} has been added to your watchlist`
          this.snackbar = true

      } else {
        const index = this.watchlist.indexOf(movie.imdbID);
        this.watchlist.splice(index, 1);
        db.collection('users').doc(this.currentUserId).update({
          watchlist: this.watchlist
        })

        this.snackContent = `${movie.Title} has been removed from your watchlist`
        this.snackbar = true
      }

    },

    watchedMethod(movie, status) {

      if(status == 'add') {

        db.collection('users').doc(this.currentUserId).get()
          .then(doc => {
            this.watched = doc.data().watched
            this.watched.push(movie.imdbID)
            this.watched = new Set(this.watched)
            this.watched = Array.from(this.watched)
            db.collection('users').doc(this.currentUserId).update({
              watched: this.watched
            })
          })

          this.snackContent = `${movie.Title} has been added to your Watched list`
          this.snackbar = true

      } else {
        const index = this.watched.indexOf(movie.imdbID);
        this.watched.splice(index, 1);
        db.collection('users').doc(this.currentUserId).update({
          watched: this.watched
        })

        this.snackContent = `${movie.Title} has been removed from your Watched list`
        this.snackbar = true
      }

    },

    favouriteMethod(movie, status) {

      if(status == 'add') {

        db.collection('users').doc(this.currentUserId).get()
          .then(doc => {
            this.favs = doc.data().favs
            this.favs.push(movie.imdbID)
            this.favs = new Set(this.favs)
            this.favs = Array.from(this.favs)
            db.collection('users').doc(this.currentUserId).update({
              favs: this.favs
            })
          })

          this.snackContent = `${movie.Title} has been added to your Favourites`
          this.snackbar = true

      } else {
        const index = this.favs.indexOf(movie.imdbID);
        this.favs.splice(index, 1);
        db.collection('users').doc(this.currentUserId).update({
          favs: this.favs
        })

        this.snackContent = `${movie.Title} has been removed from your Favourites`
        this.snackbar = true
      }

    },
  },

  mounted() {

    // this.recommend()
    this.plan2()

    // Get data from firebase
    this.currentUserId = firebase.auth().currentUser.uid
    
    db.collection('users').doc(this.currentUserId).get()
      .then(doc => {
        this.favs = doc.data().favs
        this.watchlist = doc.data().watchlist
        this.watched = doc.data().watched
      })
  }
}
</script>

<style lang="scss">
@import '../assets/sass/config';

#Home {

  form {
    max-width: 75%;
    margin: 50px auto;

    .v-input {
      max-width: 500px !important;
      margin: auto;
    }
  }

  .movies {
    .movie {
      margin: 50px auto;
      height: 400px;
      margin-bottom: 100px;
      max-width: 270px;

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
}


@include mq($sm) {
  #Home {

    padding: 50px;

    form {
      max-width: 70%;
    }
  }
}

@include mq($md) {

}

@include mq($lg) {

}




@keyframes fade-in {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
</style>
