<template>    
    <v-card>
        <!-- Titulo del dialogo -->
        <v-card-title>
            <span>Agregar Producción</span>
            <v-spacer></v-spacer>
            <v-autocomplete  :rules="[v => !!v || 'Campo requerido']" clearable v-model="editedItem.user_id" :items="changoLists" label="Productor" item-text="name" item-value="id">
                <template slot="no-data" class="pa-2">No existen usuarios relacionados.</template>                      
            </v-autocomplete>
        </v-card-title>
        <v-divider></v-divider>

        <v-stepper v-model="e1" class="elevation-0">
            <v-stepper-header class="elevation-0">
                <v-stepper-step style="font-weight:bolder!important;" :complete="e1 > 1" step="1"></v-stepper-step>
                <v-divider></v-divider>
                <v-stepper-step style="font-weight:bolder!important;" step="2"></v-stepper-step>
            </v-stepper-header>
            <v-stepper-items>
                <v-stepper-content step="1" class="py-0">
                    <!-- Formulario -->
                    <v-row class="px-12">
                        <v-col cols="12" sm="6" md="6" class="py-0">
                            <v-select :items="status" v-model="editedItem.status" label="Estatus"></v-select>
                        </v-col>
                        <v-spacer></v-spacer>
                        <v-col cols="12" sm="6" md="6" class="py-0">
                            <v-menu v-model="datePicker" :close-on-content-click="false" :nudge-right="40" transition="scale-transition" offset-y min-width="290px" >
                                <template v-slot:activator="{ on }">
                                    <v-text-field :rules="[v => !!v || 'Campo requerido']" clearable required v-model="editedItem.date" label="Fecha" prepend-icon="mdi-calendar" readonly v-on="on"></v-text-field>
                                </template>
                                <v-date-picker color="primary" v-model="editedItem.date" @input="datePicker = false"></v-date-picker>
                            </v-menu>
                        </v-col>
                        <v-col cols="12" sm="6" md="1"></v-col>
                    </v-row>
                    <v-row class="pb-3 px-12">
                        <v-col cols="12" sm="6" md="6" class="px-4 py-t pb-0" style="background:#94949417;">
                            Hora Inicio
                            <v-row class="mt-0">
                                <v-col cols="3">
                                    <v-text-field class="pt-0" :rules="rules2" v-model="start_time.hour" type="number"></v-text-field>
                                </v-col>
                                <v-col cols="3">
                                    <v-text-field class="pt-0" ::rules="rules2" v-model="start_time.minute" type="number"></v-text-field>
                                </v-col>
                                <v-col cols="6">
                                    <v-select  :items="ampm" v-model="start_time.ampm" label="Estatus"></v-select>
                                </v-col>
                            </v-row>
                        </v-col>
                        <v-spacer></v-spacer>
                        <v-col cols="12" sm="6" md="6" class="px-4 py-t pb-0" style="background:#94949417;">
                            Hora Fin
                            <v-row class="mt-0">
                                <v-col cols="3">
                                    <v-text-field class="pt-0" :rules="rules2" v-model="end_time.hour" type="number"></v-text-field>
                                </v-col>
                                <v-col cols="3">
                                    <v-text-field class="pt-0" :rules="rules2" v-model="end_time.minute" type="number"></v-text-field>
                                </v-col>
                                <v-col cols="6">
                                    <v-select :items="ampm" v-model="end_time.ampm" label="Estatus"></v-select>
                                </v-col>
                            </v-row>
                        </v-col>
                        <v-col cols="12" sm="6" md="1"></v-col>
                    </v-row>
                </v-stepper-content>
                <v-stepper-content step="2" class="py-0">
                    <v-card-text class="pt-0">
                        <v-container class="pt-0">
                            <v-row v-for="(item,j) in editedItem.production_detail" :key="j">
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
                                    <v-row style="background-color: #94949417;" class="px-2 ma-0 py-0 mt-4" v-for="(insumo,k) in editedItem.production_detail[j].insumos" :key="k">
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
                                            <v-icon @click="remove2(k, j)" v-show="k || ( !k && editedItem.production_detail[j].insumos.length > 1)" color="red">mdi-close</v-icon>
                                            <v-icon :disabled="insumo.item_id==''" @click="add2(k, j)" v-show="k == editedItem.production_detail[j].insumos.length-1" color="primary">mdi-plus</v-icon>
                                        </v-col>
                                    </v-row>
                                </v-col>
                                <div style="width: 100%;">
                                    <v-icon style="margin: auto; display: flex;" @click="remove(j)" v-show="j || ( !j && editedItem.production_detail.length > 1)" color="red">mdi-close</v-icon> <v-icon style="margin: auto; display: flex;" @click="add(j)" v-show="j == editedItem.production_detail.length-1" color="primary">mdi-plus</v-icon>
                                </div>
                            </v-row>
                        </v-container>
                    </v-card-text>
                </v-stepper-content>
            </v-stepper-items>
        </v-stepper>

        <v-card-actions class="py-4">
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="close">Cancelar</v-btn>
            <v-btn color="blue darken-1" text  v-if="e1>1" @click="e1 = e1-1">
                <v-icon v-if="!isMobile()">mdi-chevron-left</v-icon>
                Regresar
            </v-btn>
            <v-btn color="blue darken-1" text  v-if="e1!=2" @click="e1 = e1+1">
                Siguiente
                <v-icon v-if="!isMobile()">mdi-chevron-right</v-icon>
            </v-btn>
            <v-btn color="blue darken-1" text :loading="gris" :disabled="gris || incomplete" @click="save">Guardar</v-btn>
        </v-card-actions>

        <v-snackbar :color="snackbar.color" v-model="snackbar.show">
            {{ snackbar.message }}
        </v-snackbar>
    </v-card>
