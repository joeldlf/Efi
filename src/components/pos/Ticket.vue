<template>
    <div class="">
        <div id="divName">  
            <v-card class="divName">
                <img width="150" :src="empresa.logo"/>
                <div class="fiscal">
                    <strong>{{empresa.razon_social}}</strong>
                    <br/>
                    <span style="font-weight:500;">{{empresa.rfc}}</span>
                    <br/>
                    {{empresa.direccion}}
                </div>
                <div class="user">
                    {{dateFormat(ticket.date)}}
                    <br/>
                    <strong v-if="ticket.status ==  'vendido'"># Ticket:</strong>
                    <strong v-else-if="ticket.status ==  'quotation'"># Cotización:</strong>
                    {{ticket.id}}
                    <br/>
                    <strong>Atendió:</strong> {{currentUser.name}} {{currentUser.last}}
                    <span v-if="date!=''"><br/><strong>Fecha de Entrega:</strong> {{dateFormat(date)}}</span>
                </div>
                <div v-if="cart.length>0">
                    <v-row class="products"  v-for="(item, index) in cart" v-bind:key="index">
                        <v-col cols="1">
                            {{item.quantity}} <span v-if="item.product.unit!=undefined">{{item.product.unit.name}}</span><!--span v-if="(item.quantity*1)>1">s</span-->
                        </v-col>

                        <v-col cols="7">
                            sku:{{item.product.code_one}} | {{item.product.name}}<!--{{item.product.unit}}<span v-if="(item.quantity*1)>1">s</span-->
                        </v-col>
                        
                        <v-col cols="4" style="padding-left:10px!important;">
                            <v-container fill-height fluid>
                                <v-row align="center" justify="center">
                                    $
                                    <v-spacer/>
                                    {{(item.product.price*1).toFixed(2)}}
                                </v-row>
                            </v-container>
                        </v-col>

                    </v-row>
                </div>

                <v-row v-else class="products" v-for="(item, index) in ticket.items" v-bind:key="index">
                    <v-col cols="1">
                        <div>
                            {{item.quantity}} <span v-if="item.product.unit!=undefined">{{item.product.unit.name}}</span><!--span v-if="(item.quantity*1)>1">s</span-->
                        </div>
                    </v-col>
                            
                    <v-col cols="7">
                        sku:{{item.product.code_one}} | {{item.product.name}}<!--{{item.product.unit}}<span v-if="(item.quantity*1)>1">s</span-->
                    </v-col>
                    
                    <v-col cols="4" style="padding-left:10px!important;">
                        <v-container fill-height fluid>
                            <v-row align="center" justify="center">
                                $
                                <v-spacer/>
                                {{(item.price*1).toFixed(2)}}
                            </v-row>
                        </v-container>
                    </v-col>

                </v-row>



                <div class="totals">
                    <!--v-row>
                        <span>Subtotal M.N.</span>
                        <v-spacer/>
                        <span>${{ticket.subtotal.toFixed(2)}}</span>
                    </v-row>
                    <v-row>
                        <span>IVA M.N.</span>
                        <v-spacer/>
                        <span>${{ticket.iva.toFixed(2)}}</span>
                    </v-row-->
                    <v-row style="font-weight:600; font-size:14px;">
                        <span>Total M.N.</span>
                        <v-spacer/>
                        <span>${{(ticket.total*1).toFixed(2)}}</span>
                    </v-row>
                    <v-row>
                        <span>IVA INCLUIDO</span>
                        <v-spacer/>
                        <span>16%</span>
                    </v-row>
                </div>

                <!--div style="font-size:12px;" v-if="ticket.self_invoice_url!=undefined">
                    <strong>Genera tu factura aquí</strong>
                    <qrcode-vue :value="ticket.self_invoice_url" renderAs="svg" size="60" style="margin: 15px 0px;"></qrcode-vue>
                    <a style="text-transform:none!important;">{{ticket.self_invoice_url}}</a>
                </div-->

                <div style="font-size:12px;" ><!-- v-if="ticket.self_invoice_url!=undefined" -->
                    <strong>Solicita tu factura el mismo día</strong>
                    <!--qrcode-vue :value="ticket.self_invoice_url" renderAs="svg" size="60" style="margin: 15px 0px;"></qrcode-vue>
                    <a style="text-transform:none!important;">{{ticket.self_invoice_url}}</a-->
                </div>

                <div class="fiscal">
                    Cuentanos como te atendimos ingrsando a {{empresa.website}}
                    <br/>
                    Línea Express WhatsApp: {{empresa.telefono}}
                    <br/>
                    Línea Corporativa: {{empresa.celular}}
                    <br/>
                    <span v-if="ticket.status ==  'vendido'">Gracias por su compra</span>
                    
                </div>
            </v-card>
        </div>  
        <v-card-actions style="background:white;">
            <v-btn color="blue darken-1" text @click="dalecandela('divName')">Imprimir</v-btn>            
            <!--v-btn color="blue darken-1" v-if="this.correo(this.imprimir.contacto)!=null&&this.correo(this.imprimir.contacto)!=''&&this.correo(this.imprimir.contacto)!=undefined" text @click="sendEmail()">Enviar</v-btn>
            <v-btn color="blue darken-1" text @click="ticketRegalo('divName')">Ticket de Regalo</v-btn-->
        </v-card-actions>
    </div>
