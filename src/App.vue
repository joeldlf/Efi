<template>
  <v-app :dark="true">
    <v-main v-if="printed!=null">
      <newPrint v-if="liga=='https://backendbdb.unocrm.mx/'"></newPrint>
      <print v-else></print>
    </v-main>
    <v-main v-else-if="shopping_order!=null">
      <shopping-order></shopping-order>
    </v-main>
    <v-main v-else-if="printNominas!=null">
      <nominas></nominas>
    </v-main>
    <v-main v-else-if="printSales!=null">
      <sales/>
    </v-main>
    <v-main v-else-if="printShipping!=null">
      <shippings/>
    </v-main>
    <v-main v-else-if="printTicket!=null">
      <ticket/>
    </v-main>
    <v-main v-else>
      <app v-if="token!=null"></app>
      <login v-else></login>
    </v-main>
    <v-snackbar top :value="updateExists" color="primary" timeout="999999999" style="margin-top:-72px;" content-class="py-1"><!--updateExists-->
      <span style="font-size:16px;">Hay una actualización disponible!</span>
      <v-btn class="ml-4 elevation-0" small style="margin-top:-4px;" color="white" light @click="refreshApp">
        Actualizar
      </v-btn>
    </v-snackbar>
  </v-app>
</template>
<script>
import update from './mixins/update'
import App from "../src/views/App"
import Login from "../src/views/Login"
import Print from "../src/components/quotations/viewPdf"
import newPrint from "../src/components/quotations/newViewPdf"
import PrintSale from "../src/components/sales/viewPdf"
import Nominas from "../src/components/payrolls/print"
import PrintShipping from "../src/components/shippings/print"
import PrintTicket from "../src/components/sales/printTicket"
import ShoppingOrder from "../src/components/shoppings/order"
import axios from "axios"
export default {
  mixins: [update],
  name: 'App',
  data: () => ({
    token:localStorage.getItem("xn8(*&^%$#47b*g3f76gw3*&^fn734gf8q*&^&^&mwmeg934g8whmre7ngN&G#*!NG@*&#GF(!*#gm1n428fm1g3n84gmf*^$&(%$)e3298negmg"),
    printed: localStorage.getItem("print"),
    printNominas: localStorage.getItem("nominas"),
    printSales: localStorage.getItem("salePrint"),
    printShipping: localStorage.getItem("printShipping"),
    printTicket: localStorage.getItem("printTicket"),
    shopping_order: localStorage.getItem("shopping_order")
  }),
  components:{ 
    'app':App, 
    'login':Login,
    'print':Print,
    'newPrint':newPrint,
    'nominas':Nominas,
    'sales':PrintSale,
    'shippings':PrintShipping,
    'ticket':PrintTicket,
    'shopping-order':ShoppingOrder
  },
  computed:{
    liga(){
      return process.env.VUE_APP_BACKEND_ROUTE
    }
  },
  mounted(){
    axios.get(process.env.VUE_APP_BACKEND_ROUTE + "api/v1/user/current").then(response=>{

    })
    .catch(error => {
      localStorage.removeItem("xn8(*&^%$#47b*g3f76gw3*&^fn734gf8q*&^&^&mwmeg934g8whmre7ngN&G#*!NG@*&#GF(!*#gm1n428fm1g3n84gmf*^$&(%$)e3298negmg");
      this.token = null
    });
  },
};
</script>