export function maxLengthValidator(context: { requiredLength: string }): string {
  return `Máximo de caracteres — ${context.requiredLength}`;
}

export function minLengthValidator(context: { requiredLength: string }): string {
  return `Mínimo de caracteres — ${context.requiredLength}`;
}

export default {
  required: `Valor obrigatório`,
  maxlength: maxLengthValidator,
  minlength: minLengthValidator,
};
