[
    {
        category: 'Clientes',
        permissions: [
            { text: 'Acceso a Clientes', value: 'companies' },
            { text: 'Ver Clientes de Todos de Todos', value: 'viewCompanies' },
            { text: 'Editar Clientes', value: 'editCompanies' },
            { text: 'Eliminar Clientes', value: 'deleteCompanies' },
            { text: 'Asignar Clientes', value: 'assignCompanies' },
            { text: 'Reasignar Clientes', value: 'reassignCompanies' },
            { text: 'Ver Clientes de Otras Sucursales', value: 'viewBranchesCompanies' }
        ]
    },
    {
        category: 'Contactos',
        permissions: [
            { text: 'Editar Contactos', value: 'editContacts' },
            { text: 'Eliminar Contactos', value: 'deleteContacts' }
        ]
    },
    {
        category: 'Actividades',
        permissions: [
            { text: 'Acceso a Actividades', value: 'activities' },
            { text: 'Ver Actividades de Todos de Todos', value: 'viewActivities' },
            { text: 'Editar Actividades', value: 'editActivities' },
            { text: 'Eliminar Actividades', value: 'deleteActivities' },
            { text: 'Asignar Actividades', value: 'assignActivities' },
            { text: 'Ver Actividades de Otras Sucursales', value: 'viewBranchesActivities' }
        ]
    },
    {
        category: 'Cotizaciones',
        permissions: [
            { text: 'Acceso a Cotizaciones', value: 'quotations' },
            { text: 'Ver Cotizaciones de Todos de Todos', value: 'viewQuotations' },
            { text: 'Editar Cotizaciones', value: 'editQuotations' },
            { text: 'Eliminar Cotizaciones', value: 'deleteQuotations' },
            { text: 'Asignar Cotizaciones', value: 'assignQuotations' },
            { text: 'Ver Cotizaciones de Otras Sucursales', value: 'viewBranchesQuotations' }
        ]
    },
    {
        category: 'Cancelaciones',
        permissions: [
            { text: 'Acceso a Cancelaciones', value: 'cancelations' },
            { text: 'Ver Cancelaciones de Todos', value: 'viewCancelations' },
            { text: 'Ver Cancelaciones de Otras Sucursales', value: 'viewBranchesCancelations' }
        ]
    },
    {
        category: 'Ventas',
        permissions: [
            { text: 'Acceso a Ventas', value: 'sales' },
            { text: 'Ver Ventas de Todos de Todos', value: 'viewSales' },
            { text: 'Editar Ventas', value: 'editSales' },
            { text: 'Eliminar Ventas', value: 'deleteSales' },
            { text: 'Asignar Ventas', value: 'assignSales' },
            { text: 'Imprimir Ticket', value: 'printTicket' },
            { text: 'Ver Ventas de Otras Sucursales', value: 'viewBranchesSales' },
            { text: 'Acceso a Detalles de Ventas', value: 'sale_details' },
            { text: 'Editar Detalles de Ventas', value: 'editSales' },
            { text: 'Eliminar Detalles de Ventas', value: 'deleteSales' },
        ]
    },
    {
        category: 'Cobranzas',
        permissions: [
            { text: 'Acceso a Cobranzas', value: 'collections' },
            { text: 'Editar Cobranzas', value: 'editCollections' },
            { text: 'Eliminar Cobranzas', value: 'deleteCollections' },
            { text: 'Asignar Cobranzas', value: 'assignCollections' },
            { text: 'Ver Cobranzas de Otras Sucursales', value: 'viewBranchesCollections' },
            { text: 'Acceso a Caja', value: 'ferreteria' }
        ]
    },
    {
        category: 'Envíos',
        permissions: [
            { text: 'Acceso a Envíos', value: 'shippings' },
            { text: 'Editar Envíos', value: 'editShippings' },
            { text: 'Eliminar Envíos', value: 'deleteShippings' },
            { text: 'Imprimir Envíos', value: 'printShippings' },
            { text: 'Ver Cobranzas de Otras Sucursales', value: 'viewBranchesShippings' },
            { text: 'Acceso a Detalles de Envíos', value: 'shipping_details' },
            { text: 'Editar Detalles de Envíos', value: 'editShippingDetails' },
            { text: 'Eliminar Detalles de Envíos', value: 'deleteShippingDetails' },
        ]
    },
    {
        category: 'Pedidos',//NO BDB
        permissions: [
            { text: 'Acceso a Pedidos x Surtir', value: 'orders' },
            { text: 'Acceso a Pedidos Surtidos', value: 'orders_ready' }
        ]
    },
    {
        category: 'Producción',//NO BDB
        permissions: [
            { text: 'Acceso a Producciónes', value: 'productions' },
            { text: 'Ver Producciónes de Todos', value: 'viewProductions' },
            { text: 'Editar Producciónes', value: 'editProductions' },
            { text: 'Eliminar Producciónes', value: 'deleteProductions' },
            { text: 'Editar Detalle de Producción', value: 'editProductionOrders' },
            { text: 'Eliminar Detalle de Producción', value: 'deleteProductionOrders' }
        ]
    },
    {
        category: 'Compras',
        permissions: [
            { text: 'Acceso a Compras', value: 'shoppings' },
            { text: 'Editar Compras', value: 'editShoppings' },
            { text: 'Eliminar Compras', value: 'deleteShoppings' },
            { text: 'Ver Compras de Otras Sucursales', value: 'viewBranchesShoppings' },
            { text: 'Acceso a Detalles de Compras', value: 'shopping_details' },
            { text: 'Editar Detalles de Compras', value: 'editShoppingOrders' },
            { text: 'Eliminar Detalles de Compras', value: 'deleteShoppingOrders' }
        ]
    },
    {
        category: 'Proveedores',
        permissions: [
            { text: 'Acceso a Proveedores', value: 'providers' },
            { text: 'Editar Proveedores', value: 'editProviders' },
            { text: 'Eliminar Proveedores', value: 'deleteProviders' }
        ]
    },
    {
        category: 'Pagos a Proveedores',
        permissions: [
            { text: 'Acceso Pagos a Proveedores', value: 'provider_payments' },
            { text: 'Editar Pagos a Proveedores', value: 'editProviderPayments' },
            { text: 'Eliminar Pagos a Proveedores', value: 'deleteProviderPayments' },
            { text: 'Ver Pagos a Proveedores de Otras Sucursales', value: 'viewBranchesPayments' }
        ]
    },
    {
        category: 'Gastos',//NO BDB
        permissions: [
            { text: 'Acceso a Gastos', value: 'expenses' },
            { text: 'Editar Gastos', value: 'editExpenses' },
            { text: 'Eliminar Gastos', value: 'deleteExpenses' },
            { text: 'Ver Gastos de Otras Sucursales', value: 'viewBranchesExpenses' }
        ]
    },
    {
        category: 'Nominas',//NO BDB
        permissions: [
            { text: 'Acceso a Nominas', value: 'pay_rolls' },
            { text: 'Editar Nominas', value: 'editPayRolls' },
            { text: 'Eliminar Nominas', value: 'deletePayRolls' },
            { text: 'Imprimir Nominas', value: 'printPayrolls' }
        ]
    },
    {
        category: 'Inventario',
        permissions: [
            { text: 'Acceso a Productos', value: 'inventory' },
            { text: 'Acceso a Movimientos de Inventario', value: 'report_inventory' },
            { text: 'Ver Inventario de Otras Sucursales', value: 'viewBranchesPayments' },
            { text: 'Acceso a Inventario Físico', value: 'physical_inventories' },
            { text: 'Acceso a Transferencias de Inventario', value: 'inventory_transfer' },
            { text: 'Ver Inventario de Otras Sucursales', value: 'viewBranchesInventories' },
            //NO BDB
            { text: 'Acceso a Ajustes de Inventario', value: 'adjustments' },
            { text: 'Editar Ajustes de Inventario', value: 'editAdjustments' },
            { text: 'Eliminar Ajustes de Inventario', value: 'deleteAdjustments' },
        ]
    },
    
    {
        category: 'Prospectos',//NO BDB
        permissions: [
            { text: 'Acceso a Prospectos', value: 'leads' },
            { text: 'Asignar Prospectos', value: 'assignLeads' }
        ]
    },
    {
        category: 'Llamadas',//NO BDB
        permissions: [
            { text: 'Acceso a Grabaciones de Llamada de Todos', value: 'viewCallRecords' },
            { text: 'Acceso a LLamadas', value: 'calls' },
            { text: 'Ver LLamadas de Todos', value: 'viewCalls' }
        ]
    },
    {
        category: 'Mensajes',//NO BDB
        permissions: [
            { text: 'Acceso a Mensajes', value: 'messages' },
            { text: 'Ver Mensajes de Todos', value: 'viewMesages' }
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
            { text: 'Acceso a Saldos Vencidos', value: 'balances' },//NO BDB
            { text: 'Acceso a Utilidades', value: 'utilities' },//NO BDB
        ]
    },
    {
        category: 'Notas',
        permissions: [
            { text: 'Asignar Notas', value: 'assignNotes' }
        ]
    },
    
    {
        category: 'Personalizados',
        permissions: [
            { text: 'Ver Costos de Productos', value: 'view_costs' }
        ]
    },
];