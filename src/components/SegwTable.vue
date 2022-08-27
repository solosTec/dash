<template>
    <div class="shadow">
        <DataTable :value="customers" stripedRows :paginator="true" :rows="10"
            paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
            :rowsPerPageOptions="[10, 20, 50]" responsiveLayout="scroll"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords}" paginatorPosition="top"
            v-model:selection="selectedCustomers1" selectionMode="multiple" dataKey="id">

            <Column field="{{name}}" header="name"></Column>

            <template #paginatorend>
                <!-- Set position of paginator -->
                <Button type="button" icon="pi pi-cloud" class="p-button-text" />
            </template>
        </DataTable>
    </div>
</template>

<script>
import CustomerService from '../service/CustomerService';
//import {FilterMatchMode,FilterOperator} from 'primevue/api';

export default {
    data() {
        return {
            customers: null,
            selectedCustomer1: null,
            selectedCustomer2: null,
            selectedCustomer3: null,
            selectedCustomers1: null,
            selectedCustomers2: null,
            selectedCustomers3: null
        }
    },
    customerService: null,
    created() {
        this.customerService = new CustomerService();
    },
    methods: {
        onRowSelect(event) {
            this.$toast.add({ severity: 'info', summary: 'Customer Selected', detail: 'name: ' + event.data.name, life: 3000 });
        },
        onRowUnselect(event) {
            this.$toast.add({ severity: 'warn', summary: 'Customer Unselected', detail: 'name: ' + event.data.name, life: 3000 });
        }
    },
    mounted() {
        this.customerService.getCustomersLarge().then(data => this.customers = data);
    }
}

</script>
