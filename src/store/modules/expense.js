import axios from "axios";
const state = {
    expenses:[],
    reports:[]
};
const getters = {};

const actions = {
    getExpenses( {commit} ){
        axios
        .get(process.env.VUE_APP_BACKEND_ROUTE + "api/v1/expense/all")
        .then(response => {
            commit('setExpenses', response.data);
        });
    },
    getReports( {commit}, dates ){
        axios.get(process.env.VUE_APP_BACKEND_ROUTE + "api/v2/expenses-summary?filter[date_between]="+dates)
        .then(response => {
            state.total_loader = false
            commit('setReports', response.data);
        });
    },
};

const mutations = {
    setExpenses(state, data){
        state.expenses = data;
    },
    setReports(state, data){
        state.reports = data;
    },
};

export default{
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}