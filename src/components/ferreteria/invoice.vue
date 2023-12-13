<template>
    <div class="">
        <div id="divName">  
            <v-card class="divName">

                <div style="font-size:11px;" class="mb-4">
                    <strong>Folio</strong> {{invoice.series}}-{{invoice.folio_number}}
                </div>
                
                <img width="150" v-if="liga=='https://suministros.uno/'" :src="empresa.logo"/>
                
                
                <div class="fiscal">
                    <strong>{{empresa.razon_social}}</strong>
                    <br/>
                    {{empresa.direccion}}
                    <span style="font-weight:500;">RFC</span> {{empresa.rfc}}
                    <br/>
                    <span style="font-weight:500;">Régimen F.</span> 601 - General de Ley Personas Morales
                    <br/>
                    <span style="font-weight:500;">Folio Fiscal</span> {{invoice.uuid}}
                    <br/>
                    <span style="font-weight:500;">Tipo de CFDI</span> I (Ingreso)
                    <br/>
                    <span style="font-weight:500;">Versión</span> CFDI 4.0
                    <br/>
                    <span style="font-weight:500;">Lugar emisión</span> {{invoice.address.municipality}}, {{invoice.address.state}}, {{invoice.address.zip}}
                    <br/>
                    <span style="font-weight:500;">Fecha emisión</span> {{invoice.date}}
                    <br/>
                    <span style="font-weight:500;">Fecha de Vencimiento</span> {{invoice.sale.balance_due_date}}
                    <br/>
                    <span style="font-weight:500;">Dias de Crédito</span> {{invoice.sale.company.attributes.credit_days}}
                    <br/>
                    <span style="font-weight:500;">Fecha certific.</span> {{invoice.stamp.date}}
                    <br/>
                    <span style="font-weight:500;">Num. certificado</span> {{invoice.stamp.sat_cert_number}} 
                    <br/>
                </div>

                

                <div class="fiscal">
                    <div style="border-bottom:1px solid black; width:100%;">
                        <strong> Receptor</strong>
                    </div>
                    <strong>Razón Social</strong> {{invoice.customer.legal_name}}
                    <br/>
                    <strong>RFC</strong> {{invoice.customer.tax_id}}
                    <br/>
                    <strong>Régimen Fiscal</strong> {{tax_system_name(invoice.customer.tax_system)}}
                    <br/>
                    <strong>Domicilio</strong> <span v-if="invoice!=undefined">{{invoice.customer.address.street}}, No. {{invoice.customer.address.exterior}}<span v-if="invoice.customer.address.interior!=undefined">-A{{invoice.customer.address.interior}}</span>, Col. {{invoice.customer.address.neighborhood}}, C.P. {{invoice.customer.address.zip}}, {{invoice.customer.address.municipality}}, {{invoice.customer.address.state}}, {{invoice.customer.address.country}}</span><span v-else>-</span>
                    <br/>
                    <strong>Uso del CFDI</strong> {{use_name(invoice.use)}}
                </div>

                <div  class="fiscal" style="border-bottom:1px solid black; width:100%;     margin-bottom: 0px!important;">
                    <strong> Productos</strong>
                </div>

                <v-row class="products" v-for="(item, index) in invoice.items" v-bind:key="index">

                    <v-col cols="2">
                        <div>
                            <strong style="font-size:8px!important;">Cant. </strong>
                            <br/>
                            {{item.quantity}}
                            <br/>
                            <strong style="font-size:8px!important;">Unidad</strong>
                            <br/>
                            {{item.product.unit_key}}
                        </div>
                    </v-col>
                            
                    <v-col cols="6">
                        <strong style="font-size:8px!important;">SKU </strong>
                        <br/>
                        {{item.product.sku}}
                        <br/>
                        <strong style="font-size:8px!important;">Clave ProdServ </strong>
                        <br/>
                        {{item.product.product_key}}
                        <br/>
                        <strong style="font-size:8px!important;">Concepto </strong>
                        <br/>
                        {{item.product.description}}
                    </v-col>
                    
                    <v-col cols="4" style="padding-left:10px!important;">
                        <strong style="font-size:8px!important;">Objeto Impuesto </strong> 
                        <br/>
                        {{item.product.taxability}}
                        <br/>
                        <strong style="font-size:8px!important;">Precio Unitario </strong> 
                        <br/>
                        {{item.product.price.toLocaleString('es-MX', { style: 'currency', currency: 'MXN',})}}
                        <br/>
                        <strong style="font-size:8px!important;">Importe </strong> 
                        <br/>
                        {{(item.product.price*item.quantity).toLocaleString('es-MX', { style: 'currency', currency: 'MXN',})}}
                    </v-col>
                    
                    <strong v-if="invoice.sale.note!=undefined">Orden de Compra</strong> <span v-if="invoice.sale.note!=undefined">{{invoice.sale.note}}</span>
                    
                    <strong>Venta</strong>{{invoice.sale.id}}

                </v-row>

                <div class="totals">
                    <v-row>
                        <span>Subtotal</span>
                        <v-spacer/>
                        <span>${{(invoice.total/1.16).toFixed(2)}}</span>
                    </v-row>
                    <v-row>
                        <span>IVA 16%</span>
                        <v-spacer/>
                        <span>${{(invoice.total*0.16).toFixed(2)}}</span>
                    </v-row>
                    <v-row style="font-weight:600; font-size:14px;">
                        <span>Total</span>
                        <v-spacer/>
                        <span>${{(invoice.total*1).toFixed(2)}}</span>
                    </v-row>
                </div>
        
                <div>
                    <div class="fiscal">
                        <strong>Forma de pago</strong>
                        <br/>
                        {{invoice.payment_form}} | {{payment_form_name(invoice.payment_form)}}
                        <br/>
                        <strong>Método de pago</strong>
                        <br/>
                        {{invoice.payment_method}} | {{payment_method_name(invoice.payment_method)}}
                        <br/>
                        <strong>Moneda</strong>
                        <br/>
                        {{invoice.currency}}
                    </div>
                </div>

                <div style="font-size:12px;">
                    <qrcode-vue :value="invoice.verification_url" renderAs="svg" size="80" style="margin-top: 15px;"></qrcode-vue>
                    <strong>Prov. Cert. PPD101129EA3</strong>
                </div>

                <div class="fiscal" style="text-align: left !important;">
                    <strong>Sello digital del CFDI</strong>
                    <br/>
                    {{invoice.stamp.signature}}
                    <br/>
                    <strong>Sello del SAT</strong>
                    <br/>
                    {{invoice.stamp.sat_signature}}
                    <br/>
                    <strong>Cadena original del complemento de certificación digital del SAT</strong>
                    <br/>
                    {{invoice.stamp.complement_string}}
                    <br/>
                    <strong>Número de serie del certificado del SAT</strong>
                    <br/>
                    {{invoice.stamp.sat_cert_number}}
                </div>
            </v-card>
        </div>  
        <v-card-actions style="background:white;">
            <v-btn color="blue darken-1" text @click="dalecandela('divName')">Imprimir</v-btn>
        </v-card-actions>
    </div>
