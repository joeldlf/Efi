<template>
    <v-container>
        <v-card class="px-8 mb-4 elevation-0">
            <v-card-title>Inventario Físico</v-card-title>
            <v-text-field @click="actived_field_index='search'" id="searcher" v-model="search" @keydown.enter="getDataFromApi()" :loading="loading" outlined label="Buscar producto(s)"></v-text-field>
        </v-card>
        <v-list class="px-4">
            
            <v-row class="ma-0 py-3" v-for="(item, index) in items" :key="index" style="border-bottom:2px #f4f5fb solid;">
                <v-col cols="8">
                    {{item.name}}
                </v-col>
                <v-col cols="4">
                    <v-text-field type="number" hide-details v-model="item.new_inventory" @click="actived_field_index=index" :id="index==0 ? 'first_item' : ''" @keydown.enter="saveInventory(item)" outlined label="Inventario"></v-text-field>
                </v-col>
            </v-row>

            <div class="text-center py-6">
                <v-pagination
                v-model="meta.current_page"
                :length="meta.last_page"
                circle
                :total-visible="10"
                ></v-pagination>
            </div>
        </v-list>
        <div class="only_mobile mt-3">
            <SimpleKeyboard @onChange="onChange" @onKeyPress="onKeyPress" :input="input"/>
        </div>
        <v-snackbar :color="snackbar.color" v-model="snackbar.show">
            {{ snackbar.message }}
        </v-snackbar>
    </v-container>
</template>

<script>
import axios from "axios"
import SimpleKeyboard from "./SimpleKeyboard";
export default {
    data(){
        return{
            actived_field_index:0,
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
        }
    },
    components:{
        SimpleKeyboard
    },
    computed:{
        page(){
            return this.meta.current_page
        },
    },
    watch:{
        page:{
            handler:function(prev, next){
                if(prev!=next){
                    this.getDataFromApi()
                }
            }
        },
    },
    methods:{
        onChange(input) {
            this.input = input;
            if(this.actived_field_index!='search'){
                this.items[this.actived_field_index].new_inventory = input
            }else{
                this.search = input
            }
        },
        onKeyPress(button) {
            if(button=='{enter}'){
                if(this.actived_field_index!='search'){
                    this.saveInventory(this.items[this.actived_field_index])
                }else{
                    this.getDataFromApi()
                }
            }else if(button=="{bksp}"){
                this.onChange(this.input.slice(0,this.input.length-1))
            }
        },
        onInputChange(input) {
            this.input = input.target.value;
        },
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
        saveInventory(item){
            const perro = {
                created_by_user_id: this.$store.state.currentUser.user.id,
                type: 'Ajuste Inventario Físico',
                item_id: item.id,
                quantity: item.new_inventory - item.inventory,
                inventory: item.new_inventory,
                branch_id:this.$store.state.currentUser.user.branch_id
            }
            axios.post(process.env.VUE_APP_BACKEND_ROUTE + "api/v1/inventory/create", perro)
            .then(response=>{
                this.$store.dispatch('inventory/modifyInventories', perro)
                this.items = []
                this.meta = {
                    current_page:1,
                    last_page:0
                }
                this.snackbar = {
                    message: 'Inventario físico guardado con éxito',
                    color: 'success',
                    show: true
                }
                this.$nextTick(() => {
                    setTimeout(() => {
                        const field = document.getElementById('searcher');
                        field.focus()
                    }, 100)
                })
            })
            .catch(error=>{
                this.snackbar = {
                    message: 'Error al capturar inventario',
                    color: 'error',
                    show: true
                }
            })
        },
    }
}
</script>

<style>
@media(min-width: 980px){
    .only_mobile{
        display: none!important;
    }
}
</style>