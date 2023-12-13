<template>
    <v-card>
        <v-card-title class="py-4" >
            <v-icon style="background: #e7e8e9; padding: 10px!important; border-radius: 50%;" class="mr-4">mdi-file-document-outline</v-icon>
            <span>Agregar Productos a la Compra {{calculo}}</span>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text class="pb-0">
            <v-container>
                <!--v-row style="background-color: #94949417;" class="px-2 ma-0 py-2" v-for="(item,k) in products" :key="k">
                    <v-col cols="1" class="py-0 my-0">
                        <v-text-field type=number v-model="item.quantity" label="Cantidad"></v-text-field>
                    </v-col>
                    <v-col cols="4" class="py-0 my-0">
                        <v-autocomplete :items="itemLists" v-model="item.item_id" item-text="name" item-value="id" label="Producto"></v-autocomplete>
                    </v-col>
                    <v-col cols="3" class="py-0 my-0" v-if="item.item!=''">
                        <v-text-field v-model="item.unit_cost" prefix="$" suffix="c/u" label="Costo Unitario"></v-text-field>
                    </v-col>
                    <v-col cols="1">
                        <v-icon @click="remove(k)" v-show="k || ( !k && products.length > 1)" color="red">mdi-close</v-icon>
                        <v-icon @click="add(k)" v-show="k == products.length-1" color="primary">mdi-plus</v-icon>
                    </v-col>
                </v-row-->
                <v-row style="background-color: #94949417;" class="px-2 ma-0 py-2" v-for="(item,k) in products" :key="k">
                    <v-col cols="1" class="py-0 my-0">
                        <v-text-field type=number v-model="item.quantity" label="Cantidad"></v-text-field>
                    </v-col>
                    <v-col cols="3" class="py-0 my-0">
                        <div v-if="item.item_id==''">
                            <v-text-field v-model="searchItems" :loading="isLoadingItems" label="Producto" placeholder="Escribe para buscar"></v-text-field>
                            <v-list v-if="searchItems!=''&&!isLoadingItems" class="py-0" style="position: absolute; z-index: 999; height: 130px; overflow-y: scroll; margin-top: -21px; box-shadow: 0px 0px 2px 0px #0000004a; cursor:pointer;">
                                <v-list-item v-for="(product, index) in itemsList" :key="index" style="border-bottom:1px solid #00000021;" class="item-hover"  @click="item.item_id=product.id, searchItems=''">
                                    {{product.name}}
                                </v-list-item>
                            </v-list>
                        </div>


                        <div class="mt-5" v-else>{{JSON.parse(item.item_id).name}}
                            <v-btn @click="removeEmpties(), item.item_id = ''" icon>
                                <v-icon small>mdi-pencil</v-icon>
                            </v-btn>
                        </div>
                    </v-col>
                    <v-col cols="2" class="py-0 my-0" v-if="item.item!=''">
                        <v-text-field v-model="item.original_cost" prefix="$" suffix="c/u" label="Costo Unitario"></v-text-field>
                    </v-col>
                    <v-col cols="2" class="py-0 my-0" v-if="item.item!=''">
                        <v-text-field v-model="item.discount" suffix="%" label="Descuento"></v-text-field>
                    </v-col>
                    <v-col cols="3" class="py-0 my-0 pt-3" v-if="item.item!=''" style="font-size:12px; line-height:20px;">
                        Costo Unitario con Descuento: <strong>{{(item.unit_cost).toLocaleString('es-MX', { style: 'currency', currency: 'MXN',})}}</strong>
                        <br/>
                        Costo Total: <strong>{{(item.unit_cost*item.quantity).toLocaleString('es-MX', { style: 'currency', currency: 'MXN',})}}</strong>
                    </v-col>
                    <v-col cols="1">
                        <v-icon @click="remove(k)" v-show="k || ( !k && products.length > 1)" color="red">mdi-close</v-icon>
                        <v-icon @click="add(k)" v-show="k == products.length-1" color="primary">mdi-plus</v-icon>
                    </v-col>
                </v-row>
            </v-container>
        </v-card-text>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="close">
                Cancelar
            </v-btn>
            <v-btn color="blue darken-1" text @click="save" :loading="gris" :disabled="gris">
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
            compra:Number
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
                item_id:'',
                quantity:1,
                unit_cost:'',
                discount:'',
                original_cost:''
            }],
            rules: {
                required: value => !!value || 'Campo requerido',
            },
            valid: true,
            itemsList:[],
            isLoadingItems:false,
            searchItems:''
        }),
    watch:{
        searchItems:{
            handler(){
                this.isLoadingItems = true
                axios.get(process.env.VUE_APP_BACKEND_ROUTE + 'api/v2/item/pos?filter[pos]=' + this.searchItems + '&itemsPerPage=999').then(response => {
                    this.itemsList = response.data.data.map(id=>{return{
                        id:JSON.stringify({id:id.id, name:id.name}),
                        name:id.name
                    }})
                    this.isLoadingItems = false
                });
            }, deep: true
        }
    },
    computed: {
        currentUser:{
            get(){
                return this.$store.state.currentUser.user
            }
        },
        calculo(){
            for(var i=0; i<this.products.length; i++){
                this.products[i].unit_cost = this.products[i].original_cost-((this.products[i].original_cost/100)*this.isNull(this.products[i].discount))
            }
            return ''
        },
    },
    created(){
    },
    methods: {
        removeEmpties(){
            for(var i=0; i<this.products.length; i++){
                if(this.products[i].item_id == ''){
                    this.products.splice(i, 1);
                }
            }
        },
        isNull(value){
            if(value==null||value==undefined||value==''){
                return 0
            }else{
                return value
            }
        },
        add(index) {
            this.products.push({
                item_id:'',
                quantity:1,
                unit_cost:'',
                discount:'',
                original_cost:''
            });
        },
        remove(index) {
            this.products.splice(index, 1);
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
            this.products = [{
                item_id:'',
                quantity:1,
                unit_cost:'',
                discount:'',
                original_cost:''
            }]
            this.$nextTick(() => {
                this.$emit("closeDialogAddShopping", false);
            })
        },
        save(){
            this.gris = true
            var request = {
                id: this.compra.id,
                created_by_user_id: this.currentUser.id,
                last_updated_by_user_id: this.currentUser.id,
                products: this.products.map(product=>{
                    return{
                        discount:product.discount,
                        item_id:JSON.parse(product.item_id).id,
                        original_cost:product.original_cost,
                        quantity:product.quantity,
                        unit_cost:product.unit_cost,
                    }
                })
            }
            axios.post(process.env.VUE_APP_BACKEND_ROUTE + "api/v2/shopping_details",Object.assign(request)).then(response=>{
                this.close()
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