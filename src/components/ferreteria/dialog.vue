<template>
    <v-container style="max-width:100vw;">
        <v-card  class="ferreteria elevation-0 px-12 py-6" style="min-height:100vh; background:white;" v-if="editedItem!=undefined">
            <v-row class="ma-0 mb-5">
                <v-btn icon @click="closeDialog('close')">
                    <v-icon x-large>mdi-chevron-left</v-icon>
                </v-btn>
                <v-spacer/>
                <v-switch class="mt-0 mr-6" v-model="have_invoice" inset label="Factura" style="font-weight:600;"></v-switch>
            </v-row>

            <!-- Monto y Metodo -->
            <v-row class="ma-0">
                <v-autocomplete class="mx-4" v-model="payment_form" dense label="Forma de Pago" rounded outlined :items="payment_forms" item-text="text" item-value="value"></v-autocomplete>
                <v-text-field class="mx-4" v-model="amount" type="number" persistent-hint dense label="Monto" rounded outlined></v-text-field>
            </v-row>

            <!-- Facturacion -->
            <v-row class="ma-0 mt-4" v-if="(have_invoice && invoice_active && selected_ticket.facturapi_invoices.length<1)&&liga != 'https://backendbdb.unocrm.mx/'">
                <v-spacer/>
                <v-btn block rounded x-large class="elevation-0 pa-10" @click="generateInvoice()"  style="font-size:21px!important;">
                    <v-icon x-large small class="mr-2">
                        mdi-file-document
                    </v-icon>
                    Generar Factura
                </v-btn>
                <v-spacer/>
            </v-row>

            <!-- Guardar -->
            <v-card-actions class="mb-8 mt-2">
                <v-btn block rounded color="primary" class="pa-12 elevation-0" :loading="gris" :disabled="gris || (payment_form==''||payment_form==null||payment_form==undefined)" style="font-size:25px!important;" @click="save">Guardar</v-btn>
            </v-card-actions>
            
            <!-- Calculadora -->
            <v-row class="ma-0">
                <v-card-subtitle class="pa-12" style="font-size:30px!important; background:#f4f5fb!important;">
                    <strong>Por Pagar = {{(selected_ticket.total).toLocaleString('es-MX', { style: 'currency', currency: 'MXN',})}}</strong>
                </v-card-subtitle>
                <v-spacer/>
                <v-card-subtitle class="pa-12" style="font-size:30px!important; background:#f4f5fb!important;">
                    <strong>Pagado = {{amount.toLocaleString('es-MX', { style: 'currency', currency: 'MXN',})}}</strong>
                </v-card-subtitle>
                <v-spacer/>
                <v-card-subtitle class="pa-12" style="font-size:30px!important; background:#f4f5fb!important;">
                    <strong v-if="change>0">Cambio = {{(change*1).toLocaleString('es-MX', { style: 'currency', currency: 'MXN',})}}</strong>
                    <strong v-else>Faltan = {{(selected_ticket.total - amount).toLocaleString('es-MX', { style: 'currency', currency: 'MXN',})}}</strong>
                </v-card-subtitle>
            </v-row>

            <v-data-table 
            :items="selected_ticket.items"
            height="200"
            fixed-header
            :headers="items_header"
            class="elevation-2 mt-10">
                <template v-slot:[`item.quantity`]="{ item }">
                    {{item.quantity}} {{item.item.unit.name}}s
                </template>
                <template v-slot:[`item.price`]="{ item }">
                    {{(item.price*1).toLocaleString('es-MX', { style: 'currency', currency: 'MXN',})}}
                </template>
            </v-data-table>
        </v-card>


        <!-- Avisos -->
        <v-snackbar :color="snackbar.color" v-model="snackbar.show">
            {{ snackbar.message }}
        </v-snackbar>

        <!-- Dialogo Factura -->
        <v-dialog v-model="invoice_dialog" max-width="1000px">
            <invoice @cerrarInvocie="cerrarInvocie" v-bind:invoice="invoice"></invoice>
        </v-dialog> 

        <!-- Dialogo Imprimir Factura -->
        <v-dialog v-model="printDialog" max-width="350px">
            <printInvoice @cerrarPrintInvocie="cerrarPrintInvocie" v-bind:invoice="invoice_to_print"></printInvoice>
        </v-dialog> 
    </v-container>
</template>

