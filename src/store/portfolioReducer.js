import {SET_LIST, SET_SELECTED_PORTFOLIO} from "./portfolioActions";

const initalState = {
    list: null,
    selectedPortfolio: 0
}

const PortfolioReducer = (state = initalState, action) => {

    switch (action.type) {

        case SET_LIST: {
            const {list} = action;
            return {...state, ...{ list }}
        }

        case SET_SELECTED_PORTFOLIO: {
            const {id} = action;
            return {...state, ...{ selectedPortfolio: id }}
        }

        default: return state
    }
}

export default PortfolioReducer