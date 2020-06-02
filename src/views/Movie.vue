<template>
  <main class="Movie">
    <Navbar />
    <v-container class="mt-12" v-if="movie">
      <h1 class="display-1 text-center indigo--text">{{ movie.Title }}</h1>
      <v-row class="mt-12">
        <v-col class="col-12 col-md-4">
          <img class="poster d-block mx-auto" :src="movie.Poster">
          <div class="btns">
            <v-btn color="pink" fab @click="favs.includes(movieID) ? favouriteMethod(movie, 'delete') : favouriteMethod(movie, 'add')">
              <v-badge v-if="favs.includes(movie.imdbID)" color="success" icon="mdi-check"></v-badge>
              <v-icon>fa fa-heart</v-icon>
            </v-btn>
            <v-btn color="indigo" fab @click="watchlist.includes(movieID) ? watchlistMethod(movie, 'delete') : watchlistMethod(movie, 'add')">
              <v-badge v-if="watchlist.includes(movie.imdbID)" color="success" icon="mdi-check"></v-badge>
              <v-icon>fa fa-list</v-icon>
            </v-btn>
            <v-btn color="info" fab @click="watched.includes(movieID) ? watchedMethod(movie, 'delete') : watchedMethod(movie, 'add')">
              <v-badge v-if="watched.includes(movie.imdbID)" color="success" icon="mdi-check"></v-badge>
              <v-icon>fa-check</v-icon>
            </v-btn>
          </div>
        </v-col>
        <v-col class="col-12 col-md-8">
          <ul class="content">
            <li v-if="movie.Year !== 'N/A'"><strong>Year:</strong> {{ movie.Year }}</li>
            <li v-if="movie.Director !== 'N/A'"><strong>Director:</strong> {{ movie.Director }}</li>
            <li v-if="movie.Actors !== 'N/A'"><strong>Cast:</strong> {{ movie.Actors }}</li>
            <li v-if="movie.Genre !== 'N/A'"><strong>Genre:</strong> {{ movie.Genre }}</li>
            <li v-if="movie.Language !== 'N/A'"><strong>Language:</strong> {{ movie.Language }}</li>
            <li v-if="movie.Rated !== 'N/A'"><strong>Rated:</strong> {{ movie.Rated }}</li>
            <li class="rate" v-if="movie.Ratings[0]"><img src="../assets/img/Ratings/imdb.svg"> {{ movie.Ratings[0].Value }}</li>
            <li class="rate" v-if="movie.Ratings[1]"><img src="../assets/img/Ratings/rotten.png"> {{ movie.Ratings[1].Value }}</li>
            <li class="rate" v-if="movie.Ratings[2]"><img src="../assets/img/Ratings/03.png"> {{ movie.Ratings[2].Value }}</li>
          </ul>
        </v-col>
        <v-col v-if="movie.Plot !== 'N/A'" md="9" class="mx-auto text-center my-10 plot">
          <h1>Plot</h1>
          <p>{{ movie.Plot }}</p>
          <a router :href="`https://www.imdb.com/title/${movie.imdbID}`">View in imdb</a>
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

import axios from 'axios'
import firebase from 'firebase/app'
import 'firebase/auth'
import db from '@/Firebase'
import Navbar from '@/components/Navbar'


export default {
  components: {
    Navbar
  },

  data() {
    return {
      movieID: this.$route.params.movie_id,
      movie: null,
      currentUserId: null,
      watchlist: [],
      watched: [],
      favs: [],
      snackContent: '',
      snackbar: false
    }
  },

  async mounted() {
    await axios.get(`https://www.omdbapi.com?apikey=8899117d&i=${this.movieID}`)
      .then(response => this.movie = response.data)

    this.currentUserId = firebase.auth().currentUser.uid
    

    db.collection('users').doc(this.currentUserId).get()
    .then(doc => {
      this.favs = doc.data().favs
      this.watchlist = doc.data().watchlist
      this.watched = doc.data().watched
    })
  },

  methods: {
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
}

</script>

<style lang="scss">
@import '../assets/sass/config';

.Movie {

  .container {
    border-radius: 20px;
  
    .poster {
      border: 1px solid #DDD;
      border-radius: 10px;
    }

    .btns {
      margin: auto;
      display: flex;
      justify-content: center;
      margin-top: 20px;
      padding: 10px;


      button, a {
        color: #FFF !important;
        margin: 20px auto;

        .v-badge {
          right: -30px;
          bottom: -30px;

          .v-badge__badge {
            width: 25px;
            height: 25px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;

            i {
              font-size: 14px !important;
            }
          }
        }

      }
    }

    ul {
      margin: 20px;

      li {
        border: 1px solid #DDD;
        border-bottom: none;
        padding: 15px;
        color: #555 !important;
        display: flex;
        align-items: center;

        strong {
          color: $primary;
          letter-spacing: 1px;
          margin-right: 10px;
        }

        &:last-child {
          border: 1px solid #DDD;
        }


        &.rate {
          font-weight: bold;

          img {
            width: 40px;
            margin-right: 20px;
          }
        }
      }
    }

    .plot {
      padding: 10px;

      h1 {
        font-size: 3rem;
        font-weight: normal;
        color: #444;
      }

      p {
        line-height: 1.7;
        color: #777;
        width: 100%;
        margin: auto;
        margin-bottom: 50px;
      }
    }
  }
}

@include mq($lg) {
  .Movie {
    padding: 50px;
  }
}
</style>