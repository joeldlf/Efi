<template>
    <v-container style="max-width:100vw;">
        <!-- Filtros -->
        <v-navigation-drawer style="top: 0px; max-height:100vh!important;" right v-model="filters" :clipped="$vuetify.breakpoint.lgAndUp" app>
            <filterSales v-bind:company="company" @filtersSale="filtersSale"/>
        </v-navigation-drawer>
        <!-- Totalizadores -->
        <totals v-if="this.company==undefined"/>
        <!--header-->
        <v-toolbar flat class="px-4 pt-3">
            <v-toolbar-title>
                Ventas
                <br/>
                <span style="font-size:12px; color:grey; position: absolute;" v-if="filterStorage()">Mes Actual</span>
            </v-toolbar-title>


            <v-btn icon class="ml-6 pt-2" v-if="filterStorageLength== undefined" @click="openFilter()">
                <v-icon>mdi-filter</v-icon>
            </v-btn>


             <v-btn icon class="ml-6" v-else @click="openFilter()">
                <v-badge overlap color="primary">
                    <template v-slot:badge>
                        {{filterStorageLength}}
                    </template>
                    <v-icon>mdi-filter</v-icon>
                </v-badge>
            </v-btn>
            <!--v-btn icon>
                <v-icon @click="tableGraph=false" v-if="tableGraph">mdi-chart-bell-curve-cumulative</v-icon>
                <v-icon @click="tableGraph=true" v-else>mdi-periodic-table</v-icon>
            </v-btn-->
            <v-spacer></v-spacer>
            <v-btn icon v-show="permissions('download')">
                <v-icon @click="exportExcel">mdi-download</v-icon>
            </v-btn>
        </v-toolbar>
        <!-- Tabla -->
        <v-data-table 
        height="600"
        fixed-header
        :footer-props="{'items-per-page-options':[15, 30, 50, salesLength]}"
        v-if="showTable && tableGraph"
        :headers="headers" 
        :items="sales"
        class="elevation-0 px-6 pb-4 pt-10"
        :options.sync="options"
        :server-items-length="totalSales"
        :loading="loading"
        :item-class="itemRowBackground" 
        show-expand>

                <template v-slot:[`item.total`]="{ item }">
                    {{(item.total*1).toLocaleString('es-MX', { style: 'currency', currency: 'MXN',})}}
                </template>
                <template v-slot:[`item.subtotal`]="{ item }">
                    {{(item.subtotal*1).toLocaleString('es-MX', { style: 'currency', currency: 'MXN',})}}
                </template>
                <template v-slot:[`item.iva`]="{ item }">
                    {{(item.iva*1).toLocaleString('es-MX', { style: 'currency', currency: 'MXN',})}}  
                </template>
                

            <template v-slot:[`item.printed`]="{ item }">
                <v-icon v-if="item.printed!=true" color="grey"> mdi-close </v-icon>
                <v-icon v-else color="primary"> mdi-check </v-icon>
            </template>
            <!-- Acciones por fila -->
            <template v-slot:[`item.actions`]="{ item }">
                <v-menu bottom left>
                    <template v-slot:activator="{ on, attrs }">
                    <v-btn icon v-bind="attrs" v-on="on">
                        <v-icon>mdi-dots-vertical</v-icon>
                    </v-btn>
                    </template>
                    <v-list style="font-size:13px;">
                        <!--v-tooltip left v-if="item.production_dispatched">
                            <template v-slot:activator="{ on, attrs }">
                                <v-list-item v-bind="attrs" v-on="on">
                                    <v-list-item disabled class="px-0">
                                        <v-icon small class="mr-2">
                                            mdi-pencil
                                        </v-icon>
                                        Editar
                                    </v-list-item>
                                </v-list-item>
                            </template>
                            <span>Esta venta ya se surtió</span>
                        </v-tooltip>
                        <v-tooltip left v-else-if="item.is_in_production">
                            <template v-slot:activator="{ on, attrs }">
                                <v-list-item v-bind="attrs" v-on="on">
                                    <v-list-item disabled class="px-0">
                                        <v-icon small class="mr-2">
                                            mdi-pencil
                                        </v-icon>
                                        Editar
                                    </v-list-item>
                                </v-list-item>
                            </template>
                            <span>Esta venta esta en producción</span>
                        </v-tooltip-->

                        <v-list-item @click="generateInvoice(item)" v-show="permissions('generateInvoice')" v-if="(item.facturapi_invoices!=undefined && item.facturapi_invoices.length<1) || permissions('regenerateInvoice')">
                            <v-icon small class="mr-2">
                                mdi-file-document
                            </v-icon>
                            Generar Factura
                        </v-list-item>


                        <v-list-item @click="editItem(item.id)" v-show="permissions('editSales')">
                            <v-icon small class="mr-2">
                                mdi-pencil
                            </v-icon>
                            Editar
                        </v-list-item>

                        <v-tooltip left v-if="item.production_dispatched" v-show="permissions('deleteSales')">
                            <template v-slot:activator="{ on, attrs }">
                                <v-list-item v-bind="attrs" v-on="on">
                                    <v-list-item :disabled="true" class="px-0">
                                        <v-icon small class="mr-2">
                                            mdi-delete
                                        </v-icon>
                                        Eliminar
                                    </v-list-item>
                                </v-list-item>
                            </template>
                            <span>Esta venta ya se surtió</span>
                        </v-tooltip>
                        <v-tooltip left v-else-if="item.is_in_production" v-show="permissions('deleteSales')">
                            <template v-slot:activator="{ on, attrs }">
                                <v-list-item v-bind="attrs" v-on="on">
                                    <v-list-item :disabled="true" class="px-0">
                                        <v-icon small class="mr-2">
                                            mdi-delete
                                        </v-icon>
                                        Eliminar
                                    </v-list-item>
                                </v-list-item>
                            </template>
                            <span>Esta venta esta en producción</span>
                        </v-tooltip>
                        <v-list-item v-else @click="deleteItem(item)" v-show="permissions('deleteSales')">
                            <v-icon small class="mr-2">
                                mdi-delete
                            </v-icon>
                            Eliminar
                        </v-list-item>

                        <v-list-item @click="sendEmail(item.id)">
                            <v-icon small class="mr-2">
                                mdi-email
                            </v-icon>
                            Enviar Venta por Correo
                        </v-list-item>
                        <v-list-item @click="sendInvoiceEmail(item)" v-if="item.facturapi_invoices!=undefined && item.facturapi_invoices.length>=1">
                            <v-icon small class="mr-2">
                                mdi-email
                            </v-icon>
                            Enviar Factura por Correo
                        </v-list-item>
                        <v-list-item @click="printTicket(item)" v-show="permissions('printTicket')==true"><!--item.printed!=true && -->
                            <v-icon small class="mr-2">
                                mdi-printer
                            </v-icon>
                            Imprimir ticket
                        </v-list-item>

                        <v-list-item @click="rejection(item)">
                            <v-list-item class="px-0">
                                <v-icon small class="mr-2">
                                    mdi-close
                                </v-icon>
                                Cancelar
                            </v-list-item>
                        </v-list-item>

                    </v-list>
                </v-menu>
            </template>
            <!-- Tabla sin información -->
            <template v-slot:no-data>
                No existen registros de ventas aún
            </template>
            <!-- Empresa -->
            <template v-slot:[`item.company_id`]="{ item }">
                <v-list-item class="px-0" style="min-height:0px!important; font-size:14px;" :to="{ path: '/clients/client/'+ item.companyID}">{{item.company_id}}</v-list-item>
            </template>

            <template v-slot:[`item.collections_date`]="{ item }">
                <div v-for="(date, index) in item.collections_date" v-bind:key="index"><span>{{date.date}}</span><br/></div>
            </template>
            <!-- Envio -->
            <template v-slot:[`item.shipping_date`]="{ item }">
                <span v-if="item.shipping_date!=undefined&&item.shipping_date!=null">{{item.shipping_date}}</span>
                <span v-else-if="item.production_dispatched==1&&(item.shipping_date==null||item.shipping_date==undefined)&&item.bar!=1">En envío</span>
                <span v-else-if="item.production_dispatched!=1">No surtido</span>
                <span v-else-if="item.production_dispatched==1&&(item.shipping_date==null||item.shipping_date==undefined)&&item.bar">{{item.date}}</span>
            </template>
            <template v-slot:[`item.production_dispatched`]="{ item }">
                <v-icon v-if="item.production_dispatched==true">mdi-check</v-icon>
                <v-icon v-else>mdi-close</v-icon>
            </template>
            <!-- Mostrador -->
            <template v-slot:[`item.bar`]="{ item }">
                <v-icon v-if="item.bar==true">mdi-check</v-icon>
                <v-icon v-else>mdi-close</v-icon>
            </template>
            <!-- Detalle PC -->
            <template v-slot:expanded-item="{ headers, item }">
                <td :colspan="headers.length" class="pb-4"><!-- v-if="permissions('sale_details')"-->
                    <v-row class="pa-6 pb-0">
                        <v-col cols="12" sm="6" md="6">
                            <v-data-table hide-default-footer :items-per-page="item.items.length" :headers="headers2" :items="item.items" v-if="item.items!=undefined" class="elevation-0" style="background: #f7f7f7;!important" dense>
                                <template v-slot:footer>
                                    <v-container style="max-width: 100%!important;">

                                        <v-tooltip right v-if="item.production_dispatched && liga!='https://backendbdb.unocrm.mx/'">
                                            <template v-slot:activator="{ on, attrs }">
                                                <span v-bind="attrs" v-on="on">
                                                    <v-btn :disabled="item.is_in_production==1" small class="elevation-0" color="primary" rounded @click="addProduct(item.id)"> Agregar Producto</v-btn>
                                                </span>
                                            </template>
                                            <span>Esta venta ya se surtió</span>
                                        </v-tooltip>
                                        <v-tooltip right v-else-if="item.is_in_production && liga!='https://backendbdb.unocrm.mx/'">
                                            <template v-slot:activator="{ on, attrs }">
                                                <span v-bind="attrs" v-on="on">
                                                    <v-btn :disabled="item.is_in_production==1" small class="elevation-0" color="primary" rounded @click="addProduct(item.id)"> Agregar Producto</v-btn>
                                                </span>
                                            </template>
                                            <span>Esta venta esta en producción</span>
                                        </v-tooltip>
                                        <v-btn v-else-if="liga!='https://backendbdb.unocrm.mx/'" :disabled="item.is_in_production==1" small class="elevation-0" color="primary" rounded @click="addProduct(item.id)"> Agregar Producto</v-btn>

                                        <v-divider vertical class="mx-2"></v-divider>
                                        <a style="text-decoration:none" :href="'https://www.google.com.mx/maps/place/' + item.delivery_address + '/@'" target="_blank" class="mx-3">
                                            <v-icon class="mr-4">mdi-map-marker-outline</v-icon>
                                            <span>{{item.delivery_address}}</span>
                                        </a>

                                        

                                    </v-container>
                                </template> 
                                <template v-slot:[`item.item`]="{ item }">
                                    {{ item.item.name }}
                                </template>
                                <template v-slot:[`item.macro`]="{ item }">
                                    <span v-if="liga == 'https://suministros.uno/'">{{ item.item.macro }}</span>
                                    <span v-else-if="liga == 'https://backend.ferreteriaenlinea.com/'">{{ item.item.code_one }}</span>
                                </template>
                                <template v-slot:[`item.value`]="{ item }">
                                    {{ (item.value*1).toLocaleString('es-MX', { style: 'currency', currency: 'MXN',}) }}
                                </template>
                                <template v-slot:[`item.price`]="{ item }">
                                    {{ (item.price*1).toLocaleString('es-MX', { style: 'currency', currency: 'MXN',}) }} 
                                </template>
                                <template v-slot:[`item.total`]="{ item }">
                                    {{ (item.price*item.quantity).toLocaleString('es-MX', { style: 'currency', currency: 'MXN',}) }}
                                </template>
                                <template v-slot:[`item.weight`]="{ item }">
                                    {{ item.item.weight }} kg
                                </template>
                                <template v-slot:[`item.totalWeight`]="{ item }">


                                    <span v-if="item.item!=undefined && item.item.unit!=undefined && item.item.unit.name=='Kilo'">{{ item.item.weight*item.quantity }} kgs</span>
                                    <span v-else-if="item.item!=undefined && item.item.unit!=undefined && item.item.unit.name=='Pieza'">{{ item.quantity }} pzas</span>

                                    <span v-else>{{ item.quantity }} </span>

                                    <span v-if="item.rejection_status!=null">({{item.rejection_status}})</span>


                                </template>
                                <template v-slot:[`item.cost`]="{ item }">
                                    {{ (item.cost*1).toLocaleString('es-MX', { style: 'currency', currency: 'MXN',}) }} 
                                </template>
                                <template v-slot:[`item.total_cost`]="{ item }">
                                    {{ (item.cost*item.quantity).toLocaleString('es-MX', { style: 'currency', currency: 'MXN',}) }} 
                                </template>
                                <template v-slot:[`item.utility_per_item`]="{ item }">
                                    {{ ((item.price*1)-(item.cost*1)).toLocaleString('es-MX', { style: 'currency', currency: 'MXN',}) }} 
                                </template>
                                <template v-slot:[`item.utility`]="{ item }">
                                    {{ ((item.price*item.quantity)-(item.cost*item.quantity)).toLocaleString('es-MX', { style: 'currency', currency: 'MXN',}) }} 
                                </template>

                                 <!-- Acciones por fila -->
                                <template v-slot:[`item.actions`]="{ item }">
                                    <v-menu bottom left>
                                        <template v-slot:activator="{ on, attrs }">
                                        <v-btn icon v-bind="attrs" v-on="on">
                                            <v-icon>mdi-dots-vertical</v-icon>
                                        </v-btn>
                                        </template>
                                        <v-list style="font-size:13px;">
                                            <v-tooltip left v-if="item.production_dispatched">
                                                <template v-slot:activator="{ on, attrs }">
                                                    <v-list-item v-bind="attrs" v-on="on">
                                                        <v-list-item disabled class="px-0">
                                                            <v-icon small class="mr-2">
                                                                mdi-pencil
                                                            </v-icon>
                                                            Editar
                                                        </v-list-item>
                                                    </v-list-item>
                                                </template>
                                                <span>Esta venta ya se surtió</span>
                                            </v-tooltip>
                                            <v-tooltip left v-else-if="item.is_in_production">
                                                <template v-slot:activator="{ on, attrs }">
                                                    <v-list-item v-bind="attrs" v-on="on">
                                                        <v-list-item disabled class="px-0">
                                                            <v-icon small class="mr-2">
                                                                mdi-pencil
                                                            </v-icon>
                                                            Editar
                                                        </v-list-item>
                                                    </v-list-item>
                                                </template>
                                                <span>Esta venta esta en producción</span>
                                            </v-tooltip>
                                            <v-list-item v-else @click="editDetail(item.id)" v-show="permissions('editSaleDetail')">
                                                <v-icon small class="mr-2">
                                                    mdi-pencil
                                                </v-icon>
                                                Editar
                                            </v-list-item>

                                            <v-tooltip left v-if="item.production_dispatched">
                                                <template v-slot:activator="{ on, attrs }">
                                                    <v-list-item v-bind="attrs" v-on="on">
                                                        <v-list-item :disabled="true" class="px-0">
                                                            <v-icon small class="mr-2">
                                                                mdi-delete
                                                            </v-icon>
                                                            Eliminar
                                                        </v-list-item>
                                                    </v-list-item>
                                                </template>
                                                <span>Esta venta ya se surtió</span>
                                            </v-tooltip>
                                            <v-tooltip left v-else-if="item.is_in_production">
                                                <template v-slot:activator="{ on, attrs }">
                                                    <v-list-item v-bind="attrs" v-on="on">
                                                        <v-list-item :disabled="true" class="px-0">
                                                            <v-icon small class="mr-2">
                                                                mdi-delete
                                                            </v-icon>
                                                            Eliminar
                                                        </v-list-item>
                                                    </v-list-item>
                                                </template>
                                                <span>Esta venta esta en producción</span>
                                            </v-tooltip>
                                            <v-list-item v-else @click="deleteDetail(item.id)" v-show="permissions('deleteSaleDetail')">
                                                <v-icon small class="mr-2">
                                                    mdi-delete
                                                </v-icon>
                                                Eliminar
                                            </v-list-item>

                                            
                                            

                                            <!--v-btn outlined rounded color="red" class="mt-4"  style="font-size:12px; height:30px!important; margin-left: auto; margin-right: auto; display: block;">Cancelar</v-btn-->
                                        </v-list>
                                    </v-menu>
                                </template>
                            </v-data-table>
                        </v-col>
                        <v-col cols="12" sm="6" md="3" class="px-6">
                            <div class="px-4 py-3" style="background-color:#ffedb3; border-radius: 0px 10px 10px 10px; min-height:120px;" >
                                <strong>Notas:</strong><br>
                                <span>{{item.note}}</span>
                            </div>
                        </v-col>
                        <v-col cols="12" sm="6" md="1">
                            <v-btn v-if="item.pdf2!=undefined" v-bind:href="liga + 'files/' + item.pdf2" target="_blank" class="elevation-0" rounded color="primary">
                                <v-icon small>mdi-file-document-outline</v-icon> OC
                                
                            </v-btn>
                            <v-btn v-if="item.facturapi_invoices!=undefined && item.facturapi_invoices.length>0" @click="downloadInvoice(item.facturapi_invoices)" target="_blank" outlined rounded color="primary">
                                <v-icon small>mdi-file-document-outline</v-icon> Factura
                            </v-btn>
                            <v-btn v-if="item.pdf!=''&&item.pdf!=null&&item.pdf!=undefined&&item.pdf.length>0" v-bind:href="liga + 'files/' + item.pdf" target="_blank" outlined rounded color="primary">
                                <v-icon small>mdi-file-document-outline</v-icon> Factura Envío
                            </v-btn>
                        </v-col>
                    </v-row>
                </td>
            </template>
        </v-data-table>
        <!-- Grafica>
        <v-card class="elevation-0" v-if="showTable && tableGraph==false"> 
        </v-card-->
        <!-- Crear venta -->
        <v-dialog v-model="createDialog" max-width="900px">
          <template v-slot:activator="{ on, attrs }">
            <v-btn bottom color="#e25200" dark fab fixed right v-bind="attrs" v-on="on">
                <v-icon color="white">  mdi-plus </v-icon>
            </v-btn> 
          </template>
          <create v-bind:message="[company, statusss]" @closeCreateDialogQuotation="closeCreateDialogQuotation"/>
        </v-dialog>
        <!-- Editar venta -->
        <v-dialog v-model="editDialog" max-width="650px">
          <edit v-bind:quotation="sale" @closeDialogEditQuotation="closeDialogEditQuotation"/>
        </v-dialog>
        <!-- Enviar email -->
        <v-dialog v-model="emailDialog" max-width="700px">
          <email v-bind:quotation="sale" @closeDialogEmailQuotation="closeDialogEmailQuotation"/>
        </v-dialog>
        <!-- Enviar factura -->
        <v-dialog v-model="invoiceEmailDialog" max-width="700px">
            <v-card v-if="invoiceEmailDialog" class="py-5">
                <v-row class="ma-0">
                    <v-spacer/>
                        <v-card-title>Selecciona el correo al que enviaras la factura B-{{invoice_to_send.facturapi_invoices[0].folio_number}}</v-card-title>
                    <v-spacer/>
                </v-row>

                <v-row class="ma-0">
                    <v-spacer/>
                    <v-text-field v-model="invoice_to_send.company.attributes.fiscal_email" label="Email"></v-text-field>
                    <v-spacer/>
                </v-row>

                <v-card-actions>
                    <v-row class="ma-0">
                        <v-spacer/>
                        <v-btn @click="sendInovice()" rounded color="primary" class="elevation-0">Enviar</v-btn>
                        <v-spacer/>
                    </v-row>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <!-- Dialogo confirmación de eliminación -->
        <div class="text-center">
            <v-bottom-sheet  v-model="sheet" inset>
                <v-sheet class="text-center" height="150px">
                    <div class="pt-6">
                    ¿Seguro que deseas borrar esta venta?
                    </div>
                    <v-btn class="mt-4" text color="error" @click="deleteSale()">
                    Eliminar
                    </v-btn>
                    <v-btn class="mt-4" text color="grey" @click="cancel()">
                    Cancelar
                    </v-btn>
                </v-sheet>
            </v-bottom-sheet>
        </div>
        <!-- Dialogo confirmación de cambio de estatus -->
        <div class="text-center">
            <v-bottom-sheet  v-model="sheet2" inset>
                <v-sheet class="text-center" height="150px">
                    <div class="pt-6">
                    ¿Seguro que deseas cambiar el estatus de esta cotización a "Cancelación"?
                    </div>
                    <v-btn class="mt-4" text color="primary" @click="confirmRejection()">
                    Si
                    </v-btn>
                    <v-btn class="mt-4" text color="grey" @click="cancel()">
                    No
                    </v-btn>
                </v-sheet>
            </v-bottom-sheet>
        </div>
        <!-- Motivo de Rechazo -->
        <v-dialog v-model="rejectionDialog" max-width="800px">
            <v-card class="px-12 pb-6 pt-8 elevtion-0" style="background-color:white;">
                Motivo de Rechazo:

                <v-autocomplete clearable v-model="editedItem.rejection_id" :items="rejectionsLists" label="Motivo de Cancelación" item-text="name" item-value="id">
                    <template slot="no-data" class="pa-2">No existen motivos relacionados.</template>                      
                </v-autocomplete>
                <v-textarea v-model="editedItem.rejection_comment" label="Descripcion"></v-textarea>

                <br>Inventario:<br>

                <v-list-item v-for="(item, i) in editedItem.items" :key="i" style="border-bottom:solid 1px grey;">
                    <v-list-item-content>
                        <span>{{item.quantity}} <span v-if="item.item.unit!=undefined">{{item.item.unit.name}}</span> | {{item.item.name}}</span>
                    </v-list-item-content>
                    <v-list-item-action style="width:200px!important">
                        <v-select :items="merma" v-model="item.rejection_status" label="Merma/Devolción" x-small rounded dense outlined></v-select>
                    </v-list-item-action>
                </v-list-item>
                
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" class="mt-3" text @click="rejectionDialog=false">
                        Cancelar
                    </v-btn>
                    <v-btn color="blue darken-1" class="mt-3" text @click="saveRejection" :disabled="disbaledCancellation || process_cancelation" :loading="process_cancelation">
                        Guardar
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <!-- corte mostrador -->
        <v-snackbar :color="snackbar.color" v-model="snackbar.show">
            {{ snackbar.message }}
        </v-snackbar>
        <!-- Editar detalle de venta -->
        <v-dialog v-model="editDialogDetail" max-width="650px">
          <edit-detail v-bind:editedDetail="editedDetail" @closeDialogEditDetail="closeDialogEditDetail"/>
        </v-dialog>
        <!-- Agregar detalle de venta -->
        <v-dialog v-model="addDialogDetail" max-width="650px">
          <add-detail v-bind:addDetail="addDetail" @closeDialogAddDetail="closeDialogAddDetail"/>
        </v-dialog>

        <v-dialog v-model="filterMobile" fullscreen hide-overlay transition="dialog-bottom-transition">
            <filterSales style="background:white;" v-bind:company="company" @filtersSale="filtersSale"/>
        </v-dialog>

        <!-- Dialogo ticket POS -->
        <v-dialog v-model="dialogTicket" max-width="350px">
            <bdbTicket v-if="liga == 'https://backendbdb.unocrm.mx/'" @cerrar="cerrarTicket" v-bind:ticket="ticket"/>
            <ticket v-else @cerrar="cerrarTicket" v-bind:ticket="ticket"></ticket>
        </v-dialog> 

        <!-- Dialogo Factura -->
        <v-dialog v-model="invoice_dialog" max-width="800px">
            <invoice @cerrarInvocie="cerrarInvocie" v-bind:invoice="invoice"></invoice>
        </v-dialog> 

    </v-container>
