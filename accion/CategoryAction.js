import {LOAD_CATEGORY} from '../src/config/constant'

export const LoadCategory = data =>{
    return{
        type: LOAD_CATEGORY,
        data
    }
} 