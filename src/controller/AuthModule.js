import firebase from 'firebase';
import firebaseConfig from '../firebaseConfig';
import store from "../store/store";
import {setUser} from "../store/authActions";

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

        }).catch((errors) => {

            console.log(errors);

        });

    }

    isLogged() {

        // refresh page function

        /*return new Promise((res, rej) => {



        })*/
        firebase.auth().onAuthStateChanged(user => {

            this.setAuthentication(user ? user : null)

            /*this.setAuthentication(user ? {
                email: user.email,
                uid: user.uid,
                token: true
            } : {
                email: null,
                uid: null,
                token: false
            })*/
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

        /*if (user) {
            localStorage.setItem('userEmail', user.email);
            localStorage.setItem('userId', user.uid);
            localStorage.setItem('token', user.token);
        } else {
            localStorage.removeItem('userEmail');
            localStorage.removeItem('userId');
            localStorage.removeItem('token');
        }*/

        /*store.dispatch('setAuthUser', user);
        store.dispatch('setToken', token);*/
        //store.dispatch('setSelectedSite', site);

    }
}