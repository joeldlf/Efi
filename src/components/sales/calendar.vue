<template>
  <v-row class="fill-height pb-12 pt-2 mx-1">
    <v-col>
      <v-sheet height="64">
        <!-- header -->
        <v-toolbar
          flat>
          <v-btn outlined class="mr-4" color="grey darken-2" @click="setToday">
            HOY
          </v-btn>
          <v-btn fab text small color="grey darken-2" @click="prev">
            <v-icon small>
              mdi-chevron-left
            </v-icon>
          </v-btn>
          <v-btn fab text small color="grey darken-2" @click="next">
            <v-icon small>
              mdi-chevron-right
            </v-icon>
          </v-btn>
          <v-toolbar-title v-if="$refs.calendar">
            {{ $refs.calendar.title }}
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-menu bottom right>
            <template v-slot:activator="{ on, attrs }">
              <v-btn outlined color="grey darken-2" v-bind="attrs" v-on="on">
                <span>{{ typeToLabel[type] }}</span>
                <v-icon right>mdi-menu-down</v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item @click="type = 'week'">
                <v-list-item-title>Semana</v-list-item-title>
              </v-list-item>
              <v-list-item @click="type = 'month'">
                <v-list-item-title>Mes</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
          <v-btn icon class="ml-2">
            <v-icon @click="openFilter">mdi-filter</v-icon>
          </v-btn>
        </v-toolbar>
      </v-sheet>

      <v-sheet height="600">
        <!-- calendario -->
        <v-calendar
          v-if="render"
          ref="calendar"
          v-model="focus"
          color="#e84919"
          :events="events"
          :event-color="getEventColor"
          :type="type"
          @click:event="showEvent"
          @click:more="viewDay"
          @click:date="viewDay"
          @change="updateRange"
          :event-text-color="getTextEventColor"
        ></v-calendar>
        <!-- Detalle del evento -->
        <v-menu v-model="selectedOpen" :close-on-content-click="false" :activator="selectedElement" offset-x >
          <v-card flat width="400px">
            <v-toolbar style="margin-bottom:-10px;" class="elevation-0">
              <a style="color:black; text-decoration:none;" target="blank_page" :href="'#/sales/'+selectedEvent.id">
              <v-card-title>Venta {{selectedEvent.id}}
                <v-icon class="ml-2" small>mdi-logout-variant</v-icon>
              </v-card-title>
              </a>
              <v-spacer></v-spacer>
              <v-btn icon @click="selectedOpen=false">
                <v-icon color="#3c4043" small> mdi-close</v-icon><!-- #32241c -->
              </v-btn>
            </v-toolbar>
            <div class="pt-2 mx-4 mb-0" color="primary">
              <v-icon color="primary" class="mr-2 mb-1">mdi-calendar</v-icon><span style="font-size:15px; color: #1976d1; font-weight: 500;">{{fecha(selectedEvent.start)}}</span>
            </div>
            <!--div class="pb-1 mx-4 mb-2" color="primary">
              <v-icon color="primary" class="mr-2 mb-1">mdi-clock-outline</v-icon><span style="font-size:15px; color: #1976d1; font-weight: 500;">{{formatAMPM(selectedEvent.start)}}</span>
            </div-->
            <v-card-text class="px-6 pt-1" style="color:#3c4043;">
              <v-list-item v-if="selectedEvent.client!=undefined" :to="{ path: '/clients/client/'+ selectedEvent.client.id}" class="pa-0"><v-icon small class="mr-2 mb-1">mdi-domain</v-icon><strong>Cliente: </strong>{{client(selectedEvent.client)}}</v-list-item>
              <v-list-item v-if="selectedEvent.lead!=undefined" :to="{ path: '/leads/'+ selectedEvent.lead.id}" class="pa-0"><v-icon small class="mr-2 mb-1">mdi-domain</v-icon><strong>Prospecto: </strong>{{selectedEvent.lead.name}}</v-list-item>
              <div class="py-1"></div>
              <div v-if="selectedEvent.lead==undefined&&liga!='https://backendbdb.unocrm.mx/'">
                <v-icon small class="mr-2 mb-1">mdi-account</v-icon><strong>Contacto: </strong>{{selectedEvent.contact}}
              </div>
              <v-divider class="my-4"></v-divider>
              <strong>Notas: </strong>{{selectedEvent.description}}
            </v-card-text>
            <v-card-actions>
              <div style="font-size:12px;"><strong>Vendedor: </strong> {{selectedEvent.user}}</div>
              <v-spacer></v-spacer>
              <!--v-btn @click="status(selectedEvent)" elevation="0" v-if="!selectedEvent.completed" style="text-transform:capitalize; letter-spacing:0;" class="px-5 mb-2 mr-2" color="primary">Entregado</v-btn-->
            </v-card-actions>
          </v-card>
        </v-menu>
      </v-sheet>
    </v-col>
    <!-- Filtros -->
    <v-navigation-drawer style="top: 0px; max-height:100vh!important;" right v-model="filters" :clipped="$vuetify.breakpoint.lgAndUp" app>
        <filterSales @filtersSale="filtersSale"/>
    </v-navigation-drawer>
  </v-row>
