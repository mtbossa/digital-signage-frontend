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

export const disableOnlyFormControls = (mustBeDisabled: string[], form: FormGroup) => {
  Object.keys(form.controls)
    .filter((key) => mustBeDisabled.includes(key))
    .forEach((key) => {
      form.get(key)?.disable();
    });
};

export const isFormSameData = <T>(form: FormGroup, compareData: T) =>
  form.valueChanges.pipe(map((newFormData) => isEqual(newFormData, compareData)));

export const getDirtyValues = (form: FormGroup) => {
  const dirtyValues: { [key: string]: any } = {};

  Object.keys(form.controls).forEach((key) => {
    const currentControl = form.controls[key];

    if (currentControl.dirty) {
      dirtyValues[key] = currentControl.value;
    }
  });

  return dirtyValues;
};
