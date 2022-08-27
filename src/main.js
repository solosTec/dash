import "bootstrap/dist/css/bootstrap.min.css"
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import i18n from './i18n'
import PrimeVue from 'primevue/config';


import "primevue/resources/themes/saga-blue/theme.css"     //theme
import "primevue/resources/primevue.min.css"                //core css
import "primeicons/primeicons.css"     

import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import ColumnGroup from 'primevue/columngroup';     //optional for column grouping
import RowTable from 'primevue/row';

createApp(App).use(i18n).use(router).use(PrimeVue).component('DataTable', DataTable).component('Column', Column).component('ColumnGroup', ColumnGroup).component('RowTable', RowTable).mount('#app')

import "bootstrap/dist/js/bootstrap.js"
