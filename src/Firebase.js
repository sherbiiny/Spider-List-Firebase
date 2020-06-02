const firebase = require('firebase/app');
import 'firebase/firestore'

// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyCxykfqYg1425L-jpmLEabGMQuzeEhCUo8",
  authDomain: "spider-list-e5463.firebaseapp.com",
  databaseURL: "https://spider-list-e5463.firebaseio.com",
  projectId: "spider-list-e5463",
  storageBucket: "spider-list-e5463.appspot.com",
  messagingSenderId: "827927959942",
  appId: "1:827927959942:web:3fdd644d4451e8bef27407",
  measurementId: "G-Q3CRS0Y9PP"
};
// Initialize Firebase
const fb = firebase.initializeApp(firebaseConfig);
export default fb.firestore()
