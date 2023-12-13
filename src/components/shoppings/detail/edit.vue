<template>
    <v-card>
        <v-card-title class="py-4" >
            <v-icon style="background: #e7e8e9; padding: 10px!important; border-radius: 50%;" class="mr-4">mdi-file-document-outline</v-icon>
            <span>Editar Productos de la Compra {{calculo}}</span>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text class="pb-0">
            <v-container>



                <v-row style="background-color: #94949417;" class="px-2 ma-0 py-2">
                    <v-col cols="1" class="py-0 my-0">
                        <v-text-field type=number v-model="shoppingOrder.quantity" label="Cantidad"></v-text-field>
                    </v-col>
                    <v-col cols="3" class="py-0 my-0">
                        <div v-if="shoppingOrder.item_id==''">
                            <v-text-field v-model="searchItems" :loading="isLoadingItems" label="Producto" placeholder="Escribe para buscar"></v-text-field>
                            <v-list v-if="searchItems!=''&&!isLoadingItems" class="py-0" style="position: absolute; z-index: 999; height: 130px; overflow-y: scroll; margin-top: -21px; box-shadow: 0px 0px 2px 0px #0000004a; cursor:pointer;">
                                <v-list-item v-for="(product, index) in itemsList" :key="index" style="border-bottom:1px solid #00000021;" class="item-hover"  @click="shoppingOrder.item_id=product.id, searchItems=''">
                                    {{product.name}}
                                </v-list-item>
                            </v-list>
                        </div>


                        <div class="mt-5" v-else>{{JSON.parse(shoppingOrder.item_id).name}}
                            <v-btn @click="shoppingOrder.item_id = ''" icon>
                                <v-icon small>mdi-pencil</v-icon>
                            </v-btn>
                        </div>
                    </v-col>
                    <v-col cols="2" class="py-0 my-0" v-if="shoppingOrder.item_id!=''">
                        <v-text-field v-model="shoppingOrder.original_cost" prefix="$" suffix="c/u" label="Costo Unitario"></v-text-field>
                    </v-col>
                    <v-col cols="2" class="py-0 my-0" v-if="shoppingOrder.item_id!=''">
                        <v-text-field v-model="shoppingOrder.discount" suffix="%" label="Descuento"></v-text-field>
                    </v-col>
                    <v-col cols="3" class="py-0 my-0 pt-3" style="font-size:12px; line-height:20px;">
                        Costo Unitario con Descuento: <strong>{{(shoppingOrder.unit_cost).toLocaleString('es-MX', { style: 'currency', currency: 'MXN',})}}</strong>
                        <br/>
                        Costo Total: <strong>{{(shoppingOrder.unit_cost*shoppingOrder.quantity).toLocaleString('es-MX', { style: 'currency', currency: 'MXN',})}}</strong>
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
            shoppingOrder:Object
        },  
        data: () => ({
            snackbar: {
                show: false,
                message: null,
                color: null
            },
            gris:false,
            rules: {
                required: value => !!value || 'Campo requerido',
            },
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
        calculo(){
            this.shoppingOrder.unit_cost = this.shoppingOrder.original_cost-((this.shoppingOrder.original_cost/100)*this.isNull(this.shoppingOrder.discount))
            return ''
        },
        currentUser:{
            get(){
                return this.$store.state.currentUser.user
            }
        },
    },
    methods: {
        isNull(value){
            if(value==null||value==undefined||value==''){
                return 0
            }else{
                return value
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
        close () {
            this.gris = false
            this.$nextTick(() => {
                this.$store.dispatch('shopping_detail/getShoppingDetails')
                this.$emit("closeDialogEditShopping", false);
            })
        },
        save(){
            this.gris = true
            this.shoppingOrder.last_updated_by_user_id=this.currentUser.id;
            axios.put(process.env.VUE_APP_BACKEND_ROUTE + "api/v1/shopping_detail/update",Object.assign(this.shoppingOrder)).then(response=>{
                this.$store.dispatch('shopping_detail/getShoppingDetails')
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