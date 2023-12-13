import axios from "axios";
const state = {
    inventories:[],
    loader: true
};
const getters = {};

const actions = {
    getInventories( {commit, state} ){
        state.loader = true
        axios
        .get(process.env.VUE_APP_BACKEND_ROUTE + "api/v1/inventory/all")
        .then(response => {
            commit('setInventories', response.data);
        });
    },
    modifyInventories({commit}, item){
        commit('addInventoryMovement', item);
    }
};

const mutations = {
    setInventories(state, data){
        state.inventories = data;
        state.loader = false;
    },
    addInventoryMovement(state, data){
        state.inventories.unshift(data)
    }
};

export default{
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}