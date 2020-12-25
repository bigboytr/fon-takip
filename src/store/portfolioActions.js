
export const SET_LIST = "SET_LIST"
export const SET_SELECTED_PORTFOLIO = "SET_SELECTED_PORTFOLIO"

export const setList = (list) => ({
    type: SET_LIST,
    list
})

export const setSelectedPortfolio = (id) => ({
    type: SET_SELECTED_PORTFOLIO,
    id
})