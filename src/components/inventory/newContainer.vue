<template>
    <v-container class="px-4" style="background:white;">
        <!-- Filtros -->
        <v-navigation-drawer style="top: 0px; max-height:100vh!important;" right v-model="showFilter" :clipped="$vuetify.breakpoint.lgAndUp" app>
            <filterInventory @filtersItem="filtersItem"/>
        </v-navigation-drawer>
        <!-- header -->
        <v-toolbar flat class="mb-2">
            <v-toolbar-title>
                Inventario
            </v-toolbar-title>
            <v-spacer/>
            <v-text-field
                v-model="search"
                append-icon="mdi-magnify"
                label="Buscar"
                single-line
                hide-details
                @keydown.enter="getDataFromApi()"
            ></v-text-field>
            <!--v-spacer></v-spacer>
            <v-btn icon class="ml-6" v-if="filtersLength>0" @click="openFilter()">
                <v-badge overlap color="primary">
                    <template v-slot:badge>
                        {{filterLength}}
                    </template>
                    <v-icon>mdi-filter</v-icon>
                </v-badge>
            </v-btn>
            <v-btn icon class="ml-6 pt-2" v-else @click="openFilter()">
                <v-icon>mdi-filter</v-icon>
            </v-btn-->
        </v-toolbar>
        <!-- tabla -->
        <v-data-table  
            height="600"
            fixed-header
            :footer-props="{'items-per-page-options':[15, 30, 50, totalItems]}"
            :options.sync="options"
            :server-items-length="totalItems"
            :loading="loading"
            :headers="headers" 
            :items="items" 
            class="elevation-0 px-6 py-4"
            :item-class="itemRowBackground" 
            >
            <template v-slot:[`item.actions`]="{ item }">
                <v-icon small class="mr-2" @click="editedItem=item, editDialog=true" v-if="permissions('editProduct')">mdi-pencil</v-icon>
                <v-icon small @click="deleteItem(item.id)" v-if="permissions('deleteProduct')">mdi-delete</v-icon>
            </template>
            <template v-slot:[`item.price`]="{ item }">
                {{money(item.price)}}
            </template>
            <template v-slot:[`item.price_two`]="{ item }">
                {{money(item.price_two)}}
            </template>
            <template v-slot:[`item.price_three`]="{ item }">
                {{money(item.price_three)}}
            </template>
            <template v-slot:[`item.price_four`]="{ item }">
                {{money(item.price_four)}}
            </template>
            <template v-slot:[`item.cost`]="{ item }">
                {{money(item.cost)}}
            </template>
            <template v-slot:[`item.branch_inventories`]="{ item }">
                <div>
                    <li v-for="(value, key) in filterBranchInventory(item.branch_inventories)" :key="key">
                        {{ key }}: {{ value }}
                    </li>
                </div>
            </template>
        </v-data-table>
        <!-- avisos -->
        <v-snackbar :color="snackbar.color" v-model="snackbar.show">
            {{ snackbar.message }}
        </v-snackbar>
        <!-- crear -->
        <v-dialog v-model="createDialog" max-width="700px">
          <template v-slot:activator="{ on, attrs }">
            <v-btn bottom color="#e25200" dark fab fixed right v-bind="attrs" v-on="on">
                <v-icon color="white">  mdi-plus </v-icon>
            </v-btn> 
          </template>
          <createFelItem @closeDialogItem="closeDialogItem"/>
        </v-dialog>
        <!-- editar -->
        <v-dialog v-model="editDialog" max-width="600px">
            <editFelItem @closeDialogItem="closeDialogItem" v-bind:editedItem="editedItem"/>
        </v-dialog> 
        <!-- Dialogo confirmación de eliminación -->
        <div class="text-center" >
            <v-bottom-sheet  v-model="sheet" inset>
                <v-sheet class="text-center" height="150px">
                    <div class="pt-6">
                    ¿Seguro que deseas borrar este producto?
                    </div>
                    <v-btn class="mt-4" text color="error" @click="deleteNow()">
                    Eliminar
                    </v-btn>
                    <v-btn class="mt-4" text color="grey" @click="sheet=false, deleteId=''">
                    Cancelar
                    </v-btn>
                </v-sheet>
            </v-bottom-sheet>
        </div>
    </v-container>
</template>

