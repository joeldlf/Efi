<template>
    <v-container style="max-width:100vw;">
        <v-data-table 
        :options.sync="options" 
        :footer-props="{'items-per-page-options':[15, 30, 50, inventoryLength]}"
        :server-items-length="inventoryLength"
        :headers="headers" 
        :items="inventory"
        v-if="!loader"
        class="elevation-0 px-6 py-4">
            <template v-slot:[`item.sale_id`]="{ item }">
                <v-list-item class="px-0" style="min-height:0px!important; font-size:14px;" :to="{ path: '/sales/' + item.sale_id}">{{item.sale_id}}</v-list-item>
            </template>
            <!-- Header -->
            <template v-slot:top>
                <v-toolbar flat style="z-index:9!important;">
                    <v-toolbar-title>Mermas</v-toolbar-title>
                    <v-spacer></v-spacer>
                    <div style="width:500px;">
                        <v-text-field v-model="searchItems" append-icon="mdi-magnify" :loading="isLoadingItems" label="Producto" placeholder="Escribe para buscar"></v-text-field>
                        <v-list  v-if="!isLoadingItems && searchItems!=''" class="py-0" style="position: absolute; z-index: 999; height: 130px; overflow-y: scroll; margin-top: -21px; box-shadow: 0px 0px 2px 0px #0000004a; cursor:pointer;"><!-- && itemFilterValue==''-->
                            <v-list-item v-for="(product, index) in itemsList" :key="index" style="border-bottom:1px solid #00000021;" class="item-hover"  @click="searchAction(product.id), searchItems=''">
                                {{product.name}}
                            </v-list-item>
                        </v-list>
                    </div>
                </v-toolbar>
            </template>
        </v-data-table>
        <!-- Crear venta -->
        <v-dialog v-model="createDialog" max-width="900px">
          <template v-slot:activator="{ on, attrs }">
            <v-btn bottom color="#e25200" dark fab fixed right v-bind="attrs" v-on="on">
                <v-icon color="white">  mdi-plus </v-icon>
            </v-btn> 
          </template>
          <v-card>
            <v-card-title>Alta de Merma</v-card-title>
            <div class="px-8">
                <v-autocomplete class="pt-5" v-model="merma.sale_id" :items="salesList" :loading="isLoadingSale" :search-input.sync="searchSales" hide-no-data item-value="id" item-text="name" label="Venta" placeholder="Escribe para buscar"></v-autocomplete>
                <div>
                    <v-text-field v-model="searchItems" append-icon="mdi-magnify" :loading="isLoadingItems" label="Producto" placeholder="Escribe para buscar"></v-text-field>
                    <v-list  v-if="!isLoadingItems && searchItems!=''" class="py-0" style="position: absolute; z-index: 999; height: 130px; overflow-y: scroll; margin-top: -21px; box-shadow: 0px 0px 2px 0px #0000004a; cursor:pointer;"><!-- && itemFilterValue==''-->
                        <v-list-item v-for="(product, index) in itemsList" :key="index" style="border-bottom:1px solid #00000021;" class="item-hover"  @click="merma.item_id = product.id, searchItems=''">
                            {{product.name}}
                        </v-list-item>
                    </v-list>
                    <v-text-field label="Cantidad" v-model="merma.quantity"></v-text-field>
                </div>
            </div>
            <v-card-actions>
                <v-row class="ma-0">
                    <v-spacer/>
                    <v-btn @click="createDialog=false" rounded class="elevation-0 mr-4" color="grey">Cancelar</v-btn>
                    <v-btn @click="save()" rounded class="elevation-0" color="primary">Guardar</v-btn>
                </v-row>
            </v-card-actions>
          </v-card>
        </v-dialog>
    </v-container>
</template>

<script>
import axios from "axios";
export default {
    data:()=>({
        createDialog:false,
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
        isLoadingItems:false,
        entries:{
            sales:[]
        },
        isLoadingSale: false,
        searchSales: null,
        merma:{
            branch_id:'', 
            quantity:'', 
            type:'Merma', 
            item_id: '', 
            created_by_user_id: '', 
            item_id:''
        },
    }),
    watch:{
        searchSales(val){
            //if (this.salesList.length > 0) return
            if (this.isLoadingSale) return
            this.isLoadingSale = true
            axios.get(process.env.VUE_APP_BACKEND_ROUTE + 'api/v2/orders/dispatched_orders?filter'+val)
            .then(res => {
                console.log(res)
                this.entries.sales = res.data.data
            }).finally(() => (this.isLoadingSale = false))
        },
        searchItems:{
            handler(){
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
                console.log(this.store_invenntory)
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
        salesList(){
            return this.entries.sales.map(id => {
                return{
                    id:id.id,
                    name: 'id:' + id.id + ' | ' + id.company.attributes.razon_social + ' | ' + id.date
                }
            })
        },
        loader(){
            return this.$store.state.inventory.loader
        },
        store_invenntory(){
            var inventory = this.$store.state.inventory.inventories
            .filter(inventory=>inventory.branch_id == this.currentUser.branch[0].id)
            .filter(inventory=>inventory.type == 'Merma')
            if(this.$route.params.id!=undefined){
                return inventory.filter(item=>item.item_id == this.$route.params.id)
            }
            else{
                return inventory
            }
        },
        headers(){
            return [
            { text: 'Producto', value: 'item_id' },
            { text: 'Cantidad', value: 'quantity' },
            { text: 'Fecha', value: 'created_at' },
            { text: 'Venta', value: 'sale_id' },
            { text: 'Usuario', value: 'created_by_user_id' }
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
        save(){
            this.merma.created_by_user_id = this.$store.state.currentUser.user.id
            this.merma.branch_id = this.$store.state.currentUser.user.branch[0].id
            axios.post(process.env.VUE_APP_BACKEND_ROUTE + "api/v1/inventory/create", this.merma).then(response=>{
                location.reload()
            })
        },
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