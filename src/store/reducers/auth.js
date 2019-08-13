import * as actionTypes from '../actions/actionTypes';
import {updateObject} from '../utility'

const initialState = {
    token: null,
    userId: null,
    error: null,
    loading: false
};
const authStart = (state, action) => {
    return updateObject( state, {error: null, loading: true})
}
const authSuccess = (state, action) => {
    return updateObject(state, {
        token: action.idToken,
        userId: action.userId,
        error: action.er
    })
}
const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.AUTH_START: return authStart(state, action)
        case actionTypes.AUTH_FAIL:
            return updateObject()
        default:
            return state
    }
}
export default reducer;