<template>
    <v-container style="max-width:100vw; background:white;" class="pa-4">
        <!-- Filtros -->
        <v-navigation-drawer style="top: 0px; max-height:100vh!important;" right v-model="filters" :clipped="$vuetify.breakpoint.lgAndUp" app>
            <filterInvoices @filtersInvoice="filtersInvoice"/>
        </v-navigation-drawer>
        <v-toolbar flat>
            <v-toolbar-title class="">
                Facturas
                <br/>    
                <span style="font-size:12px; color:grey; position: absolute;" v-if="filterStorage">Mes Actual</span>
            </v-toolbar-title>
            <v-btn icon @click="openFilter()" class="ml-6 pt-2" v-if="filterStorageLength== undefined">
                <v-icon>mdi-filter</v-icon>
            </v-btn>
            <v-btn icon class="ml-6" v-else @click="openFilter()">
                <v-badge overlap color="primary">
                    <template v-slot:badge>
                        {{filterStorageLength}}
                    </template>
                    <v-icon>mdi-filter</v-icon>
                </v-badge>
            </v-btn>
            <v-spacer></v-spacer>
            <!--v-btn icon @click="exportExcel">
                <v-icon>mdi-download</v-icon>
            </v-btn-->
            <v-btn class="elevation-0" color="primary" small @click="globalInvoice()" v-if="permissions('globalInvoice')">
                Generar Factura Global
            </v-btn>
        </v-toolbar>
        <v-data-table  
        height="600"
        fixed-header
        :footer-props="{'items-per-page-options':[15, 30, 50, 100]}"
        :options.sync="options"
        :server-items-length="totalInvoices"
        :loading="loading"
        :item-class="itemRowBackground" 
        :headers="headers" 
        :items="invoices" 
        class="elevation-0 px-6 py-4">

        <template v-slot:[`item.verification_url`]="{ item }">
            <v-btn class="elevation-0" color="primary" rounded x-small :href="verification_url">Verificar</v-btn>
        </template>

        <template v-slot:[`item.collection_sale`]="{ item }">
            <v-btn small class="pa-0" text v-if="item.collection_id!=undefined" :to="{ path: '/sales/' + item.collection_id }">Cobranza(s) {{item.collection_id}}</v-btn>
            <v-btn small class="pa-0" text v-if="item.sale_id!=undefined" :to="{ path: '/sales/' + item.sale_id }">Venta {{item.sale_id}}</v-btn>
            <span style="font-weight: 500; letter-spacing: 0.0892857143em; font-size: 0.75rem; text-indent: 0.0892857143em; text-transform: uppercase;" v-else-if="item.type=='I'">Factura Global</span>
            <span style="font-weight: 500; letter-spacing: 0.0892857143em; font-size: 0.75rem; text-indent: 0.0892857143em; text-transform: uppercase;" v-else-if="item.type=='P'">Complemento de Pago</span>
        </template>
        
        <template v-slot:[`item.payment_form`]="{ item }">
            {{paymentForm(item.payment_form)}}
        </template>
        <template v-slot:[`item.payment_method`]="{ item }">
            {{paymentMethod(item.payment_method)}}
        </template>
        <template v-slot:[`item.type`]="{ item }">
            {{typeName(item.type)}}
        </template>
        <template v-slot:[`item.use`]="{ item }">
            {{useName(item.use)}}
        </template>
        <template v-slot:[`item.total`]="{ item }">
            {{(item.total*1).toLocaleString('es-MX', { style: 'currency', currency: 'MXN',})}}
        </template>
        

        <template v-slot:[`item.actions`]="{ item }">
            <v-menu bottom left>
                <template v-slot:activator="{ on, attrs }">
                    <v-btn icon v-bind="attrs" v-on="on">
                        <v-icon>mdi-dots-vertical</v-icon>
                    </v-btn>
                </template>
                <v-list style="font-size:13px;">
                    <v-list-item  v-if="permissions('cancelInvoice') && item.status!='canceled'" @click="invoice_to_cancell.sheet=true, invoice_to_cancell.invoice=item.facturapi_id">
                        <v-icon small class="mr-2">
                            mdi-close
                        </v-icon>
                        Cancelar
                    </v-list-item>
                    <v-list-item @click="sendInvoiceEmail(item)">
                        <v-icon small class="mr-2">
                            mdi-email
                        </v-icon>
                        Enviar por Correo
                    </v-list-item>
                    <v-list-item v-if="item.type=='I'" @click="printInvoiceTicket(item.facturapi_id, item)">
                        <v-icon small class="mr-2">
                            mdi-print
                        </v-icon>
                        Imprimir Factura en Ticket
                    </v-list-item>

                    <v-list-item @click="downloadInvoice(item)">
                        <v-icon small class="mr-2">
                            mdi-download
                        </v-icon>
                        Descargar
                    </v-list-item>

                    <v-list-item v-if="(item.collection_id==undefined && item.sale_id==undefined) && item.type=='I'" @click="generateComplement(item)">
                        <v-icon small class="mr-2">
                            mdi-file-document
                        </v-icon>
                        Generar Complemento de Pago
                    </v-list-item>
                </v-list>
            </v-menu>
        </template>

        </v-data-table>
        <!-- Motivo de cancelacion -->
        <div class="text-center">
            <v-bottom-sheet  v-model="invoice_to_cancell.sheet" inset>
                <v-sheet class="text-center" :height="invoice_to_cancell.motive=='01' ?  '230px' : '160px'">
                    <div class="pt-6">
                    ¿Motivo de cancelación de la factura {{invoice_to_cancell.invoice}}?
                    </div>
                    <v-row class="mt-2">
                        <v-spacer/>
                        <v-select style="width:200px;" label="Seleccione el motivo" rounded dense outlined v-model="invoice_to_cancell.motive" :items="motives"></v-select>
                        <v-spacer/>
                    </v-row>

                    <v-row class="mt-2" v-if="invoice_to_cancell.motive=='01'">
                        <v-spacer/>
                        <v-text-field style="width:200px;" label="Folio Fiscal de la nueva factura" rounded dense outlined v-model="invoice_to_cancell.substitution"></v-text-field>
                        <v-spacer/>
                    </v-row>

                    <v-btn text color="error" @click="invoice_to_cancell={motive: '', invoice: '', sheet: false}">
                    Salir
                    </v-btn>
                    <v-btn text color="primary" @click="cancellInvoice()">
                    Cancelar Factura
                    </v-btn>
                </v-sheet>
            </v-bottom-sheet>
        </div>
        <v-snackbar :color="snackbar.color" v-model="snackbar.show">
            {{ snackbar.message }}
        </v-snackbar>
        <!-- Enviar factura -->
        <v-dialog v-model="invoiceEmailDialog" max-width="700px">
            <v-card v-if="invoiceEmailDialog" class="py-5">
                <v-row class="ma-0">
                    <v-spacer/>
                        <v-card-title>Selecciona el correo al que enviaras la factura B-{{invoice_to_send.folio_number}}</v-card-title>
                    <v-spacer/>
                </v-row>

                <v-row class="ma-0">
                    <v-spacer/>
                    <v-text-field v-model="fiscal_email" label="Email"></v-text-field>
                    <v-spacer/>
                </v-row>

                <v-card-actions>
                    <v-row class="ma-0">
                        <v-spacer/>
                        <v-btn @click="sendInovice()" rounded color="primary" class="elevation-0">Enviar</v-btn>
                        <v-spacer/>
                    </v-row>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-dialog v-model="dialogComplement" max-width="700px">
            <v-card v-if="dialogComplement" class="py-5">
                <v-row class="ma-0">
                    <v-spacer/>
                        <v-card-title>Fecha en que se recibió el pago</v-card-title>
                    <v-spacer/>
                </v-row>

                <v-row class="ma-0">
                    <v-spacer/>
                    <v-menu v-model="datePicker" :close-on-content-click="false" :nudge-right="40" transition="scale-transition" offset-y min-width="290px">
                        <template v-slot:activator="{ on }">
                            <v-text-field :rules="[v => !!v || 'Campo requerido']" required v-model="complement_date" label="" prepend-icon="mdi-calendar" readonly v-on="on"></v-text-field>
                        </template>
                        <v-date-picker color="primary" v-model="complement_date" @input="datePicker = false"></v-date-picker>
                    </v-menu>
                    <v-spacer/>
                </v-row>

                <v-card-actions>
                    <v-row class="ma-0">
                        <v-spacer/>
                        <v-btn @click="confirmComplement()" rounded color="primary" class="elevation-0">Generar Complemento</v-btn>
                        <v-spacer/>
                    </v-row>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-dialog v-model="filterMobile" fullscreen hide-overlay transition="dialog-bottom-transition">
            <filterInvoices style="background:white;" @filtersInvoice="filtersInvoice"/>
        </v-dialog>

        <v-dialog v-model="printDialog" max-width="350px">
            <printInvoice @cerrarPrintInvocie="cerrarPrintInvocie" v-bind:invoice="invoice_to_print"></printInvoice>
        </v-dialog> 
        <v-dialog v-model="globalInvoiceDialog" max-width="900px">
            <v-row class="ma-0 pa-8 pb-6" style="background:white;">
                <v-row class="ma-0" style="width:100%;">
                    <v-spacer/>
                    <v-menu offset-y :close-on-content-click="closeDatePicker(dates)">
                        <template v-slot:activator="{ on, attrs }">
                            <v-text-field  clearable  outlined v-model="dates" label="Fecha" prepend-inner-icon="mdi-calendar" v-bind="attrs" readonly v-on="on"></v-text-field>
                        </template>
                        <v-date-picker style="min-width:443px;" v-model="dates" range></v-date-picker>
                    </v-menu>
                    <v-spacer/>
                </v-row>
                <v-col cols="6">
                    <v-card class="pa-4 elevation-0" style="background:#f4f5fb;">
                        <v-card-subtitle class="pa-0 text-center">Tarjeta de Crédito</v-card-subtitle>
                        <v-row class="ma-0 my-2" v-if="!loading_global_invoice">
                            <v-spacer/>
                            <v-card-title class="pa-0">{{(global_invoice.total_credito*1).toLocaleString('es-MX', { style: 'currency', currency: 'MXN',})}}</v-card-title>
                            <v-spacer/>
                        </v-row>
                        <v-skeleton-loader class="my-4 mx-12" v-else type="text"></v-skeleton-loader>
                        <v-btn :loading="is_being_generated_credito" v-if="!loading_global_invoice" small rounded color="primary" :disabled="global_invoice.total_credito<0.01" @click="generateGlobalInvoice(6), is_being_generated_credito=true" class="elevation-0 mx-auto d-block">Generar Factura</v-btn>
                        <v-btn v-else small rounded color="primary" :disabled="true" class="elevation-0 mx-auto d-block">Generar Factura</v-btn>
                    </v-card>
                </v-col>
                <v-col cols="6">
                    <v-card class="pa-4 elevation-0" style="background:#f4f5fb;">
                        <v-card-subtitle class="pa-0 text-center">Tarjeta de Debito</v-card-subtitle>
                        <v-row class="ma-0 my-2" v-if="!loading_global_invoice">
                            <v-spacer/>
                            <v-card-title class="pa-0">{{(global_invoice.total_debito*1).toLocaleString('es-MX', { style: 'currency', currency: 'MXN',})}}</v-card-title>
                            <v-spacer/>
                        </v-row>
                        <v-skeleton-loader class="my-4 mx-12" v-else type="text"></v-skeleton-loader>
                        <v-btn :loading="is_being_generated_debito" v-if="!loading_global_invoice" small rounded color="primary" :disabled="global_invoice.total_debito<0.01" @click="generateGlobalInvoice(7), is_being_generated_debito=true" class="elevation-0 mx-auto d-block">Generar Factura</v-btn>
                        <v-btn v-else small rounded color="primary" :disabled="true" class="elevation-0 mx-auto d-block">Generar Factura</v-btn>
                    </v-card>
                </v-col>
                <v-row class="ma-0 mt-6">
                    <v-spacer/>
                    <v-card-title v-if="!loading_global_invoice" class="pa-0">Total = {{(global_invoice.total_global*1).toLocaleString('es-MX', { style: 'currency', currency: 'MXN',})}}</v-card-title>
                    <v-spacer/>
                </v-row>
            </v-row>
        </v-dialog> 
    </v-container>
