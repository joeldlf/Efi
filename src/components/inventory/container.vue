<template>
    <v-container class="px-4" style="background:white;">
        <!-- Filtros -->
        <v-navigation-drawer style="top: 0px; max-height:100vh!important;" right v-model="showFilter" :clipped="$vuetify.breakpoint.lgAndUp" app>
            <filterInventory @filtersItem="filtersItem"/>
        </v-navigation-drawer>
        <!-- header -->
        <v-toolbar flat class="mb-2">
            <v-toolbar-title>
                Productos | Servicios
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
            class="elevation-0 px-6 py-4">
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
            filtersLength:0
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
        headers(){
            return [
                {text: 'Nombre', value: 'name'},
                //{text: 'Codigo', value: 'sku'},
                {text: 'Codigo Macro', value: 'macro'},
                //{text: 'Tipo', value: 'type'},
                //{text: 'Proveedor', value: 'provider_id'},
                {text: 'Unidad', value: 'unit_id'},
                //{text: 'Peso', value: 'weight'},
                {text: 'Precio', value: 'price'},
                this.costs,
                {text: 'Categoría', value: 'categories'},
                {text: 'Publicado', value: 'is_published'},
                {text: 'Inventario Ideal', value: 'ideal_inventory'},
                {text: 'Inventario', value: 'inventory'},
                {text: 'Acciones', value: 'actions', sortable: false },
            ]
        },
        costs(){
            return {text: 'Costo', value: 'cost'}
        },
        currentUser:{
            get(){
                return this.$store.state.currentUser.user;
            }
        },
    },
    methods: {
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
            console.log(params)
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