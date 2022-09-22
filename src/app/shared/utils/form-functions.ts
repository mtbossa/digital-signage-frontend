import { FormGroup } from "@angular/forms";

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
