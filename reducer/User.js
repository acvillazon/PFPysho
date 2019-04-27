import { addAuth } from '../accion/User'
import { ADD_CREDENTIALS } from '../src/config/constant'

const InitialState={
    Auth:[]
}

export function addCredentials(state=InitialState, action) {
    switch (action.type) {
        case ADD_CREDENTIALS:
            return Object.assign({}, state, {
                Auth: action.user
            })
        default:
            return state;
    }
}