<template>
  <v-container class="px-4 pt-8 mt-6" style="background:white;">

    <v-toolbar flat class="mb-2">
        <v-toolbar-title>
            Recibos a Facturar del Día
        </v-toolbar-title>
        <v-spacer/>
        <v-btn small class="elevation-0" color="primary" v-if="!show_invoices" @click="validateTickets()">Validar Tickets</v-btn>
        <v-btn small class="elevation-0" color="primary" v-else @click="addInvoiceToSale()">Asociar Facturas</v-btn>
    </v-toolbar>

    <div v-if="progress_bar" class="px-6">
        <v-progress-linear v-model="knowledge" height="25">
        <strong>{{ Math.ceil(knowledge) }}%</strong>
        </v-progress-linear>
    </div>

    <v-data-table  
    v-if="show_invoices"
    height="600"
    fixed-header
    :footer-props="{'items-per-page-options':[15, 30, 50, invoices.length]}"
    :server-items-length="invoices.length"
    :headers="headers2" 
    :items="invoices" 
    class="elevation-0 px-6 py-4">
        
    </v-data-table>

    <v-data-table  
    v-else
    height="600"
    fixed-header
    :footer-props="{'items-per-page-options':[15, 30, 50, totalReceipts]}"
    :options.sync="options"
    :server-items-length="totalReceipts"
    :loading="loading"
    :headers="headers" 
    :items="receipts" 
    class="elevation-0 px-6 py-4">
        
    </v-data-table>

        <v-snackbar :color="snackbar.color" v-model="snackbar.show">
            {{ snackbar.message }}
        </v-snackbar>
  </v-container>
</template>

<script>
import axios from 'axios';
export default {
    data(){
        return{
            index: 0,
            validated_receipts:[],
            progress_bar:false,
            headers:[
                {text:'Folio de Venta', value:'id'},
                {text:'URL', value:'self_invoice_url'},
            ],
            headers2:[
                {text:'Folio Fiscal', value:'id'},
                {text:'Folio Venta', value:'external_id'},
            ],
            options: {},
            loading: true,
            snackbar: {
                show: false,
                message: null,
                color: null
            },
            sheet: false,
            receipts:[],
            facturapi_receipts:[],
            totalReceipts:0,
            show_invoices:false,
            invoices:[],
            filters:undefined
        }
    },
    watch: {
        options: {
            handler () {
                this.getDataFromApi()
            },
            deep: true,
        },
    },
    computed:{
        knowledge(){
            var perro = (100/this.options.itemsPerPage)*this.index
            if(perro==100){
                this.receipts = this.validated_receipts
                this.totalReceipts = this.receipts.length
                this.progress_bar = false
            }
            return perro
        }
    },
    methods: {
        getDataFromApi () {
            this.loading = true
            this.apiCall().then(data => {
                this.receipts = data.receipts
                this.totalReceipts = data.total
                this.loading = false
            })
        },
        apiCall () {
            return new Promise((resolve, reject) => {
                const { sortBy, sortDesc, page, itemsPerPage } = this.options
                var receipts = []
                var total = 0
                var link = ''
                if (sortBy.length === 1 && sortDesc.length === 1) {
                    if(sortDesc[0]){
                        link = "sort=-" + sortBy[0] + '&'
                    }else{
                        link = "sort=" + sortBy[0] + '&'
                    }
                }
                if(this.filters!=undefined){
                    link = link
                }
                axios.get(process.env.VUE_APP_BACKEND_ROUTE + "api/v2/sales?filter[status]=Vendido&filter[has_receipt]=1&filter[doesnt_have_invoices]=1&filter[type]=Serie A&" + link + "page=" + page + "&itemsPerPage=999999999").then(response => {
                    receipts = response.data.data
                    total = response.data.meta.total
                    resolve({
                        receipts,
                        total,
                    })
                })
            })
        },
        validateTickets() {
            this.progress_bar = true
            const CHUNK_SIZE = 10; // Cantidad de solicitudes a enviar en cada iteración
            const chunks = this.splitIntoChunks(this.receipts, CHUNK_SIZE);
            let index = 0;
            let config = {
                headers: {
                    'Authorization': "Bearer " + process.env.VUE_APP_FACTURAPI_TOKEN,
                    'Content-Type': "application/json"
                }
            }
            const sendRequests = () => {
                if (index >= chunks.length) {
                    this.show_invoices = true
                    // Si se han enviado todas las solicitudes, se termina el proceso
                    return;
                }
                // Se crea un array con las solicitudes que se enviarán en esta iteración
                const requests = chunks[index].map(receipt => axios.get(`https://www.facturapi.io/v2/receipts/${receipt.facturapi_receipt_id}`, config).then(response=>{
                    this.index = this.index + 1
                    const facturapi_receipt = response.data
                    if(facturapi_receipt.status=="invoiced_to_customer"){
                        this.validated_receipts = this.validated_receipts.concat([receipt])
                        axios.get(`https://www.facturapi.io/v2/invoices/${facturapi_receipt.invoice}`, config).then(resp=>{
                            var invoice = resp.data
                            invoice.external_id = receipt.id
                            this.invoices = this.invoices.concat([invoice])
                        })
                    }
                }));
                // Se envían las solicitudes usando Promise.all()
                Promise.all(requests).then(() => {
                    index++;
                    // Se espera un momento antes de enviar la siguiente tanda de solicitudes
                    setTimeout(sendRequests, 2500);
                }).catch(error => {
                    this.snackbar = {
                        message: error.response.data.message,
                        color: 'red',
                        show: true
                    }
                    // Si hay un error, se detiene el proceso
                });
            };
            sendRequests();
        },
        splitIntoChunks(array, chunkSize) {
            const result = [];
            for (let i = 0; i < array.length; i += chunkSize) {
                result.push(array.slice(i, i + chunkSize));
            }
            return result;
        },
        addInvoiceToSale() {
            const invoices = this.invoices.map(invoice=>{return{
                facturapi_id: invoice.id,
                organization: invoice.organization,
                date: new Date(invoice.created_at).toLocaleString("sv-SE", {timeZone: "America/Monterrey"}).toString().slice(0, 19),
                type: invoice.type,
                uuid: invoice.uuid,
                use: invoice.use,
                folio_number:invoice.folio_number,
                payment_form: invoice.payment_form,
                payment_method: invoice.payment_method,
                cfdi_version: invoice.cfdi_version,
                facturapi_customer_id: invoice.customer.id,
                verification_url: invoice.verification_url,
                status: invoice.status,
                total: invoice.total,
                series: 'Serie A',
                sale_id: invoice.external_id,
                conditions: invoice.conditions
            }})
            axios.post(process.env.VUE_APP_BACKEND_ROUTE + "api/v2/invoice/bulk-create", invoices).then(response => {
                this.getDataFromApi()
            })
        },
    },
};
</script>