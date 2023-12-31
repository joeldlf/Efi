<template>
    <v-container class="pa-4" style="max-width:100vw;">
        <!-- Filtros -->
        <v-navigation-drawer style="top: 0px; max-height:100vh!important;" right v-model="filters" :clipped="$vuetify.breakpoint.lgAndUp" app>
                <filterClients @filtersCompanies="filtersCompanies"/>
        </v-navigation-drawer>
        <!-- Contenedor -->
        <v-data-table
        class="pa-4"
        :items="clients" 
        :headers="header"
        :footer-props="{'items-per-page-options':[15, 30, 50, totalClients]}"
        :options.sync="options"
        :server-items-length="totalClients"
        :loading="loading">
            <!-- Header -->
            <template v-slot:top>
                <v-toolbar flat >
                    <v-toolbar-title>Clientes</v-toolbar-title>
                    <v-btn icon>
                        <v-icon @click="openFilter()">mdi-filter</v-icon>
                    </v-btn>
                    <v-spacer></v-spacer>
                    <v-btn icon v-show="permissions('download')">
                        <v-icon @click="exportExcel">mdi-download</v-icon>
                    </v-btn>
                </v-toolbar>
            </template>
            <!-- Tabla sin información -->
            <template v-slot:no-data>
                No existen registros de clientes aún
            </template>
            <!-- Acciones por fila -->
            <template v-slot:[`item.actions`]="{ item }">
                <v-menu bottom left >
                    <template v-slot:activator="{ on, attrs }">
                    <v-btn icon v-bind="attrs" v-on="on">
                        <v-icon>mdi-dots-vertical</v-icon>
                    </v-btn>
                    </template>
                    <v-list style="font-size:13px;">
                        <v-list-item @click="editItem(item.editedItem)"  v-show="permissions('editCompanies')">
                            <v-icon small class="mr-2">
                                mdi-pencil
                            </v-icon>
                            Editar
                        </v-list-item>
                        <v-list-item @click="deleteItem(item.id)"  v-show="permissions('deleteCompanies')">
                            <v-icon small class="mr-2">
                                mdi-delete
                            </v-icon>
                            Eliminar
                        </v-list-item>
                    </v-list>
                </v-menu>
            </template>
            <!-- Ver más -->
            <template v-slot:[`item.view`]="{ item }">
                <div class="semaforo" :style="'background:' + item.activity_indicator + ';' "></div> <v-btn class="detail" icon :to="{ path: '/clients/client/'+ item.id}"><v-icon small> mdi-eye</v-icon></v-btn>
            </template>
            <template v-slot:[`item.name`]="{ item }">
                <strong>{{item.name}}</strong>
                <br>
                <span v-show="item.razon_social!=null && item.name.toLowerCase()!=item.razon_social.toLowerCase()">{{item.razon_social}}</span>
            </template >
        </v-data-table>
        <!-- Crear -->
        <v-dialog v-model="createDialog" max-width="700px">
          <template v-slot:activator="{ on, attrs }">
            <v-btn bottom color="#e25200" dark fab fixed right v-bind="attrs" v-on="on">
                <v-icon color="white">  mdi-plus </v-icon>
            </v-btn> 
          </template>
          <create-client v-if="liga=='https://backendbdb.unocrm.mx/'" @closeCreateDialogClient="closeCreateDialogClient"/>
          <create v-else @closeCreateDialogClient="closeCreateDialogClient"/>
          
        </v-dialog>
        <!-- Editar -->
        <v-dialog v-model="editDialog" max-width="700px">
          <edit v-bind:client="client" @closeEditDialogClient="closeEditDialogClient"/>
        </v-dialog>
        <!-- Eliminar -->
        <div class="text-center">
            <v-bottom-sheet  v-model="sheet" inset>
                <v-sheet class="text-center" height="150px">
                    <div class="pt-6">
                    ¿Seguro que deseas borrar este cliente?
                    </div>
                    <v-btn class="mt-4" text color="error" @click="deleteClient()">
                    Eliminar
                    </v-btn>
                    <v-btn class="mt-4" text color="grey" @click="cancel()">
                    Cancelar
                    </v-btn>
                </v-sheet>
            </v-bottom-sheet>
        </div>
        <!-- errores -->
        <v-snackbar :color="snackbar.color" v-model="snackbar.show">
            {{ snackbar.message }}
        </v-snackbar>
    </v-container>
</template>

