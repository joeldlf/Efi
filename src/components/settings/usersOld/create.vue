<template>    
    <v-card>
        <!-- Titulo del dialogo -->
        <v-card-title>
            Crear Usuario
        </v-card-title>
        <v-divider></v-divider>
            <!-- Formulario -->
        <v-form ref="form">
            <v-stepper v-model="e1" class="elevation-0">
                <v-stepper-header class="elevation-0">
                    <v-stepper-step style="font-weight:bolder!important;" :complete="e1 > 1" step="1"></v-stepper-step>
                    <v-divider></v-divider>
                    <v-stepper-step style="font-weight:bolder!important;" step="2"></v-stepper-step>
                    <v-divider></v-divider>
                    <v-stepper-step style="font-weight:bolder!important;" step="3"></v-stepper-step>
                </v-stepper-header>
                <v-stepper-items>
                    <v-stepper-content step="1" class="pt-0">
                        <v-row class="py-3 px-6">
                            <v-col cols="12" sm="6" md="6">
                                <v-select v-model="editedItem.job_position" :items="positions" label="Área"></v-select>
                                <v-text-field :rules="[v => !!v || 'Campo requerido']" v-model="editedItem.name" label="Nombre"></v-text-field>
                                <v-text-field :rules="[v => !!v || 'Campo requerido']" v-model="editedItem.email" label="Email"></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" md="6">
                                <v-select :disabled="editedItem.job_position==''" v-model="editedItem.sub_job_position" :items="subPositions" label="Puesto"></v-select>
                                <v-text-field :rules="[v => !!v || 'Campo requerido']" v-model="editedItem.last" label="Apellido"></v-text-field>
                                <!--v-text-field v-model="editedItem.phone" label="Teléfono"></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" md="4"-->
                                <v-text-field :rules="[v => !!v || 'Campo requerido']" type="password" v-model="editedItem.password" label="Contraseña"></v-text-field>
                            </v-col>
                        </v-row>
                    </v-stepper-content>
                    <v-stepper-content step="2" class="pt-0">
                        <v-card-text class="pb-0 pt-0">
                            <!--strong>Datos de Empleado</strong-->
                            <v-container>
                                <v-row class="mt-0">
                                    <v-row>
                                        <v-col cols="12" sm="12" md="12">
                                            <v-autocomplete
                                                v-model="editedItem.permissions"
                                                :items="flattenedPermissions"
                                                filled
                                                chips
                                                color="blue-grey lighten-2"
                                                label="Permisos"
                                                item-text="text"
                                                item-value="value"
                                                multiple
                                                cache-items
                                            >
                                                <!--template v-slot:selection="data">
                                                    <v-chip
                                                        v-bind="data.attrs"
                                                        :input-value="data.selected"
                                                        close
                                                        @click="data.select"
                                                        @click:close="remove(data.item)"
                                                    >
                                                        <v-avatar left>
                                                        <v-img :src="data.item.icon"></v-img>
                                                        </v-avatar>
                                                        {{ data.item.text }}
                                                    </v-chip>
                                                </template-->
                                                <template v-slot:item="data">
                                                    <template v-if="data.item.category">
                                                        <v-list-item-content class="text-grey">{{data.item.category}}</v-list-item-content>
                                                    </template>
                                                    <template v-else>
                                                        <v-list-item-title v-html="data.item.text"></v-list-item-title>
                                                    </template>
                                                </template>
                                            </v-autocomplete>
                                        </v-col>
                                    </v-row>
                                </v-row>
                            </v-container>
                        </v-card-text>
                    </v-stepper-content>
                    <v-stepper-content step="3" class="pt-0">
                        <v-card-text class="pb-0 pt-0">
                            <!--strong>Datos de Empleado</strong-->
                            <v-container>
                                <v-row class="mt-0">
                                    <v-row>
                                        <v-col cols="12" sm="6" md="6">
                                            <v-menu v-model="datePicker" :close-on-content-click="false" :nudge-right="40" transition="scale-transition" offset-y min-width="290px" >
                                                <template v-slot:activator="{ on }">
                                                    <v-text-field clearable required v-model="editedItem.entry_date" label="Fecha de Ingreso" prepend-icon="mdi-calendar" readonly v-on="on"></v-text-field>
                                                </template>
                                                <v-date-picker color="primary" v-model="editedItem.entry_date" @input="datePicker = false"></v-date-picker>
                                            </v-menu>
                                            <v-menu v-model="datePicker2" :close-on-content-click="false" :nudge-right="40" transition="scale-transition" offset-y min-width="290px" >
                                                <template v-slot:activator="{ on }">
                                                    <v-text-field clearable required v-model="editedItem.birth_date" label="Fecha Nacimiento" prepend-icon="mdi-calendar" readonly v-on="on"></v-text-field>
                                                </template>
                                                <v-date-picker color="primary" v-model="editedItem.birth_date" @input="datePicker2 = false"></v-date-picker>
                                            </v-menu>
                                            <v-text-field v-if="editedItem.sub_job_position.toLowerCase().includes('venta')" type="number" clearable required v-model="editedItem.goal_amount" label="Meta de Venta" prepend-icon="mdi-currency-usd"></v-text-field>
                                        </v-col>
                                        <v-col cols="12" sm="6" md="6">
                                            <v-menu v-model="datePicker3" :close-on-content-click="false" :nudge-right="40" transition="scale-transition" offset-y min-width="290px" >
                                                <template v-slot:activator="{ on }">
                                                    <v-text-field clearable required v-model="editedItem.departure_date" label="Fecha de Salida" prepend-icon="mdi-calendar" readonly v-on="on"></v-text-field>
                                                </template>
                                                <v-date-picker color="primary" v-model="editedItem.departure_date" @input="datePicker3 = false"></v-date-picker>
                                            </v-menu>
                                            <v-text-field type="number" clearable required v-model="editedItem.daily_salary" label="Sueldo Diario" prepend-icon="mdi-currency-usd"></v-text-field>
                                        </v-col>
                                    </v-row>
                                </v-row>
                            </v-container>
                        </v-card-text>
                    </v-stepper-content>
                </v-stepper-items>
            </v-stepper>
        </v-form>
        <v-card-actions class="pt-4">
            <v-menu :close-on-content-click="false" :nudge-right="40" transition="scale-transition" offset-y min-width="290px" >
                <template v-slot:activator="{ on }">
                    <v-chip class="ma-2 mt-0" :color="editedItem.color" text-color="white" v-on="on"><v-avatar left><v-icon color="#676767"> mdi-palette</v-icon></v-avatar> Color Calendario</v-chip>
                </template>
                <v-color-picker :rules="[v => !!v || 'Campo requerido']" v-model="editedItem.color" class="ma-2"></v-color-picker>
            </v-menu> 
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="close">Cancelar</v-btn>
            <v-btn color="blue darken-1" text  v-if="e1>1" @click="e1 = e1-1">
                <v-icon>mdi-chevron-left</v-icon>
                Regresar
            </v-btn>
            <v-btn color="blue darken-1" text  v-if="e1!=3" @click="e1 = e1+1">
                Siguiente
                <v-icon>mdi-chevron-right</v-icon>
            </v-btn>
            <v-btn color="blue darken-1" text :loading="gris" :disabled="gris || !valid" @click="save">Guardar</v-btn>
        </v-card-actions>
        <v-snackbar :color="snackbar.color" v-model="snackbar.show">
            {{ snackbar.message }}
        </v-snackbar>
    </v-card>
