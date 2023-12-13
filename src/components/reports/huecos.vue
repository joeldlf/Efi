<template>
  <v-card class="elevation-0 mx-8 my-2 py-4 px-8">
    <v-row class="ma-0 pb-0">
        <v-card-title>
            Huecos
        </v-card-title>
        <v-spacer/>
        <div>
        <v-menu offset-y :close-on-content-click="closeDatePicker(month_filter)">
            <template v-slot:activator="{ on, attrs }">
                <v-text-field rounded outlined dense clearable v-model="month_filter" label="Meses" prepend-inner-icon="mdi-calendar" v-bind="attrs" readonly v-on="on" class="mt-0"></v-text-field>
            </template>
            <v-date-picker v-model="month_filter" type="month" range></v-date-picker>
        </v-menu>
        </div>
    </v-row>
    
    <v-data-table
        height="600"
        fixed-header
        :loading="loading"
        :headers="headers_to_show"
        :items="records">
    </v-data-table>

  </v-card>
</template>

<script>
import VueHorizontal from 'vue-horizontal';
import axios from "axios"
export default {
    components: {
        VueHorizontal
    },
    data(){
        return{
            loading:true,
            month_filter:[],
            records:[],
            headers:[],
            headers_to_show:[],
        }
    },
    watch:{
        month_filter:{
            handler(){
                if(this.month_filter==null){
                    this.loading = true
                    this.headers_to_show = this.headers
                    this.loading = false
                }else if(this.month_filter.length==2){
                    this.loading = true
                    const months = this.headers.filter(header=>
                        header.key>=new Date(this.month_filter[0]+'-01')
                        &&
                        header.key<=new Date(this.month_filter[1]+'-01')
                    )
                    this.headers_to_show = [{text:'Cliente', value:'name', width: '100%'}].concat(months)
                    this.loading = false
                }
            }, deep:true
        }
    },
    created(){
        axios.get(process.env.VUE_APP_BACKEND_ROUTE + "api/v2/huecos").then(response=>{
            const resp = response.data.map(id=>{return{
                ...id,
                month_year:this.monthName(id.month) + ' ' + id.year,
            }});
            this.headers = [
                { text: 'Cliente', value: 'name', width: '300px' },
                ...[...new Set(resp.map(objeto => objeto.month_year))].map(month_year => {
                    const [year, month] = month_year.split(' ');
                    const key = new Date(`${year}-${month}-01`);
                    return {
                        text: month_year,
                        value: month_year,
                        key: key,
                    };
                }),
            ];
            
            const grouped = {};
            for (const item of resp) {
                if (!grouped[item.name]) {
                    grouped[item.name] = {
                        name: item.name,
                    };
                }
                grouped[item.name][item.month_year] = (item.sale_amount*1).toLocaleString('es-MX', { style: 'currency', currency: 'MXN',}) + '\n' + item.kg_amount.toFixed(0) + ' kgs'
            }
            this.records = Object.values(grouped);

            this.month_filter = [(new Date().getFullYear() + '-01'), (new Date().getFullYear() + '-12')]

            this.loading = false
        })
    },
    methods:{
        closeDatePicker(dates){
            if(dates!=undefined && dates.length==2){
                return true
            }else{
                return false
            }
        },
        monthName(month){
            switch(month){
                case 1: return 'Enero'
                case 2: return 'Febrero'
                case 3: return 'Marzo'
                case 4: return 'Abril'
                case 5: return 'Mayo'
                case 6: return 'Junio'
                case 7: return 'Julio'
                case 8: return 'Agosto'
                case 9: return 'Septiembre'
                case 10: return 'Octubre'
                case 11: return 'Noviembre'
                case 12: return 'Diciembre'
            }
        }
    }
}
</script>