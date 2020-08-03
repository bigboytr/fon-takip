import firebase from 'firebase';
import store from "../store/store";
import {setList} from "../store/portfolioActions";


export default class FirebaseModule {

    constructor(collection, dataMap) {

        this.db = firebase.firestore();
        this.userId = store.getState().auth.user.uid;

        this.getPortfolios();
    }

    getPortfolios() {
        // get user's portfolio list

        this.db.collection(this.userId).get().then(snap => {
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
        this.db.collection(this.userId).doc(title).set({}).then(() => {
            this.getPortfolios();
        })
    }

}