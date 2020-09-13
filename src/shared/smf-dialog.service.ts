import {CombinedVueInstance, VueConstructor} from 'vue/types/vue';
import SmfDialog from '@/components/dialogs/smf-dialog.vue';
import {BBrokerPortHardwareConfig} from '@/api/broker';


export interface DialogFormState<T> {
    invalid: boolean;
    formModel: T;
}

export type VueComponentInstance = CombinedVueInstance<any, any, any, any, any>;

export class SmfDialogService {

    /**
     * Opens a standard form dialog. the form button is active if the form is valid and
     * there are no changes to the data.
     * @param parent the parent component taht opens the dialog. usually "this"
     * @param title teh title for the dialog
     * @param dialogComponentType the dialog content. must have a prop formModel and
     *          should emit DialogFormState on mount and changes to to $v.
     * @param formModel the Model that will be passed to the form.
     *
     * @returns a Promise the value is the changed formModel or null.
     */
    public static openFormDialog<T>(
        parent: VueComponentInstance,
        title: string,
        dialogComponentType: VueConstructor,
        formModel: T): Promise<T | null> {

        const dialogContentComponent = new dialogComponentType({
            propsData: {formModel: formModel}
        });

        return new Promise<any>((resolve) => {
            const dialog = new SmfDialog({
                propsData: {
                    parent,
                    dialogContentComponent,
                    title
                },
            })
            dialog.$on('close', (e: T | null) => {
                resolve(e)
            })
        });


    }

    public static emitFormState(this: any) {
        this.$emit('formState', {
            invalid: this.$v.$invalid,
            formModel: this.$v.formModel.$model
        } as DialogFormState<BBrokerPortHardwareConfig>)
    }
}
