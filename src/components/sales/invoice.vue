<template>
    <v-container class="pa-0">
        <v-card class="pa-6">
            
            <div v-if="invoice.customer!=null">
                <v-card-title class="mb-0 pb-0">
                    {{company.name}}
                    <v-btn icon @click="invoice.customer=null">
                        <v-icon small>mdi-pencil</v-icon>
                    </v-btn>
                </v-card-title>
                <v-card-subtitle class="mt-0 pt-1">
                    {{company.razon_social}} - {{company.rfc}}
                </v-card-subtitle>
            </div>

            <div v-else class="mb-4">
                <div v-if="sku=='code_one'">
                    <div v-if="!modifyClient">
                        <v-card-title class="mb-0 pb-0">
                            {{company.name}}
                            <v-btn small class="elevation-0 ml-4" @click="modifyClient=true">
                                <v-icon small class="mr-1">mdi-pencil</v-icon>
                                Cambiar cliente
                            </v-btn>
                        </v-card-title>
                        <v-card-subtitle class="mt-0 pt-1">
                            {{company.razon_social}} - {{company.rfc}}
                        </v-card-subtitle>
                    </div>
                    <v-row class="ma-0 pa-4" v-else>
                        <v-autocomplete dense outlined @keydown.enter="filter()" v-model="quotation_company_id" :items="companyLists" :loading="isLoadingCompany" :search-input.sync="searchCompanies" item-value="id" item-text="name" label="Empresa(s)" placeholder="Escribe para buscar">
                            <template v-slot:item="{item, attrs, on}">
                                <v-list-item v-on="on" v-bind="attrs">
                                    <v-list-item-content>
                                        <v-list-item-title v-if="item.name!=null">
                                            <span v-if="item.macro!=null">{{item.macro}}</span>{{item.name}}
                                            <div v-if="item.razon_social!=null">
                                                <span style="font-size:12px;">{{item.razon_social}}</span>
                                            </div>
                                        </v-list-item-title>
                                        <v-list-item-title v-else-if="item.razon_social!=null">
                                            {{item.razon_social}}
                                        </v-list-item-title>
                                    </v-list-item-content>
                                </v-list-item>
                            </template> 
                            <template slot="no-data">
                                <div class="px-4 py-1">No existen clientes relacionados. 
                                    <v-btn rounded class="mx-3 elevation-0" color="primary" @click="createCompanyDialog=true" small>Crear</v-btn>
                                </div>
                            </template>                      
                        </v-autocomplete>
                        <v-btn @click="saveClientOfQuotation()" rounded class="elevation-0 ml-4" color="primary">Guardar</v-btn>
                        <v-btn @click="modifyClient=false, quotation_company_id=''" rounded class="elevation-0 ml-4" color="primary" text>Cancelar</v-btn>
                    </v-row>
                </div>

                

                <v-card-title class="pb-0">
                    Por favor verficia los datos del cliente
                </v-card-title>
                <v-text-field v-model="company.razon_social" :error="nosa" hint="sin el régimen societario (ej.: S.A. de C.V.)." persistent-hint dense class="mt-3 mb-0 mx-3" label="Razón Social*" outlined></v-text-field>
                <v-row class="ma-0">
                    <v-col cols="4" class="mt-2">
                        <v-text-field v-model="company.rfc" dense label="RFC*" outlined></v-text-field>
                    </v-col>
                    <v-col cols="4" class="mt-2">
                        <v-text-field v-model="company.fiscal_email" dense label="Email" outlined :hint="'Correo Principal: ' + company.email" persistent-hint></v-text-field>
                    </v-col>
                    <v-col cols="4" class="mt-2">
                        <v-autocomplete v-model="company.tax_system" dense label="Régimen Fiscal*" outlined :items="tax_systems" item-text="name" item-value="id"></v-autocomplete>
                    </v-col>
                </v-row>
                <v-row class="ma-0">
                    <div style="text-align:center; background:whitesmoke; width:100%" class="py-3 mb-2">
                        {{company.address}}
                    </div>
                    <v-col cols="4" class="mt-2">
                        <v-text-field v-model="company.fiscal_address_json.street" dense label="Calle" outlined></v-text-field>
                    </v-col>
                    <v-col cols="4" class="mt-2">
                        <v-text-field v-model="company.fiscal_address_json.exterior" dense label="# Exterior" outlined></v-text-field>
                        </v-col>
                    <v-col cols="4" class="mt-2">
                        <v-text-field v-model="company.fiscal_address_json.interior" dense label="# Interior" outlined></v-text-field>
                        </v-col>
                    <v-col cols="4" class="mt-2">
                        <v-text-field v-model="company.fiscal_address_json.neighborhood" dense label="Colonia" outlined></v-text-field>
                        </v-col>
                    <v-col cols="4" class="mt-2">
                        <v-text-field v-model="company.fiscal_address_json.city" dense label="Ciudad" outlined></v-text-field>
                        </v-col>
                    <v-col cols="4" class="mt-2">
                        <v-text-field v-model="company.fiscal_address_json.municipality" dense label="Municipio" outlined></v-text-field>
                        </v-col>
                    <v-col cols="3" class="mt-0">
                        <v-text-field v-model="company.fiscal_address_json.zip" dense label="Código Postal*" outlined></v-text-field>
                        </v-col>
                    <v-col cols="3" class="mt-0">
                        <v-text-field v-model="company.fiscal_address_json.state" dense label="Estado" outlined></v-text-field>
                    </v-col>
                    <v-col cols="3" class="mt-0">
                        <v-text-field class="mb-2" v-model="company.fiscal_address_json.country" hint="Código de país acorde al estándar ISO 3166-1 alpha-3" persistent-hint dense label="Código de País" outlined></v-text-field>
                    </v-col>
                    <v-col cols="3" class="mt-0">
                        <v-autocomplete outlined dense clearable v-model="company.cfdi_use" :items="cfdi" label="Uso de CFDI" item-text="Descripción" item-value="Clave">
                            <template slot="no-data">No existen usos relacionados.</template>                      
                        </v-autocomplete>
                    </v-col>
                </v-row>
                <v-row class="ma-0 pt-0" style="margin-top:-30px!important;">
                    <v-spacer/>
                    <v-btn rounded color="primary" @click="saveClient()" class="elevation-0" small :disabled="readyToSave || modifyClient">Guardar</v-btn>
                </v-row>
            </div>

            <v-card class="px-5 py-3 elevation-1 mb-4" v-for="(product, index) in invoice.products" :key="index" :color="color(product.item)">

                <v-row class="ma-0" style="line-height:28px;">
                    {{product.quantity}} | {{product.item.name}} | {{product.price.toLocaleString('es-MX', { style: 'currency', currency: 'MXN',})}} + IVA
                    <v-spacer/>
                    <v-btn v-if="product.item.facturapi_id==undefined && edited_item_id != product.item.id" class="elevation-0" small @click="edited_item_id = product.item.id">Validar producto</v-btn>
                    <v-btn v-if="product.item.facturapi_id==undefined && edited_item_id == product.item.id" color="primary" :disabled="product.item[sku]==undefined||product.item.sat_key_code==undefined||product.item.unit_name==undefined" class="elevation-0" small @click="saveProduct(product.item, index)">Guardar</v-btn>
                </v-row>

                <v-row class="ma-0" v-if="product.item.facturapi_id==undefined && edited_item_id == product.item.id">
                    <v-col cols="4" class="pb-0 mt-4">
                        <v-text-field class="mb-2" v-model="product.item[sku]" dense label="SKU" outlined></v-text-field>
                    </v-col>
                    <v-col cols="4" class="pb-0 mt-4">
                        <v-text-field class="mb-2" v-model="product.item.sat_key_code" hint="Clave de producto/servicio, del catálogo del SAT" persistent-hint dense label="Código SAT" outlined></v-text-field>
                    </v-col>
                    <v-col cols="4" class="pb-0 mt-4">
                        <v-select class="mb-2" v-model="product.item.unit_name" :items="products_units" item-text="name" item-value="name" dense label="Unidad de Medida" outlined></v-select>
                    </v-col>
                </v-row>

            </v-card>

            <v-row class="ma-0">
                <v-col cols="4" class="pb-0">
                    <v-autocomplete v-model="invoice.payment_form" dense label="Forma de Pago" outlined :items="payment_forms" item-text="text" item-value="value"></v-autocomplete>
                </v-col>
                <v-col cols="4" class="pb-0">
                    <v-autocomplete v-model="invoice.payment_method" dense label="Método de Pago" outlined :items="payment_methods" item-text="text" item-value="value"></v-autocomplete>
                </v-col>
                <v-col cols="4" class="pb-0">
                    <v-autocomplete v-model="invoice.use" dense label="Uso de CFDI" outlined :items="cfdi" item-text="Descripción" item-value="Clave"></v-autocomplete>
                </v-col>
            </v-row>

            

            <v-row class="ma-0">
                <v-text-field class="mb-2" v-model="invoice.note" hint="# Orden de Compra" persistent-hint dense label="Condiciones de Pago" outlined></v-text-field>
                <v-spacer/>
                <v-btn color="primary" :disabled="invoice.customer==null||valid_products||modifyClient" class="elevation-0 mt-4" :loading="loading_button" rounded @click="saveInvoice()">Generar Factura</v-btn>
            </v-row>

        </v-card>
        <v-snackbar :color="snackbar.color" v-model="snackbar.show">
            {{ snackbar.message }}
        </v-snackbar>
        <!-- Crear cliente -->
        <v-dialog v-model="createCompanyDialog" max-width="700px">
          <template v-slot:activator="{ on, attrs }">
            <v-btn bottom color="#e25200" dark fab fixed right v-bind="attrs" v-on="on">
                <v-icon color="white">  mdi-plus </v-icon>
            </v-btn> 
          </template>
          <createCompany @closeCreateDialogClient="closeCreateDialogClient"/>
        </v-dialog>

        
    </v-container>
