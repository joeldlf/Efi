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
                </v-stepper-header>
                <v-stepper-items>
                    <v-stepper-content step="1" class="pt-0">
                        <v-row class="mx-0">
                            <v-col cols="12" sm="6" md="6">
                                <v-select item-value="id" item-text="name" v-model="editedItem.branch_id" :items="branchs" label="Sucursal"></v-select>
                            </v-col>
                            <v-col cols="12" sm="6" md="6">
                                <v-select v-model="editedItem.rol" :items="roles" item-value="name" item-text="name" label="Rol"></v-select>
                            </v-col>
                        </v-row>
                        <v-row class="mx-0">
                            <v-col cols="12" sm="6" md="6">
                                <v-select v-model="editedItem.job_position" :items="positions" label="Área"></v-select>
                            </v-col>
                            <v-col cols="12" sm="6" md="6">
                                <v-select :disabled="editedItem.job_position==''" v-model="editedItem.sub_job_position" :items="subPositions" label="Puesto"></v-select>
                            </v-col>
                        </v-row>
                        
                        <v-row class="mx-0">
                            <v-col cols="12" sm="6" md="6">
                                <v-text-field :rules="[v => !!v || 'Campo requerido']" v-model="editedItem.name" label="Nombre"></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" md="6">
                                <v-text-field :rules="[v => !!v || 'Campo requerido']" v-model="editedItem.last" label="Apellido"></v-text-field>
                            </v-col>
                        </v-row>
                        <v-row class="mx-0">
                            <v-col cols="12" sm="6" md="6">
                                <v-text-field :rules="[v => !!v || 'Campo requerido']" v-model="editedItem.email" label="Email"></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" md="6">
                                <v-text-field v-model="editedItem.phone" label="Teléfono"></v-text-field>
                            </v-col>
                        </v-row>
                        <v-row class="mx-0">
                            <v-col cols="12" sm="12" md="12">
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
            <v-btn color="blue darken-1" text  v-if="e1!=2" @click="e1 = e1+1">
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
        branchs:[],
        editedItem: {
            name:'',
            last:'',
            email:'',
            color:'',
            phone:'',
            job_position:'',
            sub_job_position:'',
            birth_date:'',
            departure_date:'',
            entry_date:'',
            daily_salary:'',
            branch_id:'',
            status:'activo',
            avatar:'default.jpg'
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
        positions(){
            return [
                'Administración',
                'Almacén',
                'Chofer Ejecutivo',
                'Chofer Repartidor',
                'Comercial',
                'Dirección',
                'Producción',
                'Sistemas',
            ]
        },
        roles(){
            return this.$store.state.role.roles
        }
    },
    created(){
        this.$store.dispatch('role/getRoles')
        axios.get(process.env.VUE_APP_BACKEND_ROUTE + "api/v2/branches").then(response=>{
            this.branchs = response.data
        })
    },
    methods:{
        close () {
            this.gris = false
            this.e1= 1
            this.editedItem = Object.assign({}, this.defaultItem)
            this.$nextTick(() => {
                this.$emit("closeCreateDialog", false);
            })
        },
        save () {
            axios.post(process.env.VUE_APP_BACKEND_ROUTE + "api/v2/users", this.editedItem).then(response=>{
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
    },
}
</script>