<script>
import axios from "axios";
import XLSX from 'xlsx';
import Filter from "../clients/filter"
import Create from "../clients/companies/create"
import CreateClient from "../clients/companies/create_client"
import Edit from "../clients/companies/edit"
export default {
    components: {
        'filterClients':Filter,
        'create':Create,
        'create-client':CreateClient,
        'edit':Edit,
    }, 
    data: () => ({
        filters:false,
        totalClients: 0,
        clients: [],
        client:{},
        loading: true,
        options: {},
        sheet: false,
        editDialog: false,
        createDialog: false,
        deleteId:'',
        snackbar: {
            show: false,
            message: null,
            color: null
        },
        filterStorageLength:0,
    }),
    computed:{
        liga(){
            return process.env.VUE_APP_BACKEND_ROUTE
        },
        statusesLists(){
            return this.$store.state.status.statuses
        },
        header(){ 
            if(this.liga != 'https://backendbdb.unocrm.mx/'){
                return [
                    { value: 'view', sortable: false, align: 'start', },
                    { text: 'Dias de Credito', value: 'credit_days' },
                    { text: 'Empresa', value: 'name', width: '100%'},
                    { text: 'Código Macro', value: 'number',},
                    { text: 'Rango de Consumo', value: 'phase' },
                    { text: 'Tipo de Cliente', value: 'type_id',},
                    { text: 'Categoría', value: 'consumptions',},
                    { text: 'Procedencia', value: 'origin' },
                    { text: 'Estatus', value: 'status' },
                    { text: 'Vendedor', value: 'salesman' },
                    { text: 'Creación', value: 'created_at' },
                    { text: 'Actualización', value: 'updated_at' },
                    { value: 'actions', sortable: false, align: 'end', },
                ]
            }else{
                return [
                    { value: 'view', sortable: false, align: 'start', },
                    { text: 'Cliente', value: 'name', width: '100%'},
                    { text: 'Teléfono', value: 'phone', width: '100%'},
                    { text: 'Email', value: 'mail', width: '100%'},
                    { text: 'Compleaños', value: 'birth_date', width: '100%'},
                    { value: 'actions', sortable: false, align: 'end', },
                ]
            }
            
        },
        currentUser:{
            get(){
                return this.$store.state.currentUser.user;
            }
        },
        categoryLists(){
            return this.$store.state.category.categories;
        },
    },
    watch: {
        options: {
            handler () {
                this.getDataFromApi()
            },
            deep: true,
        },
    },
    methods:{
        getDataFromApi () {
            this.loading = true
            this.apiCall().then(data => {
                this.clients = data.clients
                this.totalClients = data.total
                this.loading = false
            })
        },
        apiCall () {
            return new Promise((resolve, reject) => {
                this.filterStorageLength = localStorage.getItem('filtersSalesLength')
                const { sortBy, sortDesc, page, itemsPerPage } = this.options
                var clients = []
                var total = 0
                var link = ''
                if(localStorage.getItem('filtersClient')!=null){
                    link = link + JSON.parse(localStorage.getItem('filtersClient'))+'&'
                }
                if(sortBy.length === 1){
                    if(sortDesc[0]){
                        link = link + "sort=-" + sortBy[0] + '&'
                    }else{
                        link = link + "sort=" + sortBy[0] + '&'
                    }
                }
                axios.get(process.env.VUE_APP_BACKEND_ROUTE + "api/v2/companies?" + link + "page=" + page + "&itemsPerPage=" + itemsPerPage).then(response => {
                    clients = this.mapClients(response.data.data)
                    total = total = response.data.meta.total
                    resolve({
                        clients,
                        total,
                    })
                })
            })
        },
        mapClients(clients){
            console.log(clients)
            return clients.map(id=>{
                return{
                    id:id.id,
                    name:id.attributes.name,
                    razon_social: id.attributes.razon_social,
                    number:id.attributes.macro,
                    address:id.attributes.address,
                    phone:id.attributes.phone,
                    email:id.attributes.email,
                    rfc:id.attributes.rfc,
                    razon_social:id.attributes.razon_social,
                    phase: this.exist(id.attributes.phase),
                    origin: this.exist(id.attributes.origin),
                    status: this.exist(id.attributes.status),
                    salesman:this.userName(id.attributes.user),
                    created_at:id.attributes.created_at,
                    updated_at:id.attributes.updated_at,
                    type_id:this.exist(id.attributes.company_type),
                    credit_days:id.attributes.credit_days*1,
                    activity_indicator: id.attributes.activity_indicator,
                    editedItem:id,
                    consumptions:this.mapCategories(id.attributes.consumptions),
                    fiscal_address_json:id.fiscal_address_json,
                    birth_date:id.attributes.birth_date
                }
            });
        },
        exist(item){
            if(item!=undefined){
                return item.name
            }else{
                return ''
            }
        },
        userName(user){
            var name = user.name
            if(user.last!=null){
                return name + ' ' + user.last
            }else{
                return name
            }
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
        filtersCompanies: function(params) {
            this.getDataFromApi()
        },
        closeEditDialogClient: function(params) {
            this.editDialog = false;
            this.getDataFromApi()
        },
        closeCreateDialogClient: function(params) {
            this.createDialog = false;
            this.getDataFromApi()
        },
        exportExcel: function () {
            let data = XLSX.utils.json_to_sheet(this.clients)
            const workbook = XLSX.utils.book_new()
            const filename = 'Lista de Nominas'
            XLSX.utils.book_append_sheet(workbook, data, filename)
            XLSX.writeFile(workbook, `${filename}.xlsx`)
        },
        deleteClient(){
            axios.delete(process.env.VUE_APP_BACKEND_ROUTE + "api/v2/companies/"+this.deleteId).then(response => {
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
        cancel(){
            this.deleteId = ''
            this.sheet = false
        },
        deleteItem (id) {
            this.deleteId = id
            this.sheet = true
        },
        editItem(editedItem){
            this.client = [editedItem].map(id=>{
                return{
                    id:id.id,
                    user_id:this.ids(id.attributes.user),
                    phase_id:this.ids(id.attributes.phase),
                    origin_id:this.ids(id.attributes.origin),
                    status_id:this.ids(id.attributes.status),
                    type_id:this.ids(id.attributes.company_type),
                    frequency_id:this.ids(id.attributes.frequency),

                    delivery_time:id.attributes.delivery_time,
                    name:id.attributes.name,
                    address:id.attributes.address,
                    phone:id.attributes.phone,
                    email:id.attributes.email,
                    rfc:id.attributes.rfc,
                    razon_social:id.attributes.razon_social,
                    number:id.attributes.macro,
                    delivery_address:id.attributes.delivery_address,
                    credit_days:id.attributes.credit_days,

                    city_id:this.ids(id.attributes.city),
                    payment_method_id:this.ids(id.attributes.payment_method),
                    price_list_id:this.ids(id.attributes.price_list),
                    zone_id:this.ids(id.attributes.zone),
                    contact_mode_id:this.ids(id.attributes.contact_mode),
                    cfdi_id:this.ids(id.attributes.cfdi),

                    payment_conditions:id.attributes.payment_conditions,
                    opportunity_area:id.attributes.opportunity_area,
                    consumptions:id.attributes.consumptions,//this.mapCategories(id.attributes.consumptions),
                    special_conditions:id.attributes.special_conditions,
                    special_note:id.attributes.special_note,
                    credit_limit:id.attributes.credit_limit,
                    bank_account_number:id.attributes.bank_account_number,
                    fiscal_address_json:id.attributes.fiscal_address_json,
                    birth_date:id.birth_date

                }
            })[0]
            this.editDialog = true
        },
        mapCategories(consumptions){
            //return consumptions
            var response = ''
            if(consumptions!=undefined){
                for(var i=0; i<consumptions.length; i++){
                    response = response + this.categoryLists.filter(category=>category.id == consumptions[i]).map(category=>category.name)[0]
                    if(i!=(consumptions.length-1)){
                        response = response + ', '
                    }
                }
            }
            return response
        },
        ids(item){
            if(item!=undefined){
                return item.id*1
            }else{
                return ''
            }
        },
        changePhase(id, phase){
            var editedItem = this.$store.state.company.companies.filter(company=>company.id == id)[0]
            editedItem.phase_id = phase
            axios.put(process.env.VUE_APP_BACKEND_ROUTE + "api/v1/company/update",Object.assign(editedItem)).then(response=>{
                this.$store.dispatch('company/getCompanies')
            }).catch(error => {
                this.snackbar = {
                    message: error.response.data.message,
                    color: 'error',
                    show: true
                }
            })
        },
        changeStatus(id, status){
            var editedItem = this.$store.state.company.companies.filter(company=>company.id == id)[0]
            editedItem.status_id = status
            axios.put(process.env.VUE_APP_BACKEND_ROUTE + "api/v1/company/update",Object.assign(editedItem)).then(response=>{
                this.$store.dispatch('company/getCompanies')
            }).catch(error => {
                this.snackbar = {
                    message: error.response.data.message,
                    color: 'error',
                    show: true
                }
            })
        },
    },
}
</script>


<style>
    .semaforo{
        content: ' ';
        position: absolute;
        border-radius:50%;
    }
    @media(min-width: 980px){
        .semaforo{
            width: 8px;
            height: 8px;
            margin-top: 13px;
            margin-left: -10px;
        }
        .detail{
            transform: translateX(14px);
        }
    }
    @media(max-width: 980px){
        .semaforo {
            width: 12px;
            height: 12px;
            left: 9px;
            margin-left: 40px!important;
            margin-top: 20px!important;
        }
    }
</style>



