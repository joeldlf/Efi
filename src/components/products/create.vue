<template>
  <v-container style="max-width:100vw;">
    <v-card class="elevation-0 pa-6">

        <!-- header -->
        <v-row class="mt-0 mb-6 mx-4">

            <v-autocomplete outlined dense hide-details rounded v-if="newProduct==''" v-model="product_id" :items="productsList" :loading="isLoadingProducts" :search-input.sync="searchProducts" item-text="name" item-value="id" label="Producto" placeholder="Escribe para buscar o crear">
                <template slot="no-data">
                    <div class="px-6 pt-3" v-if="searchProducts!=null && !isLoadingProducts"><!--@keydown.enter="search=true"  ----  &&!isLoadingProducts&&!search-->
                        No existen productos relacionados.
                        <v-text-field v-model="searchProducts" label="Crear Producto" append-icon="mdi-plus" @click:append="newProduct=searchProducts"></v-text-field>
                    </div>
                    <div class="px-6 pt-3" v-else>
                        Escribe para buscar o crear
                    </div>
                </template>
            </v-autocomplete>
            <div style="padding:20px 50px 20px 0px; font-weight:600;" v-else>{{newProduct}}</div>

            <div class="mx-8" v-if="product.provider!=''&&product.provider!=undefined">
                <span>Proveedor Actual:</span>
                <br/>
                <v-chip :to="{ path: '/providers/'+ product.provider.id}" small class="mt-1" color="#e4e4e4" style="font-weight:500;">{{product.provider.name}}</v-chip>
            </div>

            <v-autocomplete outlined dense hide-details rounded class="mx-8" v-else :items="providers" :search-input.sync="createProvider.name" label="Proveedor" item-text="name" item-value="id" v-model="provider_id">
                <template slot="no-data">
                    <div class="px-6 pt-3">
                        No existen proveedores relacionados.
                        <v-text-field v-model="createProvider.name" label="Crear Proveedor" append-icon="mdi-plus" @click:append="saveProvider()"></v-text-field>
                    </div>
                </template>
            </v-autocomplete>
            
            <v-btn class="elevation-0" color="primary" v-if="product.id!=undefined" rounded @click="modifyProduct()">Guardar</v-btn>
            <v-btn class="elevation-0" color="primary" v-else rounded @click="saveProduct()">Guardar</v-btn>
        </v-row>

        <!-- form -->
        <v-row class="ma-0">
            <v-col cols="6">
                <v-row class="ma-0 justify-center" style="border:solid 1px grey;">
                    <v-col cols="4" class="px-0">
                        <div class="tabla"></div>
                        <div class="tabla">
                            <span style="font-weight:500; margin:auto;">PRECIO 1</span>
                        </div>
                        <div class="tabla">
                            <span style="font-weight:500; margin:auto;">PRECIO 2</span>
                        </div>
                        <div class="tabla">
                            <span style="font-weight:500; margin:auto;">PRECIO 3</span>
                        </div>
                        <div class="tabla">
                            <span style="font-weight:500; margin:auto;">PRECIO 4</span>
                        </div>
                    </v-col>
                    <v-col cols="4" class="px-0">
                        <div class="tabla" style="background:#d9eaff;">
                            <v-checkbox style="margin:auto; font-weight:500;" :hide-details="true" v-model="prices_without_iva" label="SIN IVA"></v-checkbox>
                        </div>
                        <div class="tabla">
                            <v-text-field outlined dense hide-details rounded v-if="prices_without_iva" style="margin:auto;" prefix="$" class="mx-6" v-model="product.price"></v-text-field>
                            <span style="margin:auto; font-weight:600;" v-else-if="modify_utility">{{(priceByUtility((product.profit_margin_1*1), '1')).toLocaleString('es-MX', { style: 'currency', currency: 'MXN',})}}    </span>
                            <span style="margin:auto; font-weight:600;" v-else>{{(product.price_iva/1.16).toLocaleString('es-MX', { style: 'currency', currency: 'MXN',})}}</span>
                        </div>
                        <div class="tabla">
                            <v-text-field outlined dense hide-details rounded v-if="prices_without_iva" style="margin:auto;" prefix="$" class="mx-6" v-model="product.price_two"></v-text-field>
                            <span style="margin:auto; font-weight:600;" v-else-if="modify_utility">{{(priceByUtility((product.profit_margin_2*1), '2')).toLocaleString('es-MX', { style: 'currency', currency: 'MXN',})}}</span>
                            <span style="margin:auto; font-weight:600;" v-else>{{(product.price_two_iva/1.16).toLocaleString('es-MX', { style: 'currency', currency: 'MXN',})}}</span>
                        </div>
                        <div class="tabla">
                            <v-text-field outlined dense hide-details rounded v-if="prices_without_iva" style="margin:auto;" prefix="$" class="mx-6" v-model="product.price_three"></v-text-field>
                            <span style="margin:auto; font-weight:600;" v-else-if="modify_utility">{{(priceByUtility((product.profit_margin_3*1), '3')).toLocaleString('es-MX', { style: 'currency', currency: 'MXN',})}}</span>
                            <span style="margin:auto; font-weight:600;" v-else>{{(product.price_three_iva/1.16).toLocaleString('es-MX', { style: 'currency', currency: 'MXN',})}}</span>
                        </div>
                        <div class="tabla">
                            <v-text-field outlined dense hide-details rounded v-if="prices_without_iva" style="margin:auto;" prefix="$" class="mx-6" v-model="product.price_four"></v-text-field>
                            <span style="margin:auto; font-weight:600;" v-else-if="modify_utility">{{(priceByUtility((product.profit_margin_4*1), '4')).toLocaleString('es-MX', { style: 'currency', currency: 'MXN',})}}</span>
                            <span style="margin:auto; font-weight:600;" v-else>{{(product.price_four_iva/1.16).toLocaleString('es-MX', { style: 'currency', currency: 'MXN',})}}</span>
                        </div>
                    </v-col>
                    <v-col cols="4" class="px-0">
                        <div class="tabla" style="background:#d9eaff;">
                            <v-checkbox style="margin:auto; font-weight:500;" :hide-details="true" v-model="prices_with_iva" label="CON IVA"></v-checkbox>
                        </div>
                        <div class="tabla">
                            <v-text-field outlined dense hide-details rounded v-if="prices_with_iva" style="margin:auto;" prefix="$" v-model="product.price_iva" class="mx-6"></v-text-field>
                            <span style="margin:auto; font-weight:600;" v-else-if="modify_utility">{{((priceByUtility((product.profit_margin_1*1), '1'))*1.16).toLocaleString('es-MX', { style: 'currency', currency: 'MXN',})}}</span>
                            <span style="margin:auto; font-weight:600;" v-else>{{(product.price*1.16).toLocaleString('es-MX', { style: 'currency', currency: 'MXN',})}}</span>
                        </div>
                        <div class="tabla">
                            <v-text-field outlined dense hide-details rounded v-if="prices_with_iva" style="margin:auto;" prefix="$" v-model="product.price_two_iva" class="mx-6"></v-text-field>
                            <span style="margin:auto; font-weight:600;" v-else-if="modify_utility">{{((priceByUtility((product.profit_margin_2*1), '2'))*1.16).toLocaleString('es-MX', { style: 'currency', currency: 'MXN',})}}</span>
                            <span style="margin:auto; font-weight:600;" v-else>{{(product.price_two*1.16).toLocaleString('es-MX', { style: 'currency', currency: 'MXN',})}}</span>
                        </div>
                        <div class="tabla">
                            <v-text-field outlined dense hide-details rounded v-if="prices_with_iva" style="margin:auto;" prefix="$" v-model="product.price_three_iva" class="mx-6"></v-text-field>
                            <span style="margin:auto; font-weight:600;" v-else-if="modify_utility">{{((priceByUtility((product.profit_margin_3*1), '3'))*1.16).toLocaleString('es-MX', { style: 'currency', currency: 'MXN',})}}</span>
                            <span style="margin:auto; font-weight:600;" v-else>{{(product.price_three*1.16).toLocaleString('es-MX', { style: 'currency', currency: 'MXN',})}}</span>
                        </div>
                        <div class="tabla">
                            <v-text-field outlined dense hide-details rounded v-if="prices_with_iva" style="margin:auto;" prefix="$" v-model="product.price_four_iva" class="mx-6"></v-text-field>
                            <span style="margin:auto; font-weight:600;" v-else-if="modify_utility">{{((priceByUtility((product.profit_margin_4*1), '4'))*1.16).toLocaleString('es-MX', { style: 'currency', currency: 'MXN',})}}</span>
                            <span style="margin:auto; font-weight:600;" v-else>{{(product.price_four*1.16).toLocaleString('es-MX', { style: 'currency', currency: 'MXN',})}}</span>
                        </div>
                    </v-col>
                </v-row>
            </v-col>
            <v-col cols="6">
                <v-row class="ma-0" style="border:solid 1px grey;">
                    <v-col cols="5" class="pa-0">
                        <div class="tabla" style="background:#d9eaff;">
                            <div style="margin:auto;">
                                <span style="font-weight:500;">
                                    COSTO
                                </span>
                            </div>
                        </div>
                        <div class="tabla" style="height:360px!important;">
                            <v-text-field outlined hide-details rounded style="margin:auto;" v-model="product.cost" prefix="$" class="mx-6"></v-text-field>
                        </div>
                    </v-col>
                    <v-col cols="7" class="pa-0">
                        <div class="tabla" style="background:#d9eaff;">
                            <div style="margin:auto;">
                                <span style="font-weight:500;">
                                    UTILIDAD
                                    <v-icon @click="modify_utility=true" small>mdi-pencil</v-icon>
                                </span>
                            </div>
                        </div>
                        <div class="tabla">
                            <div style="margin:auto; text-align:center!important;">
                                <span v-if="prices_without_iva">{{(utilityAmount(product.price)).toLocaleString('es-MX', { style: 'currency', currency: 'MXN',})}}</span>
                                <span v-else-if="prices_with_iva">{{(utilityAmount(product.price_iva/1.16)).toLocaleString('es-MX', { style: 'currency', currency: 'MXN',})}}</span>
                                <br/>
                                <span v-if="!modify_utility && product.price>0 && prices_without_iva">{{utilityPercentage(product.price, '1')}}%</span>
                                <span v-else-if="!modify_utility && product.price_iva>0 && prices_with_iva">{{utilityPercentage((product.price_iva/1.16), '1')}}%</span>
                                <span v-else-if="!modify_utility">0%</span>
                                <v-text-field v-else v-model="product.profit_margin_1" suffix="%" outlined dense hide-details rounded></v-text-field>
                            </div>
                        </div>
                        <div class="tabla">
                            <div style="margin:auto; text-align:center!important;">
                                <span v-if="prices_without_iva">{{(utilityAmount(product.price_two)).toLocaleString('es-MX', { style: 'currency', currency: 'MXN',})}}</span>
                                <span v-else-if="prices_with_iva">{{(utilityAmount(product.price_two_iva/1.16)).toLocaleString('es-MX', { style: 'currency', currency: 'MXN',})}}</span>
                                <br/>
                                <span v-if="!modify_utility && product.price_two>0 && prices_without_iva">{{utilityPercentage(product.price_two, '2')}}%</span>
                                <span v-else-if="!modify_utility && product.price_two_iva>0 && prices_with_iva">{{utilityPercentage((product.price_two_iva/1.16), '2')}}%</span>
                                <span v-else-if="!modify_utility">0%</span>
                                <v-text-field v-else v-model="product.profit_margin_2" suffix="%" outlined dense hide-details rounded></v-text-field>
                            </div>
                        </div>
                        <div class="tabla">
                            <div style="margin:auto; text-align:center!important;">
                                <span v-if="prices_without_iva">{{(utilityAmount(product.price_three)).toLocaleString('es-MX', { style: 'currency', currency: 'MXN',})}}</span>
                                <span v-else-if="prices_with_iva">{{(utilityAmount(product.price_three_iva/1.16)).toLocaleString('es-MX', { style: 'currency', currency: 'MXN',})}}</span>
                                <br/>
                                <span v-if="!modify_utility && product.price_three>0 && prices_without_iva">{{utilityPercentage(product.price_three, '3')}}%</span>
                                <span v-else-if="!modify_utility && product.price_three_iva>0 && prices_with_iva">{{utilityPercentage((product.price_three_iva/1.16), '3')}}%</span>
                                <span v-else-if="!modify_utility">0%</span>
                                <v-text-field v-else v-model="product.profit_margin_3" suffix="%" outlined dense hide-details rounded></v-text-field>
                            </div>
                        </div>
                        <div class="tabla">
                            <div style="margin:auto; text-align:center!important;">
                                <span v-if="prices_without_iva">{{(utilityAmount(product.price_four)).toLocaleString('es-MX', { style: 'currency', currency: 'MXN',})}}</span>
                                <span v-else-if="prices_with_iva">{{(utilityAmount(product.price_four_iva/1.16)).toLocaleString('es-MX', { style: 'currency', currency: 'MXN',})}}</span>
                                <br/>
                                <span v-if="!modify_utility && product.price_four>0 && prices_without_iva">{{utilityPercentage(product.price_four, '4')}}%</span>
                                <span v-else-if="!modify_utility && product.price_four_iva>0 && prices_with_iva">{{utilityPercentage((product.price_four_iva/1.16), '4')}}%</span>
                                <span v-else-if="!modify_utility">0%</span>
                                <v-text-field v-else v-model="product.profit_margin_4" suffix="%" outlined dense hide-details rounded></v-text-field>
                            </div>
                        </div>
                    </v-col>
                </v-row>
            </v-col>
        </v-row>

        <!-- compras -->
        <v-data-table
        v-if="product.item_shopping_details!=undefined"
        class="pa-4"
        :items="product.item_shopping_details" 
        :headers="header"
        :loading="isLoadingProducts">
            <!-- Header -->
            <template v-slot:top>
                <v-toolbar flat >
                    <v-toolbar-title>Historial de Compras</v-toolbar-title>
                </v-toolbar>
            </template>
            <!-- Tabla sin información -->
            <template v-slot:no-data>
                No existen registros de compras para este producto
            </template>
            <!-- Proveedor -->
            <template v-slot:[`item.shopping.provider`]="{ item }">
                <v-list-item v-if="item!=undefined&&item.shopping!=undefined&&item.shopping.provider!=undefined" class="px-0" style="min-height:0px!important; font-size:14px;" :to="{ path: '/providers/'+ item.shopping.provider.id}">{{item.shopping.provider.name}}</v-list-item>
            </template>
            <!-- Compra -->
            <template v-slot:[`item.shopping.id`]="{ item }">
                <v-list-item v-if="item!=undefined&&item.shopping!=undefined" class="px-0" style="min-height:0px!important; font-size:14px;" :to="{ path: '/shoppings/'+ item.shopping.id}">{{item.shopping.id}}</v-list-item>
            </template>
            <!-- Costo -->
            <template v-slot:[`item.unit_cost`]="{ item }">
                {{(item.unit_cost*1).toLocaleString('es-MX', { style: 'currency', currency: 'MXN',})}}
            </template>
            <!-- Total -->
            <template v-slot:[`item.total`]="{ item }">
                {{(item.unit_cost*item.quantity).toLocaleString('es-MX', { style: 'currency', currency: 'MXN',})}}
            </template>
        </v-data-table>
    </v-card>

    <v-snackbar :color="snackbar.color" v-model="snackbar.show">
        {{ snackbar.message }}
    </v-snackbar>
  </v-container>
