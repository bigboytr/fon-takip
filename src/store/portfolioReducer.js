import {SET_LIST} from "./portfolioActions";

const initalState = {
    list: null
}

const PortfolioReducer = (state = initalState, action) => {

    switch (action.type) {

        case SET_LIST: {
            const {list} = action;
            return {...state, list}
        }

        default: return state
    }
}

export default PortfolioReducer