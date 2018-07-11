import api from '../api'

export default {
    menu({ commit, state }, data){
        api.icenter.menu().then( data => {
            commit( 'menu' , data)
        }).catch( err => {
            console.log(err)
        })
    }
}
