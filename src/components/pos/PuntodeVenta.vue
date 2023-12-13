<template>
    <v-container class="pl-9">
        <!-- carrito-->
        <v-navigation-drawer :width="550" style="top:0!important; height:100vh; max-height:100vh;" right v-model="open_cart" :clipped="$vuetify.breakpoint.lgAndUp" app>
            <cart/>
        </v-navigation-drawer>

        <v-row class="mb-0 mx-0 px-4">
            <v-autocomplete @keydown.enter="filter()" v-model="client_id" :items="companyLists" :loading="isLoadingCompany" :search-input.sync="searchCompanies" hide-no-data item-value="id" item-text="name" label="Cliente" placeholder="Escribe para buscar" attach>
                <template v-slot:item="{item, attrs, on}">
                    <v-list-item v-on="on" v-bind="attrs">
                        <v-list-item-content>
                            <v-list-item-title v-if="item.name!=null">
                                <span v-if="item.macro!=null">{{item.macro}}</span>{{item.name}}
                                <div v-if="item.razon_social!=null">
                                    <span style="font-size:12px;">{{item.razon_social}}</span>
                                </div>
                            </v-list-item-title>
                            <v-list-item-title v-else-if="item.razon_social!=null">
                                {{item.razon_social}}
                            </v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                </template> 
            </v-autocomplete>
            
            <v-btn class="ml-12 mt-4 elevation-0" rounded color="primary" @click="createDialog = true">Agregar Cliente</v-btn>
        </v-row>

         <v-row class="mt-0 ml-2 mb-4">
            <v-text-field
            content-class="mt-0 py-0"
            rounded
            light
            append-icon="mdi-barcode"
            @click:append="scanner = true"
            class="mr-6"
            flat
            hide-details
            placeholder="Buscar Producto"
            prepend-inner-icon="mdi-magnify"
            background-color=#f5f6fa
            outlined
            filled
            dense
            v-model="searchInput"
            @keydown.enter="search()"
            ></v-text-field>
         </v-row>

        <v-row justify="center" class="ma-0">
            <v-col class="my-4 mx-0" v-for="(product,k) in products" :key="k" cols="6">
                <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                        <v-card class="elevation-0" v-bind="attrs" v-on="on">
                            <v-card :disabled="!(product.price!=undefined && product.price>0)" @click="addToCart(product)"><!--||(product.inventory<=0&&liga=='https://backendbdb.unocrm.mx/')-->
                                <v-img v-if="product.image!=undefined" height="150px" width="19vw" v-bind:src="liga + 'files/' + product.image"></v-img>
                                <v-card-subtitle class="pb-0">SKU:{{product.code_one}} | {{product.name}}</v-card-subtitle>
                                <v-card-text class="text--primary pb-4 pt-2">
                                    <v-row class="ma-0">
                                        <div style="line-height: 16px;" v-if="product.price!=undefined && product.price>0">{{(product.price*1).toLocaleString('es-MX', { style: 'currency', currency: 'MXN',})}}</div>
                                        <v-spacer/>
                                        <v-chip x-small>Inventario: {{product.inventory}}</v-chip>
                                    </v-row>
                                </v-card-text>
                                <v-row v-if="product.inventory<=0&&liga=='https://backendbdb.unocrm.mx/'" class="ma-0" style="background:#cfcfcf; color:black; font-size:12px; font-weight:bold;">
                                    <v-spacer/>
                                    <div class="mr-2">Sin existencia en esta susucral </div>
                                    <v-spacer/>
                                </v-row>
                            </v-card>
                        </v-card>
                    </template>
                    <div v-if="liga=='https://backendbdb.unocrm.mx/' && currentUser.branch[0].name!='CDMX'">
                        <strong>Existencia en otras sucursales</strong>
                        <div>
                            <li v-for="(value, key) in product.branch_inventories" :key="key">
                                {{ key }}: {{ value }}
                            </li>
                        </div>
                    </div>
                </v-tooltip>
            </v-col>
        </v-row>
        <v-row justify="center" v-if="products.length>=limit">
            <v-divider class="my-6 mx-12"></v-divider>
                <button @click="limit = limit+12">Ver Más</button>
            <v-divider  class="my-6 mx-12"></v-divider>
        </v-row>
        <v-row justify="center">
            <v-spacer/>
                <v-btn @click="createProductDialog=true" class="mt-6 elevation-0" rounded color="primary">Agregar Producto</v-btn>
            <v-spacer/>
        </v-row>
        <!-- Crear Cliente -->
        <v-dialog v-model="createDialog" max-width="700px">
          <create-client v-if="liga=='https://backendbdb.unocrm.mx/'" @closeCreateDialogClient="closeCreateDialogClient"/>
          <create v-else @closeCreateDialogClient="closeCreateDialogClient"/>
        </v-dialog>

        <!-- Crear producto -->
        <v-dialog v-model="createProductDialog" max-width="700px">
          <template v-slot:activator="{ on, attrs }">
            <v-btn bottom color="#e25200" dark fab fixed right v-bind="attrs" v-on="on">
                <v-icon color="white">  mdi-plus </v-icon>
            </v-btn> 
          </template>
          <createFelItem @closeDialogItem="closeDialogItem"/><!-- v-if="liga == 'https://backend.ferreteriaenlinea.com/'" -->
          <!--createItem v-else @closeDialogItem="closeDialogItem"/-->
        </v-dialog>

        <!-- Dialogo scanner -->
        <v-dialog v-model="scanner" max-width="350px">
            <v-quagga v-if="scanner==true" 
            :onDetected="logIt" 
            :readerTypes="['ean_reader']"
            :readerSize="readerSize"
            :aspectRatio="aspectRatio"
            ></v-quagga>
        </v-dialog> 

    </v-container>    
