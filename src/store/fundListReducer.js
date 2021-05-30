import {SET_ALL_FUNDS_LIST, GET_LIST} from "./fundListActions";
import axios from "axios";

const initialState = {
    allFunds: null
}

const fundListReducer = (state = initialState, action) => {


    switch (action.type) {

         case SET_ALL_FUNDS_LIST: {
             const { allFunds } = action;
             return {...state, ...{ allFunds }}
        }

        default: return state
    }
}

export default fundListReducer