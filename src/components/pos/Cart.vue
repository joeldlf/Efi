<template>
    <v-container >
        <v-row class="ma-0 mt-2 pl-5">
            <strong>carrito ({{cartCount}})</strong>
            <v-spacer/>
             <v-switch class="mr-3 ma-0" v-model="payment_method_ppd" inset label="PPD" style="font-weight:800;" ></v-switch>
             <v-switch class="mr-3 ma-0" v-model="is_quotation" inset label="Cotización" style="font-weight:800;" ></v-switch>
             <v-switch class="mr-3 ma-0" v-model="cortesia" inset label="Cortesía" style="font-weight:800;" ></v-switch>
        </v-row>
        <v-row  id="scroll-target" style="height: calc(100vh - 320px);  overflow-x:hidden;" class="overflow-y-auto">
            <v-list class="pb-0">
                <v-list-item v-for="(item,index) in StoreCart" :key="index" style="border-bottom:1px solid #e0e0e0; margin-left:5px">
                    <v-list-item-icon class="ma-0 mr-3">
                        <v-row class="ma-0 px-2" style="background: #ecedf3; padding-top: 4px; border-radius: 5px; margin-top: 4px!important;">
                            <v-text-field style="width:100px;" dense type="number" outlined v-model="item.quantity"></v-text-field>
                            <v-spacer/>
                            <v-btn style="margin-top:5px;" icon small @click="removeItem(index)">
                                <v-icon small>  mdi-delete </v-icon>
                            </v-btn>
                        </v-row>
                    </v-list-item-icon>
                    <v-list-item-content style="padding-top: 10px!important;">
                        <div style="font-size: 15px!important; font-weight:500;"> {{item.product.name}}</div>
                        <div style="font-size: 14px!important;">
                            <div v-if="!item.product.edit">c/u = {{(item.product.price*1.16).toLocaleString('es-MX', { style: 'currency', currency: 'MXN',})}} <v-btn icon x-small @click="item.product.edit=true, edited_item=item, modifiedProductPrice=true"><v-icon x-small>mdi-pencil</v-icon></v-btn></div>
                            <v-text-field @keydown.enter="item.product.edit=false, modifiedProductPrice=true" v-if="item.product.edit" class="pt-0" prefix="$" suffix="c/u (+IVA)" v-model="item.product.price"></v-text-field>
                            <v-text-field class="pt-0" v-if="item.product.sat_key_code==undefined || item.product.sat_key_code==null || item.product.sat_key_code==''" label="Código SAT" v-model="item.product.new_sat_key_code"></v-text-field>
                        </div>
                    </v-list-item-content>
                </v-list-item>   
            </v-list>
        </v-row>
        <v-row>
            <v-col class="total pa-0">
                <v-card tile class="px-6 py-1">
                    <v-switch class="ml-1" v-model="ticket_type" inset label="Factura" style="font-weight:600;"></v-switch>
                    <v-autocomplete class="mb-3" v-if="ticket_type" v-model="ticket.payment_form" dense label="Método de Pago" rounded outlined :items="payment_forms" item-text="text" item-value="value"></v-autocomplete>
                    <strong>Sub-Total:</strong> {{subtotal.toLocaleString('es-MX', { style: 'currency', currency: 'MXN',})}}
                    <br>
                    <strong>IVA:</strong> {{iva.toLocaleString('es-MX', { style: 'currency', currency: 'MXN',})}}
                    <br>
                    <strong>Total:</strong> {{((subtotal*1)+(iva*1)).toLocaleString('es-MX', { style: 'currency', currency: 'MXN',})}}

                    <v-switch class="ml-1" v-model="has_desc" inset label="Descuento Global" style="font-weight:600;"></v-switch>
                
                    <v-row v-if="has_desc" class="mx-0">
                        <v-col cols="2" class="px-0 mt-2">
                            <v-icon class="pt-2" @click="desc='percent'" v-if="desc=='amount'" > mdi-currency-usd</v-icon>
                            <v-icon class="pt-2" @click="desc='amount'" v-else> mdi-percent</v-icon>
                        </v-col>
                        <v-col cols="10" class="px-0 mt-2">
                            <v-text-field rounded outlined dense class="pt-0" v-model="rebajo" label="Descuento"></v-text-field>
                        </v-col>
                    </v-row>
                </v-card>
                <v-card tile color="primary" :disabled="(ticket_type && ticket.payment_form=='') || loader || client==undefined"><!-- # d71182 -->
                    <v-list-item link @click="preSave()" dark>
                        <v-list-item-content style="color:white;"><!-- #32241c -->
                            <strong>PAGAR</strong>
                        </v-list-item-content>
                    </v-list-item>    
                </v-card>
            </v-col>
        </v-row>

        <!-- Dialogo ticket -->
        <v-dialog persistent v-model="dialogTicket" max-width="350px">
            <bdbTicket v-if="backend_link == 'https://backendbdb.unocrm.mx/'" @cerrar="cerrarTicket" v-bind:ticket="ticket"/>
            <ticket v-else @cerrar="cerrarTicket" v-bind:ticket="ticket"/>
        </v-dialog>

        <!-- Dialogo autorizacion -->
        <v-dialog v-model="authDialog" max-width="500px"><!-- @click:outside="has_desc=false, cortesia=false" -->
            <v-card class="pa-6">
                <v-card-title class="pa-0 pb-4">Ingrese Código de Autorización</v-card-title>
                <v-text-field class="ma-0" v-model="auth_code" @keydown.enter="check_auth_code=!check_auth_code" label="Codigo de Autorización" outlined></v-text-field>
            </v-card>
        </v-dialog>

        <!-- Avisos -->
        <v-snackbar :color="snackbar.color" v-model="snackbar.show">
            {{ snackbar.message }}
        </v-snackbar>

    </v-container>
