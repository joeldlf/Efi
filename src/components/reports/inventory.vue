<template>
    <v-container style="max-width:100vw;">
        <v-navigation-drawer style="top: 0px; max-height:100vh!important;" right v-model="filters" :clipped="$vuetify.breakpoint.lgAndUp" app>
            <filterInventory @filtersInventory="filtersInventory"/>
        </v-navigation-drawer>
        <!-- Contenedor show-select -->


        <v-data-table 
        :options.sync="options" 
        :footer-props="{'items-per-page-options':[15, 30, 50, inventoryLength]}"
        :server-items-length="inventoryLength"
        :headers="headers" 
        :items="inventory"
        v-if="!loader"
        class="elevation-0 px-6 py-4">

            
            <template v-slot:[`item.type`]="{ item }">
                <v-list-item v-if="item.type.link!=''" class="px-0" style="min-height:0px!important; font-size:14px;" :to="{ path: item.type.link}">{{item.type.type}}</v-list-item>
                <v-list-item v-else class="px-0" style="min-height:0px!important; font-size:14px;">{{item.type.type}}</v-list-item>
            </template>
            <!-- Header -->
            <template v-slot:top>
                <v-toolbar flat style="z-index:9!important;">
                    <v-toolbar-title>Movimientos de Inventarioaaaa</v-toolbar-title>
                    <v-btn icon>
                        <v-icon @click="openFilter()">mdi-filter</v-icon>
                    </v-btn>
                    <v-spacer></v-spacer>
                    
                    <div style="width:500px;">
                        <v-text-field v-model="searchItems" append-icon="mdi-magnify" :loading="isLoadingItems" label="Producto" placeholder="Escribe para buscar"></v-text-field>
                        <v-list  v-if="!isLoadingItems && searchItems!=''" class="py-0" style="position: absolute; z-index: 999; height: 130px; overflow-y: scroll; margin-top: -21px; box-shadow: 0px 0px 2px 0px #0000004a; cursor:pointer;"><!-- && itemFilterValue==''-->
                            <v-list-item v-for="(product, index) in itemsList" :key="index" style="border-bottom:1px solid #00000021;" class="item-hover"  @click="searchAction(product.id), searchItems=''">
                                {{product.name}}
                            </v-list-item>
                        </v-list>
                    </div>

                    <!--div v-else style="width:500px;">

                        <v-text-field
                        
                            v-model="search"
                            append-icon="mdi-magnify"
                            label="Buscar"
                            single-line
                            hide-details
                            :loading="loadingItems"
                        ></v-text-field>

                        <v-list v-show="search!='' && itemFilterValue==''" dense class="pa-2 elevation-1" style="position: absolute; right: 0; top: 50px; background:white!important; overflow: scroll; max-height:50vh; min-width:45%;">
                            <v-list-item v-show="filter.length>0" @click="searchAction(item.id)" v-for="(item, i) in filter" :key="i" style="border-bottom:solid 1px #e0e0e0;">
                                {{item.name}}
                            </v-list-item>
                            <div class="pa-4" v-show="filter.length==0">No hay resultados relacionados</div>
                        </v-list>

                    </div-->

                </v-toolbar>
            </template>
            <template v-slot:[`item.actions`]="{ item }" >
                <v-icon v-show="permissions('delete_inventory_reports')" small @click="deleteItem(item.id)">mdi-delete</v-icon>
            </template>
        </v-data-table>
    </v-container>
</template>

