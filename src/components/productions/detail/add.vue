<template>
    <v-card>
        <v-card-title class="py-4" >
            <v-icon style="background: #e7e8e9; padding: 10px!important; border-radius: 50%;" class="mr-4">mdi-file-document-outline</v-icon>
            <span>Agregar detalle de Producción</span>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text class="pb-0">
            <v-container>
                <v-row v-for="(item,j) in products" :key="j">
                    <v-col cols="12" sm="12" md="6">
                        <strong style="font-size:18px;">Producto</strong>
                        <v-row style="background-color: #94949417;" class="px-2 ma-0 py-1 mt-4">
                            <v-col cols="12" sm="5" md="3" class="py-0 my-0">
                                <v-text-field type=number v-model="item.quantity" label="Cantidad"></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="5" md="9" class="py-0 my-0">
                                <v-autocomplete v-if="item.item_id==''" item-text="name" v-model="item.item_id" item-value="id" label="Producto" clearable :items="productsList" :loading="isLoadingProducts" :search-input.sync="searchProducts" placeholder="Escribe para buscar o crear" hide-no-data>
                                    <template v-slot:item="{item, attrs, on}">
                                        <v-list-item v-on="on" v-bind="attrs">
                                            <v-list-item-content>
                                                <v-list-item-title>
                                                    {{item.name}} | {{(item.price*1).toLocaleString('es-MX', { style: 'currency', currency: 'MXN',})}}
                                                    <div>
                                                        <span style="font-size:12px;">Categoría:</span>
                                                        <template v-for="(category, index) in item.categories">
                                                            <v-chip  v-bind:key="index" small class="ml-2"  style="font-size:8px;">{{categoryName(category)}}</v-chip>
                                                        </template>
                                                    </div>
                                                    <div>
                                                        <span style="font-size:14px;">Inventario:
                                                            <strong v-if="item.inventory<1" style="color:red!important;">{{item.inventory}}</strong>
                                                            <strong v-else style="color:green!important;">{{item.inventory}}</strong>
                                                        </span>
                                                    </div>
                                                </v-list-item-title>
                                            </v-list-item-content>
                                        </v-list-item>
                                    </template> 
                                </v-autocomplete>
                                <v-row class="mx-0 mb-0" style="border-bottom:1px solid black; width:100%; margin-top:20px; padding-bottom:5px;" v-else>
                                    {{entries.products.filter(product=>product.id == item.item_id).map(product=>product.name)[0]}}
                                    <v-spacer/>
                                </v-row>
                            </v-col>
                        </v-row>
                    </v-col>
                    <v-col cols="12" sm="12" md="6">
                        <strong style="font-size:18px;">Insumos</strong>
                        <v-row style="background-color: #94949417;" class="px-2 ma-0 py-0 mt-4" v-for="(insumo,k) in products[j].insumos" :key="k">
                            <v-col cols="12" sm="5" md="3" class="py-0 my-0">
                                <v-text-field type=number v-model="insumo.quantity" label="Cantidad"></v-text-field><!--:disabled="yanohay(insumo.quantity, insumo.item_id, j, k)"-->
                            </v-col>
                            <v-col cols="12" sm="5" md="8" class="py-0 my-0">
                                <v-autocomplete v-if="insumo.item_id==''" item-text="name" v-model="insumo.item_id" item-value="id" label="Insumo" clearable :items="suppliesList" :loading="isLoadingSupplies" :search-input.sync="searchSupplies" placeholder="Escribe para buscar o crear" hide-no-data>
                                    <template v-slot:item="{item, attrs, on}">
                                        <v-list-item v-on="on" v-bind="attrs">
                                            <v-list-item-content>
                                                <v-list-item-title>
                                                    {{item.name}} | {{(item.price*1).toLocaleString('es-MX', { style: 'currency', currency: 'MXN',})}}
                                                    <div>
                                                        <span style="font-size:12px;">Categoría:</span>
                                                        <template v-for="(category, index) in item.categories">
                                                            <v-chip  v-bind:key="index" small class="ml-2"  style="font-size:8px;">{{categoryName(category)}}</v-chip>
                                                        </template>
                                                    </div>
                                                    <div>
                                                        <span style="font-size:14px;">Inventario:
                                                            <strong v-if="item.inventory<1" style="color:red!important;">{{item.inventory}}</strong>
                                                            <strong v-else style="color:green!important;">{{item.inventory}}</strong>
                                                        </span>
                                                    </div>
                                                </v-list-item-title>
                                            </v-list-item-content>
                                        </v-list-item>
                                    </template> 
                                </v-autocomplete>
                                <v-row class="mx-0 mb-0" style="border-bottom:1px solid black; width:100%; margin-top:20px; padding-bottom:5px;" v-else>
                                    {{entries.supplies.filter(supply=>supply.id == insumo.item_id).map(supply=>supply.name)[0]}}
                                    <v-spacer/>
                                </v-row>
                            </v-col>
                            <v-col cols="12" sm="2" md="1">
                                <v-icon @click="remove2(k, j)" v-show="k || ( !k && products[j].insumos.length > 1)" color="red">mdi-close</v-icon>
                                <v-icon @click="add2(k, j)" v-show="k == products[j].insumos.length-1" color="primary">mdi-plus</v-icon>
                            </v-col>
                        </v-row>
                    </v-col>
                    <div style="width: 100%;">
                        <v-icon style="margin: auto; display: flex;" @click="remove(j)" v-show="j || ( !j && products.length > 1)" color="red">mdi-close</v-icon> <v-icon style="margin: auto; display: flex;" @click="add(j)" v-show="j == products.length-1" color="primary">mdi-plus</v-icon>
                    </div>
                </v-row>
            </v-container>
        </v-card-text>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="close">
                Cancelar
            </v-btn>
            <v-btn :loading="gris" :disabled="gris" color="blue darken-1" text @click="save">
                Guardar
            </v-btn>
        </v-card-actions>
        <v-snackbar :color="snackbar.color" v-model="snackbar.show">
            {{ snackbar.message }}
        </v-snackbar>
    </v-card>