</template>

<script>
import axios from "axios"
import fiscal_catalogs from '../../mixins/fiscal_catalogs'
import CreateCompany from "../clients/companies/create"
export default {
    mixins: [fiscal_catalogs],
    props:{
        invoice:Object
    },
    components: {
        'createCompany':CreateCompany,
    },  
    data(){return{
        invoice_note:'',
        createCompanyDialog: false,
        modifyClient:false,
        loading_button:false,
        company:'',
        edited_item_id:'',
        fiscal_address_json:{
            street:'',
            exterior:'',
            interior:'',
            neighborhood:'',
            city:'',
            municipality:'',
            zip:'',
            state:'',
            country:'MEX'
        },
        
        snackbar: {
            show: false,
            message: null,
            color: null
        },
        searchCompanies: null,
        entries:{
            companies: []
        },
        isLoadingCompany: false,
        quotation_company_id:''
    }},
    watch:{
        company_cfdi_use:{
            handler(){
                this.invoice.use = this.company.cfdi_use
            }, deep:true
        },
        invoice:{
            handler(){
                this.loading_button = false
                this.company = this.invoice.company
                if(this.company.fiscal_address_json==null){
                    this.company.fiscal_address_json = this.fiscal_address_json
                }
                this.invoice.use = this.company.cfdi_use
            }
        },
        searchCompanies(val){
            if(val!=null){
                //if (this.companyLists.length > 0) return
                if (this.isLoadingCompany) return
                this.isLoadingCompany = true
                axios.get(process.env.VUE_APP_BACKEND_ROUTE + 'api/v2/companies?filter[name_razon_social]='+val)
                .then(res => {
                    this.entries.companies = res.data.data
                }).finally(() => (this.isLoadingCompany = false))
            }
        },
    },
    created(){
        this.company = this.invoice.company
        if(this.company.fiscal_address_json==null){
            this.company.fiscal_address_json = this.fiscal_address_json
        }
        this.invoice.use = this.company.cfdi_use
    },
    computed:{
        company_cfdi_use(){
            return this.company.cfdi_use
        },
        companyLists(){
            return this.entries.companies.map(id => {
                return{
                    id:id.id,
                    name:id.attributes.name,
                    razon_social:id.attributes.razon_social,
                }
            })
        },
        cfdi(){
            return this.$store.state.cfdi.uses
        },
        nosa(){
            if(this.company.razon_social!=undefined && (
                this.company.razon_social.toLowerCase().includes('s.a. de c.v')||
                this.company.razon_social.toLowerCase().includes('sa de cv')||
                this.company.razon_social.toLowerCase().includes('sapi de cv')||
                this.company.razon_social.toLowerCase().includes('sapi')||
                this.company.razon_social.toLowerCase().includes('s.a de c.v')||
                this.company.razon_social.toLowerCase().includes('s. c')||
                this.company.razon_social.toLowerCase().includes('s.c')||
                this.company.razon_social.toLowerCase().includes('s.a.s')||
                this.company.razon_social.toLowerCase().includes('s. a. s')||
                this.company.razon_social.toLowerCase().includes('rl de cv')
            )){
                return true
            }else{
                return false
            }
        },
        readyToSave(){
            if(this.company.razon_social!=undefined&&this.company.rfc!=undefined&&this.company.tax_system!=undefined&&this.company.fiscal_address_json.zip!=undefined&&
            this.company.razon_social!=null&&this.company.rfc!=null&&this.company.tax_system!=null&&this.company.fiscal_address_json.zip!=null&&
            this.company.razon_social!=''&&this.company.rfc!=''&&this.company.tax_system!=''&&this.company.fiscal_address_json.zip!=''){
                return false
            }else{
                return true
            }
        },
        sku(){
            if(process.env.VUE_APP_BACKEND_ROUTE == "https://suministros.uno/"){
                return 'id'
            }else if(process.env.VUE_APP_BACKEND_ROUTE == "https://backend.ferreteriaenlinea.com/"){
                return 'code_one'
            }
        },
        valid_products(){
            for(var i=0; i<this.invoice.products; i++){
                if(this.invoice.products[i].item.facturapi_id){
                    return true
                }
            }
            return false
        }
    },
    methods:{
        closeCreateDialogClient: function(params) {
            axios.get(process.env.VUE_APP_BACKEND_ROUTE + 'api/v2/companies?filter[name_razon_social]='+params)
            .then(res => {
                this.entries.companies = res.data.data
                this.quotation_company_id =  res.data.data[0].id
                this.company = res.data.data[0].attributes
                this.createCompanyDialog = false;
            })
        },
        saveClientOfQuotation(){
            axios.patch(process.env.VUE_APP_BACKEND_ROUTE + 'api/v2/sales/' + this.invoice.external_id, {company_id:this.quotation_company_id}).then(response=>{
                axios.get(process.env.VUE_APP_BACKEND_ROUTE + 'api/v2/sales/' + this.invoice.external_id).then(response=>{
                    this.company = response.data.data.company.attributes
                    this.invoice.customer = response.data.data.company.attributes.facturapi_id
                    if(this.company.fiscal_address_json==null){
                        this.company.fiscal_address_json = this.fiscal_address_json
                    }
                    this.modifyClient = false
                    this.quotation_company_id = ''
                })
            })
            this.modifyClient = false
        },
        price(price){
            if(price!=undefined){
                return price
            }else{
                return 1
            }
        },
        color(item){
            if(item.facturapi_id!=undefined){
                return 'white'
            }else if(this.edited_item_id == item.id){
                return '#f4f5fb'
            }else{
                return '#ffacac'
            }
        },
        saveClient(){
            var facturApiClient = [this.company].map(id=>{return{
                legal_name: id.razon_social,
                email: id.fiscal_email,
                tax_id: id.rfc,
                address: id.fiscal_address_json,
                tax_system: id.tax_system,
            }})[0]
            let config = {
                headers: {
                    'Authorization': "Bearer " + process.env.VUE_APP_FACTURAPI_TOKEN,
                    'Content-Type': "application/json"
                }
            }
            axios.post('https://www.facturapi.io/v2/customers', facturApiClient, config).then(response => {
                this.company.facturapi_id = response.data.id
                this.invoice.customer = response.data.id
                this.company.validation = true
                axios.patch(process.env.VUE_APP_BACKEND_ROUTE + "api/v2/companies/" + this.company.id, this.company).then(response => {
                    this.snackbar = {
                        message: 'Datos actualizados con éxito',
                        color: 'success',
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
        },
        saveProduct(product, index){
            var facturApiProduct = [product].map(item=>{return{
                description: item.name,
                product_key: item.sat_key_code,
                price: this.price(item.price),
                tax_included: false,
                taxability: "01",
                taxes: [{
                    "type": "IVA",
                    "rate": 0.16
                }],
                unit_key: this.products_units.filter(unit=>unit.unit_name == item.unit_name).map(unit=>unit.unit_key)[0],
                unit_name: item.unit_name,
                sku: item[this.sku] + ''
            }})[0]
            let config = {
                headers: {
                    'Authorization': "Bearer " + process.env.VUE_APP_FACTURAPI_TOKEN,
                    'Content-Type': "application/json"
                }
            }
            axios.post('https://www.facturapi.io/v2/products', facturApiProduct, config).then(response => {
                this.invoice.items[index].product_id = response.data.id
                this.invoice.products[index].facturapi_id = response.data.id
                product.facturapi_id = response.data.id
                axios.patch(process.env.VUE_APP_BACKEND_ROUTE + "api/v2/items/" + product.id, product).then(response => {
                    this.snackbar = {
                        message: 'Producto validado con éxito',
                        color: 'success',
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
        },
        close(invoice){
            this.company = ''
            this.edited_item_id = ''
            this.fiscal_address_json = {
                street:'',
                exterior:'',
                interior:'',
                neighborhood:'',
                city:'',
                municipality:'',
                zip:'',
                state:'',
                country:'MEX'
            }
            this.$nextTick(() => {
                this.loading_button = false
                this.$emit("cerrarInvocie", invoice);
            })
        },
        items(products, index){
            return [products[index].item].map(item=>{return{
                description: item.name,
                product_key: item.sat_key_code,
                price: this.price(item.price),
                tax_included: false,
                taxability: "01",
                taxes: [{
                    "type": "IVA",
                    "rate": 0.16
                }],
                sku: item[this.sku] + '',
                unit_key: this.products_units.filter(unit=>unit.unit_name == item.unit.name).map(unit=>unit.unit_key)[0],
                unit_name: this.products_units.filter(unit=>unit.unit_name == item.unit.name).map(unit=>unit.unit_name)[0],
            }})[0]
        },
        returnName(unit){
            if(unit!=undefined){
                return unit.name
            }
        },
        haveNote(note, type){
            if(note!=undefined && note!=null && note!=''){
                if(type=='header'){
                    return '<td><strong>Orden de compra:</strong></td>'
                }else if(type=='value'){
                    return '<td><span>' + note + '</span></td>'
                }
            }else{
                return ''
            }
        },
        haveInvoiceNote(type){
            if(this.invoice_note!=undefined && this.invoice_note!=null && this.invoice_note!=''){
                if(type=='header'){
                    return '<td><strong>Comentarios:</strong></td>'
                }else if(type=='value'){
                    return '<td><span>' + this.invoice_note + '</span></td>'
                }
            }else{
                return ''
            }
        },
        haveDate(balance_due_date, type){
            if(balance_due_date!=undefined && balance_due_date!=null && balance_due_date!=''){
                if(type=='header'){
                    return '<td><strong>Fecha de vencimiento:</strong></td>'
                }else if(type=='value'){
                    return '<td><span>' + balance_due_date + '</span></td>'
                }
            }else{
                return ''
            }
        },
        haveDays(credit_days, type){
            if(credit_days!=undefined && credit_days!=null && credit_days!=''){
                if(type=='header'){
                    return '<td><strong>Días de crédito:</strong></td>'
                }else if(type=='value'){
                    return '<td><span>' + credit_days + '</span></td>'
                }
            }else{
                return ''
            }
        },
        saveInvoice(){
            this.loading_button = true
            console.log(this.invoice)
            const invoice = [this.invoice].map(id=>{return{
                items:id.items.map(item=>{return {
                    quantity: item.quantity,
                    product: {
                        description: this.productName(item.product.name),
                        product_key: item.product.sat_key_code,
                        price: item.price,
                        tax_included: false,
                        taxability: "01",
                        taxes: [{
                            "type": "IVA",
                            "rate": 0.16
                        }],
                        unit_key: this.products_units.filter(unit=>unit.unit_name == this.returnName(item.product.unit)).map(unit=>unit.unit_key)[0],
                        unit_name: this.products_units.filter(unit=>unit.unit_name == this.returnName(item.product.unit)).map(unit=>unit.unit_name)[0],
                        sku: item.product[this.sku] + ''
                    },
                    parts:[process.env.VUE_APP_BACKEND_ROUTE == "https://suministros.uno/"?{
                        description:item.product.name,
                        product_key:item.product.sat_key_code
                    }:{}]
                }}),
                payment_form: id.payment_form,
                payment_method: id.payment_method,
                use: id.use,
                //conditions: 'Orden de compra: ' + id.note,
                customer: id.customer,
                date: id.date,
                external_id: id.external_id,
                series: id.series,
                pdf_custom_section: "<table><tr>" + this.haveNote(id.note, 'header') + "<td><strong>Venta:</strong></td>" + this.haveDate(id.balance_due_date, 'header') + this.haveDays(id.company.credit_days, 'header') + this.haveInvoiceNote('header') + "</tr><tr>" + this.haveNote(id.note, 'value') + "<td><span>" + id.external_id + "</span></td>" + this.haveDate(id.balance_due_date, 'value') + this.haveDays(id.company.credit_days, 'value') + this.haveInvoiceNote('value') + "</tr></table>"
            }})[0]
            let config = {
                headers: {
                    'Authorization': "Bearer " + process.env.VUE_APP_FACTURAPI_TOKEN,
                    'Content-Type': "application/json"
                }
            }
            axios.post('https://www.facturapi.io/v2/invoices', invoice, config).then(response => {
                const facturapi = response.data
                const sale = {
                    facturapi_id: facturapi.id,
                    organization: facturapi.organization,
                    date: new Date(facturapi.created_at).toLocaleString("sv-SE", {timeZone: "America/Monterrey"}).toString().slice(0, 19),
                    type: facturapi.type,
                    uuid: facturapi.uuid,
                    use: facturapi.use,
                    folio_number:facturapi.folio_number,
                    payment_form: facturapi.payment_form,
                    payment_method: facturapi.payment_method,
                    cfdi_version: facturapi.cfdi_version,
                    facturapi_customer_id: facturapi.customer.id,
                    verification_url: facturapi.verification_url,
                    status: facturapi.status,
                    cancellation_status: facturapi.cancellation_status,
                    total: facturapi.total,
                    series: facturapi.series,
                    salesId: [facturapi.external_id*1],
                    sale_id: facturapi.external_id,
                    conditions: facturapi.conditions,
                }
                axios.post(process.env.VUE_APP_BACKEND_ROUTE + "api/v2/invoices", sale).then(agua => {
                    var email = 'joelf@unonegocios.com'
                    if(this.company.email!=null&&this.company.email!=undefined&&this.company.email!=''){
                        email = this.company.email
                    }
                    if(this.company.fiscal_email!=null&&this.company.fiscal_email!=undefined&&this.company.fiscal_email!=''){
                        email = this.company.fiscal_email
                    }
                    axios.post('https://www.facturapi.io/v2/invoices/' + facturapi.id + '/email', {'email':email}, config).then((respo) => {
                        if(process.env.VUE_APP_BACKEND_ROUTE == "https://backend.ferreteriaenlinea.com/"){
                            let config2 = {
                                responseType: 'arraybuffer',
                                headers: {
                                    'Authorization': "Bearer " + process.env.VUE_APP_FACTURAPI_TOKEN,
                                    'Content-Type': 'application/json',
                                    'Accept': 'application/pdf'
                                }
                            }
                            axios.get('https://www.facturapi.io/v2/invoices/' + facturapi.id + '/pdf', config2).then((resp) => {
                                const url = window.URL.createObjectURL(new Blob([resp.data]));
                                const link = document.createElement('a');
                                link.href = url;
                                link.setAttribute('download', facturapi.uuid + '.pdf'); //or any other extension
                                document.body.appendChild(link);
                                link.click();
                                this.close(facturapi)
                            }).catch(error => {
                                this.snackbar = {
                                    message: 'Ya se genero la factura pero, ' + error.response.data.message,
                                    color: 'error',
                                    show: true
                                }
                            })
                        }else{
                            this.close(facturapi)
                        }
                    }).catch(error => {
                        this.snackbar = {
                            message: 'Ya se genero la factura pero, ' + error.response.data.message,
                            color: 'error',
                            show: true
                        }
                    })
                }).catch(error => {
                    this.snackbar = {
                        message: 'Ya se genero la factura pero, ' + error.response.data.message,
                        color: 'error',
                        show: true
                    }
                })
            }).catch(error => {
                this.loading_button = false
                this.snackbar = {
                    message: error.response.data.message,
                    color: 'error',
                    show: true
                }
            })
        },
        productName(name){
            if(process.env.VUE_APP_BACKEND_ROUTE == "https://backend.ferreteriaenlinea.com/"){
                return name
            }else if(process.env.VUE_APP_BACKEND_ROUTE == "https://suministros.uno/"){
                if(name.toLowerCase().includes('trapo')){
                    return 'Trapo Industrial'// Multicolor'
                }else{
                    return name
                }
            }
        }
    }
}
</script>