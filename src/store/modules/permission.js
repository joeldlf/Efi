
import axios from "axios";

const state = {
    permissions:[]
};

const getters = {};

const actions = {
    getPermisssions( {commit} ){
        axios
        .get(process.env.VUE_APP_BACKEND_ROUTE + "api/v2/permissions")
        .then(response => {
            commit('setPermissions', response.data);
        });
    }
};

const mutations = {
    setPermissions(state, data){
        state.permissions = data;
    }
};

export default{
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}
