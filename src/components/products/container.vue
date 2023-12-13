<template>
<keep-alive>
    <v-container style="max-width:100vw;">
        <!-- Filtros -->
        <v-navigation-drawer style="top: 0px; max-height:100vh!important;" right v-model="filters" :clipped="$vuetify.breakpoint.lgAndUp" app>
            <filterInventory @filtersItem="filtersItem"/>
        </v-navigation-drawer>
        <!-- Contenedor -->

        <v-data-table :headers="headers" :loading="isLoadingProducts" :items="entries.products" class="elevation-0 px-6 py-4"><!-- show-expand -->
            <!-- Header -->
            <template v-slot:top>
                <v-toolbar flat >
                    <v-toolbar-title>Productos | Servicios </v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-text-field
                        v-model="searchProducts"
                        append-icon="mdi-magnify"
                        label="Buscar"
                        single-line
                        hide-details
                    ></v-text-field>
                    <v-spacer></v-spacer>
                    <!--v-btn icon>
                        <v-icon @click="openFilter()">mdi-filter</v-icon>
                    </v-btn-->
                </v-toolbar>
            </template>

            <!-- Footer -->
            <template v-slot:footer>
                <v-container style="margin-bottom:-80px!important;">
                    <v-select :items="sumavg" v-model="totalType" style="width: 100px; display: inline-block; margin-right:30px; font-size: 14px;"></v-select>
                    <v-select :items="campos" v-model="campo" item-text="text" item-value="value" style="width: 100px; display: inline-block; margin-right:30px; font-size: 14px;"></v-select>
                    <v-select v-if="campo=='method'" :items="methodsList" v-model="methodId" item-text="method" item-value="id" style="width: 100px; display: inline-block; margin-right:30px; font-size: 14px;"></v-select>
                    <strong v-if="totalType=='sum'">Total = {{ sumField(campo) }}</strong>
                    <strong v-if="totalType=='avg'">Promedio = {{ avgField(campo) }}</strong>
                </v-container>
            </template> 

            <template v-slot:[`item.gallery`]="{ item }">
                <v-icon v-if="item.gallery!=undefined" @click="viewGallery(item.images)" small>mdi-image-multiple</v-icon>
                <v-dialog v-model="dialogGallery" width="900">
                    <v-card>
                        <v-row justify="space-around" class="ma-0">
                            <v-col v-for="(image, n) in imagesGallery" :key="n" class="d-flex child-flex pa-0" cols="3" style="border: solid 1px #b7b7b7; border-collapse: collapse;">
                                <v-img :src="liga + 'files/items/'+image"
                                    aspect-ratio="1" class="grey lighten-2">
                                    <template v-slot:placeholder>
                                        <v-row class="fill-height ma-0" align="center" justify="center">
                                            <v-progress-circular indeterminate color="grey lighten-5" ></v-progress-circular>
                                        </v-row>
                                    </template>
                                    <a style="color:transparent!important; margin-left:10px;" :href="liga + 'files/items/'+image" :download="image" target="_blank"><v-icon>mdi-eye</v-icon></a>
                                </v-img>
                            </v-col>
                        </v-row>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="blue darken-1" text @click="dialog=false">Cerrar</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
            </template>

            <!-- Detalle PC -->
            <template v-slot:expanded-item="{ headers, item }">
                <td style="padding:0px!important;" :colspan="headers.length">
                    <v-data-table :headers="headers2" :items="variations(item.id)" class="elevation-0 pa-5" style="background: #f7f7f7;!important" dense>
                        <template slot="no-data">
                            No existen productos registrados.
                        </template>
                        <template v-slot:[`item.price`]="{ item }">
                            {{money(item.price)}}
                        </template>
                        <template v-slot:[`item.cost`]="{ item }">
                            {{money(item.cost)}}
                        </template>
                        <template v-slot:[`item.is_published`]="{ item }">
                            <v-icon v-if="item.is_published==true" color="green">mdi-record</v-icon>
                            <v-icon v-else color="red">mdi-record</v-icon>
                        </template>
                        <template v-slot:[`item.unit_id`]="{ item }">
                            {{unit(item.unit_id)}}
                        </template>
                        <template v-slot:[`item.actions`]="{ item }">
                            <v-icon small class="mr-2" @click="edit(item.id)">mdi-pencil</v-icon>
                            <v-icon small @click="deleteItem(item)">mdi-delete</v-icon>
                        </template>
                    </v-data-table>
                </td>
            </template>

            <template slot="no-data">
                No existen productos registrados.
            </template>
            <template v-slot:[`item.price`]="{ item }">
                {{money(item.price)}}
            </template>
            <template v-slot:[`item.cost`]="{ item }">
                {{money(item.cost)}}
            </template>
            <template v-slot:[`item.name`]="{ item }">
                <v-list-item class="px-0" style="min-height:0px!important; font-size:14px;" :to="{ path: '/inventory-reports/'+ item.id}">{{item.name}}</v-list-item>
            </template>
            <!--template v-slot:[`item.weight`]="{ item }">
                {{item.weight}}kg
            </template-->
            <template v-slot:[`item.is_published`]="{ item }">
                <div v-if="item.product_type!='Variable'">
                    <v-icon v-if="item.is_published==true" color="green">mdi-record</v-icon>
                    <v-icon v-else color="red">mdi-record</v-icon>
                </div>
            </template>
            <template v-slot:[`item.unit_id`]="{ item }">
                {{unit(item.unit_id)}}
            </template>
        </v-data-table>
        <v-snackbar :color="snackbar.color" v-model="snackbar.show">
            {{ snackbar.message }}
        </v-snackbar>
    </v-container>
