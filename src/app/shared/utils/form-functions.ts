import { FormGroup } from "@angular/forms";
import { isEqual } from "lodash";
import { map } from "rxjs";

export const disableAllFormControlsBut = (
  mustNotBeDisabled: string[],
  form: FormGroup
) => {
  Object.keys(form.controls)
    .filter((key) => !mustNotBeDisabled.includes(key))
    .forEach((key) => {
      form.get(key)?.disable();
    });
};

export const isFormSameData = <T>(form: FormGroup, compareData: T) =>
  form.valueChanges.pipe(map((newFormData) => isEqual(newFormData, compareData)));
