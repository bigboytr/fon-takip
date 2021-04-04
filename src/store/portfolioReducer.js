import {SET_LIST, SET_SELECTED_PORTFOLIO, SET_SELECTED_PORTFOLIO_TEXT} from "./portfolioActions";

const initalState = {
    list: null,
    selectedPortfolio: 0,
    selectedPortfolioText: ""
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

        case SET_SELECTED_PORTFOLIO_TEXT: {
            const {value} = action;
            return {...state, ...{ selectedPortfolioText: value }}
        }

        default: return state
    }
}

export default PortfolioReducer