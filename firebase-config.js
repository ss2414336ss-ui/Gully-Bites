// 🔥 FIREBASE CONFIG
// Yahan apna Firebase config paste karo
// firebase.google.com pe jaake free account banao

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  databaseURL: "https://YOUR_PROJECT-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();
<script type="module">
  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-analytics.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyAVoVjb6WcOn9sOluzfIJJueK7UJ7m2hck",
    authDomain: "ai-power-business.firebaseapp.com",
    databaseURL: "https://ai-power-business-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "ai-power-business",
    storageBucket: "ai-power-business.firebasestorage.app",
    messagingSenderId: "957300448743",
    appId: "1:957300448743:web:988c1d2d5985ab5918b142",
    measurementId: "G-D7W1E3XLM0"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);
</script>
