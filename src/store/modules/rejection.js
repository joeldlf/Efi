import axios from "axios";
const state = {
    rejections:[]
};
const getters = {};

const actions = {
    getRejections( {commit} ){
        axios
        .get(process.env.VUE_APP_BACKEND_ROUTE + "api/v1/rejection/all")
        .then(response => {
            commit('setRejections', response.data);
        });
    }
};

const mutations = {
    setRejections(state, data){
        state.rejections = data;
    }
};

export default{
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}