</template>

<script>
    import QrcodeVue from 'qrcode.vue'
    //import emailjs from 'emailjs-com';
    //import{ init } from 'emailjs-com';
    //init("user_8a0ZvcQvBK8YSEM7Sades");
    export default {
        props:{
            ticket:Object
        },
        data: () => ({
            datePicker:false,
            date:''
        }),
        components: {
            QrcodeVue,
        },
        computed: { 
            currentUser(){
                return this.$store.state.currentUser.user
            },
            cart() {
                return this.$store.state.cart.carts
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
            /*
            sendEmail() {
                emailjs.send("service_kjstmjc","template_3o9pox9",{
                    fecha: this.fechita(),
                    cliente: this.cliente(this.imprimir.contacto),
                    email: this.correo(this.imprimir.contacto),
                    productos: this.losproductos(this.imprimir.productos),
                    valor: this.imprimir.valor.toLocaleString('es-MX', { style: 'currency', currency: 'MXN',}),
                    subtotal:(this.imprimir.valor/1.16).toLocaleString('es-MX', { style: 'currency', currency: 'MXN',}),
                    iva:(this.imprimir.valor-(this.imprimir.valor/1.16)).toLocaleString('es-MX', { style: 'currency', currency: 'MXN',}),
                    descuento:((this.imprimir.descuento)*1).toLocaleString('es-MX', { style: 'currency', currency: 'MXN',})
                }).then(response => {
                    location.reload();
                })
                .catch(error =>{ 
                    this.sendEmail()
                })
            },
            */
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
                        this.$emit("cerrarTicket", this.falso);
                        location.reload();
                    }
                })
            },
            dalecandelamovil(divName) {
                var printContents = document.getElementById(divName).innerHTML;
                var originalContents = document.body.innerHTML;
                document.body.innerHTML = printContents;
                window.print()
                /*
                .then(resp=>{
                    document.body.innerHTML = originalContents;
                    this.$emit("cerrarTicket", this.falso);
                    location.reload();
                })
                */
            },
            daledoblecandela(divName){
                var printContents = document.getElementById(divName).innerHTML;
                var originalContents = document.body.innerHTML;
                document.body.innerHTML = printContents;
                window.print();
                document.body.innerHTML = originalContents;
                this.$emit("cerrarTicket", this.falso);
            },
            cerrar(){
                this.$emit("cerrar", 'hola');
            },
            dateFormat(date){
                // Creamos el objeto fecha instanciándolo con la clase Date
                const fecha = new Date(date + ' 00:00:00')
                // Creamos array con los días de la semana
                const dias_semana = ['Domingo', 'Lunes', 'martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
                // Creamos array con los meses del año
                const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
                // Construimos el formato de salida
                if(fecha.getUTCFullYear()!=new Date().getUTCFullYear()){
                    return dias_semana[fecha.getDay()] + ', ' + fecha.getDate() + ' de ' + meses[fecha.getMonth()]// + ' a las ' + fecha.toLocaleString("sv-SE", {timeZone: "America/Monterrey"}).slice(10,16)
                }else{
                    return dias_semana[fecha.getDay()] + ', ' + fecha.getDate() + ' de ' + meses[fecha.getMonth()] + ' de ' + fecha.getUTCFullYear()// + ' a las ' + fecha.toLocaleString("sv-SE", {timeZone: "America/Monterrey"}).slice(10,16)
                }
                
            },
        }
    }
</script>

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
        font-size: 12px;
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




