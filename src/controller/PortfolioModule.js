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

        this.db.collection(userId).doc('portfolio').get().then(snap => {
            const keys = Object.keys(snap.data())
            if (keys)
                store.dispatch(setList(keys))

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
    // Create new Portfolio
    savePortfolio(title) {
        const userId = store.getState().auth.user.uid;

        this.db.collection(this.userId).doc(title).set({}).then(() => {
            this.getPortfolios();
        })
    }


    // Get selected portfolio data
    getFundDataObj(portfolio, funCode) {

        const userId = store.getState().auth.user.uid

        return this.db.collection(userId).doc('portfolio').get().then(snap => {
            const d = snap.data()
            return d[portfolio][funCode]
        })
    }

    /*Save fund to portfolio */
    async saveFundToPortfolio(portfolio, dto) {

        const userId = store.getState().auth.user.uid

        const {fundCode, purchaseDate, purchasePrice, cost} = dto
        let fundData = await this.getFundDataObj(portfolio, fundCode);
        fundData = !fundData ? [] : fundData

        const data = {
            [portfolio]: {
                [fundCode]: [
                    ...fundData,
                    {
                        purchaseDate: new Date(purchaseDate),
                        purchasePrice: parseFloat(purchasePrice),
                        cost: parseFloat(cost),
                    },
                ]
            }
        }

        return this.db.collection(userId).doc("portfolio").set(data, { merge: true }).then(function() {
            return true
        }).catch(err => {
            console.log(err)
            return false
        });
    }
}