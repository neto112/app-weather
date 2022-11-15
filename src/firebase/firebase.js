import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';

var firebaseConfig = {
  apiKey: "AIzaSyARf_QGosv3CQKtoPvZmR0Nsclpr87vORU",
  authDomain: "weatherapp-b05c0.firebaseapp.com",
  projectId: "weatherapp-b05c0",
  storageBucket: "weatherapp-b05c0.appspot.com",
  messagingSenderId: "219150822768",
  appId: "1:219150822768:web:650dcbc3ac79d4238433b5"
};
const firebaseApp = firebase.initializeApp(firebaseConfig)
export default firebaseApp.firestore();
