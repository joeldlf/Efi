import axios from "axios";
const state = {
    shipping_details:[]
};
const getters = {};

const actions = {
    getShippingDetails( {commit} ){
        axios
        .get(process.env.VUE_APP_BACKEND_ROUTE + "api/v1/shipping_detail/all")
        .then(response => {
            commit('setShippingDetails', response.data);
        });
    }
};

const mutations = {
    setShippingDetails(state, data){
        state.shipping_details = data;
    }
};

export default{
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}