import {LoadCategory} from '../accion/CategoryAction'
import {LOAD_CATEGORY} from '../src/config/constant'

var categoriesInitial={
    categories:[]
}

export const LoadCategoryReducer = (state=categoriesInitial,action) =>{
    switch(action.type){
        case LOAD_CATEGORY:
            return Object.assign({}, state, {
                categories:action.data
            })
        default:
            return state
    }
}