</template>
<script>
  import axios from "axios"
  import Filter from "../sales/filter"
  export default {
    components: {
      'filterSales':Filter,
    }, 
    data: () => ({
      render:true,
      filters: false,
      focus: '',
      type: 'month',
      typeToLabel: {
        month: 'Mes',
        week: 'Semana',
      },
      selectedEvent: {},
      selectedElement: null,
      selectedOpen: false,
      events: [],
      start:'',
      end:''
    }),
    mounted () {
      this.$refs.calendar.checkChange()
    },
    methods: {
      viewDay ({ date }) {
        this.focus = date
        this.type = 'day'
      },
      getEventColor (event) {
        if(event.completed){
          return 'white'
        }else{
          return event.color
        }
      },
      getTextEventColor(event) {
        if(event.completed){
          return event.color
        }else{
          return 'white'
        }
      },
      setToday () {
        this.focus = ''
      },
      prev () {
        this.$refs.calendar.prev()
      },
      next () {
        this.$refs.calendar.next()
      },
      showEvent ({ nativeEvent, event }) {
        const open = () => {
          this.selectedEvent = event
          this.selectedElement = nativeEvent.target
          requestAnimationFrame(() => requestAnimationFrame(() => this.selectedOpen = true))
        }
        if (this.selectedOpen) {
          this.selectedOpen = false
          requestAnimationFrame(() => requestAnimationFrame(() => open()))
        } else {
          open()
        }
        nativeEvent.stopPropagation()
      },
      updateRange ({ start, end }) {
        this.start = start.date
        this.end = end.date
        if(this.start==undefined){
          this.start = new Date().toLocaleString("sv-SE", {timeZone: "America/Monterrey"}).slice(0,10)
        }
        if(this.end==undefined){
          this.end = new Date().toLocaleString("sv-SE", {timeZone: "America/Monterrey"}).slice(0,16)
        }
        var filters = ''
        if(JSON.parse(localStorage.getItem('filtersSales'))!=null){
          filters = '&' + JSON.parse(localStorage.getItem('filtersSales'))
        }
        var link = process.env.VUE_APP_BACKEND_ROUTE + "api/v2/sales?filter[bar]=0&filter[date_between]=" + this.start + ',' + this.end + filters + '&calendar=true'
        axios.get(link).then(response => {
          this.events = this.mapCalendar(response.data.data)
        }).catch(error => {
            this.events = []
        })
      },
      mapCalendar(item){
        return item.map(id=>{
          return{
            id: id.id,
            name: id.id + ' | ' + this.client(id.company),
            start: new Date(id.date + ' 00:00:00'),
            end: new Date(id.date + ' 00:00:00'),
            timed: false,
            //activity_type: id.activity_type.name,
            client: id.company,
            contact: this.contact(id.contact),
            description: id.note,
            user: this.salesman(id.user),
            color: 'primary',
            //completed: id.completed
          }
        })
      },
      notNull(element){
        if(element!=null&&element!=undefined&&element!=''){
          return element.id
        }else{
          return ''
        }
      },
      client(client){
        if(client!=undefined){
          if(client.attributes.name == undefined || client.attributes.name == '' || client.attributes.name == null){
            return client.attributes.razon_social
          }else{
            return client.attributes.name
          }
        }else{
          return ''
        }
      },
      salesman(user){
        if(user!=undefined){
          if(user.last!=null){
            return user.name + ' ' + user.last
          }else{
            return user.name
          }
        }
      },
      contact(contact){
        if(contact!=undefined){
          if(contact.last!=null){
            return contact.name + ' ' + contact.last
          }else{
            return contact.name
          }
        }
      },
      filtersSale: function(params) {
        var link = process.env.VUE_APP_BACKEND_ROUTE + "api/v2/sales?calendar=true,filter[date_between]=" + this.start + ',' + this.end
          if(JSON.parse(localStorage.getItem('filtersSales'))!=null){
            link = link + JSON.parse(localStorage.getItem('filtersSales'))
          }
          axios.get(link).then(response => {
            this.events = this.mapCalendar(response.data.data)
          }).catch(error => {
              this.events = []
          })
      },
      openFilter(){
        if(this.filters == false){
          this.$emit("closeDrawer", false);
          this.filters = true
        }else{
          this.$emit("closeDrawer", true);
          this.filters = false
        }
      },
      formatAMPM(date) {
        var hours = new Date(date).getHours();
        var minutes = new Date(date).getMinutes();
        var ampm = hours >= 12 ? 'pm' : 'am';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? '0'+minutes : minutes;
        var strTime = hours + ':' + minutes + ' ' + ampm;
        return strTime;
      },
      fecha(date){
        var meses = new Array ("Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre");
        var diasSemana = new Array("Domingo","Lunes","Martes","Miércoles","Jueves","Viernes","Sábado");
        return diasSemana[new Date(date).getDay()] + ", " + new Date(date).getDate() + " de " + meses[new Date(date).getMonth()] + " de " + new Date(date).getFullYear()
      },
    },
    computed:{
      liga(){
        return process.env.VUE_APP_BACKEND_ROUTE
      },
      currentUser:{
        get(){
          return this.$store.state.currentUser.user;
        }
      },
    }
  }
</script>