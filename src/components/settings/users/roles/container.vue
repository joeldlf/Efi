<template>
    <div class="padding1" style="background:#f4f5fa; min-height:80vh;" v-if="!permissions_module"> 
        <v-card style="background:transparent;" class="elevation-0 pb-4 padding2">
            <v-card-title style="background:white;">Roles
                <v-tooltip right>
                    <template v-slot:activator="{ on, attrs }">
                        <v-icon v-bind="attrs" v-on="on" small class="ml-4">mdi-information-outline</v-icon>
                    </template>
                    <span>Right tooltip</span>
                </v-tooltip>
                <v-spacer></v-spacer>
                <v-btn @click="add_role=true" class="elevation-0" style="height:30px; font-size:13px; font-weight: 400; text-transform:capitalize; color: #1976d1; background-color: rgb(25 118 209 / 10%)!important;" color="primary" dark>Agregar Nuevo</v-btn>
            </v-card-title>
            <div class="ma-0" style="background:white;">
                <v-text-field v-model="search" label="Buscar" rounded class="mx-4" outlined></v-text-field>
                <v-card class="py-4 px-6" v-for="(role, index) in roles" :key="index" @click="managePermissions(role)">
                    <v-row class="ma-0">
                    {{role.name}}
                    <v-spacer/>
                    <v-icon>mdi-chevron-right</v-icon>
                    </v-row>
                </v-card>
                <v-card class="py-4 px-6" v-if="add_role">
                    <v-text-field v-model="new_role" label="Nombre del Rol" rounded class="mx-4" outlined></v-text-field>
                    <v-btn :disabled="disable_button" @click="save()">Guardar</v-btn>
                </v-card>
            </div>
        </v-card>
        <v-snackbar :color="snackbar.color" v-model="snackbar.show">
            {{ snackbar.message }}
        </v-snackbar>
    </div>
    <div v-else>
        <permissions :role="selected_role" @closePermissions="closePermissions()"/>
    </div>
</template>
<script>
import axios from "axios";
import Permissions from "../roles/permissions.vue"
export default {
    components:{
        'permissions':Permissions
    },
    data:()=>({
        selected_role:undefined,
        permissions_module:false,
        new_role:'',
        add_role:false,
        search:'',
        snackbar: {
            show: false,
            message: null,
            color: null
        },
        disable_button:false
    }),
    created(){
        this.$store.dispatch('role/getRoles')
    },
    computed:{
        roles(){
            return this.$store.state.role.roles.filter(role=>role.name.toLowerCase().includes(this.search.toLowerCase()))
        }
    },
    methods:{
        save(){
            this.disable_button = true
            axios.post(process.env.VUE_APP_BACKEND_ROUTE + "api/v2/roles", {name: this.new_role})
            .then(response => {
                this.roles.push(response.data)
                this.add_role = false
                this.new_role = ''
                this.disable_button = false
                this.snackbar = {
                    message: 'Rol generado con éxito',
                    color: 'success',
                    show: true
                }
            })
            .catch(error=>{
                this.snackbar = {
                    message: error.response.data.message,
                    color: 'error',
                    show: true
                }
                this.disable_button = false
            });
        },
        managePermissions(role){
            this.selected_role = [role].map(id=>{return{
                id:id.id,
                name:id.name,
                permissions:id.permissions.map(permission=>permission.name)
            }})[0]
            this.permissions_module = true
        },
        closePermissions(){
            this.permissions_module = false
            this.selected_role = undefined  
        }
    }
}
</script>