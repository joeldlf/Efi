<template>
    <v-app class="pa-0" style="background-color:white;">

        <div class="invoice-box" style="background-color:white; text-align:center!important; padding-bottom:30px;" id="divName" elevation="0">
            <div style="display:flex;">
                <div class="column" style="">
                    <img src="https://babidiboo.com/cdn/shop/files/BABIDIBOO-LOGOS_FINALES-02_360x.png?v=1613750988" style="width:100%; margin:auto 0px; max-height:200px; width:auto;">
                </div>
                <div class="column" style=" font-size:15px; line-height:1.5em;">
                    <div style="margin:auto;">
                        <strong>{{empresa.razon_social}}</strong>
                        <br/>
                        {{currentUser.branch[0].address}}
                        <br/>
                        Teléfono: {{currentUser.branch[0].phone}}
                    </div>
                </div>
                <div class="column" style=" font-size:15px; line-height:1.5em;">
                    <div style="margin:auto;">
                        <strong>RFC: {{currentUser.branch[0].rfc}}</strong>
                        <br/>
                        {{currentUser.branch[0].razon_social}}
                        <br/>
                        correo: {{currentUser.branch[0].email}}
                    </div>
                </div>
            </div>
            <div style="display:flex; background:#f2f2f2; border:solid black 1px;">
                <div class="column" style=" font-size:15px; line-height:1.5em;">
                    <div style="margin:auto;">
                        NOSOTROS
                        <br/>
                        ENTREGAMOS
                    </div>
                </div>
                <div class="column" style=" font-size:15px; line-height:1.5em;">
                    <div style="margin:auto;">
                        FECHA DE COTIZACIÓN
                        <br/>
                        {{dateFormat(quotation.created_at)}}
                    </div>
                </div>
                <div class="column" style=" font-size:15px; line-height:1.5em;">
                    <div style="margin:auto;">
                        FECHA DE ENTREGA
                        <br/>
                        {{dateFormat(quotation.date)}}
                    </div>
                </div>
            </div>
            <div style="display:flex;">
                <div class="column" style=" font-size:15px; line-height:1.5em; width:50%!important;">
                    <div style="margin:auto;">
                        CLIENTE
                        <br/>
                        <strong>{{client(quotation.company_id).name}}</strong>
                        <!--br/>
                        DIRECCIÓN:-->
                        <br/>
                        {{client(quotation.company_id).delivery_address}}
                    </div>
                </div>
                <div class="column" style=" font-size:15px; line-height:1.5em; width:50%!important;">
                    <div style="margin:auto;">
                        COORDINADOR
                        <br/>
                        <strong>{{currentUser.name + ' ' + currentUser.last}}</strong>
                        <br/>
                        Babidiboo Party
                    </div>
                </div>
            </div>
            <div style="border:solid black; border-width:1px 0px;">
                <table cellpadding="0" cellspacing="0" style="padding:0px;">
                    <tr style="width:100%; background:#f2f2f2; font-weight:600; color:black; text-transform:uppercase;">
                        <td style="text-align:center;">No</td>
                        <td style="text-align:center;">Artículo</td>
                        <!--td style="text-align:center;">Descripción</td-->
                        <td style="text-align:center;">Cantidades</td>
                        <!--td style="text-align:center;">Nota</td-->
                        <td style="text-align:center;">Precio</td>
                        <td style="text-align:center;">Total</td>
                    </tr>
                    <tr class="item" v-for="(item, index) in quotation.items" :key="index">
                        <td style="text-align:center;">{{item.item}}</td>
                        <td style="text-align:center;">{{itemName(item.item)}}</td>
                        <td style="text-align:center;">{{item.quantity}}</td>
                        <td style="text-align:center;">{{(item.price).toLocaleString('es-MX', { style: 'currency', currency: 'MXN',})}}</td>
                        <td style="text-align:center;">{{ ((item.quantity*1)*(item.price)).toLocaleString('es-MX', { style: 'currency', currency: 'MXN',}) }}</td>
                    </tr>
                </table>
            </div>
            <div style="display:flex;">
                <div class="column" style="text-align:left; font-size:15px; line-height:1.5em; width:50%!important;">
                    <div style="margin:auto 0px;">
                        <strong>Estatus de Orden:</strong> Confirmada
                        <br/>
                        <strong>Ultima Modificación:</strong> {{dateFormat(quotation.updated_at)}}
                    </div>
                </div>
                <div class="column" style="text-align:right; font-size:15px; line-height:1.5em; width:50%!important;">
                    <div style="margin:auto 0px auto auto;">
                        <strong>Subtotal:</strong> {{(quotation.subtotal).toLocaleString('es-MX', { style: 'currency', currency: 'MXN',})}}
                        <br/>
                        <strong>IVA:</strong> {{(quotation.iva).toLocaleString('es-MX', { style: 'currency', currency: 'MXN',})}}
                    </div>
                </div>
            </div>
            <div style="display:flex; background:#f2f2f2; border:solid black 1px;">
                <div class="column" style="width:25%; font-size:15px; line-height:1.5em;">
                    <div style="margin:auto;">
                        TOTAL
                        <br/>
                        <strong>{{(quotation.total).toLocaleString('es-MX', { style: 'currency', currency: 'MXN',})}}</strong>
                    </div>
                </div>
                <div class="column" style="width:25%; font-size:15px; line-height:1.5em;">
                    <div style="margin:auto;">
                        Anticipo
                        <br/>
                        {{(quotation.total/2).toLocaleString('es-MX', { style: 'currency', currency: 'MXN',})}}
                    </div>
                </div>
                <div class="column" style="width:25%; font-size:15px; line-height:1.5em;">
                    <div style="margin:auto;">
                        FINAL BALANCE DUE
                        <br/>
                        {{dinal_balance_due}}
                    </div>
                </div>
                <div class="column" style="width:25%; font-size:15px; line-height:1.5em;">
                    <div style="margin:auto;">
                        PENDIENTE POR PAGAR
                        <br/>
                        <strong>{{(quotation.total/2).toLocaleString('es-MX', { style: 'currency', currency: 'MXN',})}}</strong>
                    </div>
                </div>
            </div>
            <div style="margin-top:20px; text-align:left; font-size:14px;">
                <strong style="font-size:15px;">Téminos y Condiciones </strong>
                <br/>
                <br/>
                Condiciones
                <br/>
                <br/>
                1.Se requiere un anticipo del 50% para separar y el resto se liquida a una semana antes del evento.
                <br/>
                2.Se pueden subir y bajar cantidades pero no cancelar en su totalidad el artículo. En caso de cancelar, el pago no será reembolsable ni se puede utilizar para otro evento.
                <br/>
                3.Es responsabilidad del cliente saber si el pedido puede entrar y cabe en el lugar del evento.
                <br/>
                4.Se requiere un depósito del 10% del total (en  notas menores a $10,000.00 pesos, el depósito será de $1,000.00 pesos) en garantía por posibles daños. Se reembolsará 5 días hábiles después del evento. Si existen faltantes se cobrará el 100% del valor del árticulo. 
                <br/>
                5.En caso de eventos fuera de Monterrey, Babi di boo Party no se hace responsable del transporte de ida y regreso de los árticulos rentados.  El regreso debe de ser máximo dos días después del evento. Se cobrará un depósito para reparación de daños del 30%. Éste se reembolsará 5 días días hábiles después del evento. Si existen faltantes se cobrará el 100% del valor del artículo. 
                <br/>
                6.El depósito se deberá recoger en las oficinas de Babi di boo Party, maximo 3 meses después del evento. En caso de no recogerlo, el depósito pasa a  reposiciones.
                <br/>
                7.En eventos en donde el cliente recoge y entrega en bodega, Babi di boo Party no se hace responsable de daños que puedan ocurrir en el traslado.
                <br/>
                8.En caso de requerir factura, puede solicirtarse unicamente durante el mes que realice el pago.
                <div style="padding-top:80px;">
                    <div style="border-top:1px solid black; width:350px; text-align:center; margin:auto;">
                        <strong>FIRMA</strong>
                    </div>
                </div>
            </div>
        </div>
        


        <v-btn v-if="printButton==true" bottom color="#1c256a" dark fab fixed right style="bottom:90px;" @click="downloadPDF()">
            <v-icon color="white">mdi-download</v-icon>
        </v-btn> 
        <v-btn v-if="printButton==true" bottom color="#e25200" dark fab fixed right @click="dalecandela()">
            <v-icon color="white">  mdi-printer </v-icon>
        </v-btn> 
    </v-app>
