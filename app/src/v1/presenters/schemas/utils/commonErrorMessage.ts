export enum ZodValidationMessageCommon {
  FIELDS_UNEXPECTED_MESSAGE = 'Unexpected Values',
  FIELDS_EMPTY_MESSAGE = 'No Fields Specified',
  FIELDS_EMPTY_KEY = 'data',
}

export const FIELDS_EMPTY_OBJECT = {
  message: `${ZodValidationMessageCommon.FIELDS_EMPTY_MESSAGE}`,
  path: [`${ZodValidationMessageCommon.FIELDS_EMPTY_KEY}`],
};