</template>

<script>
import axios from "axios";
import Ticket from "../pos/Ticket"
import BdbTicket from "../pos/BdbTicket"
import fiscal_catalogs from '../../mixins/fiscal_catalogs'
export default {
    mixins: [fiscal_catalogs],
    props:{
        cliente:String,
    },
    components: {
        'ticket':Ticket,
        'bdbTicket':BdbTicket,
    },
    data:()=>({
        cortesia:false,
        modifiedProductPrice:false,
        check_auth_code:false,
        has_desc:false,
        desc:'percent',
        is_quotation:false,
        loader: false,
        snackbar: {
            show: false,
            message: null,
            color: null
        },
        authDialog:false,
        edited_item:undefined,
        auth_code:'',
        rebajo:0,
        dialogPago:false,
        dialogTicket:false,
        menu:false,
        menu2:false,
        menu3:false,
        payment_method_ppd:false,
        ticket_type:false,
        ticket:{
            company_id:null,
            user_id:'',
            note:'',
            items:[{
                quantity:1,
                item:'',
                price:''
            }],
            status:'vendido',
            bar:1,
            subtotal:'',
            date:'',
            iva:'',
            total:'',
            invoice:'',
            created_by_user_id:'',
            last_updated_by_user_id:'',
            payment_form:'',
            payment_method:'PUE',
            authorized_by:'',
            authorization_reason:''
        },
    }),
    watch:{
        check_auth_code:{
            handler(){
                if(this.backend_link != 'https://backendbdb.unocrm.mx/' && this.auth_code == process.env.VUE_APP_POS_AUTH_CODE){
                    this.save()
                }else if(this.backend_link == 'https://backendbdb.unocrm.mx/'){
                    axios.post(process.env.VUE_APP_BACKEND_ROUTE + 'api/v2/user/authorize', {authorization_code: this.auth_code}).then(resp=>{
                        this.ticket.authorized_by = resp.data
                        if(this.has_desc){
                            this.ticket.authorization_reason = this.ticket.authorization_reason + '- Descuento ' 
                        }
                        if(this.cortesia){
                            this.ticket.authorization_reason = this.ticket.authorization_reason + '- Cortesía ' 
                        }
                        this.authDialog = false
                        this.save()
                    })
                }else{
                    this.authDialog = false
                }
            }, deep: true
        },
        payment_method_ppd:{
            handler(){
                if(this.payment_method_ppd){
                    this.payment_method = 'PPD'
                }else{
                    this.payment_method = 'PUE'
                }
            }, deep: true,
        }
    },
    computed: {
        
        backend_link(){
            return process.env.VUE_APP_BACKEND_ROUTE
        },
        client(){
            return this.$store.state.cart.client.id
        },
        cualMetodo(){
            if(this.payment_method_ppd){
                return 'PPD'
            }else{
                return 'PUE'
            }
        },
        methodList:{
            get(){
                var response = this.$store.state.payment_method.payment_methods
                if(this.backend_link == "https://backend.ferreteriaenlinea.com/"){
                    return response.filter(method=>method.method != 'Tarjeta')
                }else{
                    return response
                }
                
            }
        },
        currentUser:{
            get(){
                return this.$store.state.currentUser.user;
            }
        },
        StoreCart() {
            return this.$store.state.cart.carts
        },
        cartCount() {
            var sum = 0
            for(var i=0; i<this.StoreCart.length; i++){
                sum = sum + this.StoreCart[i].quantity*1
            }
            return sum
        },
        subtotal: function(){
            var sum = 0;
            this.StoreCart.forEach(e => {
                sum += Number(e.quantity*e.product.price);
            });
            if(this.desc=='percent'){
                sum = sum-((sum/100)*this.rebajo)
            }
            if(this.desc=='amount'){
                sum = sum-this.rebajo
            }
            return sum
        },
        iva: function(){
            var sum = 0;
            this.StoreCart.forEach(e => {
                sum += (Number(e.quantity*e.product.price));
            });
            if(this.desc=='percent'){
                sum = sum-((sum/100)*this.rebajo)
            }
            if(this.desc=='amount'){
                sum = sum-this.rebajo
            }
            return sum*.16
        },
    },
    created(){
        this.$store.dispatch('currentUser/getUser')
    },
    methods: {
        authorize(){
            if( this.edited_item!= undefined){
                this.StoreCart.filter(cart=>cart == this.edited_item)[0].product.edit = true
            }
            this.authDialog = false
            this.auth_code = ''
            if(this.has_desc){
                if(!this.ticket.authorization_reason.contains('Descuento')){
                    this.ticket.authorization_reason = this.ticket.authorization_reason + ' -Descuento'
                }
            }
            if(this.cortesia){
                if(!this.ticket.authorization_reason.contains('Cortesia')){
                    this.ticket.authorization_reason = this.ticket.authorization_reason + ' -Cortesia'
                }
            }
        },
        add(index) {
            this.ticket.methods.push({ id: '', amount: '' });
        },
        remove(index) {
            this.ticket.methods.splice(index, 1);
        },
        removeItem(index) {
            this.$store.dispatch('cart/removeItem', index);
        },
        downItem(index) {
            this.$store.dispatch('cart/downItem', index);
        },
        upItem(id, index) {
            this.$store.dispatch('cart/upItem', {'id':id, 'index':index});
        },
        priceWithoutDiscount(price, quantity){
            if(this.desc=='percent'){
                return price-((price/100)*this.rebajo)
            }
            if(this.desc=='amount'){
                return price-((this.rebajo/this.StoreCart.length)/quantity)
            }
        },
        preSave(){
            if(this.cortesia||this.has_desc||this.modifiedProductPrice){
                this.authDialog = true
            }else{
                this.save()
            }
        },
        save(){
            if(this.cortesia){
                this.ticket.status = 'cortesia'
            }
            if(this.is_quotation){
                this.ticket.status = 'quotation'
            }
            this.loader = true
            var serie = ''
            if(this.ticket_type){
                serie = 'Serie A'
            }else{
                serie = 'Serie B'
            }
            this.ticket = [this.ticket].map(ticket=>{return{
                company_id:this.$store.state.cart.client.id,
                user_id:this.currentUser.id,
                note:'',
                items:this.StoreCart.map(id=>{return{
                    quantity:id.quantity*1,
                    item:id.product.id,
                    price:this.priceWithoutDiscount(id.product.price, id.quantity*1),
                    cost:id.product.cost,
                    value:id.product.price,
                }}),
                status:ticket.status,
                bar:1,
                subtotal:this.subtotal,
                iva:this.iva,
                total:(this.subtotal*1) + (this.iva*1),
                date:new Date().toLocaleString("sv-SE", {timeZone: "America/Monterrey"}).toString().slice(0, 10),
                created_by_user_id:this.currentUser.id,
                last_updated_by_user_id:this.currentUser.id,
                id:'',
                self_invoice_url:'',
                type:serie,
                receipt: {
                    items: this.StoreCart.map(id=>{return{
                        quantity: id.quantity*1,
                        product: this.facturapi_product_id(id.product),
                    }}),
                    //date: new Date().toISOString({timeZone: "America/Monterrey"}),
                    payment_form: ticket.payment_form
                },
                payment_form:ticket.payment_form,
                payment_method:this.cualMetodo,
                authorized_by:ticket.authorized_by,
                authorization_reason:ticket.authorization_reason
            }})[0]
            console.log('2')
            if(this.ticket_type && !this.is_quotation){
                console.log('3')
                axios.post(process.env.VUE_APP_BACKEND_ROUTE + 'api/v2/sale/pos', this.ticket).then(reponse => {
                    console.log('4')
                    this.loader = false
                    const resp = reponse.data.data
                    /*this.ticket.id = resp.id
                    this.ticket.self_invoice_url = resp.self_invoice_url*/

                    console.log(resp)

                    this.ticket = [resp].map(id=>{return{
                        id:id.id,
                        company_id:id.company.id,
                        note:id.note,
                        bar:id.bar,
                        subtotal:id.subtotal,
                        iva:id.iva,
                        total:id.total,
                        date:id.date,
                        status:id.status,

                        created_at: id.created_at,

                        user_id:this.currentUser.id,
                        
                        items:id.items.map(i=>{return{
                            quantity:i.quantity,
                            product:i.item,
                            price:i.price,
                        }}),

                        self_invoice_url:id.self_invoice_url,
                        
                    }})[0]
                    console.log('5')
                    this.dialogTicket=true;
                }).catch(error => {
                    this.loader = false
                    this.snackbar = {
                        message: error.response.data.message,
                        color: 'error',
                        show: true
                    }
                })
            }else{
                this.ticket.user_id = this.currentUser.id
                axios.post(process.env.VUE_APP_BACKEND_ROUTE + 'api/v2/sales', this.ticket).then(reponse => {
                    this.loader = false
                    const resp = reponse.data.data
                    /*this.ticket.id = resp
                    this.ticket.self_invoice_url = undefined*/
                    
                    this.ticket = [resp].map(id=>{return{
                        id:id.id,
                        company_id:id.company.id,
                        note:id.note,
                        bar:id.bar,
                        subtotal:id.subtotal,
                        iva:id.iva,
                        total:id.total,
                        date:id.date,

                        created_at: id.created_at,

                        user_id:this.currentUser.id,
                        
                        items:id.items.map(i=>{return{
                            quantity:i.quantity,
                            product:i.item,
                            price:i.price,
                        }}),
                        status:id.status,

                        self_invoice_url:id.self_invoice_url,
                        
                    }})[0]

                    this.dialogTicket=true;
                }).catch(error => {
                    this.loader = false
                    this.snackbar = {
                        message: error.response.data.message,
                        color: 'error',
                        show: true
                    }
                })
            }
            
        },
        cerrarTicket: function(params) {
            this.dialogTicket=false;
            location.reload();
        },
        facturapi_product_id(product){
            if(product.sat_key_code==null||product.sat_key_code==undefined||product.sat_key_code==''){
                product.sat_key_code = product.new_sat_key_code
            }
            /*console.log(product)
            if(product.facturapi_id!=undefined && ){
                return product.facturapi_id
            }else{*/
                return {
                    "description": product.name,
                    "product_key": product.sat_key_code,
                    "price": product.price,
                    "tax_included": false,
                    "taxability": "01",
                    "taxes": [{
                        "type": "IVA",
                        "rate": 0.16
                    }],
                    "local_taxes": [ ],
                    "sku": product.code_one,
                    "unit_key": 'H87',
                    "unit_name": 'Pieza'
                }
            //}
        }
    },
};
</script>

<style>
.total{
    position:absolute!important; 
    bottom:0!important;
}
#scroll-target .v-text-field__details{
    display: none!important;
}
</style>


precio mostrador -> 3
precio mayoreo -> 1


permiso venta precio menor que costo y producto en $0.00


Todos los productos son con iva en ferreteria y en efi sin iva