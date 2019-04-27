import {LOAD_CHAT,LOAD_CHAT_INACTIVOS} from '../src/config/constant'

export const LoadChat = data =>{
    return{
        type: LOAD_CHAT,
        data
    }
} 

export const LoadChatInactivo = data =>{
    return{
        type: LOAD_CHAT_INACTIVOS,
        data
    }
} 