<script>
import axios from 'axios';
import editFelItem from "../inventory/edit_fel"
import createFelItem from "../inventory/create_fel"
import filterInventory from "../inventory/filter"
export default {
    components: {
        'filterInventory':filterInventory,
        'createFelItem':createFelItem,
        'editFelItem': editFelItem
    },
    data(){
        return{
            sheet:false,
            options: {},
            loading: true,
            snackbar: {
                show: false,
                message: null,
                color: null
            },
            totalItems:0,
            showFilter:false,
            filters:undefined,
            search:'',
            items:[],
            editDialog:false,
            createDialog:false,
            editedItem:{},
            filtersLength:0,
            deleteId:''
        }
    },
    watch: {
        options: {
            handler () {
                this.getDataFromApi()
            },
            deep: true,
        },
    },
    computed:{
        itemRowBackground: function (item) {
            //return (item.branch_inventories[this.currentUser.branch[0].name]*1)<(item.ideal_inventory*1) ? 'faltaProducto' : ''
        },
        currentUser(){
            return this.$store.state.currentUser.user
        },
        headers(){
            var headers = [
                {text:'id', value:'id'},
                {text:'Nombre', value:'name'},
                {text:'Inventario', value:'branch_inventories'},
                {text:'Inventario Mínimo', value:'ideal_inventory'},
                {text:'Código 1', value:'code_one'},
                {text:'Código 2', value:'code_two'},
                {text:'Código 3', value:'code_three'},
                {text:'Código SAT', value:'sat_key_code'},
                {text:'Precio 1', value:'price'},
                {text:'Precio 2', value:'price_two'},
                {text:'Precio 3', value:'price_three'},
                {text:'Precio 4', value:'price_four'},
            ]
            return headers.concat(this.costHeader).concat([{ value: 'actions', sortable: false, align: 'end', }])
        },
        costHeader(){
            if(this.permissions('view_costs')){
                return [
                    {text:'Costo', value:'cost'}
                ]
            }else{
                return []
            }
        },
    },
    methods: {
        filterBranchInventory(branchInventories) {
            const branch_name = this.currentUser.branch[0].name
            if(this.currentUser){
                const filteredInventories = {};
                if (branch_name == 'CDMX') {
                    // Si el nombre de la sucursal es igual a CDMX, devolver solo el inventario de CDMX
                    filteredInventories[branch_name] = branchInventories[branch_name];
                } else {
                    // Si el nombre de la sucursal no es CDMX, devolver todo excepto el inventario de CDMX
                    for (const key in branchInventories) {
                        if (key != 'CDMX') {
                            filteredInventories[key] = branchInventories[key];
                        }
                    }
                }
                return filteredInventories;
            }
        },
        permissions(permission){
            if(this.currentUser.id==1){
                return true
            }else if(this.currentUser.permissions!=undefined){
                if(this.currentUser.permissions.includes(permission)){
                    return true
                }else{
                    return false
                }
            }else{
                return false
            }
        },
        deleteItem (id) {
            this.deleteId = id
            this.sheet = true
        },
        deleteNow(){
            axios.delete(process.env.VUE_APP_BACKEND_ROUTE + "api/v2/items/"+this.deleteId).then(response => {
                this.deleteId = ''
                this.sheet = false
                this.getDataFromApi()
            }).catch(error => {
                this.snackbar = {
                    message: error.response.data.message,
                    color: 'error',
                    show: true
                }
            });
        },
        money(amount){
            if(amount!=undefined){
                return (amount*1).toLocaleString('es-MX', { style: 'currency', currency: 'MXN',})
            }else{
                return '-'
            }
        },
        getDataFromApi () {
            this.loading = true
            this.apiCall().then(data => {
                this.items = data.items
                this.totalItems = data.total
                this.loading = false
            })
        },
        apiCall () {
            return new Promise((resolve, reject) => {
                const { sortBy, sortDesc, page, itemsPerPage } = this.options
                var items = []
                var total = 0
                var link = ''
                if (sortBy.length === 1 && sortDesc.length === 1) {
                    if(sortDesc[0]){
                        link = "sort=-" + sortBy[0] + '&'
                    }else{
                        link = "sort=" + sortBy[0] + '&'
                    }
                }
                if(this.filters!=undefined){
                    link = link + this.filters
                }
                if(this.search!=''){
                    link = link + '&filter[pos]=' + this.search
                }
                axios.get(process.env.VUE_APP_BACKEND_ROUTE + "api/v2/item/pos?page=" + page + "&itemsPerPage=" + itemsPerPage + link).then(response => {
                    items = response.data.data
                    total = response.data.meta.total
                    resolve({
                        items,
                        total,
                    })
                })
            })
        },
        openFilter(){
            if(this.filters == false){
                this.$emit("closeDrawer", false);
                this.filters = true
            }else{
                this.$emit("closeDrawer", true);
                this.filters = false
            }
        },
        filtersItem: function(params) {
            /*if(this.quotation.type!=''){
                this.filtersLength = this.filtersLength + 1
                filter = filter + '&filter[type]='+this.quotation.type
            }*/
            this.getDataFromApi()
        },
        closeDialogItem: function(params) {
            this.editedItem = {}
            this.editDialog = params;
            this.createDialog = params;
            this.getDataFromApi()
        },
    },
};
</script>
<style>
.faltaProducto{
    background-color:red;
}
</style>