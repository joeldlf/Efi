<template>
    <v-container class="ma-0 pa-0 pb-8">
        <div class="py-6 pl-8 pr-12">
            <v-row class="ma-0 mb-2">
                <strong>Filtros</strong>
                <v-spacer></v-spacer>
                <v-btn @click="removeFilter()" small class="elevation-0" style="border:solid 1px #dddddd;">
                    <v-icon small class="mr-1">mdi-filter-off</v-icon>Limpiar
                </v-btn>
                <v-btn class="hidden-md-and-up elevation-0 ml-4" @click="close()" small>
                    <v-icon class="mr-1">mdi-close</v-icon>
                </v-btn>
            </v-row>

            <v-text-field @keydown.enter="filter()" v-model="invoice.folio_number" label="Folio"></v-text-field>
            <v-text-field @keydown.enter="filter()" v-model="invoice.uuid" label="Folio Fiscal"></v-text-field>
            <v-select @keydown.enter="filter()" v-model="invoice.type" clearable :items="types" label="Metodo de Pago" ></v-select>
            <v-text-field @keydown.enter="filter()" v-model="invoice.sale_id" label="Folio Venta"></v-text-field>
            <v-text-field @keydown.enter="filter()" v-model="invoice.collection_id" label="Folio Cobranza"></v-text-field>
            

            <v-autocomplete @keydown.enter="filter()" v-model="invoice.company_id" :items="companyLists" :loading="isLoadingCompany" :search-input.sync="searchCompanies" hide-no-data item-value="id" item-text="name" label="Empresa" placeholder="Escribe para buscar">
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
            </v-autocomplete>

            <v-menu offset-y :close-on-content-click="closeDatePicker(invoice.date)">
                <template v-slot:activator="{ on, attrs }">
                    <v-text-field clearable v-model="invoice.date" label="Fecha" prepend-icon="mdi-calendar" v-bind="attrs" readonly v-on="on"></v-text-field>
                </template>
                <v-date-picker v-model="invoice.date" range></v-date-picker>
            </v-menu>

            <v-select @keydown.enter="filter()" v-model="invoice.payment_form" clearable :items="payment_forms" label="Forma de Pago" ></v-select>
            <v-select @keydown.enter="filter()" v-model="invoice.payment_method" clearable :items="payment_methods" label="Metodo de Pago" ></v-select>
            
            <v-autocomplete @keydown.enter="filter()" v-model="invoice.use" :items="cfdi" item-text="Descripción" item-value="Clave" label="Uso de CFDI">
            </v-autocomplete>

            <v-text-field @keydown.enter="filter()" v-model="invoice.conditions" label="Condiciones de Pago"></v-text-field>

            
        </div>
        <v-card style="margin-bottom:100px; width:100%;" class="hidden-md-and-up" tile color="primary">
            <v-list-item link @click="filter()" dark>
                <v-list-item-content>
                    <strong>Filtrar (0)</strong>
                </v-list-item-content>
            </v-list-item>    
        </v-card>
        <v-card style="position:absolute; bottom:0; width:100%;" class="hidden-sm-and-down" tile color="primary">
            <v-list-item link @click="filter()" dark>
                <v-list-item-content>
                    <strong>Filtrar (0)</strong>
                </v-list-item-content>
            </v-list-item>    
        </v-card>
    </v-container>