<script>
import PrintInvoice from "../ferreteria/invoice"
import axios from "axios";
import Invoice from "../sales/invoice"
import fiscal_catalogs from '../../mixins/fiscal_catalogs'
export default {
    mixins: [fiscal_catalogs],
     components: {
        'invoice':Invoice,
        'printInvoice':PrintInvoice
    }, 
    props:{
        selected_ticket:Object
    },
    data () {
        return {
            items_header:[
                { text: 'Cantidad', value: 'quantity' },
                { text: 'Producto', value: 'item.name' },
                { text: 'Precio', value: 'price' },
            ],
            invoice_to_print:{},
            printDialog:false,
            invoice_to_facturapi:{},
            temporal_sale:undefined,
            invoice_active:true,
            invoice_dialog:false,
            method:'',
            amount:0,
            invoice:{},
            have_invoice:false,
            snackbar: {
                show: false,
                message: null,
                color: null
            },
            gris:false,
            editedItem:undefined,
        }
    },
    created(){
        this.modifyItem()
    },
    watch:{
        selected_ticket:{
            handler(){
                this.modifyItem()
            }, deep: true
        }
    },
    computed:{
        liga(){
            return process.env.VUE_APP_BACKEND_ROUTE
        },
        change(){
            return  this.amount - (this.selected_ticket.total*1)
        },
        currentUser:{
            get(){
                return this.$store.state.currentUser.user
            }
        },
        paymentMethodsList:{
            get(){
                return this.$store.state.payment_method.payment_methods
            }
        },
    },
    methods: {
        generateInvoice(){
            this.invoice = [this.selected_ticket].map(id=>{return{
                items:id.items.map(item=>{return {
                    quantity: item.quantity,
                    product_id: item.item.facturapi_id,
                    product:item.item,
                    price: item.price
                }}),
                products: id.items,
                payment_form: this.payment_form,
                payment_method: "PUE",
                use: "",
                conditions: "",
                customer: id.company.attributes.facturapi_id,
                company: id.company.attributes,
                date: new Date().toISOString({timeZone: "America/Monterrey"}),
                external_id: id.id,
                series: id.serie,
            }})[0]
            this.invoice_dialog = true
        },
        modifyItem(){
            this.payment_form = this.selected_ticket.payment_form
            this.editedItem = [this.selected_ticket].map(id=>{return{
                company_id:id.company.id,
                salesID:[this.selected_ticket].map(sale=>{return{
                    id:sale.id,
                    amount:0,
                    due:sale.due_balance,
                    new_due:sale.due_balance,
                    invoice:'',
                    invoice_date:'',
                }}),
                date:new Date().toLocaleString("sv-SE", {timeZone: "America/Monterrey"}).toString().slice(0, 10),
                methods:[{
                    method:this.payment_forms.filter(method=>method.method == this.payment_forms.filter(form=>form.value == this.selected_ticket.payment_form).map(form=>form.text)[0]).map(method=>method.id)[0],
                    amount:this.amount
                }],
                amount:this.amount,
                created_by_user_id:this.currentUser.id,
                last_updated_by_user_id:this.currentUser.id,
                user_id:this.currentUser.id,
                serie:id.type,
                payment_method_id:this.payment_forms.filter(method=>method.method == this.payment_forms.filter(form=>form.value == this.selected_ticket.payment_form).map(form=>form.text)[0]).map(method=>method.id)[0]
            }})[0]
            if(this.selected_ticket.type == 'Serie A'){
                this.have_invoice = true
            }
        },
        closeDialog (value) {
            this.invoice_to_facturapi = {}
            this.invoice_active = true
            this.invoice_dialog = false
            this.method = ''
            this.amount = 0
            this.invoice = {}
            this.have_invoice = false
            this.gris = false
            this.editedItem = undefined
            this.temporal_sale = undefined
            this.$nextTick(() => {
                this.$emit("closeDialog", value);
            })
        },
        cerrarInvocie: function(params) {
            axios.get(process.env.VUE_APP_BACKEND_ROUTE + "api/v2/sales/" + this.selected_ticket.id).then(response => {//&filter[payment_method]=PUE
                this.temporal_sale = response.data.data
            })
            this.invoice_to_print = params
            this.printDialog = true
            this.invoice_dialog = false;
            this.invoice_active = false
            this.snackbar = {
                message: 'Factura generada con éxito',
                color: 'success',
                show: true
            }
        },
        cerrarPrintInvocie: function(params){
            this.printDialog = false
        },
        save(){
            this.gris = true
            this.editedItem.methods[0].method = this.paymentMethodsList.filter(method=>method.method == this.payment_forms.filter(form=>form.value == this.payment_form).map(form=>form.text)[0]).map(method=>method.id)[0]
            this.editedItem.payment_method_id = this.paymentMethodsList.filter(method=>method.method == this.payment_forms.filter(form=>form.value == this.payment_form).map(form=>form.text)[0]).map(method=>method.id)[0]
            this.editedItem.methods[0].amount = this.amount
            if(this.have_invoice && this.temporal_sale!=undefined){
                this.editedItem.salesID[0].invoice = this.temporal_sale.invoice
                this.editedItem.salesID[0].invoice_date = this.temporal_sale.invoice_date
            }
            this.editedItem.salesID[0].amount = this.amount - this.change
            this.editedItem.amount = this.amount - this.change
            if(this.have_invoice){
                this.editedItem.serie = 'Serie A'
            }else{
                this.editedItem.serie = 'Serie B'
            }
            this.editedItem.companies = [this.editedItem.company_id]
            this.$nextTick(() => {
                axios.post(process.env.VUE_APP_BACKEND_ROUTE + "api/v1/collection/create",Object.assign(this.editedItem)).then(response=>{
                    console.log(response)
                    if(this.have_invoice && this.temporal_sale!=undefined && this.payment_form!='01'){
                        this.generatePaymentComplement(response.data)
                    }else{
                        this.closeDialog(this.selected_ticket.id)
                    }
                })/*.catch(error => {
                    this.snackbar = {
                        message: 'error guardar cobranza',
                        color: 'error',
                        show: true
                    }
                    this.gris = false
                })*/
            })
        },
        generatePaymentComplement(collection){
             this.invoice_to_facturapi = [collection].map(id=>{return{
                type:"P",
                customer:this.temporal_sale.company.attributes.facturapi_id,
                complements:[{
                    type:"pago",
                    data:[{
                        payment_form: this.payment_form,
                        related_documents: [this.temporal_sale].map(detail=>{return{
                            uuid: detail.facturapi_invoices[0].uuid,
                            amount: detail.total,
                            taxes: [{
                                base: detail.subtotal,
                                type: "IVA",
                                rate: 0.16
                            }],
                            installment: 1,
                            last_balance: detail.total
                        }}),
                    }],
                }],
                external_id:id.id,
                series:this.temporal_sale.type
            }})[0]
            console.log(this.invoice_to_facturapi)
            let config = {
                headers: {
                    'Authorization': "Bearer " + process.env.VUE_APP_FACTURAPI_TOKEN,
                    'Content-Type': "application/json"
                }
            }
            this.$nextTick(() => {
                axios.post('https://www.facturapi.io/v2/invoices', this.invoice_to_facturapi, config).then(response => {
                    const facturapi = response.data
                    const sale = {
                        facturapi_id: facturapi.id,
                        organization: facturapi.organization,
                        date: facturapi.created_at.toLocaleString("sv-SE", {timeZone: "America/Monterrey"}).toString().slice(0, 19),
                        type: facturapi.type,
                        uuid: facturapi.uuid,
                        use: facturapi.use,
                        folio_number:facturapi.folio_number,
                        cfdi_version: facturapi.cfdi_version,
                        facturapi_customer_id: facturapi.customer_id,
                        verification_url: facturapi.verification_url,
                        status: facturapi.status,
                        cancellation_status: facturapi.cancellation_status,
                        total: facturapi.total,
                        series: facturapi.series,                    
                        collection_id: facturapi.external_id
                    }
                    axios.post(process.env.VUE_APP_BACKEND_ROUTE + "api/v2/invoices", sale).then(response => {
                        this.closeDialog(this.selected_ticket.id)
                    }).catch(error => {
                        this.snackbar = {
                            message: error.response.data.message,
                            color: 'error',
                            show: true
                        }
                    })
                }).catch(error => {
                    this.snackbar = {
                        message: error.response.data.message,
                        color: 'error',
                        show: true
                    }
                })
            })
        }
    }
}
</script>

<style>
.ferreteria .v-label, .ferreteria .v-input {
    font-size: 23px!important;
}
.ferreteria .v-text-field input,.ferreteria .v-label {
    font-size: 30px!important;
}
.ferreteria .v-text-field input {
    flex: 1 1 auto!important;
    line-height: 50px!important;
    padding: 13px 0 10px!important;
}
.ferreteria .v-input input {
    max-height: 60px;
}
</style>