import authReducer from "./authReducer";
import PortfolioReducer from "./portfolioReducer";
import {combineReducers} from "redux";

const rootReducer = combineReducers({
    auth: authReducer,
    portfolio: PortfolioReducer
})

export default rootReducer