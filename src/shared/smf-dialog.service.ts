import { CombinedVueInstance, VueConstructor } from "vue/types/vue";
import SmfGenericFormDialog from "@/components/dialogs/smf-generic-form-dialog.vue";
import SmfDeleteConfirmDialog from "@/components/dialogs/smf-delete-confirm-dialog.vue";
import { PropType } from "vue";
import { LocaleMessages, TranslateResult } from "vue-i18n";

export interface DialogFormState<T> {
  invalid: boolean;
  formModel: T;
}

export type VueComponentInstance = CombinedVueInstance<any, any, any, any, any>;

export class SmfDialogService {
  /**
   * Opens a standard form dialog. the form button is active if the form is valid and
   * there are no changes to the data.
   * @param parent the parent component that opens the dialog. usually "this"
   * @param title the title for the dialog
   * @param dialogComponentType the dialog content. must have a prop formModel and
   *          should emit DialogFormState on mount and changes to the $v. or just use
   *          the mixin: SmfDialogContentMixin
   * @param formModel the Model that will be passed to the form.
   *
   * @returns a Promise. the value is the changed(!) formModel or null in case of cancel or close.
   */
  public static openFormDialog<T>(
    parent: VueComponentInstance,
    title: string | LocaleMessages,
    dialogComponentType: VueConstructor,
    formModel: T
  ): Promise<T> {
    const dialogContentComponent = new dialogComponentType({
      // pass a copy to avoid changing the input data in the view - even if they are not saved
      propsData: { formModel: Object.assign({}, formModel) }
    });

    return new Promise<T>(resolve => {
      new SmfGenericFormDialog({
        propsData: { parent, dialogContentComponent, title }
      }).$on("close", (e: T) => {
        // remove all properties from the processed object thatstrat
        // with _. These props are client only
        Object.keys(e).forEach(key => {
          if (key.startsWith("_")) {
            delete (e as any)[key];
          }
        });
        resolve(e);
      });
    });
  }

  public static confirmDelete(
    parent: VueComponentInstance,
    title: string | TranslateResult
  ): Promise<boolean> {
    return new Promise<boolean>(resolve => {
      new SmfDeleteConfirmDialog({ propsData: { parent, title } }).$on(
        "close",
        (e: boolean) => {
          resolve(e);
        }
      );
    });
  }
}

function emitFormState(this: any) {
  this.$emit("formState", {
    invalid: this.$v.$invalid,
    formModel: this.$v.formModel.$model
  } as DialogFormState<any>);
}

export const SmfDialogContentMixin = {
  props: {
    formModel: {
      type: Object as PropType<any>,
      required: true
    }
  },
  mounted() {
    // emit the initial state - because the component is mounted after creation
    emitFormState.call(this);
  },
  watch: {
    $v: {
      immediate: true,
      handler() {
        emitFormState.call(this);
      },
      deep: true
    }
  }
};
