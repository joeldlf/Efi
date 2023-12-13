
import axios from "axios";

const state = {
    roles:[]
};

const getters = {};

const actions = {
    getRoles( {commit} ){
        axios
        .get(process.env.VUE_APP_BACKEND_ROUTE + "api/v2/roles")
        .then(response => {
            commit('setRoles', response.data.data);
        });
    }
};

const mutations = {
    setRoles(state, data){
        state.roles = data;
    }
};

export default{
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}
