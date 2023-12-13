<template>
    <v-card>
        <v-card-title>
            <v-icon style="background: #e7e8e9; padding: 10px!important; border-radius: 50%;" class="mr-4">mdi-file-document-outline</v-icon>
            <span >Alta Ajuste</span>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text class="pb-0">
            <v-container>
                <v-row>
                    <v-col cols="12" sm="6" md="4">
                        <v-menu v-model="datePicker" :close-on-content-click="false" :nudge-right="40" transition="scale-transition" offset-y min-width="290px" >
                            <template v-slot:activator="{ on }">
                                <v-text-field :rules="[v => !!v || 'Campo requerido']" clearable required v-model="adjustment.date" label="Fecha" prepend-icon="mdi-calendar" readonly v-on="on"></v-text-field>
                            </template>
                            <v-date-picker color="primary" v-model="adjustment.date" @input="datePicker = false"></v-date-picker>
                        </v-menu>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                        <v-autocomplete item-text="name" v-model="adjustment.item_id" item-value="id" label="Producto" clearable :items="productsList" :loading="isLoadingProducts" :search-input.sync="searchProducts" placeholder="Escribe para buscar o crear" hide-no-data>

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
                    <v-col cols="12" sm="6" md="4">
                        <v-text-field type=number v-model="adjustment.amount" label="Monto a Ajustar"></v-text-field>
                    </v-col>

                    <v-container fluid>
                        <v-textarea v-model="adjustment.note" label="Descripcion"></v-textarea>
                    </v-container>
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
        data: () => ({
            snackbar: {
                show: false,
                message: null,
                color: null
            },
            datePicker:'',
            adjustment:{
                item_id:'',
                date:'',
                amount:'',
                note:'',
                created_by_user_id:'',
                last_updated_by_user_id:'',
            },
            rules: {
                required: value => !!value || 'Campo requerido',
            },
            valid: true,
            gris:false,
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
                }).finally(() => (this.isLoadingProducts = false, this.search = false))
                //}
            },
        },
        computed: {
            productsList(){
                return this.entries.products
            },
            currentUser:{
                get(){
                    return this.$store.state.currentUser.user
                }
            },
        },
        methods: {
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
                this.adjustment = Object.assign({}, this.defaultItem)
                this.gris = false
                this.$nextTick(() => {
                    this.$emit("closeCreateDialogAdjustment", false);
                })
            },
            save(){
                //this.adjustment.user_id = this.currentUser.id
                this.adjustment.created_by_user_id = this.currentUser.id
                //this.adjustment.last_updated_by_user_id = this.currentUser.id
                this.gris = true
                this.$nextTick(() => {
                    axios.post(process.env.VUE_APP_BACKEND_ROUTE + "api/v1/adjustment/create",Object.assign(this.adjustment)).then(response=>{                
                        var inventario = {
                            created_by_user_id: this.currentUser.id,
                            type: 'Ajuste Manual',
                            item_id: this.adjustment.item_id,
                            quantity: this.adjustment.amount,
                            branch_id:this.currentUser.branch_id
                        }
                        axios.post(process.env.VUE_APP_BACKEND_ROUTE + "api/v1/inventory/create",Object.assign(inventario)).then(response=>{
                            this.close()
                        }).catch(error => {
                            this.snackbar = {
                                message: error.response.data.message,
                                color: 'error',
                                show: true
                            }
                            this.gris = false
                        })
                    }).catch(error => {
                        this.snackbar = {
                            message: error.response.data.message,
                            color: 'error',
                            show: true
                        }
                        this.gris = false
                    })
                })
            },
        },
    }
</script>
<style lang="css" scoped>
.v-text-field >>> label{
    font-size: 14px!important;
}
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