</template>

<script>
import axios from 'axios';
import XLSX from 'xlsx';
import fiscal_catalogs from '../../mixins/fiscal_catalogs'
import filterInvoices from '../invoices/filters'
import PrintInvoice from "../ferreteria/invoice"
export default {
    invoiceEmailDialog:false,
    mixins: [fiscal_catalogs],
    components: {
        filterInvoices:filterInvoices,
        'printInvoice':PrintInvoice
    },
    data: () => ({
        datePicker:false,
        complement_date:new Date().toLocaleString("sv-SE", {timeZone: "America/Monterrey"}).toString().slice(0, 10),
        dialogComplement:false,
        complement:undefined,
        globalInvoiceDialog:false,
        printDialog:false,
        invoice_to_print:{},
        invoice_to_send:{},
        fiscal_email:'',
        invoiceEmailDialog:false,
        options: {},
        loading: true,
        snackbar: {
            show: false,
            message: null,
            color: null
        },
        invoice_to_send:{},
        sheet: false,
        filters: false,
        filterMobile: false,
        invoices:[],
        headers:[
            {text:'Folio', value:'folio_number'},
            {text:'Fecha', value:'date'},
            {text:'Status de Cancelación', value:'cancellation_status'},
            {text:'Venta / Cobranza', value:'collection_sale'},
            {text:'Condiciones de Pago', value:'conditions'},
            {text:'Forma de Pago', value:'payment_form'},
            {text:'Metodo de Pago', value:'payment_method'},
            {text:'Serie', value:'series'},
            {text:'Status', value:'status'},
            {text:'Monto', value:'total'},
            {text:'Tipo', value:'type'},
            {text:'Uso de CFDI', value:'use'},
            //{text:'Verificación', value:'verification_url'},
            {value:'actions', sortable:false},
        ],
        filterStorageLength:0,
        totalInvoices:0,
        motives:[
            {value:'01', text:'Comprobante emitido con errores con relación'},
            {value:'02', text:'Comprobante emitido con errores sin relación'},
            {value:'03', text:'No se llevó a cabo la operación'},
            {value:'04', text:'Operación nominativa relacionada en la factura global'},
        ],
        invoice_to_cancell:{
            motive: '',
            invoice: '',
            sheet: false,
            substitution:undefined
        },
        loading_global_invoice:true,
        global_invoice:undefined,
        is_being_generated_credito:false,
        is_being_generated_debito:false,
        dates:[new Date().toLocaleString("sv-SE", {timeZone: "America/Monterrey"}).slice(0,10), new Date().toLocaleString("sv-SE", {timeZone: "America/Monterrey"}).slice(0,10)]
    }),
    watch: {
        options: {
            handler () {
                this.getDataFromApi()
            },
            deep: true,
        },
        dates: {
            handler () {
                console.log(this.dates)
                if(this.dates.length==2 || this.dates.length==null){
                    this.globalInvoice()
                }
            },
            deep: true
        }
    },
    computed:{
        filterStorage(){
            if(localStorage.getItem('filtersInvoices')!=null){
                false
            }else{
                return true
            }
        },
        currentUser(){
            return this.$store.state.currentUser.user
        }
    },
    methods: {
        downloadInvoice(invoice){
            console.log(invoice)
            let config = {
                responseType: 'arraybuffer',
                headers: {
                    'Authorization': "Bearer " + process.env.VUE_APP_FACTURAPI_TOKEN,
                    'Content-Type': 'application/json',
                    'Accept': 'application/pdf'
                }
            }
            axios.get('https://www.facturapi.io/v2/invoices/' + invoice.facturapi_id + '/pdf', config).then((response) => {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', invoice.uuid+ '.pdf'); //or any other extension
                document.body.appendChild(link);
                link.click();
            })
        },
        closeDatePicker(dates){
            if(dates!=undefined && dates.length==2){
                return true
            }else{
                return false
            }
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
        generateGlobalInvoice(methodId){
            var filter = ''
            if(this.dates.length == 2){
                filter = '&date1=' + this.dates[0] + '&date2=' + this.dates[1]
            }
            axios.post(process.env.VUE_APP_BACKEND_ROUTE + 'api/v2/global-invoices/make-credit?methodId=' + methodId + filter).then(response=>{
                /*let config2 = {
                    responseType: 'arraybuffer',
                    headers: {
                        'Authorization': "Bearer" + process.env.VUE_APP_FACTURAPI_TOKEN,
                        'Content-Type': 'application/json',
                        'Accept': 'application/pdf'
                    }
                }
                var invoice = response.data
                axios.get('https://www.facturapi.io/v2/invoices/' + invoice.facturapi_id + '/pdf', config2).then((resp) => {
                    const url = window.URL.createObjectURL(new Blob([resp.data]));
                    const link = document.createElement('a');
                    link.href = url;
                    link.setAttribute('download', invoice.uuid + '.pdf');
                    document.body.appendChild(link);
                    link.click();*/
                    this.globalInvoice()
                    this.snackbar = {
                        message: 'Factura generada con éxito',
                        color: 'success',
                        show: true
                    }
                    this.is_being_generated_credito = false
                    this.is_being_generated_debito = false
                    this.getDataFromApi()
                //})
            })
        },
        globalInvoice(){
            this.globalInvoiceDialog = true
            this.loading_global_invoice = true
            var filter = ''
            if(this.dates.length == 2){
                filter = '?date1=' + this.dates[0] + '&date2=' + this.dates[1]
            }
            axios.get(process.env.VUE_APP_BACKEND_ROUTE + 'api/v2/global-invoices' + filter).then(response=>{
                this.loading_global_invoice = false
                this.global_invoice = response.data
            })
        },
        printInvoiceTicket(facturapi_id, invoice){
            let config = {
                headers: {
                    'Authorization': "Bearer " + process.env.VUE_APP_FACTURAPI_TOKEN, 
                    'Content-Type': "application/json"
                }
            }
            axios.get('https://www.facturapi.io/v2/invoices/' + facturapi_id, config).then(response=>{
                this.invoice_to_print = response.data
                this.invoice_to_print.sale = invoice.sale
                this.printDialog = true
            })
        },
        cerrarPrintInvocie: function(params){
            this.printDialog = false
        },
        filtersInvoice: function(params) {
            this.getDataFromApi()
            this.showTable = false
            if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
                this.filterMobile = false
            }
            this.$nextTick(() => {
                this.showTable = true
            })
        },
        cancellInvoice(){
            let config = {
                headers: {
                    'Authorization': "Bearer " + process.env.VUE_APP_FACTURAPI_TOKEN
                },
                params: {
                    motive: this.invoice_to_cancell.motive,
                    substitution: this.invoice_to_cancell.substitution
                },
            }
            axios.delete('https://www.facturapi.io/v2/invoices/' + this.invoice_to_cancell.invoice, config).then((resp) => {
                var invoice = {
                    cancellation_status: 'accepted',
                    status: 'canceled'
                }
                axios.patch(process.env.VUE_APP_BACKEND_ROUTE + "api/v2/invoices/" + this.invoices.filter(invoice=>invoice.facturapi_id == this.invoice_to_cancell.invoice)[0].id, invoice).then(response => {
                    this.invoices.filter(invoice=>invoice.facturapi_id == this.invoice_to_cancell.invoice)[0].cancellation_status = 'accepted'
                    this.invoices.filter(invoice=>invoice.facturapi_id == this.invoice_to_cancell.invoice)[0].status = 'canceled'
                    this.snackbar = {
                        message: 'Factura cancelada con éxito',
                        color: 'success',
                        show: true
                    }
                    this.invoice_to_cancell = {
                        motive: '',
                        invoice: '',
                        sheet: false
                    }
                })
            }).catch(error=>{
                this.snackbar = {
                    message: error.response.data.message,
                    color: 'red',
                    show: true
                }
            })
        },
        sendInvoiceEmail(item){
            this.invoiceEmailDialog = true
            this.invoice_to_send = item
        },
        sendInovice(){
            let config = {
                headers: {
                    'Authorization': "Bearer " + process.env.VUE_APP_FACTURAPI_TOKEN
                }
            }
            axios.post('https://www.facturapi.io/v2/invoices/' + this.invoice_to_send.facturapi_id + '/email', {email: this.fiscal_email},config).then((resp) => {
                this.snackbar = {
                    message: 'Factura enviada con éxito',
                    color: 'success',
                    show: true
                }
                this.invoiceEmailDialog = false
                this.invoice_to_send = {}
            }).catch(error=>{
                this.snackbar = {
                    message: error.response.data.message,
                    color: 'red',
                    show: true
                }
            })
        },
        paymentForm(item){
            return this.payment_forms.filter(form=>form.value == item).map(form=>form.value + ' | ' + form.text)[0]
        },
        paymentMethod(item){
            return this.payment_methods.filter(method=>method.value == item).map(method=>method.value + ' | ' + method.text)[0]
        },
        typeName(item){
            switch(item){
                case 'I': return 'Factura'
                case 'P': return 'Complemento de Pago'
                case 'E': return 'Egreso'
                case 'N': return 'Nomina'
                case 'T': return 'Traslado'
            }
        },
        useName(item){
            return this.$store.state.cfdi.uses.filter(use=>use.Clave == item).map(use=>use.Clave + ' | ' + use.Descripción)[0]
        },
        exportExcel: function () {
            let data = XLSX.utils.json_to_sheet(this.invoices)
            const workbook = XLSX.utils.book_new()
            const filename = 'Lista de Cobranzas'
            XLSX.utils.book_append_sheet(workbook, data, filename)
            XLSX.writeFile(workbook, `${filename}.xlsx`)
        },
        openFilter(){
            if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
                this.filterMobile = true
            }else{
                if(this.filters == false){
                    this.$emit("closeDrawer", false);
                    this.filters = true
                }else{
                    this.$emit("closeDrawer", true);
                    this.filters = false
                }
            }
        },
        itemRowBackground: function (item) {
            switch(item.type){
                case 'I': return 'white'
                case 'P': return '#f4f5fb'
                case 'E': return ''
                case 'N': return ''
                case 'T': return ''
            }
        },
        getDataFromApi () {
            this.loading = true
            this.apiCall().then(data => {
                this.invoices = data.invoices
                this.totalInvoices = data.total
                this.loading = false
            })
        },
        apiCall () {
            return new Promise((resolve, reject) => {
                this.filterStorageLength = localStorage.getItem('filtersInvoicesLength')
                const { sortBy, sortDesc, page, itemsPerPage } = this.options
                var invoices = []
                var total = 0
                var link = ''
                if(this.company!=undefined){
                    link = link + 'filter[company_id]='+this.company+'&'
                }
                if(localStorage.getItem('filtersInvoices')!=null&&localStorage.getItem('filtersInvoices')!=undefined){
                    link = link + JSON.parse(localStorage.getItem('filtersInvoices'))+'&'
                }
                if (sortBy.length === 1 && sortDesc.length === 1) {
                        if(sortDesc[0]){
                            link = "&sort=-" + sortBy[0]
                        }else{
                            link = "&sort=" + sortBy[0]
                        }
                }
                axios.get(process.env.VUE_APP_BACKEND_ROUTE + "api/v2/invoices?" + link + "page=" + page + "&itemsPerPage=" + itemsPerPage).then(response => {
                    invoices = this.mapInvoices(response.data.data)
                    total = response.data.meta.total
                    resolve({
                        invoices,
                        total,
                    })
                })
            })
        },
        mapInvoices(invoices){
            console.log(invoices)
            return invoices
        },
        generateComplement(element){
            this.complement = element
            this.dialogComplement = true
        },
        confirmComplement(){
            const invoice = [this.complement].map(id=>{return{
                type:"P",
                customer:id.facturapi_customer_id,
                complements:[{
                    type:"pago",
                    data:[{
                        payment_form: id.payment_form,
                        related_documents: [{
                            uuid: id.uuid,
                            amount: id.total,
                            taxes: [{
                                base: (id.total/1.16).toFixed(2),
                                type: "IVA",
                                rate: 0.16
                            }],
                            installment: 1,
                            last_balance: id.total
                        }],
                        date: this.complement_date
                    }],
                }],
                //external_id:id.id,
                series: 'Serie A'
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
                    date: facturapi.created_at.toLocaleString("sv-SE", {timeZone: "America/Monterrey"}).toString().slice(0, 19),
                    type: facturapi.type,
                    uuid: facturapi.uuid,
                    use: facturapi.use,
                    folio_number:facturapi.folio_number,
                    //payment_form: facturapi.payment_form,
                    //payment_method: facturapi.payment_method,
                    //sale_id: facturapi.external_id,
                    //conditions: facturapi.conditions,
                    cfdi_version: facturapi.cfdi_version,
                    facturapi_customer_id: facturapi.customer_id,
                    verification_url: facturapi.verification_url,
                    status: facturapi.status,
                    cancellation_status: facturapi.cancellation_status,
                    total: facturapi.total,
                    series: facturapi.series,                    
                    collection_id: facturapi.external_id,
                    /* al tiro, quien sabe porque salen en la respuesta estos
                    items:[{
                        discount: 0
                        product: {
                            description: "Pago"
                            price: 0
                            product_key: "84111506"
                            taxes: []
                            unit_key: "ACT"
                            unit_name: "Actividad"
                        }
                        quantity: 1
                    }]*/
                }
                axios.post(process.env.VUE_APP_BACKEND_ROUTE + "api/v2/invoices", sale).then(response => {
                    this.snackbar = {
                        message: 'Complemento de pago generada con éxito',
                        color: 'success',
                        show: true
                    }
                    this.dialogComplement = false
                    this.complement_date=undefined
                    this.complement=undefined
                })
            }).catch(error => {
                this.snackbar = {
                    message: error.response.data.message,
                    color: 'error',
                    show: true
                }
            })
        }
    }
}
</script>

<style>
.v-card-title.text-center {
  text-align: center!important;
}
</style>