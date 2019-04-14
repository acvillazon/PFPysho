import { combineReducers } from 'redux'
import {addCredentials} from './User'
import {LoadCategoryReducer} from './CategoryReducer'
import {LoadChatReducer,LoadChatReducerInactivos} from './ChatReducer'

export default combineReducers({
    credentials:addCredentials,
    categories:LoadCategoryReducer,
    chats:LoadChatReducer,
    chatsInactivos:LoadChatReducerInactivos
})