</template>

<script>
import Invoice from "../sales/invoice"
import Totals from "../sales/totals"
import moment from 'moment';
import axios from "axios";
import XLSX from 'xlsx';
import Filter from "../sales/filter"
import Create from "../quotations/create"
import Edit from "../quotations/edit"
import Email from "../quotations/sendQuotation"
import EditDetail from "../sales/detail/edit"
import AddDetail  from "../sales/detail/create"
import Ticket from "../pos/Ticket"
import BdbTicket from "../pos/BdbTicket"
export default {
    props:{
        company:String
    },
    components: {
        'filterSales':Filter,
        'create':Create,
        'edit':Edit,
        'email':Email,
        'totals':Totals,
        'edit-detail':EditDetail,
        'add-detail':AddDetail,
        'ticket':Ticket,
        'bdbTicket':BdbTicket,
        'invoice':Invoice
    }, 
    data: () => ({
        invoiceEmailDialog:false,
        invoice_to_send:{},
        invoice:{},
        invoice_dialog:false,
        dialogTicket:false,
        ticket:{},
        salesLength:0,
        filterMobile:false,
        editDialogDetail:false,
        addDialogDetail:false,
        editedDetail:'',
        addDetail:'',
        merma:['Merma', 'Devolución'],
        editedItem:{
            id:'',
            status:'',
            rejection_comment:'',
            rejection_id:'',
            items: [],
            last_updated_by_user_id:''
        },
        totals:'',
        process_cancelation:false,
        editedBarSales:'',
        searchInput:'',
        tableGraph:true,
        showTable:true,
        totalSales: 0,
        sales: [],
        loading: true,
        options: {},
        snackbar: {
            show: false,
            message: null,
            color: null
        },
        gris:false,
        statusss:'vendido',
        sale:'',
        invoiceDialog: false,
        sheet2: false,
        sheet: false,
        filters: false,
        emailDialog: false,
        editDialog: false,
        createDialog: false,
        detailDialog:false,
        rejectionDialog:false,
        deleteId:'',
        rejectionData:'',
        rejectionId:'',
        filterStorageLength:0,
        headersBar:[
            { text: 'Folio', value: 'id' },
            { text: 'Empresa', value: 'company' },
            { text: 'Total', value: 'total' },
            { text: 'Serie', value: 'type' },
            { text: 'Factura/Remisión', value: 'invoice' },
            { text: 'Fecha F/R', value: 'invoice_date' },
            { text: 'Vendedor', value: 'salesman' },
        ]
    }),
    watch: {
        options: {
            handler () {
                this.getDataFromApi()
            },
            deep: true,
        },
    },
    mounted(){
        Echo.channel('sales').listen('OrderInProduction', (e) => {
            var updatedSale = this.sales.filter(sale=>sale.id == e[0])[0]
            if(updatedSale!=undefined){
                this.sales.filter(sale=>sale.id == e)[0].is_in_production = true
            }
        })
        Echo.channel('sales_dispatched').listen('OrderDispatched', (e) => {
            var updatedSale = this.sales.filter(sale=>sale.id == e[0])[0]
            if(updatedSale!=undefined){
                this.sales.filter(sale=>sale.id == e)[0].production_dispatched = true
            }
        })
    },
    computed: {
        liga(){
            return process.env.VUE_APP_BACKEND_ROUTE
        },
        showCompany(){
            if(this.company == null){
                if(this.liga == 'https://backendbdb.unocrm.mx/'){
                    return { text: 'Cliente', value: 'company_id',}
                }else{
                    return { text: 'Empresa', value: 'company_id',}
                }
            }else{
                return false
            }
        },
        utilityAndCost(){
            var headers = []
            if(this.permissions('utilities')){
                headers.concat([
                { text: 'Utilidad Unitaria', value: 'utility_per_item',},
                { text: 'Utilidad Total', value: 'utility',}])
            }
            if(this.permissions('view_costs')){
                headers.concat([
                { text: 'Costo Unitario', value: 'cost',},
                { text: 'Costo Total', value: 'total_cost',}])
            }
            
            return headers
        },
        headers2(){
            var headers = [
                //{ text: 'Codigo Macro', value: 'macro',},
                { text: 'Producto | Servicio', value: 'item',},
                { text: 'Cantidad', value: 'totalWeight',},
                { text: 'Precio Ajustado', value: 'price',},
                { text: 'Subtotal', value: 'total',}
            ]
            return headers.concat(this.viewCosts).concat(this.utilityPermission).concat([{ value: 'actions', sortable: false, align: 'end', }])
        },
        disbaledCancellation(){
            for(var i=0; i<this.editedItem.items.length; i++){
                if(this.editedItem.items[i].rejection_status==null){
                    return true
                }
            }
            return false
        },
        utilityPermission(){
            if(this.permissions('utility')){
                return {text: 'Utilidad', value:'utility'}
            }else{
                return false
            }
        },
        viewCosts(){
            if(this.permissions('view_costs')){
                return [{ text: 'Costo Unitario', value: 'cost' }]
            }
            return []
        },
        currentUser:{
            get(){
                return this.$store.state.currentUser.user;
            }
        },
        headers(){ 
            return [
            { text: '', value: 'data-table-expand' },
            { text: 'Folio', value: 'id' },
            { text: 'Factura', value: 'invoice', sortable: false },
            { text: 'Remisión', value: 'remission', sortable: false },
            { text: 'Fecha Programada', value: 'date' },
            this.showCompany,
            { text: 'Vendedor', value: 'user_id' },
            { text: 'Subtotal', value: 'subtotal' },
            { text: 'IVA', value: 'iva' },
            { text: 'Total', value: 'total' },
            { text: 'Pagos', value: 'payments', sortable: false },
            { text: 'Fecha(s) de Pago(s)', value: 'collections_date', sortable: false },
            { text: 'Adeudo', value: 'due_balance', sortable: false },
            { text: 'Saldo Vencido', value: 'past_due_balance', sortable: false },
            { text: 'Lista de Precios', value: 'price_list' },
            { text: 'Estatus de Pago', value: 'payment_status', sortable: false },
            this.utilityPermission,
            { text: 'Fecha Factura', value: 'invoice_date' },
            { text: 'Fecha de Vencimiento', value: 'balance_due_date', sortable: false },
            { text: 'Mostrador', value: 'bar' },
            { text: 'Peso', value: 'sale_total_weight' },
            { text: 'Fecha de Entrega', value: 'shipping_date', sortable: false },
            { text: 'Serie', value: 'type' },
            
            { text: 'Impresa', value: 'printed' },
            { text: 'Días Factura', value: 'days_after_invoice_date', sortable: false },
            { text: 'Días Vencido', value: 'balance_due_days', sortable: false },
            { text: 'Surtido', value: 'production_dispatched'},

            { text: 'Autorizado por', value: 'authorized_by'},
            { text: 'Motivo de Autorización', value: 'authorization_reason'},

            { text: 'Creación', value: 'created_at' },
            { text: 'Usuario Creador', value: 'created_by_user_id' },
            { text: 'Edición', value: 'updated_at' },
            { text: 'Usuario Editor', value: 'last_updated_by_user_id' },
            { value: 'actions', sortable: false, align: 'end', },
        ]},
        rejectionsLists(){
            return this.$store.state.rejection.rejections;
        },
    },
    methods: { 
        sendInovice(){
            let config = {
                headers: {
                    'Authorization': "Bearer " + process.env.VUE_APP_FACTURAPI_TOKEN
                }
            }
            axios.post('https://www.facturapi.io/v2/invoices/' + this.invoice_to_send.facturapi_invoices[0].facturapi_id + '/email', {email: this.invoice_to_send.company.attributes.fiscal_email},config).then((resp) => {
                this.snackbar = {
                    message: 'Factura enviada con éxito',
                    color: 'success',
                    show: true
                }
                this.invoiceEmailDialog = false
                this.invoice_to_send = {}
            }).catch(error=>{
                this.snackbar = {
                    message: error.response.data.message,
                    color: 'red',
                    show: true
                }
            })
        },
        downloadInvoice(invoices){
            let config = {
                responseType: 'arraybuffer',
                headers: {
                    'Authorization': "Bearer " + process.env.VUE_APP_FACTURAPI_TOKEN,
                    'Content-Type': 'application/json',
                    'Accept': 'application/pdf'
                }
            }
            axios.get('https://www.facturapi.io/v2/invoices/' + invoices[0].facturapi_id + '/pdf', config).then((response) => {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', invoices[0].uuid+ '.pdf'); //or any other extension
                document.body.appendChild(link);
                link.click();
            })
        },
        addProduct(quotation_id){
            this.addDialogDetail = true
            this.addDetail = quotation_id*1
        },
        rejectionSwitchLabel(value){
            if(value == null || value){
                return 'Devolución'
            }else{
                return 'Merma'
            }
        },
        rejection(item){
            this.editedItem.id = item.id
            this.editedItem.status = 'cancelled'
            this.editedItem.items = item.items
            this.rejectionDialog = true
            this.editedItem.self_invoice_url = item.self_invoice_url
            this.editedItem.facturapi_receipt_id = item.facturapi_receipt_id
        },
        saveRejection(){
            this.sheet2 = true
        },
        confirmRejection(){
            this.process_cancelation = true
            this.editedItem.last_updated_by_user_id = this.currentUser.id
            axios.post(process.env.VUE_APP_BACKEND_ROUTE + "api/v2/sale/cancel",Object.assign(this.editedItem)).then(response=>{
                let config = {
                    headers: {
                        'Authorization': "Bearer " + process.env.VUE_APP_FACTURAPI_TOKEN
                    }
                }
                if(this.editedItem.facturapi_invoices!=undefined && this.editedItem.facturapi_invoices.length>0){
                    const chunks = this.editedItem.facturapi_invoices.filter(invoice=>invoice.status != "canceled")
                    let index = 0;
                    const sendRequests = () => {
                        if (index >= chunks.length) {
                            this.snackbar = {
                                message: 'Factura(s) cancelada(s) con éxito',
                                color: 'success',
                                show: true
                            }
                            this.getDataFromApi()
                            this.cancel()
                            return;
                        }
                        // Se crea un array con las solicitudes que se enviarán en esta iteración
                        const requests = chunks[index].map(invoice => axios.delete(`https://www.facturapi.io/v2/invoices/${invoice.facturapi_id}`, config).then(response=>{
                            this.index = this.index + 1
                        }));
                        // Se envían las solicitudes usando Promise.all()
                        Promise.all(requests).then(() => {
                            index++;
                            // Se espera un momento antes de enviar la siguiente tanda de solicitudes
                            setTimeout(sendRequests, 1000);
                        }).catch(error => {
                            this.snackbar = {
                                message: error.response.data.message,
                                color: 'red',
                                show: true
                            }
                            // Si hay un error, se detiene el proceso
                        });
                    };
                    sendRequests();
                }else if(this.editedItem.facturapi_receipt_id!=undefined){
                    axios.delete('https://www.facturapi.io/v2/receipts/' + this.editedItem.facturapi_receipt_id, config).then(resp => {
                        this.snackbar = {
                            message: 'Recibo cancelado con éxito',
                            color: 'success',
                            show: true
                        }
                        this.getDataFromApi()
                        this.cancel()
                    }).catch(error=>{
                        this.snackbar = {
                            message: error.response.data.message,
                            color: 'red',
                            show: true
                        }
                    })
                }else{
                    this.getDataFromApi()
                    this.cancel()
                }
            }).catch(error => {
                this.snackbar = {
                    message: "Error al cancelar la venta",
                    color: 'error',
                    show: true
                }
            })
        },
        barSales(){
            axios.get(process.env.VUE_APP_BACKEND_ROUTE + "api/v2/bar_sales_list").then(response => {
                this.editedBarSales = response.data.data.map(id=>{
                    return{
                        id:id.id,
                        company:id.company.attributes.name,
                        total:id.total,
                        type:id.type,
                        invoice:id.invoice,
                        invoice_date:id.invoice_date,
                        salesman:id.salesman,
                    }
                })
                this.invoiceDialog = true
            })
        },
        getDataFromApi () {
            this.loading = true
            this.apiCall().then(data => {
                this.editedBarSales
                this.sales = data.items
                this.totalSales = data.total
                this.loading = false
            })
        },
        filterStorage(){
            if(localStorage.getItem('filtersSales')!=null){
                false
            }else{
                return true
            }
        },
        apiCall () {
            return new Promise((resolve, reject) => {
                this.filterStorageLength = localStorage.getItem('filtersSalesLength')
                const { sortBy, sortDesc, page, itemsPerPage } = this.options
                var items = []
                var total = 0
                var link = ''
                if(this.company!=undefined){
                    link = link + 'filter[company_id]='+this.company+'&' 
                }
                if(localStorage.getItem('filtersSales')!=null&&this.$route.params.sale_id==undefined&&this.company==undefined){
                    link = link + JSON.parse(localStorage.getItem('filtersSales'))+'&'
                }else if(this.$route.params.sale_id==undefined&&this.company==undefined){
                    var startDate = []
                    var date = new Date()
                    startDate[0] = new Date(date.getFullYear(), date.getMonth(), 1).toLocaleString("sv-SE", {timeZone: "America/Monterrey"}).toString().slice(0, 10)
                    startDate[1] = new Date(date.getFullYear(), date.getMonth() + 1, 0).toLocaleString("sv-SE", {timeZone: "America/Monterrey"}).toString().slice(0, 10)
                    link = link + 'filter[date_between]='+startDate+'&'
                }
                if(this.$route.params.sale_id!=undefined){
                    link = link + 'filter[id]='+this.$route.params.sale_id+'&'
                }
                axios.get(process.env.VUE_APP_BACKEND_ROUTE + "api/v2/sales?" + link + "page=" + page + "&itemsPerPage=" + itemsPerPage).then(response => {
                    this.salesLength = response.data.meta.total
                    items = this.mapSales(response.data.data)
                    total = response.data.meta.total
                    if (sortBy.length === 1 && sortDesc.length === 1) {
                        if(sortDesc[0]){
                            axios
                            .get(process.env.VUE_APP_BACKEND_ROUTE + "api/v2/sales?" + link + "page=" + page + "&sort=-" + sortBy[0] + "&itemsPerPage=" + itemsPerPage)
                            .then(response=>{
                                items = this.mapSales(response.data.data)
                                total = response.data.meta.total
                                resolve({
                                    items,
                                    total,
                                })
                            })
                        }else{
                            axios
                            .get(process.env.VUE_APP_BACKEND_ROUTE + "api/v2/sales?" + link + "page=" + page + "&sort=" + sortBy[0] + "&itemsPerPage=" + itemsPerPage)
                            .then(response=>{
                                items = this.mapSales(response.data.data)
                                total = response.data.meta.total
                                resolve({
                                    items,
                                    total,
                                })
                            })
                        }
                    }else{
                        resolve({
                            items,
                            total,
                        })
                    }
                })
            })
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
        priceList(id){
            if(id!=undefined){
                return id.name
            }
        },
        macro(macro){
            if(macro!=null){
                return macro + ' | '
            }else{
                return ''
            }
        },
        mapSales(sales){
            sales = sales.map(id=>{
                return{
                    company:id.company,
                    production:id.production,
                    datePicker: false,
                    id:id.id,
                    company_id: this.macro(id.company.attributes.macro) + this.nombre(id.company.attributes),
                    companyID: id.company.id,
                    delivery_address:id.company.attributes.delivery_address,
                    razon_social: id.company.attributes.razon_social,
                    direccion: id.company.attributes.address,
                    delivery_time: id.company.attributes.delivery_time,
                    macro:id.company.attributes.macro,

                    collections_date:id.collections_date,

                    //contact:this.contact(id.contact),
                    user_id:this.salesman(id.company.attributes.user),
                    created_by_user_id:this.salesman(id.created_by_user_id),
                    last_updated_by_user_id:this.salesman(id.last_updated_by_user_id),
                    price_list:this.priceList(id.price_list), 
                    utility:(id.utility.toFixed(2)*1).toLocaleString('es-MX', { style: 'currency', currency: 'MXN',}),

                    total:(id.total*1),
                    pdf:id.pdf,
                    pdf2:id.pdf2,
                    note:id.note,
                    bar:id.bar,
                    date:id.date,
                    type:id.type,
                    items:id.items.map(item=>{
                        return{
                            cost: item.cost,
                            id: item.id,
                            item: item.item,
                            price: item.price,
                            quantity: item.quantity,
                            quotation: item.quotation,
                            rejection_status: item.rejection_status,
                            value: item.value,
                            is_in_production:id.is_in_production,
                            production_dispatched:id.production_dispatched
                        }
                    }),
                    created_at:id.created_at.slice(0, 18),
                    updated_at:id.updated_at.slice(0, 18),
                    subtotal:(id.subtotal*1),
                    iva:(id.iva*1),                 
                    printed:id.printed,
                    invoice_date:this.invoiceData(id.facturapi_invoices[0], 'date'),                    
                    payments:(id.payments*1).toLocaleString('es-MX', { style: 'currency', currency: 'MXN',}),
                    due_balance:(id.due_balance*1).toLocaleString('es-MX', { style: 'currency', currency: 'MXN',}),
                    past_due_balance:(id.past_due_balance*1).toLocaleString('es-MX', { style: 'currency', currency: 'MXN',}),
                    balance_due_date:id.balance_due_date.slice(0, 10),//falta filtro
                    balance_due_days:id.balance_due_days,
                    days_after_invoice_date:id.days_after_invoice_date,
                    status:id.status,

                    invoice:this.invoiceData(id.facturapi_invoices[0], 'invoice'),
                    remission:id.remission,

                    payment_status:id.payment_status,//falta filtro
                    sale_total_weight: id.sale_total_weight,
                    shipping_date:id.shipping_date,//falta filtro
                    is_in_production:id.is_in_production,
                    production_dispatched:id.production_dispatched,
                    facturapi_invoices:id.facturapi_invoices,
                    self_invoice_url:id.self_invoice_url,
                    facturapi_receipt_id:id.facturapi_receipt_id,
                    authorized_by:this.nombre(id.authorized_by),
                    authorization_reason:id.authorization_reason
                }
            });
            return sales
        },
        invoiceData(invoice, data){
            if(invoice!=undefined){
                switch(data){
                    case 'invoice': return 'B-'+invoice.folio_number
                    case 'date': return invoice.date
                }
            }
        },
        nombre(empresa){
            if(empresa!=undefined){
                if(empresa.name == undefined || empresa.name == '' || empresa.name == null){
                    return empresa.razon_social
                }else{
                    return empresa.name
                }
            }
        },
        printTicket(item){
            if(process.env.VUE_APP_BACKEND_ROUTE == "https://suministros.uno/"){
                axios.put(process.env.VUE_APP_BACKEND_ROUTE + "api/v1/quotation/print-sale",Object.assign(item)).then(response=>{
                    localStorage.setItem('printTicket', item.id);
                    window.open("/");
                    this.$nextTick(() => {
                        if (this.options.sortBy.length === 1 && this.options.sortDesc.length === 1) {
                            if(this.options.sortDesc){
                                var sort = '-' + this.options.sortBy[0]
                                this.$store.dispatch('quotation/getSales', {'pageNumber':this.options.page, 'sort':sort})
                            }else{
                                var sort = this.options.sortBy[0]
                                this.$store.dispatch('quotation/getSales', {'pageNumber':this.options.page, 'sort':sort})
                            }
                            
                        }else{
                            this.$store.dispatch('quotation/getSales', {'pageNumber':this.options.page, 'sort':'id'})
                        }
                    })
                })
            }else {
                console.log(item)
                this.ticket = [item].map(id=>{return{
                    id:id.id,
                    company_id:id.companyID,
                    note:id.note,
                    bar:id.bar,
                    subtotal:id.subtotal,
                    iva:id.iva,
                    total:id.total,
                    date:id.date,

                    created_at:id.created_at,

                    user_id:this.currentUser.id,
                    
                    items:id.items.map(i=>{return{
                        quantity:i.quantity,
                        product:i.item,
                        price:i.price,
                    }}),

                    self_invoice_url:id.self_invoice_url,
                    
                }})[0]
                this.dialogTicket=true;
            }
        },
        itemRowBackground: function (item) {
            return item.status == 'cancelled' ? 'cancelled' : 'normal'
        },
        openFilter(){
            if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
                this.filterMobile = true
            }else{
                if(this.filters == false){
                    this.$emit("closeDrawer", false);
                    this.filters = true
                }else{
                    this.$emit("closeDrawer", true);
                    this.filters = false
                }
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
        filtersSale: function(params) {
            this.$store.dispatch('quotation/getSales', {'pageNumber':1, 'sort':'id'})
            this.showTable = false
            if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
                this.filterMobile = false
            }
            this.$nextTick(() => {
                this.showTable = true
            })
        },
        closeDialogEditQuotation: function(params) {
            this.editDialog = false;
            //this.$store.dispatch('quotation/getQuotations')
            this.getDataFromApi()
        },
        cerrarInvocie: function(params) {
            this.invoice_dialog = false;
            this.snackbar = {
                message: 'Factura generada con éxito',
                color: 'success',
                show: true
            }
            this.getDataFromApi()
        },
        closeCreateDialogQuotation: function(params) {
            this.createDialog = false;
            //this.$store.dispatch('quotation/getQuotations')
            this.getDataFromApi()
        },
        closeDialogEmailQuotation: function(params) {
            this.emailDialog = false;
        },
        closeDialogEditDetail: function(params) {
            this.editDialogDetail = false
            this.getDataFromApi()
        },
        closeDialogAddDetail: function(params) {
            this.addDialogDetail = false
            this.getDataFromApi()
        },
        exportExcel: function () {
            let data = XLSX.utils.json_to_sheet(this.sales.filter(sale=>sale.status == 'vendido').map(id=>{
                return{
                    id:id.id,
                    empresa: id.company_id,
                    mostrador: id.bar,
                    fecha_programada: id.date,
                    serie: id.type,
                    subtotal: id.subtotal,
                    iva: id.iva,
                    total: id.total,
                    pagos: id.payments,
                    adeudo: id.due_balance,
                    saldo_vencido: id.past_due_balance,
                    factura: id.invoice,	
                    remisison: id.remission,	
                    status_de_pago:id.payment_status
                }
            }))
            const workbook = XLSX.utils.book_new()
            const filename = 'Lista de Ventas'
            XLSX.utils.book_append_sheet(workbook, data, filename)
            XLSX.writeFile(workbook, `${filename}.xlsx`)
        },
        deleteSale(){
            axios.delete(process.env.VUE_APP_BACKEND_ROUTE + "api/v1/quotation/delete/"+this.deleteId).then(response => {
                this.deleteId = ''
                this.sheet = false
                this.getDataFromApi()
            }).catch(error => {
                this.snackbar = {
                    message: error.response.data.message,
                    color: 'error',
                    show: true
                }
            });
        },
        sendEmail (id) {
            axios.get(process.env.VUE_APP_BACKEND_ROUTE + 'api/v2/sale_items/' + id).then(response => {
                this.editedDetail = response.data
                this.emailDialog = true
            })
        },
        sendInvoiceEmail(item){
            this.invoiceEmailDialog = true
            this.invoice_to_send = item
        },
        cancel(){
            this.editedItem={
                id:'',
                status:'',
                rejection_comment:'',
                rejection_id:'',
                items: [],
                last_updated_by_user_id:''
            },
            this.rejectionDialog = false
            this.sheet = false
            this.sheet2 = false
        },
        deleteItem (item) {
            this.deleteId = item.id
            this.sheet = true
        },
        editItem(id){
            axios.get(process.env.VUE_APP_BACKEND_ROUTE + "api/v2/sales?filter[id]=" + id).then(response => {
                this.sale = response.data.data.map(id=>{
                    return{
                        id:id.id,
                        company_id:this.existe(id.company),
                        contact_id:this.existe(id.contact),
                        user_id:this.existe(id.user),
                        pdf:id.pdf,
                        note:id.note,
                        bar:id.bar,
                        date:id.date,
                        type:id.type,
                        invoice:id.invoice,
                        last_updated_by_user_id:this.existe(id.last_updated_by_user_id),
                        invoice_date:id.invoice_date,
                        status:'vendido',
                        self_invoice_url:id.self_invoice_url,
                        facturapi_receipt_id:id.facturapi_receipt_id
                    }
                })[0]
                this.editDialog = true
            })
        },
        cerrarTicket: function(params) {
            this.dialogTicket=false;
        },
        existe(item){
            if(item!=null){
                return item.id*1
            }else{
                return ''
            }
        },
        generateInvoice(item){
            this.invoice = [item].map(id=>{return{
                items:id.items.map(item=>{return {
                    quantity: item.quantity,
                    product_id: item.item.facturapi_id,
                    product: item.item,
                    price: item.price
                }}),
                products: id.items,
                payment_form: "",
                payment_method: "",
                use: "",
                conditions: "",
                customer: id.company.attributes.facturapi_id,
                email: id.company.attributes.fiscal_email,
                company: id.company.attributes,
                date: new Date().toISOString({timeZone: "America/Monterrey"}),
                external_id: id.id,
                series: id.type,
                note:id.note,
                balance_due_date:id.balance_due_date
            }})[0]
            this.invoice_dialog = true
        },
        saveInvoice(){
            this.gris = true
            var edited = []
            for(var i=0; i<this.editedBarSales.length; i++){
                if(this.editedBarSales[i].invoice!=''&&this.editedBarSales[i].invoice_date!=null){
                    edited=edited.concat(this.editedBarSales[i])
                }
            }
            this.$nextTick(() => {
                axios.put(process.env.VUE_APP_BACKEND_ROUTE + "api/v1/quotation/bar-bulk-update", edited.map(id=>{
                    return{
                        id:id.id,
                        invoice:id.invoice,
                        invoice_date:id.invoice_date,
                    }
                })).then(response=>{
                    this.getDataFromApi()
                    this.gris = false
                    this.searchInput = ''
                    this.invoiceDialog = false
                }).catch(error => {
                    this.snackbar = {
                        message: error.response.data.message,
                        color: 'error',
                        show: true
                    }
                })
                
            })
        },
        editDetail(id){
            axios.get(process.env.VUE_APP_BACKEND_ROUTE + 'api/v2/sale_items/' + id).then(response => {
                this.editedDetail = response.data
                this.editDialogDetail = true
            })
        },
        deleteDetail(id){
            axios.delete(process.env.VUE_APP_BACKEND_ROUTE + "api/v2/sale_items/" + id).then(response => {
                this.getDataFromApi()
            }).catch(error => {
                this.snackbar = {
                    message: error.response.data.message,
                    color: 'error',
                    show: true
                }
            });
        },
    }
}
</script>
<style>
    .cancelled {
        background-color: #fff5d7
    }
    .normal {
        background-color: white
    }
    .v-data-table > .v-data-table__wrapper tbody tr.v-data-table__expanded__content {
        box-shadow: none!important;
        background: #f7f7f7;
    }
    .v-text-field.v-text-field--solo:not(.v-text-field--solo-flat) > .v-input__control > .v-input__slot {
        box-shadow: 0px 3px 1px -2px rgb(0 0 0 / 0%), 0px 2px 2px 0px rgb(0 0 0 / 0%), 0px 1px 5px 0px rgb(0 0 0 / 0%)!important;
    }
</style>