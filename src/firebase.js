import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/storage';

var config = {
    apiKey: "AIzaSyAUVeeL5iklgk8pzpC0AbCBudxjk92NZUY",
    authDomain: "react-slack-clone-b8e87.firebaseapp.com",
    databaseURL: "https://react-slack-clone-b8e87.firebaseio.com",
    projectId: "react-slack-clone-b8e87",
    storageBucket: "react-slack-clone-b8e87.appspot.com",
    messagingSenderId: "1041750838882"
  };
firebase.initializeApp(config);

export default firebase;