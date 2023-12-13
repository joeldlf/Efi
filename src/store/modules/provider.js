
import axios from "axios";

const state = {
    providers:[]
};

const getters = {};

const actions = {
    getProviders( {commit} ){
        axios
        .get(process.env.VUE_APP_BACKEND_ROUTE + "api/v1/provider/all")
        .then(response => {
            commit('setProviders', response.data);
        });
    }
};

const mutations = {
    setProviders(state, data){
        state.providers = data;
    }
};

export default{
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}
