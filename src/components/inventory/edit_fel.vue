<template>    
    <v-card>
        <!-- Titulo del dialogo -->
        <v-card-title class="py-4">
            <span>Editar Producto</span>
        </v-card-title>

        <v-divider></v-divider>
            <!-- Formulario -->
        <v-form ref="form">
            <v-stepper v-model="e1" class="elevation-0">
                <v-stepper-header class="elevation-0" style="margin-bottom:-20px;">
                    <v-stepper-step style="font-weight:bolder!important;" :complete="e1 > 1" step="1"></v-stepper-step>
                    <v-divider></v-divider>
                    <v-stepper-step style="font-weight:bolder!important;" step="2"></v-stepper-step>
                </v-stepper-header>
                <v-stepper-items>
                    <v-stepper-content step="1" class="py-0">
                        <v-row class="py-0 px-6 ma-0">
                            <v-col cols="12" sm="6" md="6" class="my-0 pb-0 pt-0">
                                <v-text-field :rules="[v => !!v || 'Campo requerido']" v-model="editedItem.name" label="Nombre*"></v-text-field>
                                <v-text-field :rules="[v => !!v || 'Campo requerido']" v-model="editedItem.sat_key_code" label="Código SAT*"></v-text-field>
                                <v-text-field v-model="editedItem.code_one" label="Código 1"></v-text-field>
                                <v-text-field v-model="editedItem.code_two" label="Código 2"></v-text-field>
                                <v-text-field v-model="editedItem.code_three" label="Código 3"></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" md="6" class="my-0 pb-0 pt-0">
                                <v-autocomplete :rules="[v => !!v || 'Campo requerido']" v-model="editedItem.unit_id" :items="units" label="Unidad de Medida*" item-text="name" item-value="id">
                                    <template slot="no-data">
                                        <div class="px-6 pt-3">
                                            No existen unidades de medida relacionadas.
                                            <v-text-field v-model="createUnit.name" label="Nueva Unidad de Medida" append-icon="mdi-plus" @click:append="saveUnit()"></v-text-field>
                                        </div>
                                    </template>
                                </v-autocomplete>
                                <v-text-field :rules="[v => !!v || 'Campo requerido']" v-model="editedItem.price" label="Precio 1*"></v-text-field>
                                <v-text-field v-model="editedItem.price_two" label="Precio 2"></v-text-field>
                                <v-text-field v-model="editedItem.price_three" label="Precio 3"></v-text-field>
                                <v-text-field v-model="editedItem.price_four" label="Precio 4"></v-text-field>
                            </v-col>
                        </v-row>
                    </v-stepper-content>
                    <v-stepper-content step="2" class="pt-0">
                        <v-row class="py-0 px-6 ma-0">
                            <v-col cols="12" sm="6" md="4" class="my-0 pb-0 pt-0">
                                <v-text-field type="number" v-model="editedItem.ideal_inventory" label="Inventario Ideal"></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" md="4" class="my-0 pb-0 pt-0">
                                <v-autocomplete multiple v-model="editedItem.categories" :items="categories" label="Categoría" item-text="name" item-value="id">
                                    <template slot="no-data">
                                        <div class="px-6 pt-3">
                                            No existen categorías relacionadas.
                                            <v-text-field v-model="createCategory.name" label="Nueva Categoría" append-icon="mdi-plus" @click:append="saveCategory()"></v-text-field>
                                        </div>
                                    </template>
                                </v-autocomplete>
                                <v-text-field v-model="editedItem.weight" label="Peso" suffix="Kg"></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" md="4" class="my-0 pb-0 pt-0">
                                <v-autocomplete v-model="editedItem.provider_id" :items="providers" label="Proveedor" item-text="name" item-value="id">
                                    <template slot="no-data">
                                        <div class="px-6 pt-3">
                                            No existen proveedores relacionados.
                                            <v-text-field v-model="createProvider.name" label="Proveedor" append-icon="mdi-plus" @click:append="saveProvider()"></v-text-field>
                                        </div>
                                    </template>
                                </v-autocomplete>
                                <v-text-field type="number" v-model="editedItem.cost" label="Costo"></v-text-field>
                            </v-col>
                        </v-row>
                    </v-stepper-content>
                </v-stepper-items>
            </v-stepper>
        </v-form>
        <v-row class="ma-0 pa-0">
            <v-col cols="12" sm="12" md="4" class="mb-0 pb-0 pt-6">
                <v-dialog v-model="dialog" width="800">
                    <template v-slot:activator="{ on, attrs }">
                        <v-btn style="font-size:12px;" text v-bind="attrs" v-on="on">
                            <v-icon class="mr-2">mdi-attachment</v-icon> Fotografía
                        </v-btn>
                    </template>
                    <v-card>
                        <v-card-title>
                            <v-row>
                                <v-col v-for="(image, n) in editedItem.images" :key="n" class="d-flex child-flex" cols="1">
                                    <v-tooltip bottom>
                                        <template v-slot:activator="{ on, attrs }">
                                            <v-img :src="liga + 'files/items/'+image"
                                                aspect-ratio="1" class="grey lighten-2" v-bind="attrs" v-on="on">
                                                <template v-slot:placeholder>
                                                    <v-row class="fill-height ma-0" align="center" justify="center">
                                                        <v-progress-circular indeterminate color="grey lighten-5" ></v-progress-circular>
                                                    </v-row>
                                                </template>
                                                <v-btn small @click="deleteImage(n)" color="red" icon><v-icon>mdi-delete</v-icon></v-btn>
                                            </v-img>
                                        </template>
                                        <v-img width="350" height="auto" :src="liga + 'files/items/'+image"></v-img>
                                    </v-tooltip>
                                </v-col>
                            </v-row>
                        </v-card-title>
                        <vue-dropzone 
                            ref="myVueDropzone" 
                            id="dropzone" 
                            :options="dropzoneOptions" 
                            v-on:vdropzone-success="uploadSuccess" 
                            v-on:vdropzone-error="uploadError" 
                            v-on:vdropzone-removed-file="fileRemoved"/>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="blue darken-1" text @click="dialog=false">Terminar</v-btn>
                        </v-card-actions>
                    </v-card>
                    <v-snackbar :color="snackbar2.color" v-model="snackbar2.show">
                        {{ snackbar2.message }}
                    </v-snackbar>
                </v-dialog>
            </v-col>
            <v-col cols="12" sm="12" md="8" class="mb-0 pb-0 pl-0">
                <v-card-actions class="pb-6">
                    <v-spacer></v-spacer>
                    <v-btn color="red darken-1" text @click="close">Cancelar</v-btn>
                    <v-btn color="primary" text  v-if="e1>1" @click="e1 = e1-1">
                        <v-icon>mdi-chevron-left</v-icon>
                        Regresar
                    </v-btn>
                    <v-btn color="primary" text  v-if="e1!=2" @click="e1 = e1+1">
                        Siguiente
                        <v-icon>mdi-chevron-right</v-icon>
                    </v-btn>
                    <v-btn color="primary" class="elevation-0 px-4" rounded  :loading="gris" :disabled="gris || !valid" @click="save">Guardar</v-btn>
                </v-card-actions>
            </v-col>
        </v-row>
        <v-snackbar :color="snackbar.color" v-model="snackbar.show">
            {{ snackbar.message }}
        </v-snackbar>
    </v-card>
