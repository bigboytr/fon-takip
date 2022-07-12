import firebase from "firebase";
import store from "../store/store";
import {setList} from "../store/portfolioActions";
import axios from "axios";
import {setAllFundsList} from "../store/fundListActions";

export default class PortfolioModule {

    constructor() {
        this.db = firebase.firestore();
    }

    async getAllFundsList() {
        try {
            // const res = await axios({
            //     method: "GET",
            //     url: process.env.REACT_APP_PROXY_GATE + process.env.REACT_APP_FUND_LIST_EP,
            // })

            store.dispatch(setAllFundsList([]))
            //store.dispatch(setAllFundsList(res.data))
        }
        catch (err) {
            console.error(err);
            return undefined
        }
    }

    // Create new Portfolio
    createPortfolio(title) {
        const userId = store.getState().auth.user.uid;

        this.db.collection(userId).doc('portfolio').set({
            [title]: {
                items: {},
                summary: {}
            }
        }, {merge: true}).then(() => {
            this.getPortfolios();
        })
    }

    getPortfolios() {
        // get user's portfolio list
        const userId = store.getState().auth.user.uid;

        this.db.collection(userId).doc('portfolio').get().then(snap => {
            const keys = Object.keys(snap.data())
            if (keys)
                store.dispatch(setList(keys.sort()))

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

    // Update summary of fund
    async updateFundSummary(portfolio, fundCode) {
        const fundItems = await this.getFundDataObj(portfolio, fundCode)

        if (!fundItems) return

        const totalCost = fundItems.reduce((total, item) => +total + +item.cost, []);
        const totalQuantity = fundItems.reduce((total, item) => +total + (item.cost / item.purchasePrice), []);
        const avgFundPrice = totalCost / totalQuantity

        const userId = store.getState().auth.user.uid

        const data = {
            [portfolio]: {
                items: {
                    [fundCode]: {
                       summary: {
                           totalCost,
                           totalQuantity,
                           avgFundPrice
                       }
                    }
                }
            }
        }
        this.db.collection(userId).doc("portfolio").set(data, {merge: true}).then(() => {
            return true
        }).catch(err => {
            console.log(err)
            return false
        })
    }

    // Get selected portfolio data
    // we need that while saving new fund to portfolio
    getFundDataObj(portfolio, funCode) {

        const userId = store.getState().auth.user.uid

        return this.db.collection(userId).doc('portfolio').get().then(snap => {
            const d = snap.data()
            return d[portfolio]['items'][funCode] ? d[portfolio]['items'][funCode]['buy'] : null
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
                items: {
                    [fundCode]: {
                        buy: [
                            ...fundData,
                            {
                                purchaseDate: new Date(purchaseDate),
                                purchasePrice: parseFloat(purchasePrice),
                                cost: parseFloat(cost),
                            },
                        ]
                    }
                }
            }
        }

        return this.db.collection(userId).doc("portfolio").set(data, { merge: true }).then(async () => {
            return  await this.updateFundSummary(portfolio, fundCode)
        }).catch(err => {
            console.log(err)
            return false
        });
    }
}