<script>
import axios from "axios";
import filterInventory from "../physical_inventory/filter"
export default {
    components: {
        'filterInventory':filterInventory
    },
    data:()=>({
        selected_filters:undefined,
        search:'',
        itemFilterValue:'',
        filters:false,
        inventory: [],
        options: {},
        inventoryLength: 0,
        loadingItems: false,
        searchItems:'',
        itemsList:[],
        isLoadingItems:false
    }),
    watch:{
        searchItems:{
            handler(){
                /*if(this.searchItems==''){
                    this.itemFilterValue = ''
                }*/
                this.isLoadingItems = true
                axios.get(process.env.VUE_APP_BACKEND_ROUTE + 'api/v2/item/pos?filter[pos]=' + this.searchItems).then(response => {
                    this.itemsList = response.data.data.map(id=>{return{
                        id:id.id,
                        name:id.name
                    }})
                    this.isLoadingItems = false
                });
            }, deep: true
        },
        search:{
            handler(){
                if(this.search == ''){
                    this.itemFilterValue = ''
                }
            }
        },
        itemFilterValue:{
            handler(){
                this.filtrarAhora()
            }, deep: true
        },
        options:{
            handler(){
                const { sortBy, sortDesc, page, itemsPerPage } = this.options
                this.inventoryLength = this.store_invenntory.length
                var initialIndex = itemsPerPage * (page - 1)
                var finalIndex = initialIndex + (itemsPerPage - 1)
                this.inventory = this.store_invenntory.slice(initialIndex, finalIndex).map(id=>{
                    return{
                        id: id.id,
                        type: this.cual(id.type, id.production_id, id.sale_id, id.shopping_id),
                        quantity: id.quantity,
                        inventory: this.cerono(id.inventory),
                        item_id: this.item(id.item_id),
                        created_at: new Date(id.created_at).toLocaleString("sv-SE", {timeZone: "America/Monterrey"}).split('T'),
                        created_by_user_id: this.user(id.created_by_user_id),
                        production_id: id.production_id,
                        sale_id: id.sale_id,
                        shopping_id: id.shopping_id,
                    }
                })
            }
        }
    },
    computed: {
        loader(){
            return this.$store.state.inventory.loader
        },
        store_invenntory(){
            var inventory = this.$store.state.inventory.inventories.filter(inventory=>inventory.branch_id == this.currentUser.branch[0].id)
            console.log(inventory)
            if(this.$route.params.id!=undefined){
                console.log(inventory.filter(item=>item.item_id == this.$route.params.id))
                return inventory.filter(item=>item.item_id == this.$route.params.id)
            }
            else{
                return inventory
            }
        },
        headers(){
            return [
            { text: 'Tipo', value: 'type' },
            { text: 'Producto', value: 'item_id' },
            { text: 'Movimiento', value: 'quantity' },
            { text: 'Fecha', value: 'created_at' },
            { text: 'Usuario', value: 'created_by_user_id' },
            
            { text: 'Existencia', value: 'inventory' },
            //{ text: 'Producción', value: 'production_id' },
            //{ text: 'Venta', value: 'sale_id' },
            //{ text: 'Compra', value: 'shopping_id' },

            {text: 'Acciones', value: 'actions', sortable: false },
        ]},
        currentUser(){
            return this.$store.state.currentUser.user
        },
        filter(){
            if(this.search!=''&&this.search!=null&&this.search!=undefined){
                this.loadingItems = true
                var perro = this.$store.state.item.items

                var words = this.search.split(" ")
                for(var i=0; i<words.length; i++){
                    perro = perro.filter(item=>this.lowerCase(JSON.stringify(item.name)).includes(words[i].toLowerCase()))
                }

                this.loadingItems = false
                return perro
            }
            else{
                return ''
            }
        },
        liga(){
            return process.env.VUE_APP_BACKEND_ROUTE
        },
    },
    methods:{
        cual(type, production_id, sale_id, shopping_id){
            if(production_id!=null){
                return {
                    'type': type + ' ' + production_id,
                    'link': '/productions/'+ production_id
                }
            }else if(sale_id!=null){
                return {
                    'type': type + ' ' + sale_id,
                    'link': '/sales/'+ sale_id
                }
            }else if(shopping_id!=null&&shopping_id!=undefined&&shopping_id!=''){
                return {
                    'type': type + ' ' + shopping_id,
                    'link': '/shoppings/'+ shopping_id
                }
            }else{
                return {
                    'type': type,
                    'link': ''
                }
            }
        },
        searchAction(item){
            this.itemFilterValue=item
        },
        itemFilter(value) {
            if (!this.itemFilterValue) {
                return true;
            }
            return value==this.itemFilterValue
            
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
        category(id){
            return this.categoryName(this.$store.state.company.companies.filter(a=>a.id == id).map(a=>a.consumptions)[0])
        },
        categoryName(ids){
            if(ids!=undefined){
                var perro = this.$store.state.category.categories.filter(category=>category.id == ids[0]).map(category=>category.name)[0]
                for(var i=1; i<ids.length; i++){
                    perro = perro + ', ' + this.$store.state.category.categories.filter(category=>category.id == ids[i]).map(category=>category.name)[0]
                }
                return perro
            }
        },
        filtersInventory: function(params) {
            this.selected_filters=params
            this.filtrarAhora()
        },
        filtrarAhora(){
            var params = this.selected_filters
            this.items = ''
            var filterInventory = this.store_invenntory

            if(params!=undefined){
                //fecha
                if(params.dateFrom!='' && params.dateFrom!=null && params.dateFrom!=undefined){
                    console.log('dateFrom')
                    filterInventory=filterInventory.filter(inventory=>new Date(inventory.created_at).toLocaleString("sv-SE", {timeZone: "America/Monterrey"}) >= new Date(params.dateFrom + ' 00:00:00').toLocaleString("sv-SE", {timeZone: "America/Monterrey"}))
                }
                if(params.dateTo!='' && params.dateTo!=null && params.dateTo!=undefined){
                    console.log('dateTo')
                    filterInventory=filterInventory.filter(inventory=>new Date(inventory.created_at).toLocaleString("sv-SE", {timeZone: "America/Monterrey"}) <= new Date(params.dateTo + ' 23:59:59').toLocaleString("sv-SE", {timeZone: "America/Monterrey"}))
                }

                //responsable
                if(params.user_id!=''&&params.user_id!=undefined&&params.user_id!=null){
                    console.log('user_id')
                    var uno = filterInventory.filter(item=>item.created_by_user_id == params.user_id[0])
                    for(var i=1; i<params.user_id.length; i++){
                        uno=uno.concat(filterInventory.filter(item=>item.created_by_user_id == params.user_id[i]))   
                    }
                    filterInventory = this.removeDuplicates(uno, "id");
                }
                //tipo
                if(params.type!=''&&params.type!=undefined&&params.type!=null){
                    console.log('type')
                    var tres = filterInventory.filter(item=>item.type == params.type[0])
                    for(var i=1; i<params.type.length; i++){
                        tres=tres.concat(filterInventory.filter(item=>item.type == params.type[i]))   
                    }
                    filterInventory = this.removeDuplicates(tres, "id");
                }
            }

            //producto
            if(this.itemFilterValue!=''&&this.itemFilterValue!=undefined&&this.itemFilterValue!=null){
                console.log('itemFilterValue')
                console.log(this.itemFilterValue)
                filterInventory = filterInventory.filter(item=>item.item_id == this.itemFilterValue)
            }

            const { sortBy, sortDesc, page, itemsPerPage } = this.options
            this.inventoryLength = filterInventory.length
            var initialIndex = itemsPerPage * (page - 1)
            var finalIndex = initialIndex + (itemsPerPage - 1)
            this.inventory = filterInventory.slice(initialIndex, finalIndex).map(id=>{
                return{
                    id: id.id,
                    type: this.cual(id.type, id.production_id, id.sale_id, id.shopping_id),
                    quantity: id.quantity,
                    inventory: id.inventory,
                    item_id: this.item(id.item_id),
                    created_at: new Date(id.created_at).toLocaleString("sv-SE", {timeZone: "America/Monterrey"}).split('T'),
                    created_by_user_id: this.user(id.created_by_user_id),
                    production_id: id.production_id,
                    sale_id: id.sale_id,
                    shopping_id: id.shopping_id,
                }
            })
        },
        removeDuplicates(originalArray, prop) {
            var newArray = [];
            var lookupObject  = {};
            for(var i in originalArray) {
                lookupObject[originalArray[i][prop]] = originalArray[i];
            }
            for(i in lookupObject) {
                newArray.push(lookupObject[i]);
            }
            return newArray;
        },
        cerono(value){
            console.log(value)
            if(value>=0 || value<=0){
                return value
            }else{
                return 'NA'
            }
        },
        user(id){
            return this.$store.state.user.users.filter(user=>user.id == id).map(user=>user.name + ' ' + user.last)[0]
        },
        item(id){
            return this.$store.state.item.items.filter(item=>item.id == id).map(item=>item.name)[0]
        },
        lowerCase(text){
            if(text!=null&&text!=undefined&&text!=''){
                return text.toLowerCase()
            }else{
                return ' '
            }
        },
        deleteItem (id) {
            if (confirm('¿Seguro que deseas borrar este movimiento de inventario?')) {
                axios.delete(process.env.VUE_APP_BACKEND_ROUTE + "api/v1/inventory/delete/"+id).then(response => {
                    this.$store.dispatch('inventory/getInventories')
                }).catch(error => {
                    this.snackbar = {
                        message: error.response.data.message,
                        color: 'error',
                        show: true
                    }
                });
            }
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
    created(){
        this.$store.dispatch("item/getItems")
        this.$store.dispatch("inventory/getInventories")
    }
}
</script>
<style scoped>
.item-hover:hover{
    background: #00000008;
}
</style>