import React from "react";
import ReactDOM from "react-dom";
import "./index.scss";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { Provider } from "react-redux";
import store from "./store";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {
  FirebaseAppProvider,
  FirestoreProvider,
  useFirebaseApp,
  useFirestore,
  useFirestoreCollection,
  useFirestoreDocData,
} from "reactfire";

const firebaseConfig = {
  apiKey: "AIzaSyAmG6gfiY8QojDxjQSes-7S_xLQmJjjUcQ",
  authDomain: "delegation-sequencing-d8ae4.firebaseapp.com",
  projectId: "delegation-sequencing-d8ae4",
  storageBucket: "delegation-sequencing-d8ae4.appspot.com",
  messagingSenderId: "208130555525",
  appId: "1:208130555525:web:5ee839107976d9bb82b3ec",
  measurementId: "G-7STLL6JLRY",
};

const app = initializeApp(firebaseConfig);
getAnalytics(app);

ReactDOM.render(
  <FirebaseAppProvider firebaseConfig={firebaseConfig}>
    <Provider store={store}>
      <React.StrictMode>
        <App />
      </React.StrictMode>
    </Provider>
  </FirebaseAppProvider>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