</template>
<script>
import axios from "axios";
export default {
    data:()=>({ 
        datePicker: false,
        datePicker2: false,
        datePicker3: false,
        e1: 1, 
        disable:'',
        valid: true,
        positions:[
            'Administración',
            'Almacén',
            'Chofer Ejecutivo',
            'Chofer Repartidor',
            'Comercial',
            'Dirección',
            'Producción',
            'Sistemas',
        ],
        editedItem: {
            sub_job_position:'',
            goal_amount:'',
            birth_date:'',
            entry_date:'',
            departure_date:'',
            daily_salary:'',
            name:'',
            last:'',
            email:'',
            password:'',
            permissions:'',
            phone:'',
            color:'',
            job_position:'',
            rol:''
        },
        rules: {
            required: value => !!value || 'Campo requerido',
        },
        snackbar: {
            show: false,
            message: null,
            color: null
        },
        gris:false,
    }),
    computed:{
        selectedPermissions(){
            return this.editedItem.permissions
        },
        subPositions(){
            if(this.editedItem.job_position == 'Administración'){
                return ['Asistente dirección','Contabilidad']
            }else if(this.editedItem.job_position == 'Almacén'){
                return ['Calidad','Logística', 'Montacargas']
            }else if(this.editedItem.job_position == 'Comercial'){
                return ['Cobranza','Compras', 'Ecommerce','Publicidad','Ventas', 'Ventas Industria']
            }else if(this.editedItem.job_position == 'Producción'){
                return ['App','Trapo',]
            }
        },
        rolls(){
            return [
                {text: 'Director Comercial', value: 'director_comercial'},
                {text: 'Vendedor Cuentas Clave', value: 'vendedor_cuentas_clave'},
                {text: 'Vendedor General', value: 'vendedor_general'},
            ]
        },
        flattenedPermissions() {
            const flattened = [];
            this.groupedPermissions.forEach(category => {
                flattened.push({ category: category.category });
                category.permissions.forEach(permission => {
                    flattened.push({ text: permission.text, value: permission.value });
                });
            });
            return flattened;
        },
        groupedPermissions(){
            return [
                {
                    category: 'Empresas',
                    permissions: [
                    { text: 'Acceso a Empresas', value: 'companies' },
                    { text: 'Ver Empresas', value: 'viewCompanies' },
                    { text: 'Editar Empresas', value: 'editCompanies' },
                    { text: 'Eliminar Empresas', value: 'deleteCompanies' },
                    { text: 'Asignar Empresas', value: 'assignCompanies' },
                    { text: 'Reasignar Empresas', value: 'reassignCompanies' }
                    ]
                },
                {
                    category: 'Contactos',
                    permissions: [
                    { text: 'Ver Contactos', value: 'viewContacts' },
                    { text: 'Editar Contactos', value: 'editContacts' },
                    { text: 'Eliminar Contactos', value: 'deleteContacts' }
                    ]
                },
                {
                    category: 'Cotizaciones',
                    permissions: [
                    { text: 'Acceso a Cotizaciones', value: 'quotations' },
                    { text: 'Ver Cotizaciones', value: 'viewQuotations' },
                    { text: 'Editar Cotizaciones', value: 'editQuotations' },
                    { text: 'Eliminar Cotizaciones', value: 'deleteQuotations' },
                    { text: 'Asignar Cotizaciones', value: 'assignQuotations' }
                    ]
                },
                {
                    category: 'Cancelaciones',
                    permissions: [
                    { text: 'Acceso a Cancelaciones', value: 'cancelations' },
                    { text: 'Ver Cancelaciones', value: 'viewCancelations' }
                    ]
                },
                {
                    category: 'Ventas',
                    permissions: [
                    { text: 'Acceso a Ventas', value: 'sales' },
                    { text: 'Ver Ventas', value: 'viewSales' },
                    { text: 'Editar Ventas', value: 'editSales' },
                    { text: 'Eliminar Ventas', value: 'deleteSales' },
                    { text: 'Asignar Ventas', value: 'assignSales' },
                    { text: 'Imprimir Ticket', value: 'printTicket' }
                    ]
                },
                {
                    category: 'Actividades',
                    permissions: [
                    { text: 'Acceso a Actividades', value: 'activities' },
                    { text: 'Ver Actividades', value: 'viewActivities' },
                    { text: 'Editar Actividades', value: 'editActivities' },
                    { text: 'Eliminar Actividades', value: 'deleteActivities' },
                    { text: 'Asignar Actividades', value: 'assignActivities' }
                    ]
                },
                {
                    category: 'Cobranzas',
                    permissions: [
                    { text: 'Acceso a Cobranzas', value: 'collections' },
                    { text: 'Ver Cobranzas', value: 'viewCollections' },
                    { text: 'Editar Cobranzas', value: 'editCollections' },
                    { text: 'Eliminar Cobranzas', value: 'deleteCollections' },
                    { text: 'Asignar Cobranzas', value: 'assignCollections' }
                    ]
                },
                {
                    category: 'Envíos',
                    permissions: [
                    { text: 'Acceso a Envíos', value: 'shippings' },
                    { text: 'Ver Envíos', value: 'viewShippings' },
                    { text: 'Editar Envíos', value: 'editShippings' },
                    { text: 'Eliminar Envíos', value: 'deleteShippings' },
                    { text: 'Imprimir Envíos', value: 'printShippings' }
                    ]
                },
                {
                    category: 'Ordenes de Envío',
                    permissions: [
                    { text: 'Acceso a Ordenes de Envío', value: 'shipping_details' },
                    { text: 'Ver Ordenes de Envío', value: 'viewShippingDetails' },
                    { text: 'Editar Ordenes de Envío', value: 'editShippingDetails' },
                    { text: 'Eliminar Ordenes de Envío', value: 'deleteShippingDetails' }
                    ]
                },
                {
                    category: 'Gastos',
                    permissions: [
                    { text: 'Acceso a Gastos', value: 'expenses' },
                    { text: 'Ver Gastos', value: 'viewExpenses' },
                    { text: 'Editar Gastos', value: 'editExpenses' },
                    { text: 'Eliminar Gastos', value: 'deleteExpenses' }
                    ]
                },
                {
                    category: 'Nominas',
                    permissions: [
                    { text: 'Acceso a Nominas', value: 'pay_rolls' },
                    { text: 'Editar Nominas', value: 'editPayRolls' },
                    { text: 'Eliminar Nominas', value: 'deletePayRolls' },
                    { text: 'Imprimir Nominas', value: 'printPayrolls' }
                    ]
                },
                {
                    category: 'Compras',
                    permissions: [
                    { text: 'Acceso a Compras', value: 'shoppings' },
                    { text: 'Ver Compras', value: 'viewShoppings' },
                    { text: 'Editar Compras', value: 'editShoppings' },
                    { text: 'Eliminar Compras', value: 'deleteShoppings' }
                    ]
                },
                {
                    category: 'Detalle de Compras',
                    permissions: [
                    { text: 'Editar Detalle de Compras', value: 'editShoppingOrders' },
                    { text: 'Eliminar Detalle de Compras', value: 'deleteShoppingOrders' }
                    ]
                },
                {
                    category: 'Proveedores',
                    permissions: [
                    { text: 'Acceso a Proveedores', value: 'providers' },
                    { text: 'Acceso Pagos a Proveedores', value: 'provider_payments' },
                    { text: 'Editar Pagos a Proveedores', value: 'editProviderPayments' },
                    { text: 'Eliminar Pagos a Proveedores', value: 'deleteProviderPayments' }
                    ]
                },
                {
                    category: 'Producción',
                    permissions: [
                    { text: 'Acceso a Producción', value: 'productions' },
                    { text: 'Ver Producción', value: 'viewProductions' },
                    { text: 'Editar Producción', value: 'editProductions' },
                    { text: 'Eliminar Producción', value: 'deleteProductions' },
                    { text: 'Editar Solicitud de Producción', value: 'editProductionOrders' },
                    { text: 'Eliminar Solicitud de Producción', value: 'deleteProductionOrders' }
                    ]
                },
                {
                    category: 'Ajustes',
                    permissions: [
                    { text: 'Acceso a Ajustes', value: 'adjustments' },
                    { text: 'Editar Ajustes', value: 'editAdjustments' },
                    { text: 'Eliminar Ajustes', value: 'deleteAdjustments' }
                    ]
                },
                {
                    category: 'Inventario Físico',
                    permissions: [
                    { text: 'Acceso a Inventario Físico', value: 'physical_inventories' }
                    ]
                },
                {
                    category: 'Transferencias de Inventario',
                    permissions: [
                    { text: 'Acceso a Transferencias de Inventario', value: 'inventory_transfer' },
                    { text: 'Acceso a Movimientos de Inventario', value: 'report_inventory' },
                    { text: 'Acceso a Inventario', value: 'inventory' }
                    ]
                },
                {
                    category: 'Grabaciones de Llamada',
                    permissions: [
                    { text: 'Acceso a Grabaciones de Llamada', value: 'viewCallRecords' },
                    { text: 'Acceso a LLamadas', value: 'calls' },
                    { text: 'Ver LLamadas', value: 'viewCalls' }
                    ]
                },
                {
                    category: 'Catálogos',
                    permissions: [
                    { text: 'Acceso a Catálogos', value: 'catalogs' }
                    ]
                },
                {
                    category: 'Usuarios',
                    permissions: [
                    { text: 'Acceso a Usuarios', value: 'users' },
                    {text: 'Acceso a Roles', value: 'roles'}
                    ]
                },
                {
                    category: 'Reportes',
                    permissions: [
                    { text: 'Acceso a Reportes', value: 'reports' },
                    { text: 'Acceso a Reportes', value: 'balances' }
                    ]
                },
                {
                    category: 'Mensajes',
                    permissions: [
                    { text: 'Acceso a Mensajes', value: 'messages' },
                    { text: 'Ver Mensajes', value: 'viewMesages' }
                    ]
                },
                {
                    category: 'Caja',
                    permissions: [
                    { text: 'Acceso a Caja', value: 'ferreteria' }
                    ]
                },
                {
                    category: 'Notas',
                    permissions: [
                    { text: 'Asignar Notas', value: 'assignNotes' }
                    ]
                },
                {
                    category: 'Pedidos x Surtir',
                    permissions: [
                    { text: 'Acceso a Pedidos x Surtir', value: 'orders' }
                    ]
                },
                {
                    category: 'Pedidos Surtidos',
                    permissions: [
                    { text: 'Acceso a Pedidos Surtidos', value: 'orders_ready' }
                    ]
                },
                {
                    category: 'Saldos Vencidos',
                    permissions: [
                    { text: 'Acceso a Saldos Vencidos', value: 'balances' }
                    ]
                },
                {
                    category: 'Utilidades',
                    permissions: [
                    { text: 'Acceso a Utilidades', value: 'utilities' }
                    ]
                },
                {
                    category: 'Prospectos',
                    permissions: [
                    { text: 'Acceso a Prospectos', value: 'leads' },
                    { text: 'Asignar Prospectos', value: 'assignLeads' }
                    ]
                },
                {
                    category: 'Ver Costos',
                    permissions: [
                    { text: 'Ver Costos', value: 'viewCosts' }
                    ]
                }
                ];
        },
        currentUser:{
            get(){
                return this.$store.state.currentUser.user
            }
        },
    },
    methods:{
        close () {
            this.gris = false
            this.e1= 1
            this.editedItem = Object.assign({}, this.defaultItem)
            this.$nextTick(() => {
                this.$emit("closeDialogItem", false);
            })
        },
        save () {
            //this.editedItem.permissions = this.rol(this.editedItem.rol)
            this.editedItem.avatar='default.jpg'
            this.editedItem.status=1
            axios.post(process.env.VUE_APP_BACKEND_ROUTE + "api/v1/user/create",Object.assign(this.editedItem)).then(response=>{
                this.close()
            }).catch(error => {
                this.snackbar = {
                    message: error.response.data.message,
                    color: 'error',
                    show: true
                }
                this.gris = false
            })
        },
        rol(rol){
            if(rol == 'director_comercial'){
                return [
                'companies',
                'viewCompanies',
                'editCompanies',
                'deleteCompanies',
                'assignCompanies',
                
                'contacts',
                'viewContacts',
                'editContacts',
                'deleteContacts',
                'assignContacts',

                'quotations',
                'viewQuotations',
                'editQuotations',
                'deleteQuotations',
                'assignQuotations',

                'cancelations',
                'viewCancelations',
                'editCancelations',
                'deleteCancelations',
                'assignCancelations',

                'sales',
                'viewSales',
                'editSales',
                'deleteSales',
                'assignSales',

                'activities',
                'viewActivities',
                'editActivities',
                'deleteActivities',
                'assignActivities',
                'calendars',

                'collections',
                'viewCollections',
                'editCollections',
                'deleteCollections',
                'assignCollections'
            ]}else if(rol == 'vendedor_cuentas_clave'){
                return [
                'companies',
                'contacts',
                'quotations',
                'cancelations',
                'sales',
                'activities',
                'collections',
                'calendars'
            ]}else if(rol == 'vendedor_general'){
                return [
                'companies',
                'viewCompanies',
                'assignCompanies',
                
                'contacts',
                'viewContacts',
                'assignContacts',

                'quotations',
                'viewQuotations',
                'assignQuotations',

                'cancelations',
                'viewCancelations',
                'assignCancelations',

                'sales',
                'viewSales',
                'assignSales',

                'activities',
                'viewActivities',
                'assignActivities',
                'calendars',

                'collections',
                'viewCollections',
                'assignCollections'
            ]}
        }
    },
    watch: {
        selectedPermissions(newPermissions) {
            console.log(this.editedItem.permissions)
            for(var i=0; i<newPermissions.length; i++){
                if(newPermissions[i].category!=undefined){
                    this.editedItem.permissions.concat(
                        this.groupedPermissions
                        .filter(category=>category.category == newPermissions[i].category)
                        .map(category=>category.permissions
                            .map(permission=>permission.value)
                        )[0]
                    )
                    //this.editedItem.permissions.splice(i, 1);
                }
            }
            console.log(this.editedItem.permissions)
        }
    }
}
</script>


