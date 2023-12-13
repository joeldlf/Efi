<template>
    <v-container>
        <v-card class="px-8 mb-4 elevation-0">
            <v-card-title>Transferir Inventario</v-card-title>
            <v-text-field v-model="search" @keydown.enter="getDataFromApi(), selected_item=undefined, movements[0].item_id='', movements[1].item_id=''" :loading="loading" outlined label="Buscar producto(s)"></v-text-field>
        </v-card>
        <v-list class="px-4">
            <div v-if="selected_item==undefined">
                <v-row @click="selected_item=item, movements[0].item_id=item.id, movements[1].item_id=item.id" class="ma-0 py-3" v-for="(item, index) in items" :key="index" style="border-bottom:2px #f4f5fb solid;">
                    {{item.name}}
                </v-row>
            </div>
            <div v-else style="text-align:center; font-weigth:bold; font-size:21px;" class="pt-6">
                {{selected_item.name}}
                <br/>
                <v-text-field style="width:300px; margin:auto;" class="mt-2" outlined label="Cantidad" v-model="movements_quantity"></v-text-field>
                <v-row class="mx-0 mb-0">
                    <v-card class="px-8" width="49%">
                        <v-card-subtitle>Salida</v-card-subtitle>
                        <v-select outlined dense v-model="movements[0].branch_id" :items="branchs" item-text="name" item-value="id" label="Sucursal"></v-select>
                        <!--v-text-field outlined label="cantidad" v-model="movements[0].quantity"></v-text-field-->
                    </v-card>
                    <v-spacer/>
                    <v-card class="px-8" width="49%">
                        <v-card-subtitle>Entrada</v-card-subtitle>
                        <v-select outlined dense v-model="movements[1].branch_id" :items="branchs" item-text="name" item-value="id" label="Sucursal"></v-select>
                        <!--v-text-field outlined label="cantidad" v-model="movements[1].quantity"></v-text-field-->
                    </v-card>
                </v-row>
            </div>

            <div class="text-center py-6">
                <v-pagination
                v-if="selected_item==undefined"
                v-model="meta.current_page"
                :length="meta.last_page"
                circle
                :total-visible="10"
                ></v-pagination>
                <v-btn v-else rounded color="primary" @click="saveInventory()">
                    Guardar
                </v-btn>
            </div>
        </v-list>
        <v-snackbar :color="snackbar.color" v-model="snackbar.show">
            {{ snackbar.message }}
        </v-snackbar>
    </v-container>
</template>

<script>
import axios from "axios"
export default {
    data(){
        return{
            movements_quantity:'',
            branchs:[],
            movements:[
                {branch_id:'', quantity:'', type:'Transferencia', item_id: '', created_by_user_id: '', item_id:''},
                {branch_id:'', quantity:'', type:'Transferencia', item_id: '', created_by_user_id: '', item_id:''}
            ],
            input:'',
            loading:false,
            items:[],
            meta:{
                current_page:1,
                last_page:0
            },
            search:'',
            snackbar: {
                show: false,
                message: null,
                color: null
            },
            selected_item:undefined
        }
    },
    created(){
        axios.get(process.env.VUE_APP_BACKEND_ROUTE + "api/v2/branches").then(response=>{
            this.branchs = response.data
        })
    },
    computed:{
        page(){
            return this.meta.current_page
        },
    },
    watch:{
        movements_quantity:{
            handler(){
                this.movements[0].quantity = this.movements_quantity * -1
                this.movements[1].quantity = this.movements_quantity
            }, deep:true,
        },
        page:{
            handler:function(prev, next){
                if(prev!=next){
                    this.getDataFromApi()
                }
            }, deep:true,
        },
    },
    methods:{
        getDataFromApi () {
            this.loading = true
            this.apiCall().then(data => {
                this.items = data.items.map(item=>{
                    return {
                        id:item.id,
                        name:item.name,
                        new_inventory:'',
                        inventory:item.inventory
                    }
                })
                this.meta = data.meta
                this.loading = false
                this.search = ''
                this.$nextTick(() => {
                    const field = document.getElementById('first_item');
                    field.focus()
                })
            })
        },
        apiCall () {
            return new Promise((resolve, reject) => {
                axios.get(process.env.VUE_APP_BACKEND_ROUTE + "api/v2/item/pos?filter[pos]=" + this.search + '&page=' + this.meta.current_page).then(response => {
                    var items = response.data.data
                    var meta = response.data.meta
                    resolve({
                        items,
                        meta,
                    })
                })
            })
        },
        saveInventory(){
            this.movements[0].created_by_user_id = this.$store.state.currentUser.user.id
            this.movements[1].created_by_user_id = this.$store.state.currentUser.user.id
            axios.post(process.env.VUE_APP_BACKEND_ROUTE + "api/v1/inventory/create", this.movements[0])
            .then(response=>{
                this.$store.dispatch('inventory/modifyInventories', this.movements[0])
                axios.post(process.env.VUE_APP_BACKEND_ROUTE + "api/v1/inventory/create", this.movements[1])
                .then(response=>{
                    this.$store.dispatch('inventory/modifyInventories', this.movements[1])
                    this.snackbar = {
                        message: 'Inventario transferido con éxito',
                        color: 'success',
                        show: true
                    }
                    this.items = []
                    this.meta = {
                        current_page:1,
                        last_page:0
                    }
                    this.selected_item=undefined
                    this.movements[0].item_id=''
                    this.movements[1].item_id=''
                }).catch(error=>{
                    this.snackbar = {
                        message: 'Error al recibir inventario',
                        color: 'error',
                        show: true
                    }
                })
            })
            .catch(error=>{
                this.snackbar = {
                    message: 'Error al enviar inventario',
                    color: 'error',
                    show: true
                }
            })
        },
    }
}
</script>