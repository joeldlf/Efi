import axios from "axios";
const state = {
    users:[]
};
const getters = {};

const actions = {
    getUsers( {commit} ){
        axios
        .get(process.env.VUE_APP_BACKEND_ROUTE + "api/v1/user/all")
        .then(response => {
            commit('setUsers', response.data);
        });
    }
};

const mutations = {
    setUsers(state, data){
        state.users = data;
    }
};

export default{
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}