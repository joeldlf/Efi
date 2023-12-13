<template>
  <v-card class="elevation-0 ma-8 py-6 px-8">
    <v-row class="ma-0 pb-4">
        <v-card-title>
            Reporte de Productos Vendidos
        </v-card-title>
        <v-spacer/>
        <v-menu offset-y :close-on-content-click="closeDatePicker(dates)">
            <template v-slot:activator="{ on, attrs }">
                <v-text-field rounded outlined dense clearable v-model="dates" label="Fecha" prepend-inner-icon="mdi-calendar" v-bind="attrs" readonly v-on="on" class="mt-4"></v-text-field>
            </template>
            <v-date-picker v-model="dates" range></v-date-picker>
        </v-menu>
    </v-row>
    <v-data-table
        :headers="headers" 
        :items="products"
    >
    <template v-slot:[`item.total_amount`]="{ item }">
        {{item.total_amount.toLocaleString('es-MX', { style: 'currency', currency: 'MXN',})}}
    </template>
    <template v-slot:[`item.avg`]="{ item }">
        {{(item.total_amount/item.sales_count).toLocaleString('es-MX', { style: 'currency', currency: 'MXN',})}}
    </template>
    </v-data-table>
  </v-card>
</template>

<script>
import axios from "axios"
export default {
    data(){
        return{
            dates:[],
            products:[],
            headers:[
                { text: 'Producto', value: 'name' },
                { text: 'Cantidad Vendida', value: 'sales_count' },
                { text: 'Monto Vendido', value: 'total_amount' },
                { text: 'Precio Promedio', value: 'avg' },
            ]
        }
    },
    created(){
        var dates = []
        var current_date = new Date()
        dates[0] = new Date(current_date.getFullYear(), current_date.getMonth(), 1).toLocaleString("sv-SE", {timeZone: "America/Monterrey"}).toString().slice(0, 10)
        dates[1] = new Date(current_date.getFullYear(), current_date.getMonth() + 1, 0).toLocaleString("sv-SE", {timeZone: "America/Monterrey"}).toString().slice(0, 10)
        this.dates = dates
    },
    watch:{
        dates:{
            handler(){
                if(this.dates.length==2){
                    axios.get(process.env.VUE_APP_BACKEND_ROUTE + "api/v2/item/report?filter[created_between]=" + this.dates).then(response=>{
                        this.products = response.data
                    })
                }
            }, deep:true
        }
    },
    methods:{
        closeDatePicker(dates){
            if(dates!=undefined && dates.length==2){
                return true
            }else{
                return false
            }
        },
    }
}
</script>

<style>

</style>