</template>

<script>
import QrcodeVue from 'qrcode.vue'
import fiscal_catalogs from '../../mixins/fiscal_catalogs'
import axios from "axios"
export default {
    mixins: [fiscal_catalogs],
    props:{
        invoice: Object
    },
    watch:{
        invoice:{
            handlred(){
                console.log(this.invoice)
                let config = {
                    headers: {
                        'Authorization': "Bearer " + process.env.VUE_APP_FACTURAPI_TOKEN, 
                        'Content-Type': "application/json"
                    }
                }
                axios.get('https://www.facturapi.io/v2/customers/' + this.invoice.customer.id, config).then(response => {
                    this.invoice.customer = response.data
                })
            },deep:true
        }
    },
    created(){
        console.log(this.invoice)
        let config = {
            headers: {
                'Authorization': "Bearer " + process.env.VUE_APP_FACTURAPI_TOKEN, 
                'Content-Type': "application/json"
            }
        }
        axios.get('https://www.facturapi.io/v2/customers/' + this.invoice.customer.id, config).then(response => {
            this.invoice.customer = response.data
        })
    },
    components: {
        QrcodeVue,
    },
    data(){
        return{
            
        }
    },
    computed:{
        liga(){
            return process.env.VUE_APP_BACKEND_ROUTE
        },
        empresa(){
            return {
                banco: process.env.VUE_APP_BANCO,
                cuenta: process.env.VUE_APP_CUENTA,
                clabe: process.env.VUE_APP_CLABE,
                razon_social: process.env.VUE_APP_RAZON_SOCIAL,
                rfc: process.env.VUE_APP_RFC,
                direccion: process.env.VUE_APP_DIRECCION,
                website: process.env.VUE_APP_WEBSITE,
                telefono: process.env.VUE_APP_TELEFONO,
                whatsapp: process.env.VUE_APP_WHATSAPP,
                logo: process.env.VUE_APP_LOGO
            }
        }
    },
    methods:{
        use_name(value){
            return this.$store.state.cfdi.uses.filter(cfdi=>cfdi.Clave == value).map(cfdi=>cfdi.Clave + ' - ' + cfdi.Descripción)[0]
        },
        payment_form_name(value){
            return this.payment_forms.filter(form=>form.value == value).map(form=>form.text)[0]
        },
        payment_method_name(value){
            return this.payment_methods.filter(method=>method.value == value).map(method=>method.text)[0]
        },
        tax_system_name(id){
            return this.tax_systems.filter(system=>system.id == id).map(system=>system.name)[0]
        },
        dalecandela(divName) {
            var printContents = document.getElementById(divName).innerHTML;
            var originalContents = document.body.innerHTML;
            document.body.innerHTML = printContents;
            window.print();
            this.$nextTick(() => {
                    var is_opera = !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;
                    var is_Edge = navigator.userAgent.indexOf("Edge") > -1;
                    var is_chrome = !!window.chrome && !is_opera && !is_Edge;
                    var is_explorer= typeof document !== 'undefined' && !!document.documentMode && !is_Edge;
                    var is_firefox = typeof window.InstallTrigger !== 'undefined';
                    var is_safari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
                if(is_opera || is_Edge || is_chrome || is_explorer || is_firefox){
                    document.body.innerHTML = originalContents;
                    this.$emit("cerrarPrintInvocie", 'a');
                }
            })
        },
        cerrar(){
            this.$emit("cerrar", 'hola');
        },
    }
}
</script>

<style>

</style>

<style>
    .divName{
        font-family: revert!important;
        text-transform: uppercase!important;
        text-align: center !important;
        padding: 30px 20px;
        color:black!important;
    }
    .fiscal {
        font-size: 11px;
        margin: 15px 0px;
    }
    .products{
        text-align: left !important;
        font-size: 10px;
        border-bottom:1px solid black;
        margin:0px;
    }
    .products .col{
        padding:10px 0px;
    }
    .user{
        text-align: left !important;
        font-size: 11px;
        margin-bottom:15px;
    }
    .totals{
        font-size: 12px;
        margin:20px 0px 30px 0px;
    }
    .totals .row{
        margin:0px;
    }
</style>