</template>
<script>
import axios from "axios";
import vue2Dropzone from "vue2-dropzone";
import "vue2-dropzone/dist/vue2Dropzone.min.css";
export default {
    components: {
        vueDropzone: vue2Dropzone,
    },  
    props:{
        editedItem:Object
    },
    data:()=>({ 
        e1: 1,
        dialog: false,
        dropzoneOptions: {
            url: process.env.VUE_APP_BACKEND_ROUTE + "api/v1/item/files",
            addRemoveLinks: true,
            thumbnailWidth: 150,
            dictDefaultMessage: 'Haz clic aquí o arrastra la(s) imagen(es) a subir.',
            dictFallbackMessage: "Tu navegador no puede subir archivos arrastarndolos a la pantalla.",
            dictFileTooBig: "File is too big ({{filesize}}MiB). Max filesize: {{maxFilesize}}MiB.",
            dictInvalidFileType: "No puede cargar archivos de este tipo.",
            dictCancelUpload: "Cancelar carga",
            dictCancelUploadConfirmation: "Estás seguro de que deseas cancelar esta carga?",
            dictRemoveFile: "Eliminar",
            dictMaxFilesExceeded: "No puedes subir más archivos.",
        },
        gris:false, 
        snackbar: {
            show: false,
            message: null,
            color: null
        },
        snackbar2: {
            show: false,
            message: null,
            color: null
        },
        index:0,
        disable:'',
        productTypes:[
            'Simple', 'Variable', 'Variación'
        ],
        types:[
            'Insumo', 'Fabricado', 'Producto Final'
        ],
        createCategory:{
            name:'',
        },
        createProvider:{
            name:'',
        },
        createUnit:{
            name:'',
        },
        rules: {
            required: value => !!value || 'Campo requerido',
        },
    }),
    watch:{
        editedItem:{
            handler(){
                console.log(this.editedItem)
                this.editedItem.unit_id = this.editedItem.unit.id
            }, deep:true
        }
    },
    created(){
        console.log(this.editedItem)
        this.editedItem.unit_id = this.editedItem.unit.id
    },
    computed:{
        valid(){
            if((this.editedItem.name!='' && this.editedItem.name!=null && this.editedItem.name!=undefined) &&
                (this.editedItem.sat_key_code!='' && this.editedItem.sat_key_code!=null && this.editedItem.sat_key_code!=undefined) &&
                (this.editedItem.unit_id!='' && this.editedItem.unit_id!=null && this.editedItem.unit_id!=undefined) &&
                (this.editedItem.price!='' && this.editedItem.price!=null && this.editedItem.price!=undefined)){
                return true
            }else{
                return false
            }
        },
        liga(){
            return process.env.VUE_APP_BACKEND_ROUTE
        },
        rawMaterials:{
            get(){
                return this.$store.state.raw_material.raw_materials
            }
        },
        currentUser:{
            get(){
                return this.$store.state.currentUser.user
            }
        },
        categories:{
            get(){
                return this.$store.state.category.categories;
            }
        },
        providers:{
            get(){
                return this.$store.state.provider.providers;
            }
        },
        units:{
            get(){
                return this.$store.state.unit.units;
            }
        }
    },
    methods:{
        add() {
            this.editedItem.raw_materials.push({percentage:'', raw_material_id:''});
        },
        remove(index) {
            this.editedItem.raw_materials.splice(index, 1);
        },
        close () {
            this.gris = false
            this.index = 0
            //this.$refs.myVueDropzone.removeAllFiles()
            this.dialog = false
            this.$nextTick(() => {
                this.$emit("closeDialogItem", false);
            })
        },
        save () {
            this.$nextTick(() => {
                var perro = this.editedItem
                axios.put(process.env.VUE_APP_BACKEND_ROUTE + "api/v1/item/update",Object.assign(this.editedItem)).then(response=>{
                    location.reload()
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
        saveCategory(){
            axios.post(process.env.VUE_APP_BACKEND_ROUTE + "api/v1/category/create",Object.assign(this.createCategory)).then(response=>{
                this.$store.dispatch('category/getCategories')
                this.disable = true
                this.createCategory.name=''
            }) 
        },
        saveProvider(){
            axios.post(process.env.VUE_APP_BACKEND_ROUTE + "api/v1/provider/create",Object.assign(this.createProvider)).then(response=>{
                this.$store.dispatch('provider/getProviders')
                this.disable = true
                this.createProvider.name=''
            }) 
        },
        saveUnit(){
            axios.post(process.env.VUE_APP_BACKEND_ROUTE + "api/v1/unit/create",Object.assign(this.createUnit)).then(response=>{
                this.$store.dispatch('unit/getUnits')
                this.disable = true
                this.createUnit.name=''
            }) 
        },
        uploadSuccess(file, response) {
            console.log('File Successfully Uploaded with file name: ' + response.file);
            this.fileName = response.file;
            this.editedItem.images[this.index] = this.fileName;
            this.index = this.index+1
        },
        uploadError(file, message) {
            console.log('error')
            this.snackbar2 = {
                message: message.message,
                color: 'error',
                show: true
            }
        },
        fileRemoved(file) {
            var name = this.editedItem.images.filter(image=>image.includes(file.name))[0]
            var index = this.editedItem.images.indexOf(name)
            this.editedItem.images.splice(index, 1);
            this.index = this.index-1
        },
        deleteImage(index) {
            if (confirm('Seguro que deseas eliminar esta imagen?')) {
                this.editedItem.images.splice(index, 1);
                this.index = this.index-1
            }
        }
    }
}
</script>