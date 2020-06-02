<template>
  <v-app>
    <v-content>
      <router-view/>
    </v-content>
  </v-app>
</template>

<script>
import Home from '@/views/Home'
import Navbar from '@/components/Navbar'
import $ from 'jquery'


export default {
  components: {
    Home,
    Navbar,
  },

  created() {
    // $('html').niceScroll({
    //   cursorcolor: '#3f51b5',
    //   smoothscroll: false,
    //   scrollspeed: 200,
    // })

    // let lastHeight = $("html").css('height');

    // let checkForChanges = () => {
    //   if ($('html').css('height') != lastHeight)
    //   {
    //       $('html').getNiceScroll().resize()
    //       lastHeight = $('html').css('height'); 
    //   }

    // }
    
    // setInterval(checkForChanges, 500);
  },

  mounted() {
    $('.theme--light').removeClass('theme--light')
  },

  updated() {
    $('.theme--light').removeClass('theme--light')
  }
};
</script>
