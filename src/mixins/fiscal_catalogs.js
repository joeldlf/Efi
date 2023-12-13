export default {
    data() {
      return {
        products_units:[
            {name:'Pieza', key:'H87'},
            {name:'Kilo', key:'KGM'},
            {name:'Metro', key:'MTR'}
        ],
        payment_forms:[
            {value:"01", text:"Efectivo"},
            {value:"02", text:"Cheque nominativo"},
            {value:"03", text:"Transferencia electrónica de fondos"},
            {value:"04", text:"Tarjeta de crédito"},
            {value:"28", text:"Tarjeta de débito"},
            {value:"99", text:"Por definir"}
        ],
        payment_methods:[
            {value:"PUE", text:"Pago en una sola exhibición"},
            {value:"PPD", text:"Pago en parcialidades o diferido"},
        ],
        tax_systems:[
            {id:'601', name:'601 | General de Ley Personas Morales'},
            {id:'603', name:'603 | Personas Morales con Fines no Lucrativos'},
            {id:'605', name:'605 | Sueldos y Salarios e Ingresos Asimilados a Salarios'},
            {id:'606', name:'606 | Arrendamiento'},
            {id:'607', name:'607 | Régimen de Enajenación o Adquisición de Bienes'},
            {id:'608', name:'608 | Demás ingresos'},
            {id:'609', name:'609 | Consolidación'},
            {id:'610', name:'610 | Residentes en el Extranjero sin Establecimiento Permanente en México'},
            {id:'611', name:'611 | Ingresos por Dividendos (socios y accionistas)'},
            {id:'612', name:'612 | Personas Físicas con Actividades Empresariales y Profesionales'},
            {id:'614', name:'614 | Ingresos por intereses'},
            {id:'615', name:'615 | Régimen de los ingresos por obtención de premios'},
            {id:'616', name:'616 | Sin obligaciones fiscales'},
            {id:'620', name:'620 | Sociedades Cooperativas de Producción que optan por diferir sus ingresos'},
            {id:'621', name:'621 | Incorporación Fiscal'},
            {id:'622', name:'622 | Actividades Agrícolas, Ganaderas, Silvícolas y Pesqueras'},
            {id:'623', name:'623 | Opcional para Grupos de Sociedades'},
            {id:'624', name:'624 | Coordinados'},
            {id:'625', name:'625 | Régimen de las Actividades Empresariales con ingresos a través de Plataformas Tecnológicas'},
            {id:'626', name:'626 | Régimen Simplificado de Confianza'},
            {id:'628', name:'628 | Hidrocarburos'},
            {id:'629', name:'629 | De los Regímenes Fiscales Preferentes y de las Empresas Multinacionales'},
            {id:'630', name:'630 | Enajenación de acciones en bolsa de valores'},
        ],
      }
    }
}