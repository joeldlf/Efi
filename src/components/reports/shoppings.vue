<template>
  <v-card class="elevation-0 ma-8 py-6 px-8">
    <v-row class="ma-0 pb-4">
        <v-card-title>
            Reporte de Compras
        </v-card-title>
        <v-spacer/>
        <v-autocomplete clearable v-model="provider_id" :items="providers" label="Proveedor" item-text="name" item-value="id">
            <template slot="no-data">
                <div class="px-6 pt-3">
                    No existen proveedores relacionados.
                </div>
            </template>
        </v-autocomplete>
    </v-row>
    <v-data-table
        :headers="headers" 
        :items="products"
    >
    <template v-slot:[`item.latest_shopping_id`]="{ item }">
        <v-list-item v-if="item.latest_shopping_id!=''" class="px-0" style="min-height:0px!important; font-size:14px;" :to="{ path: '/shoppings/'+ item.latest_shopping_id}">{{item.latest_shopping_id + ' | ' + item.latest_provider}}</v-list-item>
    </template>
    <template v-slot:[`item.inventory`]="{ item }">
        <v-list-item class="px-0" style="min-height:0px!important; font-size:14px;" :to="{ path: '/inventory-reports/'+ item.id}">{{item.inventory}}</v-list-item>
    </template>
    <template v-slot:[`item.latest_cost`]="{ item }">
        <v-list-item class="px-0" style="min-height:0px!important; font-size:14px;">{{(item.latest_cost*1).toLocaleString('es-MX', { style: 'currency', currency: 'MXN',})}}</v-list-item>
    </template>
    </v-data-table>
  </v-card>
</template>

<script>
import axios from "axios"
export default {
    data(){
        return{
            provider_id:'',
            products:[],
            providers:[],
            headers:[
                { text: 'Producto', value: 'name' },
                /*{ text: 'Ventas Mes Pasado', value: 'sales_count' },
                { text: 'Inventario Actual', value: 'inventory' },
                { text: 'Sugerencia de Compra', value: 'sugested_shopping' },
                { text: 'Última Compra', value: 'latest_shopping_id' },
                { text: 'Último Proveedor', value: 'latest_provider' },
                { text: 'Último Costo', value: 'latest_cost' },*/
                { text: 'Ventas Trimestre', value: 'last_quarter_quantity' },
                { text: 'Promedio Ventas Trimestre', value: 'last_quarter_quantity_avg' },
                { text: 'Inventario', value: 'inventory' },
                { text: 'Sugerencia de Compra (en base al trimestre)', value: 'sugested_shopping' },
                { text: 'Ventas Ûltimos 30 Días', value: 'last_thirty_days_quantity' },
                { text: 'Ûltima Compra', value: 'latest_shopping_id' },
                { text: 'Ûltimo costo', value: 'latest_cost' },
            ]
        }
    },
    mounted(){
        axios.get(process.env.VUE_APP_BACKEND_ROUTE + "api/v1/provider/all").then(resp => {
            this.providers = resp.data
            axios.get(process.env.VUE_APP_BACKEND_ROUTE + "api/v2/shopping_item_report").then(response=>{
                this.products = response.data.map(id=>{
                    return{
                        id:id.id,
                        name:id.name,
                        last_quarter_quantity_avg:(id.last_quarter_quantity/3).toFixed(2),
                        last_quarter_quantity:(id.last_quarter_quantity*1).toFixed(2),
                        latest_provider: id.latest_shopping!=null?this.providerName(id.latest_shopping.provider_id):'',
                        latest_cost: id.latest_shopping!=null?id.latest_shopping.unit_cost:'',
                        inventory:(id.inventory*1).toFixed(2),
                        sugested_shopping:((id.last_quarter_quantity/3) - (id.inventory*1)).toFixed(2),
                        latest_shopping_id: id.latest_shopping!=null?id.latest_shopping.id:'',
                        latest_provider_id: id.latest_shopping!=null?id.latest_shopping.provider_id:'',
                        last_thirty_days_quantity:(id.last_thirty_days_quantity*1).toFixed(2)
                    }
                })
                this.storeProducts = this.products
                const provider_id = localStorage.getItem('shopping_report_provider')
                if(provider_id){
                    this.provider_id = provider_id*1
                }
            })
        })
    },
    methods:{
        providerName(id){
            return this.providers.filter(provider=>provider.id == id).map(provider=>provider.name)[0]
        },
    },
    watch:{
        provider_id:{
            handler(){
                if(this.provider_id==''||this.provider_id==undefined||this.provider_id==null){
                    this.products = this.storeProducts
                    localStorage.removeItem('shopping_report_provider')
                }else{
                    this.products = this.storeProducts.filter(id=>id.latest_provider_id == this.provider_id)
                    localStorage.setItem('shopping_report_provider', this.provider_id)
                }
            }, deep:true
        }
    },
}
</script>

<style>

</style>