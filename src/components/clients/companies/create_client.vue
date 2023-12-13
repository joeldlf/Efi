<template>
    <v-card class="cretae_client">
        <v-card-title class="pb-0 pt-3 pb-2" >
            <v-icon style="background: #e7e8e9; padding: 10px!important; border-radius: 50%;" class="mr-4">mdi-domain</v-icon>
            <span >Nuevo Cliente</span>
            <v-spacer></v-spacer>
            <v-col cols="12" sm="6" md="4">
                <v-autocomplete v-if="permissions('assignCompanies')" outlined  dense clearable v-model="company.user_id" :items="usersLists" label="Vendedor*" item-text="name" item-value="id">
                    <template slot="no-data" class="pa-2">No existen usuarios relacionados.</template>                      
                </v-autocomplete>
            </v-col>
        </v-card-title>
        <v-divider></v-divider>
        <v-stepper v-model="e1" class="elevation-0">
            <v-stepper-header class="elevation-0">
                <v-stepper-step style="font-weight:bolder!important;" :complete="e1 > 1" step="1"></v-stepper-step>
                <v-divider></v-divider>
                <!--v-stepper-step style="font-weight:bolder!important;" :complete="e1 > 2" step="2"></v-stepper-step>
                <v-divider></v-divider-->
                <v-stepper-step style="font-weight:bolder!important;" step="2"></v-stepper-step>
            </v-stepper-header>
            <v-stepper-items>
                <v-stepper-content step="1" class="pt-0">
                    <v-card-text class="pb-0 pt-0">
                        <v-container>
                            <v-row>
                                <v-col cols="12" sm="6" md="6">
                                    <v-text-field prepend-inner-icon="mdi-domain" :rules="[v => !!v || 'Campo requerido']" v-model="company.name" label="Nombre de Cliente*"></v-text-field>
                                </v-col>
                                <v-col cols="12" sm="6" md="6">
                                    <v-menu v-model="datePicker" :close-on-content-click="false" :nudge-right="40" transition="scale-transition" offset-y min-width="290px" >
                                        <template v-slot:activator="{ on }">
                                            <v-text-field :rules="[v => !!v || 'Campo requerido']" clearable required v-model="company.birth_date" label="Cumpleaños" prepend-icon="mdi-calendar" readonly v-on="on"></v-text-field>
                                        </template>
                                        <v-date-picker color="primary" v-model="company.birth_date" @input="datePicker = false"></v-date-picker>
                                    </v-menu>
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col cols="12" sm="6" md="6">
                                    <vue-tel-input-vuetify type="number" v-model="company.phone" label="Teléfono"></vue-tel-input-vuetify>
                                </v-col>
                                <v-col cols="12" sm="6" md="6">
                                    <v-text-field prepend-inner-icon="mdi-email" v-model="company.email" label="Correo Electrónico"></v-text-field>
                                </v-col>
                            </v-row>
                        </v-container>
                    </v-card-text>
                </v-stepper-content>
                <!--v-stepper-content step="2" class="pt-0">
                    <v-card-text class="pb-0 pt-0">
                        <strong>Condiciones Comerciales</strong>
                        <v-container>
                            <v-row class="mt-0">
                                <v-text-field prepend-inner-icon="mdi-map-marker" class="mb-2" v-model="company.delivery_address" label="Dirección de Entrega"></v-text-field>
                                <v-row>
                                    

                                <v-col class="pt-0" cols="12" sm="6" md="4">
                                    <v-autocomplete outlined class="mt-3" dense clearable v-model="company.type_id" :items="typeLists" label="Tipo de Cliente" item-text="type" item-value="id">
                                        <template slot="no-data" class="pa-2">No existen tipos relacionados.</template>                      
                                    </v-autocomplete>
                                    <v-autocomplete  outlined class="mt-3" dense clearable v-model="company.frequency_id" :items="frequencyLists" label="Frecuencia de Consumo" item-text="frequency" item-value="id">
                                        <template slot="no-data" class="pa-2">No existen frecuencias relacionadas.</template>                      
                                    </v-autocomplete>
                                    <v-select outlined class="mt-3" dense clearable v-model="company.consumptions" :items="categoryLists" item-text="name" item-value="id" label="Categoría de Consumos" multiple>
                                        <template v-slot:selection="{ item, index }">
                                            <v-chip style="max-width:80px;" class="mt-1" small v-if="index <= 1">
                                                <span class="text-truncate">{{ item.name }}</span>
                                            </v-chip>
                                            <span v-if="index === 1" class="grey--text text-caption mt-1">
                                            (+{{ company.consumptions.length - 2 }} más)
                                            </span>
                                        </template>
                                    </v-select>
                                    
                                    <v-textarea filled class="mt-4" v-model="company.opportunity_area" label="Area de Oportunidad"></v-textarea>
                                </v-col>
                                <v-col class="pt-0" cols="12" sm="6" md="4">
                                    <v-autocomplete outlined class="mt-3" dense clearable v-model="company.price_list_id" :items="priceLists" label="Lista de Precios" item-text="item" item-value="id">
                                        <template slot="no-data" class="pa-2">No existen listas de precio relacionadas.</template>                      
                                    </v-autocomplete>
                                     <v-autocomplete  outlined class="mt-3" dense clearable v-model="company.contact_mode_id" :items="mediumLists" label="Medio de Contacto Preferido" item-text="mode" item-value="id">
                                        <template slot="no-data" class="pa-2">No existen medios relacionados.</template>                      
                                    </v-autocomplete>
                                    <v-select outlined class="mt-3" dense clearable v-model="company.credit_days" :items="days" label="Días de Credito"></v-select>
                                    <v-textarea filled class="mt-4" v-model="company.special_note" label="Nota Especial"></v-textarea>
                                </v-col>

                                <v-col class="pt-0" cols="12" sm="6" md="4">
                                    <v-select outlined class="mt-3" dense clearable v-model="company.special_conditions" :items="conditionLists" label="Condicion Especial" item-text="condition" item-value="id"  chips multiple>
                                        <template v-slot:selection="{ item, index }">
                                            <v-chip style="max-width:80px;" class="mt-1" small v-if="index <= 1">
                                                <span class="text-truncate">{{ item.condition }}</span>
                                            </v-chip>
                                            <span v-if="index === 1" class="grey--text text-caption">
                                            (+{{ company.special_conditions.length - 2 }} más)
                                            </span>
                                        </template>
                                    </v-select>

                                    <v-textarea filled class="mt-3" v-model="company.delivery_references" label="Referencias de Dirección"></v-textarea>
                                    
                                    <v-textarea filled class="mt-3" v-model="company.delivery_time" label="Horario de Entrega"></v-textarea>
                                </v-col>
                            </v-row>
                            </v-row>
                        </v-container>
                    </v-card-text>
                </v-stepper-content-->
                <v-stepper-content step="2" class="pt-0">
                    <v-card-text class="pb-0 pt-0 px-0">
                        <strong>Datos Fiscales</strong>
                        <v-container>
                            <v-text-field v-model="company.razon_social" :error="nosa" hint="sin el régimen societario (ej.: S.A. de C.V.)." persistent-hint dense class="mt-3 mb-0 mx-3" label="Razón Social*" outlined></v-text-field>
                            <v-row class="ma-0">
                                <v-col cols="4" class="mt-2">
                                    <v-text-field v-model="company.rfc" dense label="RFC*" outlined></v-text-field>
                                </v-col>
                                <v-col cols="4" class="mt-2">
                                    <v-text-field v-model="company.fiscal_email" dense label="Email" outlined></v-text-field>
                                </v-col>
                                <v-col cols="4" class="mt-2">
                                    <v-autocomplete v-model="company.tax_system" dense label="Régimen Fiscal*" outlined :items="tax_systems" item-text="name" item-value="id"></v-autocomplete>
                                </v-col>
                            </v-row>
                             <v-row class="ma-0">
                                <v-col cols="4" class="mt-2">
                                    <v-text-field v-model="company.fiscal_address_json.street" dense label="Calle" outlined></v-text-field>
                                </v-col>
                                <v-col cols="4" class="mt-2">
                                    <v-text-field v-model="company.fiscal_address_json.exterior" dense label="# Exterior" outlined></v-text-field>
                                    </v-col>
                                <v-col cols="4" class="mt-2">
                                    <v-text-field v-model="company.fiscal_address_json.interior" dense label="# Interior" outlined></v-text-field>
                                    </v-col>
                                <v-col cols="4" class="mt-2">
                                    <v-text-field v-model="company.fiscal_address_json.neighborhood" dense label="Colonia" outlined></v-text-field>
                                    </v-col>
                                <v-col cols="4" class="mt-2">
                                    <v-text-field v-model="company.fiscal_address_json.city" dense label="Ciudad" outlined></v-text-field>
                                    </v-col>
                                <v-col cols="4" class="mt-2">
                                    <v-text-field v-model="company.fiscal_address_json.municipality" dense label="Municipio" outlined></v-text-field>
                                    </v-col>
                                <v-col cols="4" class="mt-2">
                                    <v-text-field v-model="company.fiscal_address_json.zip" dense label="Código Postal*" outlined></v-text-field>
                                    </v-col>
                                <v-col cols="4" class="mt-2">
                                    <v-text-field v-model="company.fiscal_address_json.state" dense label="Estado" outlined></v-text-field>
                                    </v-col>
                                <v-col cols="4" class="mt-2">
                                    <v-text-field class="mb-2" v-model="company.fiscal_address_json.country" hint="Código de país acorde al estándar ISO 3166-1 alpha-3" persistent-hint dense label="Código de País" outlined></v-text-field>
                                </v-col>
                            </v-row>
                            <!--v-row>
                                <v-col class="pt-0" cols="12" sm="4" md="4">
                                    <v-text-field v-model="company.razon_social" label="Razon Social"></v-text-field>

                                    <v-autocomplete outlined class="mt-4" dense clearable v-model="company.cfdi_id" :items="cfdiLists" label="Uso de CFDI" item-text="cfdi" item-value="id">
                                        <template slot="no-data" class="pa-2">No existen usos relacionados.</template>                      
                                    </v-autocomplete>
                                </v-col>
                                <v-col class="pt-0" cols="12" sm="4" md="4">
                                    <v-text-field v-model="company.rfc" label="RFC"></v-text-field>

                                    <v-text-field class="mt-0" v-model="company.number" label="Numero Macro"></v-text-field>
                                </v-col>
                                <v-col class="pt-0" cols="12" sm="4" md="4">
                                    <v-text-field prepend-inner-icon="mdi-map-marker" v-model="company.address" label="Dirección Fiscal"></v-text-field>

                                    <v-autocomplete outlined class="mt-2" dense clearable v-model="company.payment_method_id" :items="methodLists" label="Método de Pago" item-text="method" item-value="id">
                                        <template slot="no-data" class="pa-2">No existen metodos relacionados.</template>                      
                                    </v-autocomplete>
                                </v-col>
                            </v-row-->

                            <v-row class="ma-0">
                                <v-col class="pt-0" cols="12" sm="4" md="4">
                                    <v-autocomplete outlined dense clearable v-model="company.cfdi_use" :items="cfdiLists" label="Uso de CFDI" item-text="Descripción" item-value="Clave">
                                        <template slot="no-data">No existen usos relacionados.</template>                      
                                    </v-autocomplete>
                                    <v-text-field outlined class="mt-2" dense v-model="company.bank_account_number" label="Numero de Cuenta"></v-text-field>

                                </v-col>
                                <v-col v-if="currentUser.job_position != 'vendedor'"  class="pt-0" cols="12" sm="4" md="8">
                                    <v-textarea filled v-model="company.payment_conditions" label="Condiciones de Pago"></v-textarea>
                                </v-col>
                            </v-row>
                        </v-container>
                    </v-card-text>
                </v-stepper-content>
            </v-stepper-items>
        </v-stepper>
        <v-card-actions class="pr-6 pb-6">
            <v-spacer></v-spacer>
            <v-btn color="grey darken-2" text @click="close">
                Cancelar
            </v-btn>
            <v-btn color="blue darken-1" text  v-if="e1>1" @click="e1 = e1-1">
                <v-icon>mdi-chevron-left</v-icon>
                Regresar
            </v-btn>
            <v-btn color="blue darken-1" text  v-if="e1!=2" @click="e1 = e1+1" :disabled="grey">
                Siguiente
                <v-icon>mdi-chevron-right</v-icon>
            </v-btn>
            <v-btn color="primary" class="px-3" @click="save" :loading="gris" :disabled="gris || grey">
                Guardar
            </v-btn>
        </v-card-actions>
        <v-snackbar :color="snackbar.color" v-model="snackbar.show">
            {{ snackbar.message }}
        </v-snackbar>
    </v-card>