<!--
FGE | Direccion
Carlos Alberto Leal Isla Martinez | Comerial/Compras
Lucero Estefany Escamilla Morales | Comercial/Ecommerce
Juan Manuel Fuentes Bautista | Comercial/Ventas Industria
Melany Villarreal Garza | Administracion/Asistente direccion
Janeth Castillo Ibagüe | Almacen/Logistica
Jorge Erasmo Moreno Delgado | Almacen/Calidad
Joel Victor de la Fuente Rodriguez | Sistemas
Angelica Maria Ontiveros Ontiveros | Administracion/Contabilidad
Valeria Guadalupe Torres Juarez | Comercial/Publicidad
Jessica Paola Aleman Ramirez | Comercial/Ventas
Priscila Garcia Marroquin | Comercial/Ventas
Homero Guajardo Lopez | Comercial/Publicidad
Ana Sofia Aguirre Garza | Comercial/Ventas
Martha Isabel Moreno Cortes | Comercial/Ventas
Carlos Alberto Alanis Vargas | Chofer Ejecutivo 
Pablo Ramon Rafael Baltazar Gomez | Produccion/App
Andrea Arellano Saldivar | Comercial/Cobranza
Hector Alan Silva Reyna | Sistemas
Bonifacio Sabalza Ramirez | Produccion/Trapo
Cristian David Flores Huerta | Produccion/Trapo
Esteban Lara Gonzalez | Produccion/Trapo
Felix Guevara Gonzalez | Almacen/Montacargas
Hector Rodriguez Guerra | Produccion/Trapo
Jose Felix Ramos Garcia | Produccion/Trapo
Jose Tomas Santana Trujillo | Produccion/App
Luis Derian Aguilar Castillo | Produccion/Trapo
Raul Salazar Gonzalez  | Produccion/Trapo
Raymundo Carrizales Alvarez | Produccion/Trapo
Santiago Ortiz Hernandez | Produccion/Trapo
Sergio Solis Garcia | Produccion/Trapo
Zeferino Aguilar de la Rosa | Produccion/Trapo
Carlos Humberto Garcia de la Riva | Chofer Repartidor
Francisco Javier Gaytan Velasquez | Chofer Repartidor
Francisco Javier Sanchez Nuñez | Chofer Repartidor



Administración/Asistente dirección
Administración/Contabilidad

Almacén/Calidad
Almacén/Logística
Almacén/Montacargas

Chofer Ejecutivo
Chofer Repartidor

Comercial/Cobranza
Comercial/Compras
Comercial/Ecommerce
Comercial/Publicidad
Comercial/Ventas
Comercial/Ventas Industria

Dirección

Producción/App
Producción/Trapo

Sistemas
-->