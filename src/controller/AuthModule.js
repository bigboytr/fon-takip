import firebase from "firebase";
import store from "../store/store";
import {setUser} from "../store/authActions";
import {setList} from "../store/fundListActions";
import {useHistory} from "react-router-dom";
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

        firebase.auth().signOut().then(() => {
            // Sign-out successful.
            this.setAuthentication(null);

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

                // fund list
                this.store.dispatch(setList())
            }
        });
    }

    setAuthentication(user) {

        this.store.dispatch(setUser(user))
        const v = user ? 'logged' : 'notLogged';
        localStorage.setItem('isLogged', v);
    }
}