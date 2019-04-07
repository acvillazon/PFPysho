import {LOAD_CHAT} from '../src/config/constant'

export const LoadChat = data =>{
    return{
        type: LOAD_CHAT,
        data
    }
} 