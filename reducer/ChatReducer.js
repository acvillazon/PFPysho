import {LoadChat} from '../accion/ChatAction'
import {LOAD_CHAT,LOAD_CHAT_INACTIVOS} from '../src/config/constant'

var categoriesInitial={
    chat:undefined
}

export const LoadChatReducer = (state=categoriesInitial,action) =>{
    switch(action.type){
        case LOAD_CHAT:
            return Object.assign({}, state, {
                chat:action.data
            })
        default:
            return state
    }
}

export const LoadChatReducerInactivos = (state=categoriesInitial,action) =>{
    switch(action.type){
        case LOAD_CHAT_INACTIVOS:
            return Object.assign({}, state, {
                chat:action.data
            })
        default:
            return state
    }
}