</template>

<script>
import axios from "axios";
import importProducts from "../products/import.vue"
export default {
    components:{
        'import-products': importProducts
    },
    data:()=>({
        snackbar: {
            show: false,
            message: null,
            color: null
        },
        saving_loader:false,
        modify_utility: false,
        prices_without_iva: true,
        prices_with_iva: false,
        cost_iva: false,
        utility_iva: false,
        dialog:false,
        search:false,
        provider_id:'',
        newProduct:'',
        product_id:'',
        product:{
            id:'',
            name:'',
            code_one:'',
            code_two:'',
            code_three:'',
            price:0,
            price_two:0,
            price_three:0,
            price_four:0,
            price_iva:0,
            price_two_iva:0,
            price_three_iva:0,
            price_four_iva:0,
            sat_key_code:'',
            provider:'',
            item_shopping_details:undefined,
            cost:0,
            profit_margin_1:0,
            profit_margin_2:0,
            profit_margin_3:0,
            profit_margin_4:0,
        },
        iva:{
            price:0,
            price_two:0,
            price_three:0,
            price_four:0
        },
        entries:{
            products: []
        },
        isLoadingProducts: false,
        searchProducts: null,
        createProvider:{
            name:'',
        },
        iva_pause:false,
        no_iva_pause:false
    }),
    watch: {
        product_id:{
            handler(){
                this.product = this.productsList.filter(product=>product.id == this.product_id)[0]
            }, deep:true
        },
        searchProducts(val){
            //if (this.companyLists.length > 0) return
            //if(this.search){
                if (this.isLoadingProducts) return
                this.isLoadingProducts = true
                axios.get(process.env.VUE_APP_BACKEND_ROUTE + 'api/v2/item/pos?filter[pos]='+val)
                .then(res => {
                    this.entries.products = res.data.data
                }).finally(() => (this.isLoadingProducts = false, this.search = false))
            //}
        },

        modify_utility:{
            handler: function () {
                if(this.modify_utility){

                    if(this.prices_with_iva){

                        this.product.price = (this.product.price_iva/1.16).toFixed(2)
                        this.product.price_two = (this.product.price_two_iva/1.16).toFixed(2)
                        this.product.price_three = (this.product.price_three_iva/1.16).toFixed(2)
                        this.product.price_four = (this.product.price_four_iva/1.16).toFixed(2)

                    }

                    if(this.prices_without_iva){

                        this.product.price_iva = (this.product.price*1.16).toFixed(2)
                        this.product.price_two_iva = (this.product.price_two*1.16).toFixed(2)
                        this.product.price_three_iva = (this.product.price_three*1.16).toFixed(2)
                        this.product.price_four_iva = (this.product.price_four*1.16).toFixed(2)

                    }

                    this.prices_with_iva = false
                    this.prices_without_iva = false

                }else{
                    
                    this.product.price = (this.priceByUtility((product.profit_margin_1*1), '1')).toFixed(2)
                    this.product.price_two = (this.priceByUtility((product.profit_margin_2*1), '2')).toFixed(2)
                    this.product.price_three = (this.priceByUtility((product.profit_margin_3*1), '3')).toFixed(2)
                    this.product.price_four = (this.priceByUtility((product.profit_margin_4*1), '4')).toFixed(2)

                    this.product.price_iva = (((this.priceByUtility(product.profit_margin_1*1), '1'))*1.16).toFixed(2)
                    this.product.price_two_iva = (((this.priceByUtility(product.profit_margin_2*1), '2'))*1.16).toFixed(2)
                    this.product.price_three_iva = (((this.priceByUtility(product.profit_margin_3*1), '3'))*1.16).toFixed(2)
                    this.product.price_four_iva = (((this.priceByUtility(product.profit_margin_4*1), '4'))*1.16).toFixed(2)

                }
                
            }, deep: true
        },
        prices_without_iva:{
            handler: function () {
                if(this.prices_without_iva){
                    this.modify_utility = false
                    this.prices_with_iva = false
                    this.product.price = (this.product.price_iva/1.16).toFixed(2)
                    this.product.price_two = (this.product.price_two_iva/1.16).toFixed(2)
                    this.product.price_three = (this.product.price_three_iva/1.16).toFixed(2)
                    this.product.price_four = (this.product.price_four_iva/1.16).toFixed(2)
                }
            },deep:true,
        },
        prices_with_iva:{
            handler: function () {
                if(this.prices_with_iva){
                    this.modify_utility = false
                    this.prices_without_iva = false
                    this.product.price_iva = (this.product.price*1.16).toFixed(2)
                    this.product.price_two_iva = (this.product.price_two*1.16).toFixed(2)
                    this.product.price_three_iva = (this.product.price_three*1.16).toFixed(2)
                    this.product.price_four_iva = (this.product.price_four*1.16).toFixed(2)
                }
            },deep:true,
        },
        cost:{
            handler: function (antes, despues) {
                //if(antes!=null){
                    if(this.product.price!=null&&this.product.price>0){
                        this.product.profit_margin_1 = this.utilityPercentage(this.product.price, '1')
                    }
                    if(this.product.price_two!=null&&this.product.price_two>0){
                        this.product.profit_margin_2 = this.utilityPercentage(this.product.price_two, '2')
                    }
                    if(this.product.price_three!=null&&this.product.price_three>0){
                        this.product.profit_margin_3 = this.utilityPercentage(this.product.price_three, '3')
                    }
                    if(this.product.price_four!=null&&this.product.price_four>0){
                        this.product.profit_margin_4 = this.utilityPercentage(this.product.price_four, '4')
                    }
                //}
            }
        }
    },
    computed: {
        cost(){
            return this.product.cost
        },
        header(){ return [
            { text: 'Fecha', value: 'shopping.date' },
            { text: 'Cantidad', value: 'quantity' },
            { text: 'Costo Unitario', value: 'unit_cost' },
            { text: 'Total', value: 'total' },
            { text: 'Proveedor', value: 'shopping.provider' },
            { text: 'Compra', value: 'shopping.id' },
        ]},
        productsList(){
            return this.entries.products.map(id => {
                return{
                    id:id.id,
                    name:id.name,
                    code_one:id.code_one,
                    code_two:id.code_two,
                    code_three:id.code_three,

                    price:id.price,
                    price_two:id.price_two,
                    price_three:id.price_three,
                    price_four:id.price_four,

                    price_iva: (id.price*1,16),
                    price_two_iva: (id.price_two*1,16),
                    price_three_iva: (id.price_three*1,16),
                    price_four_iva: (id.price_four*1,16),

                    sat_key_code:id.sat_key_code,
                    provider:this.provider(id.latestShopping),
                    item_shopping_details:id.item_shopping_details,

                    profit_margin_1:id.profit_margin_1*1,
                    profit_margin_2:id.profit_margin_2*1,
                    profit_margin_3:id.profit_margin_3*1,
                    profit_margin_4:id.profit_margin_4*1,

                    cost:id.cost,
                }
            })
        },
        providers:{
            get(){
                return this.$store.state.provider.providers;
            }
        },
    },
    methods:{
        utilityPercentage(price, position){
            var utility_percentaje = ((100/price)*(price - this.product.cost)).toFixed(2)
            switch(position){
                case '1': 
                    this.product.profit_margin_1 = utility_percentaje
                break;
                case '2': 
                    this.product.profit_margin_2 = utility_percentaje
                break;
                case '3': 
                    this.product.profit_margin_3 = utility_percentaje
                break;
                case '4': 
                    this.product.profit_margin_4 = utility_percentaje
                break;
            }
            return utility_percentaje
        },
        utilityAmount(price){
            return ((price*1)-(this.product.cost*1)).toFixed(2)
        },
        priceByUtility(utility_percentaje, position){

            const y = utility_percentaje * 1
            const z = this.product.cost * 1
            function calculateX(y, z) {
                let x = 0;
                while (true) {
                    const newX = ((x / 100) * y) + z;
                    if (newX === x) {
                        return x;
                    }
                    x = newX;
                }
            }
            const result = calculateX(y, z);
            
            switch(position){
                case '1': 
                    this.product.price = result.toFixed(2)
                break;
                case '2': 
                    this.product.price_two = result.toFixed(2)
                break;
                case '3': 
                    this.product.price_three = result.toFixed(2)
                break;
                case '4': 
                    this.product.price_four = result.toFixed(2)
                break;
            }
            
            return result.toFixed(2)
        },
        provider(latestShopping){
            if(latestShopping!=undefined){
                if(latestShopping.shopping!=undefined){
                    return latestShopping.shopping.provider
                }
            }else{
                return ''
            }
        },
        saveProvider(){
            axios.post(process.env.VUE_APP_BACKEND_ROUTE + "api/v2/item/pos",Object.assign(this.createProvider)).then(response=>{
                this.$store.dispatch('provider/getProviders')
            }) 
        },
        saveProduct(){
            var new_product = [this.product].map(id=>{return{
                name:this.newProduct,
                code_one:id.code_one,
                code_two:id.code_two,
                code_three:id.code_three,
                price:id.price,
                price_two:id.price_two,
                price_three:id.price_three,
                price_four:id.price_four,
                provider_id:this.provider_id,
                cost:id.cost,
                profit_margin_1:id.profit_margin_1,
                profit_margin_2:id.profit_margin_2,
                profit_margin_3:id.profit_margin_3,
                profit_margin_4:id.profit_margin_4,
            }})[0]
            axios.post(process.env.VUE_APP_BACKEND_ROUTE + "api/v1/item/create", new_product).then(response=>{
                
            })
        },
        modifyProduct(){
            if(this.provider_id!=''){
                this.product.provider_id = this.provider_id
            }
            var edited_product = [this.product].map(id=>{return{
                code_one:id.code_one,
                code_two:id.code_two,
                code_three:id.code_three,
                price:id.price,
                price_two:id.price_two,
                price_three:id.price_three,
                price_four:id.price_four,
                provider_id:id.provider_id,
                cost:id.cost,
                profit_margin_1:id.profit_margin_1,
                profit_margin_2:id.profit_margin_2,
                profit_margin_3:id.profit_margin_3,
                profit_margin_4:id.profit_margin_4,
            }})[0]
            axios.patch(process.env.VUE_APP_BACKEND_ROUTE + "api/v2/items/" + this.product.id, edited_product).then(response=>{
                this.snackbar = {
                    message: 'Ajuste realizado con éxito',
                    color: 'success',
                    show: true
                }
            }).catch(errpr=>{
                this.snackbar = {
                    message: 'Error al realizar el ajuste, revisa los valores e intenta de nuevo',
                    color: 'error',
                    show: true
                }
            })
        },
        closeImportDialog: function(params) {
            this.dialog = params;
        },
    }
}
</script>

<style>
.tabla{
    border: solid 1px grey!important;
    border-radius: 0px!important;
    height:90px;
    display: flex!important;
}
</style>