import firebase from 'firebase';
import firebaseConfig from '../firebaseConfig';
import store from "../store/store";
import {setUser} from "../store/authActions";
import { Redirect } from "react-router-dom";

firebase.initializeApp(firebaseConfig);

export default class AuthModule {

    constructor() {
        this.store = store;
    }

    login(state) {

        const {email, password} = state;

        return new Promise((res) => {
            firebase.auth().signInWithEmailAndPassword(email, password)
                .then(user => {

                    this.setAuthentication(user);
                    res(true)

                })
                .catch(error => {
                    // Handle Errors here.
                    const {code, message} = error;

                    alert(code + " -- " + message);

                    this.setAuthentication(null);
                    res(false)
                });
        })

    }

    logout() {

        firebase.auth().signOut().then(() => {
            // Sign-out successful.
            this.setAuthentication(null);
            Redirect('/portfolio')

        }).catch((errors) => {

            console.log(errors);

        });

    }

    isLogged() {

        // refresh page function

        firebase.auth().onAuthStateChanged(user => {

            this.setAuthentication(user ? user : null)
        });
    }

    setAuthentication(user) {

        /*
        * parameters values should be
        *
            user => object
            token => boolean
         */

        this.store.dispatch(setUser(user))
    }
}