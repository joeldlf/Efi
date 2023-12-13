<template>
    <div class="padding1" style="background:#f4f5fa; min-height:80vh;"> 
        <v-card style="background:transparent;" class="elevation-0 pb-4 padding2">
            <!-- Filtros -->
            <!--v-navigation-drawer style="top: 0px; max-height:100vh!important;" right v-model="filters" :clipped="$vuetify.breakpoint.lgAndUp" app>
                <filterCalendar @filtersUsers="filtersUsers"/>
            </v-navigation-drawer-->
            <!-- Header -->
            <v-card-title style="background:white;">Usuarios
                <v-tooltip right>
                    <template v-slot:activator="{ on, attrs }">
                        <v-icon v-bind="attrs" v-on="on" small class="ml-4">mdi-information-outline</v-icon>
                    </template>
                    <span>Right tooltip</span>
                </v-tooltip>
                <v-spacer></v-spacer>
                <v-btn  @click="createDialog=true" class="elevation-0" style="height:30px; font-size:13px; font-weight: 400; text-transform:capitalize; color: #1976d1; background-color: rgb(25 118 209 / 10%)!important;" color="primary" dark>Agregar Nuevo</v-btn>
            </v-card-title>
            <!-- Contenedor -->
            <v-data-table :headers="headers" :items="users" class="elevation-0 px-6 py-4"
                height="500"
                fixed-header
                :footer-props="{'items-per-page-options':[15, 30, 50, totalUsers]}"
                v-if="showTable"
                :options.sync="options"
                :server-items-length="totalUsers"
                :loading="loading">
                <!-- Acciones por fila -->
                <template v-slot:[`item.actions`]="{ item }">
                    <v-menu bottom left v-if="permissions('editActivities')==true || permissions('deleteActivities')==true">
                        <template v-slot:activator="{ on, attrs }">
                        <v-btn icon v-bind="attrs" v-on="on">
                            <v-icon>mdi-dots-vertical</v-icon>
                        </v-btn>
                        </template>
                        <v-list style="font-size:13px;">
                            <v-list-item @click="editItem(item.editedItem)" v-show="permissions('editActivities')">
                                <v-icon small class="mr-2">
                                    mdi-pencil
                                </v-icon>
                                Editar
                            </v-list-item>
                            <v-list-item @click="deleteItem(item)" v-show="permissions('deleteActivities')">
                                <v-icon small class="mr-2">
                                    mdi-delete
                                </v-icon>
                                Eliminar
                            </v-list-item>
                        </v-list>
                    </v-menu>
                </template>
                <!-- Tabla sin información -->
                <template v-slot:no-data>
                    No existen registros de usuarios aún
                </template>
                <template v-slot:[`item.name`]="{ item }">
                    <strong :style="'color:'+item.color+';'"> {{item.name}} </strong>
                </template>
            </v-data-table>
            <!-- Crear actividad -->
            <v-dialog v-model="createDialog" max-width="700px">
                <create @closeCreateDialog="closeCreateDialog"/>
            </v-dialog>
            <!-- Editar actividad -->
            <v-dialog v-model="editDialog" max-width="700px">
                <edit :editedItem="user" @closeEditDialog="closeEditDialog"/>
            </v-dialog>
            <!-- Dialogo confirmación -->
            <div class="text-center">
                <v-bottom-sheet  v-model="sheet" inset>
                    <v-sheet class="text-center" height="150px">
                        <div class="pt-6">
                        ¿Seguro que deseas borrar este usuario?
                        </div>
                        <v-btn class="mt-4" text color="error" @click="deleteUser()">
                        Eliminar
                        </v-btn>
                        <v-btn class="mt-4" text color="grey" @click="cancel()">
                        Cancelar
                        </v-btn>
                    </v-sheet>
                </v-bottom-sheet>
            </div>
            <v-snackbar :color="snackbar.color" v-model="snackbar.show">
                {{ snackbar.message }}
            </v-snackbar>
        </v-card>
    </div>
</template>

