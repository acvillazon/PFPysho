import {ADD_CREDENTIALS} from '../src/config/constant'

export function addAuth(data){
    return{
        type : ADD_CREDENTIALS,
        user : data
    }
}