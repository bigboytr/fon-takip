import firebase from "firebase";
import store from "../store/store";
import {setList} from "../store/portfolioActions";
import {getUser} from "../store/authActions";

export default class PortfolioModule {

    constructor() {
        this.db = firebase.firestore();
    }

    getPortfolios() {
        // get user's portfolio list

        const userId = store.getState().auth.user.uid;

        this.db.collection(userId).get().then(snap => {
            //console.log(snap.docs);

            if (snap.docs)
                store.dispatch(setList(snap.docs))

        })
    }

    getPortfolioFunds(portfolio) {
        // get user's portfolio list

        console.log(portfolio);

        const userId = store.getState().auth.user.uid;

        this.db.collection(`${userId}/${portfolio}`).get().then(snap => {
            //console.log(snap.docs);

            if (snap.docs)
                store.dispatch(setList(snap.docs))

        })
    }

    /*
    * code: "AFO",
            purchaseDate: "16.07.2020",
            purchasePrice: 0.089567,
            cost: 999.93
            * */
    savePortfolio(title) {
        const userId = store.getState().auth.user.uid;

        this.db.collection(this.userId).doc(title).set({}).then(() => {
            this.getPortfolios();
        })
    }

    /*Save fund to portfolio */
    saveFundToPortfolio(portfolio, fundCode) {

        const userId = store.getState().auth.user.uid;

        this.db.collection(userId).doc(portfolio).collection(fundCode).add({
            cost: 0,
            purchasePrice: 0
        }).then(snap => {
            this.getPortfolioFunds(portfolio)
        });

        //this.db.collection()
    }
}