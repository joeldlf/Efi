<template>
    <div class="padding1" style="background:#f4f5fa; min-height:80vh;"> 
        <v-card style="background:transparent;" class="elevation-0 pb-4 padding2">
            <v-card-title style="background:white;">
                <v-icon class="mr-4" @click="closePermissions()">mdi-chevron-left</v-icon>
                Permisos
                <v-tooltip right>
                    <template v-slot:activator="{ on, attrs }">
                        <v-icon v-bind="attrs" v-on="on" small class="ml-4">mdi-information-outline</v-icon>
                    </template>
                    <span>Right tooltip</span>
                </v-tooltip>
                <v-spacer></v-spacer>
                <v-btn @click="save()" :disabled="disable_button" class="elevation-0" style="height:30px; font-size:13px; font-weight: 400; text-transform:capitalize; color: #1976d1; background-color: rgb(25 118 209 / 10%)!important;" color="primary" dark>Guardar</v-btn>
            </v-card-title>
            
            <div class="ma-0" style="background:white;">
                <v-text-field v-model="search" label="Buscar" rounded class="mx-4" outlined></v-text-field>
                <v-card class="py-4 px-6" v-for="(permission, index) in filteredPermissions" :key="index">
                    <v-row class="ma-0">
                    {{permission.category}}
                    <v-spacer/>
                    <v-btn @click="selectAll(permission.permissions)" text style="margin-top:-2px;" x-small color="primary">Seleccionar Todo</v-btn>
                    <v-btn @click="clean(permission.permissions)" text style="margin-top:-2px;" x-small color="grey">Limpiar</v-btn>
                    </v-row>
                    <v-row class="ma-0 mt-2">
                        <v-chip small class="ma-2" v-for="(permission, index) in permission.permissions" :key="index" @click="addRemovePermission(permission.value)" :color="isSelected(permission.value) ? 'primary' : ''">
                            {{permission.text}}
                        </v-chip>
                    </v-row>
                </v-card>
            </div>
        </v-card>

        <v-snackbar :color="snackbar.color" v-model="snackbar.show">
            {{ snackbar.message }}
        </v-snackbar>
    </div>
</template>
<script>
import XLSX from 'xlsx';
import axios from "axios";
export default {
    props:{
        role:Object
    },
    data:()=>({
        search:'',
        dialog:false,
        snackbar: {
            show: false,
            message: null,
            color: null
        },
        disable_button:false,
    }),
    created(){
        this.$store.dispatch('permission/getPermisssions')
    },
    methods:{
        clean(permissions){
            for(var i=0; i<permissions.length; i++){
                if(this.isSelected(permissions[i].value)){
                    this.role.permissions = this.role.permissions.filter(p=>p != permissions[i].value)
                }
            }
        },
        selectAll(permissions){
            for(var i=0; i<permissions.length; i++){
                if(!this.isSelected(permissions[i].value)){
                    this.role.permissions.push(permissions[i].value)
                }
            }
        },
        addRemovePermission(permission){
            if(this.isSelected(permission)){
                this.role.permissions = this.role.permissions.filter(p=>p != permission)
            }else{
                this.role.permissions.push(permission)
            }
        },
        isSelected(permission){
            if(this.role.permissions.indexOf(permission)>-1){
                return true
            }else{
                return false
            }
        },
        save(){
            this.disable_button = true
            axios.post(process.env.VUE_APP_BACKEND_ROUTE + "api/v2/roles/" + this.role.id + "/sync_permissions",{permissions:this.role.permissions})
            .then(response => {
                this.$store.dispatch('role/getRoles')
                this.disable_button = false
                this.snackbar = {
                    message: 'Permisos del rol ' + this.role.name + ' modificados con éxito',
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
        closePermissions(){
            this.$emit("closePermissions");
        }
    },
    computed:{
        filteredPermissions(){
            if(this.search!=''){
                return this.permissions.filter(permission=>permission.category.toLowerCase().includes(this.search.toLowerCase())||permission.permissions.filter(p=>p.text.toLowerCase().includes(this.search.toLowerCase())).length>0)
            }else{
                return this.permissions
            }
        },
        permissions(){
            return this.$store.state.permission.permissions.reduce((result, currentItem) => {
                const categoryIndex = result.findIndex(categoryItem => categoryItem.category === currentItem.category);
                
                if (categoryIndex === -1) {
                    result.push({
                        category: currentItem.category,
                        permissions: [{ text: currentItem.label, value: currentItem.name }]
                    });
                } else {
                    result[categoryIndex].permissions.push({ text: currentItem.label, value: currentItem.name });
                }
                
                return result;
            }, []);
        }
    },
}
</script>