import axios from "axios";
const state = {
    cfdis:[],
    uses:[
        {
          "Clave": "G01",
          "Descripción": "Adquisición de mercancías",
          "Régimen Fiscal": "601, 603, 606, 612, 620, 621, 622, 623, 624, 625,626"
        },
        {
          "Clave": "G02",
          "Descripción": "Devoluciones, descuentos o bonificaciones",
          "Régimen Fiscal": "601, 603, 606, 612, 620, 621, 622, 623, 624, 625,626"
        },
        {
          "Clave": "G03",
          "Descripción": "Gastos en general",
          "Régimen Fiscal": "601, 603, 606, 612, 620, 621, 622, 623, 624, 625, 626"
        },
        {
          "Clave": "I01",
          "Descripción": "Construcciones",
          "Régimen Fiscal": "601, 603, 606, 612, 620, 621, 622, 623, 624, 625, 626"
        },
        {
          "Clave": "I02",
          "Descripción": "Mobiliario y equipo de oficina por inversiones",
          "Régimen Fiscal": "601, 603, 606, 612, 620, 621, 622, 623, 624, 625, 626"
        },
        {
          "Clave": "I03",
          "Descripción": "Equipo de transporte",
          "Régimen Fiscal": "601, 603, 606, 612, 620, 621, 622, 623, 624, 625, 626"
        },
        {
          "Clave": "I04",
          "Descripción": "Equipo de computo y accesorios",
          "Régimen Fiscal": "601, 603, 606, 612, 620, 621, 622, 623, 624, 625, 626"
        },
        {
          "Clave": "I05",
          "Descripción": "Dados, troqueles, moldes, matrices y herramental",
          "Régimen Fiscal": "601, 603, 606, 612, 620, 621, 622, 623, 624, 625, 626"
        },
        {
          "Clave": "I06",
          "Descripción": "Comunicaciones telefónicas",
          "Régimen Fiscal": "601, 603, 606, 612, 620, 621, 622, 623, 624, 625, 626"
        },
        {
          "Clave": "I07",
          "Descripción": "Comunicaciones satelitales",
          "Régimen Fiscal": "601, 603, 606, 612, 620, 621, 622, 623, 624, 625, 626"
        },
        {
          "Clave": "I08",
          "Descripción": "Otra maquinaria y equipo",
          "Régimen Fiscal": "601, 603, 606, 612, 620, 621, 622, 623, 624, 625, 626"
        },
        {
          "Clave": "D01",
          "Descripción": "Honorarios médicos, dentales y gastos hospitalarios",
          "Régimen Fiscal": "605, 606, 608, 611, 612, 614, 607, 615, 625"
        },
        {
          "Clave": "D02",
          "Descripción": "Gastos médicos por incapacidad o discapacidad",
          "Régimen Fiscal": "605, 606, 608, 611, 612, 614, 607, 615, 625"
        },
        {
          "Clave": "D03",
          "Descripción": "Gastos funerales",
          "Régimen Fiscal": "605, 606, 608, 611, 612, 614, 607, 615, 625"
        },
        {
          "Clave": "D04",
          "Descripción": "Donativos",
          "Régimen Fiscal": "605, 606, 608, 611, 612, 614, 607, 615, 625"
        },
        {
          "Clave": "D05",
          "Descripción": "Intereses reales efectivamente pagados por créditos hipotecarios (casa habitación)",
          "Régimen Fiscal": "605, 606, 608, 611, 612, 614, 607, 615, 625"
        },
        {
          "Clave": "D06",
          "Descripción": "Aportaciones voluntarias al SAR",
          "Régimen Fiscal": "605, 606, 608, 611, 612, 614, 607, 615, 625"
        },
        {
          "Clave": "D07",
          "Descripción": "Primas por seguros de gastos médicos",
          "Régimen Fiscal": "605, 606, 608, 611, 612, 614, 607, 615, 625"
        },
        {
          "Clave": "D08",
          "Descripción": "Gastos de transportación escolar obligatoria",
          "Régimen Fiscal": "605, 606, 608, 611, 612, 614, 607, 615, 625"
        },
        {
          "Clave": "D09",
          "Descripción": "Depósitos en cuentas para el ahorro, primas que tengan como base planes de pensiones",
          "Régimen Fiscal": "605, 606, 608, 611, 612, 614, 607, 615, 625"
        },
        {
          "Clave": "D10",
          "Descripción": "Pagos por servicios educativos (colegiaturas)",
          "Régimen Fiscal": "605, 606, 608, 611, 612, 614, 607, 615, 625"
        },
        {
          "Clave": "S01",
          "Descripción": "Sin efectos fiscales",
          "Régimen Fiscal": "601, 603, 605, 606, 608, 610, 611, 612, 614, 616, 620, 621, 622, 623, 624, 607, 615, 625, 626"
        },
        {
          "Clave": "CP01",
          "Descripción": "Pagos",
          "Régimen Fiscal": "601, 603, 605, 606, 608, 610, 611, 612, 614, 616, 620, 621, 622, 623, 624, 607, 615, 625, 626"
        },
        {
          "Clave": "CN01",
          "Descripción": "Nómina",
          "Régimen Fiscal": "605"
        }
      ]
};
const getters = {};

const actions = {
    getCfdi( {commit} ){
        axios
        .get(process.env.VUE_APP_BACKEND_ROUTE + "api/v1/cfdi/all")
        .then(response => {
            commit('setCfdi', response.data);
        });
    }
};

const mutations = {
    setCfdi(state, data){
        state.cfdis = data.filter(cfdi=>cfdi.id>100);
    }
};

export default{
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}