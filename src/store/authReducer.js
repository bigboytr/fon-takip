import {SET_USER} from "./authActions";

const initialState = {
    user: null,
    isLogged: false
}

const authReducer = (state = initialState, action) => {


    switch (action.type) {

        case SET_USER: {
            const {user} = action.payload;
            const isLogged = !!user;

            if (user) {
                localStorage.setItem('user', user.email)
            } else {
                localStorage.removeItem('user')
            }
            return {...state, ...{user}, isLogged}
        }

        default: return state
    }
}

export default authReducer