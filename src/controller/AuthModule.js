import firebase from "firebase";
import store from "../store/store";
import {setUser} from "../store/authActions";
import {Redirect} from "react-router-dom";
import PortfolioModule from "./PortfolioModule";


export default class AuthModule {

    constructor() {
        this.store = store;

        this.portfolioModule = new PortfolioModule()
    }

    login(state) {

        const {email, password} = state;

        return new Promise((res) => {
            firebase.auth().signInWithEmailAndPassword(email, password)
                .then(async user => {

                    await this.setAuthentication(user);

                    this.portfolioModule.getPortfolios();

                    res(true)

                })
                .catch(error => {
                    // Handle Errors here.
                    const {code, message} = error;
                    console.log(error);

                    alert(code + " -- " + message);

                    this.setAuthentication(null);
                    res(false)
                });
        })

    }

    logout() {

        alert("geldi");
        firebase.auth().signOut().then(() => {
            // Sign-out successful.
            this.setAuthentication(null);
            Redirect('/login')

        }).catch((errors) => {

            console.log(errors);

        });

    }

    isLogged() {

        // refresh page function

        firebase.auth().onAuthStateChanged(user => {

            this.setAuthentication(user ? user : null)
            if (user) {
                this.portfolioModule.getPortfolios();
            }
        });
    }

    setAuthentication(user) {

        this.store.dispatch(setUser(user))
    }
}