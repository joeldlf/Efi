<template>
    <v-container class="pa-4" style="max-width:100vw;">
        <!-- Contenedor -->
        <v-data-table
        class="pa-4"
        :items="clients" 
        :headers="header"
        :footer-props="{'items-per-page-options':[15, 30, 50, totalClients]}"
        :options.sync="options"
        :server-items-length="totalClients"
        :loading="loading"
        show-expand>
            <!-- Header -->
            <template v-slot:top>
                <v-toolbar flat >
                    <v-toolbar-title>Clientes</v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-text-field label="Buscar" @keydown.enter="getDataFromApi()" rounded dense outlined append-icon="mdi-magnify" v-model="search"></v-text-field>
                </v-toolbar>
            </template>
            <!-- Tabla sin información -->
            <template v-slot:no-data>
                Todos los clientes estan verficiados
            </template>

            <template v-slot:[`item.fiscal_address`]="{ item }">
                {{item.fiscal_address.street}} 
                <span v-if="item.fiscal_address.exterior!=''">#{{item.fiscal_address.exterior}}</span>
                <span v-if="item.fiscal_address.interior!=''">, {{item.fiscal_address.interior}}</span>
                <span v-if="item.fiscal_address.neighborhood!=''">{{item.fiscal_address.neighborhood}},</span>
                <span v-if="item.fiscal_address.city!=''">{{item.fiscal_address.city}},</span>
                {{item.fiscal_address.municipality}}
                {{item.fiscal_address.zip}}
                <span v-if="item.fiscal_address.state!=''">{{item.fiscal_address.state}},</span>
                {{item.fiscal_address.country}}
            </template>
            
            <template v-slot:expanded-item="{ headers, item }">
                <td :colspan="headers.length" class="pb-4">
                    <v-text-field v-model="item.razon_social" :error="nosa(item.razon_social)" hint="sin el régimen societario (ej.: S.A. de C.V.)." persistent-hint dense class="mt-6 mb-4" label="Razón Social*" rounded outlined></v-text-field>
                    <v-row>
                        <v-col cols="4" class="py-0">
                            <v-text-field v-model="item.rfc" dense label="RFC*" rounded outlined></v-text-field>
                        </v-col>
                        <v-col cols="4" class="py-0">
                            <v-text-field v-model="item.email" dense label="Email" rounded outlined></v-text-field>
                        </v-col>
                        <v-col cols="4" class="py-0">
                            <v-autocomplete v-model="item.tax_system" dense label="Régimen Fiscal*" rounded outlined :items="tax_systems" item-text="name" item-value="id"></v-autocomplete>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="4" class="pt-0">
                            <v-text-field v-model="item.fiscal_address.street" dense label="Calle" rounded outlined></v-text-field>
                        </v-col>
                        <v-col cols="4" class="pt-0">
                            <v-text-field v-model="item.fiscal_address.exterior" dense label="# Exterior" rounded outlined></v-text-field>
                            </v-col>
                        <v-col cols="4" class="pt-0">
                            <v-text-field v-model="item.fiscal_address.interior" dense label="# Interior" rounded outlined></v-text-field>
                            </v-col>
                        <v-col cols="4" class="pt-0">
                            <v-text-field v-model="item.fiscal_address.neighborhood" dense label="Colonia" rounded outlined></v-text-field>
                            </v-col>
                        <v-col cols="4" class="pt-0">
                            <v-text-field v-model="item.fiscal_address.city" dense label="Ciudad" rounded outlined></v-text-field>
                            </v-col>
                        <v-col cols="4" class="pt-0">
                            <v-text-field v-model="item.fiscal_address.municipality" dense label="Municipio" rounded outlined></v-text-field>
                            </v-col>
                        <v-col cols="4" class="pt-0">
                            <v-text-field v-model="item.fiscal_address.zip" dense label="Código Postal*" rounded outlined></v-text-field>
                            </v-col>
                        <v-col cols="4" class="pt-0">
                            <v-text-field v-model="item.fiscal_address.state" dense label="Estado" rounded outlined></v-text-field>
                            </v-col>
                        <v-col cols="4" class="pt-0">
                            <v-text-field class="mb-2" v-model="item.fiscal_address.country" hint="Código de país acorde al estándar ISO 3166-1 alpha-3" persistent-hint dense label="Código de País" rounded outlined></v-text-field>
                        </v-col>
                    </v-row>
                    <v-row class="ma-0 pt-2">
                        <v-spacer/>
                        <v-btn rounded color="primary" @click="save(item)" :disabled="readyToSave(item)" class="elevation-0">Guardar</v-btn>
                    </v-row>
                </td>
            </template>
        </v-data-table>
        <!-- errores -->
        <v-snackbar :color="snackbar.color" v-model="snackbar.show">
            {{ snackbar.message }}
        </v-snackbar>
    </v-container>