</keep-alive>
</template>
<script>
import axios from "axios";
import filterInventory from "../inventory/filter"

export default {
    components: {
        'filterInventory':filterInventory,
    },
    data:()=>({
        search:'',
        items:'',
        dialogGallery:false,
        imagesGallery:[],
        snackbar: {
            show: false,
            message: null,
            color: null
        }, 
        filters: false,
        editDialog:false,
        createDialog:false,
        info:true,
        editedItem:'',
        headers2:[
            {text: 'Nombre', value: 'name'},
            //{text: 'Codigo', value: 'sku'},
            {text: 'Codigo Macro', value: 'macro'},
            //{text: 'Tipo', value: 'type'},
            //{text: 'Proveedor', value: 'provider_id'},
            {text: 'Unidad', value: 'unit_id'},
            //{text: 'Peso', value: 'weight'},
            {text: 'Precio', value: 'price'},
            {text: 'Costo', value: 'cost'},
            //{text: 'Categoría', value: 'categories'},
            //{text: 'Publicado', value: 'is_published'},
            {text: 'Inventario Ideal', value: 'ideal_inventory'},
            {text: 'Inventario', value: 'inventory'},
            {text: 'Acciones', value: 'actions', sortable: false },
        ],
        dialog:false,
        campo:'inventory',
        campos:[
            //{ text: 'Costo', value: 'cost'},
            { text: 'Inventario', value: 'inventory'},
            { text: 'Costo Inventario', value: 'inventory_cost'},
        ],
        totalType:'sum',
        sumavg:['sum', 'avg'],
        entries:{
            products: []
        },
        isLoadingProducts: false,
        searchProducts: null,
    }),
    watch:{
        searchProducts(val){
            //if (this.companyLists.length > 0) return
            //if(this.search){
            if (this.isLoadingProducts) return
            this.isLoadingProducts = true
            axios.get(process.env.VUE_APP_BACKEND_ROUTE + 'api/v2/item/pos?filter[pos]='+val)
            .then(res => {
                this.entries.products = res.data.data
                console.log(this.entries.products)
            }).finally(() => (this.isLoadingProducts = false, this.search = false))
            //}
        },
    },
    computed:{
        liga(){
            return process.env.VUE_APP_BACKEND_ROUTE
        },
        headers(){
            return [
                //{text: '', value: 'data-table-expand' },
                {text: 'Nombre', value: 'name'},
                //{text: 'Codigo', value: 'sku'},
                //{text: 'Codigo Macro', value: 'macro'},
                {text: 'Fotos', value: 'gallery', sortable: false },
                //{text: 'Tipo', value: 'type'},
                //{text: 'Proveedor', value: 'provider_id'},
                {text: 'Unidad', value: 'unit_id'},
                //{text: 'Peso', value: 'weight'},
                {text: 'Precio', value: 'price'},
                //{text: 'Costo', value: 'cost'},
                {text: 'Categoría', value: 'categories'},
                {text: 'Publicado', value: 'is_published'},
                //{text: 'Inventario Ideal', value: 'ideal_inventory'},
                {text: 'Inventario', value: 'inventory'},
                //{text: 'Acciones', value: 'actions', sortable: false },
            ]
        },
    },
    methods:{
        sumField(key) {//suma
            var suma=this.entries.products.reduce((a, b) => a + ((b[key]*1) || 0), 0)
            if(key=='inventory'){
                return suma + ' kg'
            }else{
                return suma.toLocaleString('es-MX', { style: 'currency', currency: 'MXN',})
            }
        },
        avgField(key){//primedio
            var suma=this.entries.products.reduce((a, b) => a + ((b[key]*1) || 0), 0)
            if(key=='inventory'){
                return (suma/this.items.length) + ' kg'
            }else{
                return (suma/this.items.length).toLocaleString('es-MX', { style: 'currency', currency: 'MXN',})
            }
        },
        money(amount){
            if(amount!=undefined){
                return (amount*1).toLocaleString('es-MX', { style: 'currency', currency: 'MXN',})
            }else{
                return '-'
            }
        },
        viewGallery(images){
            this.imagesGallery = images
            this.dialogGallery = true
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
    },
}
</script>