</template>

<script>
import axios from "axios";
import fiscal_catalogs from '../../../mixins/fiscal_catalogs'
    export default {
        mixins: [fiscal_catalogs],
        data: () => ({
            datePicker:false,
            days:['3', '15', '30', '45', '60', '90'],
            snackbar: {
                show: false,
                message: null,
                color: null
            },
            e1: 1,
            fiscales:false,
            gris:false,
            company:{
                birth_date:'',
                delivery_time:'',
                user_id:'',
                phase_id:'',
                origin_id:'',
                status_id:'',
                name:'',
                address:'',
                phone:'',
                email:'',
                rfc:'',
                razon_social:'',
                number:'',
                payment_method_id:'',
                payment_conditions:'',
                type_id:'',
                opportunity_area:'',
                frequency_id:'',
                consumptions:'',
                price_list_id:'',
                zone_id:'',
                delivery_address:'',
                contact_mode_id:'',
                special_conditions:'',
                special_note:'',
                cfdi_id:'',
                created_by_user_id:'',
                credit_limit:'',
                credit_days:'',
                bank_account_number:'',
                fiscal_address_json:{
                    street:'',
                    exterior:'',
                    interior:'',
                    neighborhood:'',
                    city:'',
                    municipality:'',
                    zip:'',
                    state:'',
                    country:'MEX'
                }
            },
            rules: {
                required: value => !!value || 'Campo requerido',
            },
            valid: true,
        }),
        props:{
            companyFromLead: Object
        },
        computed: {
            nosa(){
                if(this.company.razon_social!=undefined && (
                    this.company.razon_social.toLowerCase().includes('s.a. de c.v')||
                    this.company.razon_social.toLowerCase().includes('sa de cv')||
                    this.company.razon_social.toLowerCase().includes('sapi de cv')||
                    this.company.razon_social.toLowerCase().includes('sapi')||
                    this.company.razon_social.toLowerCase().includes('s.a de c.v')||
                    this.company.razon_social.toLowerCase().includes('s. c')||
                    this.company.razon_social.toLowerCase().includes('s.c')||
                    this.company.razon_social.toLowerCase().includes('s.a.s')||
                    this.company.razon_social.toLowerCase().includes('s. a. s')||
                    this.company.razon_social.toLowerCase().includes('rl de cv')
                )){
                    return true
                }else{
                    return false
                }
            },
            grey(){
                if( /*this.company.phase_id==''||this.company.phase_id==null||this.company.phase_id==undefined||
                    this.company.origin_id==''||this.company.origin_id==null||this.company.origin_id==undefined||
                    this.company.status_id==''||this.company.status_id==null||this.company.status_id==undefined||
                    */this.company.name==''||this.company.name==null||this.company.name==undefined){
                        return true
                }else{
                    return false
                }
            },
            cfdiLists(){
                return this.$store.state.cfdi.uses;
            },
            methodLists(){
                return this.$store.state.payment_method.payment_methods;
            },
            frequencyLists(){
                return this.$store.state.frequency.frequencies;
            },
            typeLists(){
                return this.$store.state.type.types;
            },
            priceLists(){
                return this.$store.state.price_list.price_lists;
            },
            zoneLists(){
                return this.$store.state.zone.zones;
            },
            mediumLists(){
                return this.$store.state.contact_mode.contact_modes;
            },
            categoryLists(){
                return this.$store.state.category.categories;
            },
            conditionLists(){
                return this.$store.state.special_condition.special_conditions;
            },
            usersLists(){
                return this.$store.state.user.users;
            },
            originLists(){
                return this.$store.state.origin.origins;
            },
            phaseLists(){
                return this.$store.state.phase.phases;
            },
            statusLists(){
                return this.$store.state.status.statuses;
            },
            currentUser:{
                get(){
                    return this.$store.state.currentUser.user
                }
            }
        },
        created(){
            this.$store.dispatch('currentUser/getUser')
            this.$store.dispatch('user/getUsers')
            this.$store.dispatch('origin/getOrigins')
            this.$store.dispatch('phase/getPhases')
            this.$store.dispatch('status/getStatuses')
            this.$store.dispatch('payment_method/getPaymentMethods')
            this.$store.dispatch('type/getTypes')
            this.$store.dispatch('zone/getZones')
            this.$store.dispatch('contact_mode/getContactModes')
            this.$store.dispatch('special_condition/getSpecialConditions')
            this.$store.dispatch('cfdi/getCfdi')
            this.$store.dispatch('price_list/getPriceLists')
            this.$store.dispatch('frequency/getFrequencies')
            this.$store.dispatch('cfdi/getCfdi')
            this.$store.dispatch('category/getCategories')
            if(this.companyFromLead!=undefined){
                this.company.name = this.companyFromLead.name
                this.company.origin_id = this.companyFromLead.origin_id
                this.company.phone = this.companyFromLead.phone
                this.company.email = this.companyFromLead.email
                this.company.special_note = this.companyFromLead.special_note
                this.company.user_id = this.companyFromLead.user_id
            }
        },
        methods: {
            permissions(permission){
                if(this.currentUser.id==1){
                    return true
                }else if(this.currentUser.permissions!=undefined){
                    if(this.currentUser.permissions.includes(permission)){
                        return true
                    }else{
                        return false
                    }
                }else{
                    return false
                }
            },
            close () {
                const company_name= this.company.name
                this.company = {
                    birth_date:'',
                    delivery_time:'',
                    user_id:'',
                    phase_id:'',
                    origin_id:'',
                    status_id:'',
                    name:'',
                    address:'',
                    phone:'',
                    email:'',
                    rfc:'',
                    razon_social:'',
                    number:'',
                    payment_method_id:'',
                    payment_conditions:'',
                    type_id:'',
                    opportunity_area:'',
                    frequency_id:'',
                    consumptions:'',
                    price_list_id:'',
                    zone_id:'',
                    delivery_address:'',
                    contact_mode_id:'',
                    special_conditions:'',
                    special_note:'',
                    cfdi_id:'',
                    created_by_user_id:'',
                    credit_limit:'',
                    credit_days:'',
                    bank_account_number:'',
                    fiscal_address_json:{
                        street:'',
                        exterior:'',
                        interior:'',
                        neighborhood:'',
                        city:'',
                        municipality:'',
                        zip:'',
                        state:'',
                        country:'MEX'
                    }
                }
                this.e1=1
                this.gris = false
                this.$nextTick(() => {
                    this.$emit("closeCreateDialogClient", company_name);
                })
            },
            save () {
                if(this.company.user_id==''||this.company.user_id==undefined||this.company.user_id==null){
                    this.company.user_id = this.currentUser.id
                }

                this.company.created_by_user_id = this.currentUser.id
                
                this.company.phone = (Number(this.company.phone.replace(/\s/g, ''))).toString()

                this.gris = true
                this.$nextTick(() => {
                    axios.post(process.env.VUE_APP_BACKEND_ROUTE + "api/v1/company/create",Object.assign(this.company)).then(response=>{
                        this.close()
                    }).catch(error => {
                        this.snackbar = {
                            message: error.response.data.message,
                            color: 'error',
                            show: true
                        }
                        this.gris = false
                    })
                })
                
            },
        },
    }
</script>
<style lang="css" scoped>
.v-text-field >>> label{
    font-size: 14px!important;
}
</style>
<style>
.v-input__icon--prepend-inner i::before {
    font-size: 18px!important;
    color:#1976D2;
}
.v-text-field input, .v-label {
    font-size: 14px;
}
.cretae_client .v-text-field__details{
    display: none !important;
}
</style>