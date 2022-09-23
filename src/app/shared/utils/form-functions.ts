import { FormGroup } from "@angular/forms";
import { isEqual } from "lodash";
import { map, merge, Observable, tap } from "rxjs";

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

export const isFormSameData = <T>(form: FormGroup, compareData: T | undefined) =>
  form.valueChanges.pipe(
    tap((newFormData) => console.log({ newFormData, compareData })),
    map((newFormData) => isEqual(newFormData, compareData))
  );
