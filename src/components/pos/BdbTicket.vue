<template>
    <div class="">
        <div id="divName">  
            <div style="background:white;" class="divName">
                <img width="150" src="/BABIDIBOO-LOGO.webp"/>
                <div class="fiscal">
                    <strong>{{ticket.user.branch[0].razon_social}}</strong>
                    <br/>
                    <span style="font-weight:500;">{{ticket.user.branch[0].rfc}}</span>
                    <br/>
                    {{ticket.user.branch[0].address}}
                </div>
                <div class="user">
                    {{dateFormat(ticket.created_at.slice(6, 10) + '-' + ticket.created_at.slice(3, 5) + '-' + ticket.created_at.slice(0, 2))}}
                    <br/>
                    <strong v-if="ticket.status ==  'vendido'"># Ticket:</strong>
                    <strong v-else-if="ticket.status ==  'quotation'"># Cotización:</strong>
                    {{ticket.id}}
                    <br/>
                    <strong>Atendió:</strong> {{ticket.user.name}} {{ticket.user.last}}
                    <br/>
                    <strong>Sucursal:</strong> {{ticket.user.branch[0].name}}
                    <span v-if="ticket.date!=''&&ticket.date!=null&&ticket.date!=undefined"><br/><strong>Entrega:</strong> {{dateFormat(ticket.date)}}</span>
                </div>
                <div v-if="cart.length>0">
                    <div class="products"  v-for="(item, index) in cart" v-bind:key="index">
                        <div style="width:10%;">
                            {{item.quantity}} <span v-if="item.product.unit!=undefined">{{item.product.unit.name}}</span>
                        </div>

                        <div style="width:70%;">
                            sku:{{item.product.code_one}} | {{item.product.name}}
                        </div>
                        
                        <div style="padding-left:10px!important;width:20%;">
                            <div style="display:flex;">
                                <span>$</span>
                                <span style="margin-left:auto;">{{(item.product.price*1).toFixed(2)}}</span>
                            </div>
                        </div>

                    </div>
                </div>

                <div v-else class="products" v-for="(item, index) in ticket.items" v-bind:key="index">
                    <div style="width:10%;">
                        <div>
                            {{item.quantity}} <span v-if="item.product.unit!=undefined">{{item.product.unit.name}}</span>
                        </div>
                    </div>
                            
                    <div style="width:60%;">
                        sku:{{item.product.code_one}} | {{item.product.name}}
                    </div>
                    
                    <div style="padding-left:10px!important; width:30%;">
                        <div style="display:flex;">
                            <span>$</span>
                            <span style="margin-left:auto;">{{(item.price*1).toFixed(2)}}</span>
                        </div>
                    </div>

                </div>



                <div class="totals">
                    <div style="font-weight:600; font-size:14px; display:flex;">
                        <span>Total M.N.</span>
                        <span style="margin-left:auto;">${{(ticket.total*1).toFixed(2)}}</span>
                    </div>
                    <div style="display:flex;">
                        <span>IVA INCLUIDO</span>
                        <span style="margin-left:auto;">16%</span>
                    </div>
                </div>
                <div style="font-size:12px;">
                    <strong>GRACIAS POR SU COMPRA</strong>
                    <br/>
                    <span style="text-transform: math-auto;">
                    Para cambios y/o Devoluciones favor de presentar su ticket en un plazo no mayor a 30 dias a partir de su fecha de compra.
                    <br/>
                    Las devoluciones son realizadas únicamente en monedero electrónico.
                    <br/>
                    No hay cambios ni devoluciones en mercancia de temporada.
                    <br/>
                    Solicite su factura en caja el mismo día de la compra.
                    <br/>
                    </span>
                </div>

                <div class="fiscal" style="font-weight:500;">
                    www.babidiboo.com
                </div>
            </div>
        </div>  
        <v-card-actions style="background:white;">
            <v-btn color="blue darken-1" text @click="dalecandela('divName')">Imprimir</v-btn>

            <v-dialog v-model="dialog" width="500">
                <template v-slot:activator="{ on, attrs }">
                    <v-btn v-on="on" v-bind="attrs" color="blue darken-1" text>Programar Entrega</v-btn>
                </template>
                <v-card>
                    <v-card-title class="text-h5 py-6">
                        Programar Entrega
                    </v-card-title>

                    <v-card-text class="pb-0">
                    <v-menu v-model="datePicker" :close-on-content-click="false" :nudge-right="40" transition="scale-transition" offset-y min-width="290px" >
                        <template v-slot:activator="{ on }">
                            <v-text-field v-on="on"  label="Fecha" outlined readonly v-model="ticket.date"></v-text-field>
                        </template>
                        <v-date-picker color="primary" v-model="ticket.date" @input="datePicker = false"></v-date-picker>
                    </v-menu>
                    <v-textarea outlined label="Notas" v-model="ticket.note"></v-textarea>
                    
                    </v-card-text>

                    <v-card-actions  class="pt-0">
                        <v-spacer></v-spacer>
                        <v-btn color="primary" text @click="scheduleDelivery()">
                            Guardar
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
            
            <!--v-btn color="blue darken-1" v-if="this.correo(this.imprimir.contacto)!=null&&this.correo(this.imprimir.contacto)!=''&&this.correo(this.imprimir.contacto)!=undefined" text @click="sendEmail()">Enviar</v-btn>
            <v-btn color="blue darken-1" text @click="ticketRegalo('divName')">Ticket de Regalo</v-btn-->
        </v-card-actions>
    </div>
</template>

<script>
    import QrcodeVue from 'qrcode.vue'
    import axios from 'axios'
    //import emailjs from 'emailjs-com';
    //import{ init } from 'emailjs-com';
    //init("user_8a0ZvcQvBK8YSEM7Sades");
    export default {
        props:{
            ticket:Object
        },
        data: () => ({
            datePicker:false,
            dialog:false
        }),
        components: {
            QrcodeVue,
        },
        computed: {
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
                        window.location.replace("#/caja");
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
            scheduleDelivery(){
                axios.patch(process.env.VUE_APP_BACKEND_ROUTE + "api/v2/sales/"+this.ticket.id, {date:this.ticket.date, note:this.ticket.note, bar:0}).then(response=>{
                    this.dialog=false
                })
            }
        },
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
</style>