</template>

<script>
import VueHtml2pdf from 'vue-html2pdf'
import moment from 'moment';
import emailjs from 'emailjs-com';
import{ init } from 'emailjs-com';
init("r9m6qvDgcvBn2cpxR");
export default {
    data: () => ({
        printButton:true,
    }),
    methods:{
        dateFormat(date){
            var fecha = new Date(date.slice(0,10) + ' 00:00:00');
            console.log(date)

            // Obtener el día, el mes y el año
            var dia = fecha.getDate();
            var mes = fecha.getMonth() + 1; // Los meses comienzan desde 0, por lo que sumamos 1
            var anio = fecha.getFullYear();

            // Formatear el día y el mes para que tengan dos dígitos (agregar ceros a la izquierda si es necesario)
            if (dia < 10) {
            dia = '0' + dia;
            }
            if (mes < 10) {
            mes = '0' + mes;
            }

            // Formatear la fecha en el formato dd/mm/aa
            return dia + '/' + mes + '/' + (anio % 100);
        },
        sendEmail() {
            this.printButton=false
            this.$nextTick(() => {
                emailjs.send("service_glykmzr","template_ox74hnq",{
                    credito: this.credito(this.creditDays(this.quotation.company_id)),
                    id: this.quotation.id,
                    company: this.companyName(this.quotation.company_id),
                    email: 'joelf@unonegocios.com',
                    items: this.table(this.quotation.items),
                    total: this.quotation.total.toLocaleString('es-MX', { style: 'currency', currency: 'MXN',}),
                    reply_to: this.user(this.quotation.user_id).email,
                    currentUser: this.user(this.quotation.user_id).name + ' ' + this.user(this.quotation.user_id).last,
                    userEmail: this.user(this.quotation.user_id).email,
                    date: this.fecha(this.quotation.created_at)
                }, "r9m6qvDgcvBn2cpxR").then(response => {
                    this.$nextTick(() => {
                        localStorage.removeItem("print");
                        window.close();
                    })
                }).catch(error =>{ 
                    this.sendEmail()
                })
            })
        },
        credito(days){
            if(days>0){
                return '<br><strong>Condiciones de pago: </strong>' + days + 'días de credito' 
            }
        },
        table(items){
            var products = '<tr class="heading">'+
            '<td style="text-align:center; background: #eee; border-bottom: 1px solid #ddd; font-weight: bold; width:25%!important;">Cantidad</td>'+
            '<td style="text-align:center; background: #eee; border-bottom: 1px solid #ddd; font-weight: bold; width:25%!important;">Producto</td>'+
            '<td style="text-align:center; background: #eee; border-bottom: 1px solid #ddd; font-weight: bold; width:25%!important;">Precio Unitario</td>'+
            '<td style="text-align:center; background: #eee; border-bottom: 1px solid #ddd; font-weight: bold; width:25%!important;">Total</td>'+
            '</tr>'
            for (let i = 0; i < items.length; i++) {
                products = products + 
                '<tr class="item">'+
                    '<td style="text-align:center; border-bottom: 1px solid #eee;">' + items[i].quantity + '</td>' +
                    '<td style="text-align:center; border-bottom: 1px solid #eee;">' + this.itemName(items[i].item) + '*</td>' + 
                    '<td style="text-align:center; border-bottom: 1px solid #eee;">' + (items[i].price*1).toLocaleString('es-MX', { style: 'currency', currency: 'MXN',}) + '</td>' +
                    '<td style="text-align:center; border-bottom: 1px solid #eee;">' + ((items[i].quantity*1)*(items[i].price*1)).toLocaleString('es-MX', { style: 'currency', currency: 'MXN',}) + '*</td></tr>'
            }
            return products
        },
        fecha(date){
            return moment(date).format('LL')
        },
        itemName(id){
            return this.$store.state.item.items.filter(item=>item.id == id).map(item => item.name)[0]
        },
        companyName(id){
            return this.$store.state.company.companies.filter(company=>company.id == id).map(company => company.name)[0]
        },
        client(id){
            return this.$store.state.company.companies.filter(company=>company.id == id)[0]
        },
        creditDays(id){
            return this.$store.state.company.companies.filter(company=>company.id == id).map(company => company.credit_days)[0]
        },
        user(id){
            return this.$store.state.user.users.filter(user=>user.id == id)[0]
        },
        downloadPDF () {
            this.$refs.DownloadComp.generatePdf()
        },
        dalecandela() {
            this.printButton=false
            this.$nextTick(() => {
                window.print();
                this.$nextTick(() => {
                    localStorage.removeItem("print");
                    window.close();
                })
            })
        },
    },
    computed: {
        dinal_balance_due(){
            var fechaOriginal = new Date(this.quotation.date + ' 00:00:00'); // Reemplaza 'AAAA-MM-DD' con tu fecha en el formato deseado

            // Restar 7 días
            fechaOriginal.setDate(fechaOriginal.getDate() - 7);

            // Obtener la nueva fecha en el formato AAAA-MM-DD
            return fechaOriginal.toISOString().slice(0, 10);
        },
        currentUser:{
            get(){
                return this.$store.state.currentUser.user;
            }
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
    created(){
        this.quotation = JSON.parse(localStorage.getItem('print'));
        this.$store.dispatch('item/getItems') 
        this.$store.dispatch('company/getCompanies') 
        this.$store.dispatch('currentUser/getUser')
        this.$store.dispatch('user/getUsers')
        localStorage.removeItem("print");
    },
    components: {
        VueHtml2pdf
    }
}
</script>

<style>
.divName{
    font-family: "Roboto", sans-serif!important;
        text-transform: none!important;
}
.invoice-box {
  max-width: 800px;
  margin: auto;
  /*padding: 30px;
  border: 1px solid #eee;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.15);*/
  font-size: 16px;
  line-height: 24px;
  font-family: "Helvetica Neue", "Helvetica", Helvetica, Arial, sans-serif;
  color: #555;
}

.invoice-box table {
  width: 100%;
  line-height: inherit;
  text-align: left;
}

.invoice-box table td {
  padding: 5px;
  vertical-align: top;
}

.invoice-box table tr td:nth-child(n + 2) {
  text-align: right;
}

.invoice-box table tr.top table td {
  padding-bottom: 20px;
}

.invoice-box table tr.top table td.title {
  font-size: 45px;
  line-height: 45px;
  color: #333;
}

.invoice-box table tr.information table td {
  padding-bottom: 40px;
}

.invoice-box table tr.heading td {
  background: #eee;
  border-bottom: 1px solid #ddd;
  font-weight: bold;
}

.invoice-box table tr.details td {
  padding-bottom: 20px;
}

.invoice-box table tr.item td {
  border-bottom: 1px solid #eee;
}

.invoice-box table tr.item.last td {
  border-bottom: none;
}

.invoice-box table tr.item input {
  padding-left: 5px;
}

.invoice-box table tr.item td:first-child input {
  margin-left: -5px;
  width: 100%;
}

.invoice-box table tr.total td:nth-child(2) {
  border-top: 2px solid #eee;
  font-weight: bold;
}

.invoice-box input[type="number"] {
  width: 60px;
}

@media only screen and (max-width: 600px) {
  .invoice-box table tr.top table td {
    width: 100%;
    display: block;
    text-align: center;
  }

  .invoice-box table tr.information table td {
    width: 100%;
    display: block;
    text-align: center;
  }
}

/** RTL **/
.rtl {
  direction: rtl;
  font-family: Tahoma, "Helvetica Neue", "Helvetica", Helvetica, Arial,
    sans-serif;
}

.rtl table {
  text-align: right;
}

.rtl table tr td:nth-child(2) {
  text-align: left;
}

.column{
    width:calc(100% / 3); 
    padding:20px;
    display: flex;
}
</style>