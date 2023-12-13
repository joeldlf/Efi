<template>
    <v-app class="pa-0" style="background-color:white;">
        <div class="invoice-box" style="background-color:white;" id="divName" elevation="0">
            <table cellpadding="0" cellspacing="0" class="divName" style="max-width:644px!important;">
                <tr class="top">
                <td colspan="4">
                    <table>
                        <tr>
                            <td class="title" style="padding-bottom:5px!important;">
                            <img :src="company.logo" style="width:100%; max-width:200px;">
                            </td>
                            <td style="font-size:15px; line-height:1.5em;">
                            Orden de Compra #: {{shopping_order.id}}<br> {{fecha(shopping_order.created_at)}}<br> <strong>{{shopping_order.provider_id.name}}</strong>
                            </td>
                        </tr>
                    </table>
                </td>
                </tr>
                <div style="height: 1px; background: #eeeeee; width: 644px; position: absolute;"></div>
                
                <tr class="information" style="font-size:14px; line-height:1.5em;">
                    <td colspan="4" style="padding-bottom:0px!important;">
                        <table>
                        <tr>
                            <td style="padding-bottom:30px!important;">
                            <span>{{empresa.direccion}}</span>
                            </td>
                            <td style="padding-bottom:0px!important;">
                            {{empresa.razon_social}}<br> 
                            RFC: {{empresa.rfc}}<br>
                            <!--{{currentUser.name}} {{currentUser.last}} | {{currentUser.email}}-->
                            </td>
                        </tr>
                        </table>
                    </td>
                </tr>

                <tr class="heading">
                    <td style="text-align:center;">Cantidad</td>
                    <td style="text-align:center;">Producto</td>
                    <td style="text-align:center;">Precio Unitario</td>
                    <td style="text-align:center;">Total</td>
                </tr>
                <tr class="item" v-for="(item, index) in shopping_order.items" :key="index">
                    <td style="text-align:center;">{{item.quantity}}</td>
                    <td style="text-align:center;">{{item.item_id}}</td>
                    <td style="text-align:center;">{{item.unit_cost}}</td>
                    <td style="text-align:center;">{{item.total}}</td>
                </tr>

                <div style="height:20px;"></div>
                
                <tr class="total">
                    <td colspan="3"></td>
                    <td>Total: {{ shopping_order.total.toLocaleString('es-MX', { style: 'currency', currency: 'MXN',}) }}</td>
                </tr>
                <div style="height:30px; margin-top:30px;"></div>
                <tr>
                    <td colspan="4" style="font-size:12px; line-height: 1.6em;" class="pt-10">
                        <strong>CONDICIONES: </strong><br>
                        - La información contenida en la presente, es exclusivamente para la persona y/o empresa a la que esta dirigida. <br>
                        - Todos los precios señalados están sujetos a cambios sin previo aviso.<br>
                    </td>
                </tr>
                <span style="font-size:12px; position:absolute;">Esta compra se pagara mas tardar el {{new Date(shopping_order.due_date).toLocaleDateString()}}</span>
            </table>
            <div style="height:120px;"></div>
            <div style="background:#363536; color:white; font-size:12px; line-height:1.5em; position:absolute; bottom:0; width: 644px;" class="mt-6 pa-4">
                <v-row class="px-6 pt-2 pb-5">
                    {{empresa.website}}
                    <v-divider style="border-color: transparent!important;"></v-divider>
                    <v-icon class="mr-3" small color="white">mdi-phone</v-icon>{{empresa.telefono}}
                </v-row>
                <v-row class="px-6 pb-2">
                    <v-icon class="mr-3" small color="white">mdi-map-marker</v-icon>{{empresa.direccion}}
                    <v-divider style="border-color: transparent!important;"></v-divider>
                    <v-icon class="mr-3" small color="white">mdi-whatsapp</v-icon>{{empresa.whatsapp}}
                </v-row>
            </div>
        </div>
        <v-btn bottom color="primary" dark fab fixed right style="bottom:165px;" @click="sendEmail()">
            <v-icon color="white">mdi-email</v-icon>
        </v-btn> 
    </v-app>
</template>

<script>
import moment from 'moment';
export default {
    data(){
        return{
            shopping_order: {},
        }
    },
    created(){
        this.shopping_order = JSON.parse(localStorage.getItem('shopping_order'))
        localStorage.removeItem("shopping_order");
    },
    methods:{
        fecha(date){
            return moment(date).format('LL')
        },
        sendEmail(){
            
        }
    },
    computed:{
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
    }
}
</script>

<style>

</style>