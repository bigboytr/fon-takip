import {SET_LIST, GET_LIST} from "./fundListActions";
import axios from "axios";
import {database} from "firebase";

const initialState = {
    list: null
}

const fundListReducer = (state = initialState, action) => {


    switch (action.type) {

        case SET_LIST: {

            axios({
                method: "GET",
                url: process.env.REACT_APP_PROXY_GATE + process.env.REACT_APP_FUND_LIST_EP,
            }).then(resp => {
                // console.log(resp.data);
                // console.log(JSON.parse(resp.data));
                if (resp.data) {
                    const list = resp.data
                    return {...state, ...{ list }}
                }
            })

            return state
        }

        case GET_LIST: {
            return state.list
        }

        default: return state
    }
}

export default fundListReducer