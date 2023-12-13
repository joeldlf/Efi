<template>
    <v-card class="pa-6 pb-2">
        Editar Producto de la Venta {{editedDetail.quotation_id}}
        <v-row class="ma-0 mt-4">
            <v-col ols="12" sm ="4" md="2" class="py-0 my-0">
                <v-text-field v-model="editedDetail.quantity" label="Cantidad"></v-text-field><!--:disabled="yanohay(item.quantity, item.item, k)" -->
            </v-col>
            <v-col ols="12" sm ="8" md="6" class="py-0 my-0">
                <v-autocomplete item-text="name" v-model="editedDetail.item_id" item-value="id" label="Producto" clearable :items="productsList" :loading="isLoadingProducts" :search-input.sync="searchProducts" placeholder="Escribe para buscar o crear" hide-no-data>

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
            </v-col>
            <v-col cols="12" sm ="8" md="4" class="py-0 my-0">
                <v-text-field v-model="editedDetail.price" prefix="$" suffix="c/u" label="Precio Ajustado"></v-text-field>
            </v-col>
        </v-row>
        <v-card-actions>
            <v-spacer class="hidden-md-and-down"></v-spacer>
            <v-btn color="blue darken-1" text @click="close">
                Cancelar
            </v-btn>
            <v-btn color="blue darken-1" text @click="save"  :loading="gris" :disabled="gris">
                Guardar
            </v-btn>
        </v-card-actions>

        <v-snackbar :color="snackbar.color" v-model="snackbar.show">
            {{ snackbar.message }}
        </v-snackbar>
    </v-card>
</template>

<script>
import axios from "axios"
export default {
    props:{
        editedDetail:Object
    },
    data: () => ({
        gris: false,
        snackbar: {
            show: false,
            message: null,
            color: null
        },
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
        productsList(){
            return this.entries.products
        },
    },
    methods:{
        close () {
            this.gris = false
            this.$nextTick(() => {
                this.$emit("closeDialogEditDetail", false);
            })
        },
        save(){
            this.editedDetail.quantity = this.editedDetail.quantity*1
            this.gris = true
            this.$nextTick(() => {
                axios.put(process.env.VUE_APP_BACKEND_ROUTE + "api/v2/sale_items/" + this.editedDetail.id, this.editedDetail).then(response => {
                    this.close()
                })
                .catch(error => {
                    this.snackbar = {
                        message: error.response.data.message,
                        color: 'error',
                        show: true
                    }
                    this.gris = false
                    this.close()
                })
            })
        },
    }
}
</script>

<style>

</style>