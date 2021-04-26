import authReducer from "./authReducer";
import PortfolioReducer from "./portfolioReducer";
import fundListReducer from "./fundListReducer";
import {combineReducers} from "redux";

const rootReducer = combineReducers({
    auth: authReducer,
    portfolio: PortfolioReducer,
    fundList: fundListReducer
})

export default rootReducer