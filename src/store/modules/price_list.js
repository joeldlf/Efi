import axios from "axios";
const state = {
    price_lists:[]
};
const getters = {};

const actions = {
    getPriceLists( {commit} ){
        axios
        .get(process.env.VUE_APP_BACKEND_ROUTE + "api/v1/price_list/all")
        .then(response => {
            commit('setPriceLists', response.data);
        });
    }
};

const mutations = {
    setPriceLists(state, data){
        state.price_lists = data;
    }
};

export default{
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}