</template>
<script>
import axios from "axios";
export default { 
    data:()=>({
        e1: 1,
        snackbar: {
            show: false,
            message: null,
            color: null
        },
        gris:false,
        datePicker:false,
        show1: false,
        status:['En Captura', 'Terminada'],
        ampm:['a.m.', 'p.m.'],
        editedItem: {
            password:'',
            date:'',
            status:'',
            start_time:'',
            end_time:'',
            created_by_user_id:'',
            last_updated_by_user_id:'',
            user_id:'',
            production_detail:[{
                item_id:'',
                quantity:1,
                insumos:[{
                    item_id:'',
                    quantity:1,
                }]
            }]
        },
        start_time:{
            hour:'00',
            minute:'00',
            ampm:'a.m.'
        },
        end_time:{
            hour:'00',
            minute:'00',
            ampm:'a.m.'
        },
        rules: {
            required: value => !!value || 'Campo requerido',
        },
        rules2: [v => v.length <= 2 || 'Max 2 caracteres'],
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
    computed:{
        productsList(){
            return this.entries.products
        },
        suppliesList(){
            return this.entries.supplies
        },
        incomplete(){
            if(this.editedItem.production_detail[0].item_id==''&&this.editedItem.production_detail[0].insumos[0].item_id==''){
                return true
            }else{
                return false
            }
        },
        currentUser:{
            get(){
                return this.$store.state.currentUser.user
            }
        },
        changoLists(){
            return this.$store.state.user.users.filter(user=>user.job_position == 'Producción' || user.job_position == 'Almacén').map(id=>{
                return{
                    id:id.id,
                    name: id.name + ' ' + id.last
                }
            });
        },
    },
    methods:{
        add(index) {
            this.editedItem.production_detail.push({
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
            this.editedItem.production_detail.splice(index, 1);
        },
        add2(index, a) {
            this.editedItem.production_detail[a].insumos.push({
                //production_id:'',
                item_id:'',
                quantity:'',
            });
        },
        remove2(index, a) {
            this.editedItem.production_detail[a].insumos.splice(index, 1);
        },
        isMobile() {
            if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
                return true
            } else {
                return false
            }
        },
        time(hour){
            if(hour.ampm == 'p.m.'){
                return this.format(((hour.hour*1)+12).toString()) + ':' + this.format(hour.minute) + ':00'
            }else{
                return this.format(hour.hour) + ':' + this.format(hour.minute) + ':00'
            }
        },
        format(n){
            if(n.length ==  1){
                return '0' + n
            }else if(n.length == 2){
                return n
            }
        },
        close () {
            this.gris = false
            this.editedItem = Object.assign({}, this.defaultItem)
            this.$nextTick(() => {
                this.$emit("closeDialogCreateProduction", false);
            })
        },
        save () {
            this.editedItem.start_time = this.time(this.start_time)
            this.editedItem.end_time = this.time(this.end_time)
            this.editedItem.created_by_user_id = this.currentUser.id
            this.editedItem.updated_by_user_id = this.currentUser.id
            this.editedItem.last_updated_by_user_id = this.currentUser.id
            this.$nextTick(() => {
                axios.post(process.env.VUE_APP_BACKEND_ROUTE + "api/v2/productions",Object.assign(this.editedItem)).then(response=>{
                    this.close()
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
    }
}
</script>