</template>

<script>
import fiscal_catalogs from '../../mixins/fiscal_catalogs'
import axios from "axios";
export default {
    mixins: [fiscal_catalogs],
    data: () => ({
        search:'',
        totalClients: 0,
        clients: [],
        client:{},
        loading: true,
        options: {},
        sheet: false,
        snackbar: {
            show: false,
            message: null,
            color: null
        },
    }),
    computed:{
        header(){ 
            return [
                { text: '', value: 'data-table-expand' },
                { text: 'Nombre', value: 'name' },
                { text: 'Razón Social', value: 'razon_social' },
                { text: 'RFC', value: 'rfc' },
                { text: 'Dirección', value: 'fiscal_address' },
                { text: 'Régimen Fiscal', value: 'tax_system' },
                { text: 'Email', value: 'email' },
            ]
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
        readyToSave(client){
            if(client.razon_social!=undefined&&client.rfc!=undefined&&client.tax_system!=undefined&&client.fiscal_address.zip!=undefined&&
            client.razon_social!=null&&client.rfc!=null&&client.tax_system!=null&&client.fiscal_address.zip!=null&&
            client.razon_social!=''&&client.rfc!=''&&client.tax_system!=''&&client.fiscal_address.zip!=''){
                return false
            }else{
                return true
            }
        },
        nosa(razon_social){
            if(razon_social!=undefined && (
                razon_social.toLowerCase().includes('s.a. de c.v')||
                razon_social.toLowerCase().includes('sa de cv')||
                razon_social.toLowerCase().includes('sapi de cv')||
                razon_social.toLowerCase().includes('sapi')||
                razon_social.toLowerCase().includes('s.a de c.v')||
                razon_social.toLowerCase().includes('s. c')||
                razon_social.toLowerCase().includes('s.c')||
                razon_social.toLowerCase().includes('s.a.s')||
                razon_social.toLowerCase().includes('s. a. s')||
                razon_social.toLowerCase().includes('rl de cv')
            )){
                return true
            }else{
                return false
            }
        },
        toLowerCase(email){
            if(email!=undefined){
                return email.toLowerCase()
            }
        },
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
                const { sortBy, sortDesc, page, itemsPerPage } = this.options
                var clients = []
                var total = 0
                var link = ''
                if(sortBy.length === 1){
                    if(sortDesc[0]){
                        link = link + "sort=-" + sortBy[0] + '&'
                    }else{
                        link = link + "sort=" + sortBy[0] + '&'
                    }
                }
                if(this.search!=undefined&&this.search!=null&&this.search!=''){
                    link = link + 'filter[name]=' + this.search + '&'
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
            return clients.map(id=>{
                return{
                    id:id.id,
                    razon_social: id.attributes.razon_social,
                    name: id.attributes.name,
                    email:this.toLowerCase(id.attributes.email),
                    rfc:id.attributes.rfc,
                    fiscal_address:this.haveAddress(id.attributes.fiscal_address),
                    tax_system:id.attributes.tax_system
                }
            });
        },
        haveAddress(address){
            if(address!=undefined&&address!=null&&address!=''){
                return address
            }else{
                return {
                    street:'',
                    exterior:'',
                    interior:'',
                    neighborhood:'',
                    city:'',
                    municipality:'',
                    zip:'',
                    state:'',
                    country:'MEX'
                }
            }
        },
        save(item){
            var facturApiClient = [item].map(id=>{return{
                legal_name: id.razon_social,
                email: id.email,
                tax_id: id.rfc,
                address: id.fiscal_address,
                tax_system: id.tax_system
            }})[0]
            let config = {
                headers: {
                    'Authorization': "Bearer " + process.env.VUE_APP_FACTURAPI_TOKEN, 
                    'Content-Type': "application/json"
                }
            }
            axios.post('https://www.facturapi.io/v2/customers', facturApiClient, config).then(response => {
                //axios.get('https://www.facturapi.io/v2/customers/' + response.data.id + '/tax-info-validation', config).then(response => {
                    item.facturapi_id = response.data.id
                    item.validation = true
                    axios.patch(process.env.VUE_APP_BACKEND_ROUTE + "api/v2/companies/" + item.id, item).then(response => {
                        this.snackbar = {
                            message: 'Datos actualizados con éxito',
                            color: 'error',
                            show: true
                        }
                        this.getDataFromApi()
                    })
                //})
            }).catch(error => {
                this.snackbar = {
                    message: error.response.data.message,
                    color: 'error',
                    show: true
                }
            })
        }
    },
}
</script>
<style>
.v-data-table > .v-data-table__wrapper tbody tr.v-data-table__expanded__content {
    box-shadow: none!important;
    background: #fcfcff!important;
}
</style>