</template>
<script>
import axios from "axios";
import Cart from "../pos/Cart"
import Create from "../clients/companies/create"
import createFelItem from "../inventory/create_fel"
import createItem from "../inventory/create"
import CreateClient from "../clients/companies/create_client"
export default {
    components: {
        'cart':Cart,
        'create':Create,
        'createItem':createItem,
        'createFelItem':createFelItem,
        'create-client':CreateClient
    },
    data:()=>({ 
        readerSize: {
            width: 640,
            height: 480
        },
        aspectRatio: { min: 1, max: 2 },
        searchInput:'',
        createDialog:false,
        client_id:'',
        open_cart:true,
        limit:12,
        entries:{
            companies: []
        },
        isLoadingCompany: false,
        searchCompanies: null,
        scanner:false,
        createProductDialog:false
    }),
    computed:{
        currentUser:{
            get(){
                return this.$store.state.currentUser.user;
            }
        },
        companyLists(){
            return this.entries.companies.map(id=>{
                return{
                    id:id.id,
                    name:id.attributes.name,
                    macro:id.attributes.macro,
                    razon_social:id.attributes.razon_social,
                    price_list:id.attributes.price_list
                }
            })
        },
        liga(){
            return process.env.VUE_APP_BACKEND_ROUTE
        },
        cart() {
            return this.$store.state.cart.carts
        },
        products(){
            return this.$store.state.product.products.map(id=>{
                return{
                    id:id.id,
                    name:id.name,
                    price:this.productPrice(id),
                    cost:id.cost,
                    code_one:id.code_one,
                    facturapi_id:id.facturapi_id,
                    sat_key_code:this.rellenar(id.sat_key_code),
                    new_sat_key_code:'',
                    edit:false,
                    code_one: id.code_one,
                    unit:id.unit,
                    inventory:id.inventory,
                    branch_inventories:id.branch_inventories
                }
            })
        },
        client(){
            return this.$store.state.cart.client
        }
    },
    methods:{
        rellenar(sat_key){
            if(sat_key == '1010101' || sat_key == 1010101){
                return '31162800'
            }else{
                return sat_key
            }
        },
        search(){
            this.$store.commit('product/setSearchInput',this.searchInput) 
            this.$store.dispatch('product/getProducts', 12) 
        },
        logIt (data) {
            this.searchInput=data.codeResult.code
            this.scanner=false
        },
        closeCreateDialogClient: function(params) {
            axios.get(process.env.VUE_APP_BACKEND_ROUTE + 'api/v2/companies?filter[name_razon_social]='+params)
            .then(res => {
                this.entries.companies = res.data.data
                this.client_id =  res.data.data[0].id
                this.createDialog = false;
            })
        },
        closeDialogItem: function(params) {
            this.search()
            this.createProductDialog = false;
        },
        addToCart(id) {
            this.$store.dispatch("cart/addItem", id);
        },
        productPrice(product){
            if(this.liga == 'https://backendbdb.unocrm.mx/'){
                return product.price
            }else if(this.client_id!=''){
                var price = this.priceList(this.companyLists.filter(company=>company.id == this.client_id)[0].price_list.name)
                return product[price]*1
            }else{
                return product.price_four
            }
        },
        priceList(price){
            switch(price){
                case 'Precio 1': return 'price'
                case 'Precio 2': return 'price_two'
                case 'Precio 3': return 'price_three'
                case 'Precio 4': return 'price_four'
            }
        }
    },
    created(){
        this.$store.dispatch('product/getProducts', this.limit)
        this.$emit("closeDrawer", false);
    },
    watch:{
        client_id:{
            handler(){
                var client = this.companyLists.filter(client=>client.id == this.client_id)[0]
                this.$store.dispatch("cart/selectClient", client);
            }, deep: true,
        },
        limit:{
            handler(){
                this.$store.dispatch('product/getProducts', this.limit) 
            }, deep:true
        },
        searchCompanies(val){
            //if (this.companyLists.length > 0) return
            if (this.isLoadingCompany) return
            this.isLoadingCompany = true
            axios.get(process.env.VUE_APP_BACKEND_ROUTE + 'api/v2/companies?filter[name]='+val)
            .then(res => {
                this.entries.companies = this.entries.companies.concat(res.data.data)
            }).finally(() => (this.isLoadingCompany = false))
        },
    }
}
</script>