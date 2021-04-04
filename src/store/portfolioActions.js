
export const SET_LIST = "SET_LIST"
export const SET_SELECTED_PORTFOLIO = "SET_SELECTED_PORTFOLIO"
export const SET_SELECTED_PORTFOLIO_TEXT = "SET_SELECTED_PORTFOLIO_TEXT"

export const setList = (list) => ({
    type: SET_LIST,
    list
})

export const setSelectedPortfolio = (id) => ({
    type: SET_SELECTED_PORTFOLIO,
    id
})

export const setSelectedPortfolioText = (value) => ({
    type: SET_SELECTED_PORTFOLIO_TEXT,
    value
})