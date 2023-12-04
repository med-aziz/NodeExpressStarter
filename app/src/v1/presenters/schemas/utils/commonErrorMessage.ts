export enum ZodValidationMessageCommon {
  FIELDS_UNEXPECTED_MESSAGE = 'champs inattendus',
  FIELDS_EMPTY_MESSAGE = 'Rien à mettre à jour',
  FIELDS_EMPTY_KEY = 'data',
}

export const FIELDS_EMPTY_OBJECT = {
  message: `${ZodValidationMessageCommon.FIELDS_EMPTY_MESSAGE}`,
  path: [`${ZodValidationMessageCommon.FIELDS_EMPTY_KEY}`],
};