<script>
import axios from "axios";
import XLSX from 'xlsx';
import Create from "../users/create"
import Edit from "../users/edit"
export default {
    components: {
        'create':Create,
        'edit':Edit,
    }, 
    data: () => ({
        usersLength:0,
        showTable:true,
        totalUsers:0,
        users: [],
        options: {},
        loading: true,
        user:'',
        sheet: false,
        filters: false,
        editDialog: false,
        createDialog: false,
        deleteId:'',
        snackbar: {
            show: false,
            message: null,
            color: null
        },
    }),
    watch: {
        options: {
            handler () {
                this.getDataFromApi()
            },
            deep: true,
        },
    },
    computed: {
        currentUser:{
            get(){
                return this.$store.state.currentUser.user;
            }
        },
        headers(){ 
            return [
                { text: 'ID', value: 'id' },
                { text: 'Nombre', value: 'complete_name' },
                
                { text: 'Email', value: 'email' },
                { text: 'Teléfono', value: 'phone' },

                { text: 'Sucursal', value: 'branch' },

                { text: 'Departamento', value: 'job_position' },
                { text: 'Puesto', value: 'sub_job_position' },

                { text: 'Rol', value: 'role' },
                { text: 'Permisos', value: 'permissions' },

                { text: 'Ingreso', value: 'entry_date' },
                { text: 'Egreso', value: 'departure_date' },
                { text: 'Status', value: 'status' },

                { text: 'Cumpleaños', value: 'birth_date' },

                { value: 'actions', sortable: false, align: 'end', },
            ]
        },
    },
    methods: {
        getDataFromApi () {
            this.loading = true
            this.apiCall().then(data => {
                this.users = data.users
                this.totalUsers = data.total
                this.loading = false
            })
        },
        apiCall () {
            return new Promise((resolve, reject) => {
                const { sortBy, sortDesc, page, itemsPerPage } = this.options
                var users = []
                var total = 0
                var link = ''
                if (sortBy.length === 1 && sortDesc.length === 1) {
                        if(sortDesc[0]){
                            link = "&sort=-" + sortBy[0]
                        }else{
                            link = "&sort=" + sortBy[0]
                        }
                }
                axios.get(process.env.VUE_APP_BACKEND_ROUTE + "api/v2/users?" + link + "page=" + page + "&itemsPerPage=" + itemsPerPage).then(response => {
                    users = this.mapUsers(response.data.data)
                    total = response.data.meta.total
                    resolve({
                        users,
                        total,
                    })
                })
            })
        },
        mapUsers(users){
            return users.map(id=>{
                return{
                    id: id.id,
                    complete_name:id.name + ' ' + id.last,
                    role: id.role,
                    email: id.email, 
                    phone: id.phone,
                    entry_date: id.entry_date,
                    departure_date: id.departure_date,
                    birth_date: id.birth_date,
                    daily_salary: id.daily_salary,
                    color: id.color, 
                    job_position: id.job_position,
                    profile_photo_url: id.profile_photo_url,
                    status: id.status,
                    goal_amount: id.goal_amount,
                    comission_percentage: id.comission_percentage,          
                    sub_job_position: id.sub_job_position,
                    branch: id.branch.name,
                    editedItem:id
                }
            });
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
        filterUsers: function(params) {
            this.getDataFromApi()
        },
        closeEditDialog: function(params) {
            this.editDialog = false;
            this.getDataFromApi()
        },
        closeCreateDialog: function(params) {
            this.getDataFromApi()
            this.createDialog = false;
        },
        exportExcel: function () {
            let data = XLSX.utils.json_to_sheet(this.users)
            const workbook = XLSX.utils.book_new()
            const filename = 'Lista de Usuaios'
            XLSX.utils.book_append_sheet(workbook, data, filename)
            XLSX.writeFile(workbook, `${filename}.xlsx`)
        },
        deleteUser(){
            axios.delete(process.env.VUE_APP_BACKEND_ROUTE + "api/v2/users/"+this.deleteId).then(response => {
                this.deleteId = ''
                this.sheet = false
                
            }).catch(error => {
                this.snackbar = {
                    message: error.response.data.message,
                    color: 'error',
                    show: true
                }
            });
        },
        cancel(){
            this.deleteId = ''
            this.sheet = false
        },
        deleteItem (item) {
            this.deleteId = item.id
            this.sheet = true
        },
        editItem(item){
            this.user = [item].map(id=>{return{
                id:id.id,
                name:id.name,
                last:id.last,
                email:id.email,
                color:id.color,
                status:id.status,
                phone:id.phone,
                job_position:id.job_position,
                sub_job_position:id.sub_job_position,
                birth_date:id.birth_date,
                departure_date:id.departure_date,
                entry_date:id.entry_date,
                daily_salary:id.daily_salary,
                branch_id:id.branch_id,
            }})[0]
            this.editDialog = true
        },
    }
}
</script>