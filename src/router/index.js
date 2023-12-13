import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

var dashboard = {}
var quotations = {}
if(process.env.VUE_APP_BACKEND_ROUTE != 'https://backendbdb.unocrm.mx/'){
  dashboard = {
    path: '/',
    name: 'Dashboard',
    component: () => import('../components/dashboard/container.vue')
  },
  quotations = {
    path: '/quotations',
    name: 'Quotations',
    component: () => import('../components/quotations/table.vue')
  }
}else{
  dashboard = {
    path: '/',
    name: 'Dashboard',
    component: () => import('../components/pos/PuntodeVenta.vue')
  },
  quotations = {
    path: '/quotations',
    name: 'Quotations',
    component: () => import('../components/quotations/table.vue')
  }
}

const routes = [
  {
    path: '/huecos',
    name: 'Huecos',
    component: () => import('../components/reports/huecos.vue')
  },
  {
    path: '/mermas',
    name: 'Mermas',
    component: () => import('../components/inventory/mermas.vue')
  },
  {
    path: '/items-report',
    name: 'Reporte de Productos',
    component: () => import('../components/reports/items.vue')
  },
  {
    path: '/shopping-report',
    name: 'Reporte de Compras',
    component: () => import('../components/reports/shoppings.vue')
  },
  {
    path: '/receipts',
    name: 'Recibos',
    component: () => import('../components/sales/receipts.vue')
  },
  {
    path: '/providers',
    name: 'Providers',
    component: () => import('../components/shoppings/providers/table.vue')
  },
  {
    path: '/providers/:id',
    name: 'Providers',
    component: () => import('../components/shoppings/providers/table.vue')
  },
  {
    path: '/leads',
    name: 'Leads',
    component: () => import('../components/leads/container.vue')
  },
  {
    path: '/leads/:lead_id',
    name: 'Leads',
    component: () => import('../components/leads/container.vue')
  },
  {
    path: '/perro',
    name: 'Adjustments',
    component: () => import('../components/adjustments.vue')
  },
  {
    path: '/solitario',
    name: 'Solitario',
    component: () => import('../components/shippings/solitario.vue')
  },
  dashboard,
  quotations,
  {
    path: '/costs',
    name: 'Costs',
    component: () => import('../components/costs/container.vue')
  },
  {
    path: '/andrea',
    name: 'Andrea',
    component: () => import('../components/andrea.vue')
  },
  {
    path: '/unverified_clients',
    name: 'Andrea',
    component: () => import('../components/clients/unverified_clients.vue')
  },
  {
    path: '/utilities',
    name: 'Utilities',
    component: () => import('../components/sales/detail/table.vue')
  },
  {
    path: '/balances',
    name: 'Balances',
    component: () => import('../components/balances/container.vue')
  },
  {
    path: '/orders',
    name: 'Orders',
    component: () => import('../components/orders/container.vue')
  },
  {
    path: '/orders-ready',
    name: 'Orders Ready',
    component: () => import('../components/orders/ready.vue')
  },
  {
    path: '/pos',
    name: 'Point of Sale',
    component: () => import('../components/pos/PuntodeVenta.vue')
  },
  {
    path: '/mail',
    name: 'Point of Sale',
    component: () => import('../components/clients/mailing.vue')
  },
  {
    path: '/reports',
    name: 'Reports',
    component: () => import('../components/reports/container.vue')
  },
  {
    path: '/sales',
    name: 'Sales',
    component: () => import('../components/sales/table.vue')
  },
  {
    path: '/sales/calendar',
    name: 'Sales Calendar',
    component: () => import('../components/sales/calendar.vue')
  },
  {
    path: '/sales/:sale_id',
    name: 'Sales',
    component: () => import('../components/sales/table2.vue')
  },
  {
    path: '/new-sales',
    name: 'Sales',
    component: () => import('../components/sales/table2.vue')
  },
  {
    path: '/canceled',
    name: 'Canceled', 
    component: () => import('../components/canceled/table.vue')
  },
  {
    path: '/settings',
    name: 'Settings',
    component: () => import('../components/settings/container.vue')
  },
  {
    path: '/clients',
    name: 'Clients',
    component: () => import('../components/clients/newTable.vue')
  },
  {
    path: '/calendar',
    name: 'calendar',
    component: () => import('../components/activities/calendar.vue')
  },
  {
    path: '/calls',
    name: 'Call',
    component: () => import('../components/calls/table.vue')
  },
  {
    path: '/messages',
    name: 'Messages',
    component: () => import('../components/messages/container.vue')
  },
  {
    path: '/activities',
    name: 'Activities',
    component: () => import('../components/activities/table.vue')
  },
  {
    path: '/reports',
    name: 'Reports',
    component: () => import('../components/reports/container.vue')
  },
  {
    path: '/activity-log',
    name: 'Activity Log',
    component: () => import('../components/activitylog/container.vue')
  },
  {
    path: '/clients/client/:id',
    name: 'clientDetail',
    component: () => import('../components/clients/companies/clientDetail.vue')
  },
  {
    path: '/notes',
    name: 'Notes',
    component: () => import('../components/notes/container.vue')
  },
  {
    path: '/collections',
    name: 'Collections',
    component: () => import('../components/collections/table.vue')
  },
  {
    path: '/new-collections',
    name: 'Collections',
    component: () => import('../components/collections/table2.vue')
  },
  {
    path: '/shippings',
    name: 'Shippings',
    component: () => import('../components/shippings/newTable.vue')
  },
  {
    path: '/expenses',
    name: 'Expenses',
    component: () => import('../components/expenses/container.vue')
  },
  {
    path: '/shopping',
    name: 'Shopping',
    component: () => import('../components/shoppings/container.vue')
  },
  {
    path: '/shoppings/:id',
    name: 'Shopping',
    component: () => import('../components/shoppings/container.vue')
  },
  {
    path: '/shopping/:provider_id',
    name: 'Shopping',
    component: () => import('../components/shoppings/container.vue')
  },
  {
    path: '/provider-payments',
    name: 'Provider Payments',
    component: () => import('../components/provider_payments/table.vue')
  },
  {
    path: '/production',
    name: 'Production',
    component: () => import('../components/productions/container.vue')
  },
  {
    path: '/productions/:id',
    name: 'Productions',
    component: () => import('../components/productions/container.vue')
  },
  {
    path: '/payroll',
    name: 'Payroll',
    component: () => import('../components/payrolls/newTable.vue')
  },
  {
    path: '/adjustments',
    name: 'Adjustments',
    component: () => import('../components/adjustments/container.vue')
  },
  {
    path: '/raw-material',
    name: 'Raw Material',
    component: () => import('../components/raw_material/table.vue')
  },
  {
    path: '/physical-inventory',
    name: 'Physical Inventory',
    component: () => import('../components/physical_inventory/new_container.vue')
  },
  {
    path: '/inventory-reports',
    name: 'Inventory Reports',
    component: () => import('../components/reports/inventory.vue')
  },
  {
    path: '/invoices',
    name: 'Invoices',
    component: () => import('../components/invoices/table.vue')
  },
  {
    path: '/inventory-reports/:id',
    name: 'Inventory Reports',
    component: () => import('../components/reports/inventory.vue')
  },
  {
    path: '/inventory',
    name: 'Inventory',
    component: () => import('../components/inventory/container.vue')
  },
  {
    path: '/inventory-transfer',
    name: 'Inventory',
    component: () => import('../components/inventory/transfer.vue')
  },
  {
    path: '/inventory-ferre',
    name: 'Inventory',
    component: () => import('../components/inventory/newContainer.vue')
  },
  {
    path: '/products',
    name: 'Products',
    component: () => import('../components/products/container.vue')
  },
  {
    path: '/products-pos',
    name: 'Products',
    component: () => import('../components/products/create.vue')
  },
  {
    path: '/ferreteria',
    name: 'Ferreteria',
    component: () => import('../components/ferreteria/container.vue')
  },
  {
    path: '/caja',
    name: 'Caja',
    component: () => import('../components/ferreteria/caja.vue')
  },
  {
    path: '/support',
    name: 'Soporte',
    component: () => import('../components/support/container.vue')
  },
  /*
  {
    path: '/results',
    name: 'Results',
    component: () => import('../components/results/container.vue')
  },
  {
    path: '/months',
    name: 'Months',
    component: () => import('../components/months/container.vue')
  },
  */
]

const router = new VueRouter({
  routes
})

export default router