</template>

<script>
import axios from "axios";
    export default {
        props:{
            productionId:Number
        },  
        data: () => ({
            snackbar: {
                show: false,
                message: null,
                color: null
            },
            gris:false,
            datePicker:'',
            products:[{
                production_id:'',
                item_id:'',
                quantity:1,
                insumos:[{
                    //production_id:'',
                    item_id:'',
                    quantity:1,
                    //shopping_id:'',
                }]
            }],
            rules: {
                required: value => !!value || 'Campo requerido',
            },
            valid: true,
            entries:{
                products: [],
                supplies: []
            },
            isLoadingProducts: false,
            searchProducts: null,
            isLoadingSupplies: false,
            searchSupplies: null,
        }),
        watch:{
            searchProducts(val){
                //if (this.companyLists.length > 0) return
                //if(this.search){
                if (this.isLoadingProducts) return
                this.isLoadingProducts = true
                axios.get(process.env.VUE_APP_BACKEND_ROUTE + 'api/v2/item/pos?filter[pos]='+val)
                .then(res => {
                    this.entries.products = this.entries.products.concat(res.data.data)
                }).finally(() => (this.isLoadingProducts = false))
                //}
            },
            searchSupplies(val){
                //if (this.companyLists.length > 0) return
                //if(this.search){
                if (this.isLoadingSupplies) return
                this.isLoadingSupplies = true
                axios.get(process.env.VUE_APP_BACKEND_ROUTE + 'api/v2/item/pos?filter[pos]='+val)
                .then(res => {
                    this.entries.supplies = this.entries.supplies.concat(res.data.data)
                }).finally(() => (this.isLoadingSupplies = false))
                //}
            },
        },
        computed: {
            productsList(){
                return this.entries.products
            },
            suppliesList(){
                return this.entries.supplies
            },
            currentUser:{
                get(){
                    return this.$store.state.currentUser.user
                }
            },
        },
        methods: {
            add(index) {
                this.products.push({
                    production_id:'',
                    item_id:'',
                    quantity:'',
                    insumos:[{
                        //production_id:'',
                        item_id:'',
                        quantity:'',
                    }]
                });
            },
            remove(index) {
                this.products.splice(index, 1);
            },
            add2(index, a) {
                this.products[a].insumos.push({
                    //production_id:'',
                    item_id:'',
                    quantity:'',
                });
            },
            remove2(index, a) {
                this.products[a].insumos.splice(index, 1);
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
            close () {
                this.gris = false
                this.production = Object.assign({}, this.defaultItem)
                this.$nextTick(() => {
                    this.$emit("closeDialogAddProduction", false);
                })
            },
            save(){
                for(var i=0; i<this.products.length; i++){
                    this.products[i].production_id=this.productionId
                    this.products[i].created_by_user_id=this.currentUser.id;
                    this.products[i].last_updated_by_user_id=this.currentUser.id;
                    let perro = this.products[i]
                    /* Alta de detalle de producción */
                    axios.post(process.env.VUE_APP_BACKEND_ROUTE + "api/v1/production_detail/create",Object.assign(this.products[i])).then(response=>{
                        /* Alta de entrada de productos fabricados */
                        let inventarioProductos = {
                            created_by_user_id: perro.created_by_user_id,
                            type: 'Entrada Producción',
                            item_id: perro.item_id,
                            quantity: perro.quantity,
                            production_id: perro.production_id,
                            branch_id:this.currentUser.branch_id
                        }
                        axios.post(process.env.VUE_APP_BACKEND_ROUTE + "api/v1/inventory/create",Object.assign(inventarioProductos)).then(response=>{
                            for(var j=0; j<perro.insumos.length; j++){
                                let gato = perro.insumos[j]
                                /* Alta de salida de insumos  */
                                let inventarioInsumos = {
                                    created_by_user_id: perro.created_by_user_id,
                                    type: 'Salida Producción',
                                    item_id: gato.item_id,
                                    quantity: gato.quantity,
                                    production_id: perro.production_id,
                                    branch_id:this.currentUser.branch_id
                                }
                                axios.post(process.env.VUE_APP_BACKEND_ROUTE + "api/v1/inventory/create",Object.assign(inventarioInsumos)).catch(error => {
                                    this.snackbar = {
                                        message: error.response.data.message,
                                        color: 'error',
                                        show: true
                                    }
                                })
                            }
                        }).catch(error => {
                            this.snackbar = {
                                message: error.response.data.message,
                                color: 'error',
                                show: true
                            }
                        })
                    }).catch(error => {
                        this.snackbar = {
                            message: error.response.data.message,
                            color: 'error',
                            show: true
                        }
                    })
                }
                this.close()
            },
        },
    }
</script>
<style lang="css" scoped>
.v-text-field >>> label{
    font-size: 14px!important;
}
</style>
<style>
.v-input__icon--prepend-inner i::before {
    font-size: 18px!important;
    color:#1976D2;
}
.v-text-field input, .v-label {
    font-size: 14px;
}
.v-picker__title.primary{
    display:none;
}
</style>