</template>
<script>
import axios from "axios";
import fiscal_catalogs from '../../mixins/fiscal_catalogs'
export default {
    mixins: [fiscal_catalogs],
    props:{
        company:Object
    },
    data: () => ({
        types:[{value:"I", text:"Factura"},{value:"P", text:"Complemento de Pago"},],
        invoice:{
            company_id:'',
            collection_id:'',
            sale_id:'',
            conditions:'',
            uuid:'',//Folio Fisca
            folio_number:'',
            payment_form:'',
            payment_method:'',
            type:'',
            use:'',
            date:[],
        },
        entries:{
            companies: [],
        },
        isLoadingCompany: false,
        searchCompanies: null,
    }),
    watch: {
        searchCompanies(val){
            //if (this.companyLists.length > 0) return
            if (this.isLoadingCompany) return
            this.isLoadingCompany = true
            axios.get(process.env.VUE_APP_BACKEND_ROUTE + 'api/v2/company_p?filter[name]='+val)
            .then(res => {
                this.entries.companies = res.data.data
            }).finally(() => (this.isLoadingCompany = false))
        },
    },
    computed: {
         cfdi(){
            return this.$store.state.cfdi.uses
        },
        companyLists(){
            return this.entries.companies.map(id => {
                return{
                    id:id.id,
                    macro:id.macro,
                    name:id.name,
                    razon_social:id.razon_social
                }
            })
        },
    },
    created(){
        if(localStorage.getItem('selectorFiltersInvoices')!=undefined){
            this.invoice = JSON.parse(localStorage.getItem('selectorFiltersInvoices'))
            this.entries = JSON.parse(localStorage.getItem('entriesFiltersInvoices'))
        }
    },
    methods: {
        closeDatePicker(dates){
            if(dates!=undefined && dates.length==2){
                return true
            }else{
                return false
            }
        },
        filter(){
            var count = 0
            var filter = ''
            if(this.invoice.date!=undefined && this.invoice.date.length==2){
                count = count+1
                filter = filter + '&filter[date_between]='+this.invoice.date[0]+','+this.invoice.date[1]
            }
            if(this.invoice.company_id!=''){
                count = count+1
                filter = filter + '&filter[company.id]='+this.invoice.company_id
            }
            if(this.invoice.collection_id!=''){
                count = count+1
                filter = filter + '&filter[collection_id]='+this.invoice.collection_id
            }
            if(this.invoice.sale_id!=''){
                count = count+1
                filter = filter + '&filter[sale_id]='+this.invoice.sale_id
            }
            if(this.invoice.conditions!=''){
                count = count+1
                filter = filter + '&filter[conditions]='+this.invoice.conditions
            }
            if(this.invoice.uuid!=''){
                count = count+1
                filter = filter + '&filter[uuid]='+this.invoice.uuid
            }
            if(this.invoice.folio_number!=''){
                count = count+1
                filter = filter + '&filter[folio_number]='+this.invoice.folio_number
            }
            if(this.invoice.payment_form!=''){
                count = count+1
                filter = filter + '&filter[payment_form]='+this.invoice.payment_form
            }
            if(this.invoice.payment_method!=''){
                count = count+1
                filter = filter + '&filter[payment_method]='+this.invoice.payment_method
            }
            if(this.invoice.type!=''){
                count = count+1
                filter = filter + '&filter[type]='+this.invoice.type
            }
            if(this.invoice.use!=''){
                count = count+1
                filter = filter + '&filter[use]='+this.invoice.use
            }
            localStorage.setItem('selectorFiltersInvoices', JSON.stringify(this.invoice));
            localStorage.setItem('entriesFiltersInvoices', JSON.stringify(this.entries));
            localStorage.setItem('filtersInvoices', JSON.stringify(filter.slice(1,filter.length)));
            localStorage.setItem('filtersInvoicesLength', count)
            this.$nextTick(() => {
                this.$emit("filtersInvoice", false);
            })
        },
        removeFilter(){
            this.invoice={
                company_id:'',
                collection_id:'',
                sale_id:'',
                conditions:'',
                uuid:'',//Folio Fisca
                folio_number:'',
                payment_form:'',
                payment_method:'',
                type:'',
                use:'',
            },
            localStorage.removeItem("selectorFiltersInvoices")
            localStorage.removeItem("filtersInvoices")
            localStorage.removeItem("entriesFiltersInvoices")
            localStorage.removeItem("filtersInvoicesLength")
            this.entries={
                companies: [],
            }
            this.$emit("filtersInvoice", true);
        },
        close(){
            this.$emit("filtersInvoice", false);
        },
    }
  }
</script>

<style >
.v-text-field {
    padding-top: 0px;
    margin-top: 0px;
}
</style>