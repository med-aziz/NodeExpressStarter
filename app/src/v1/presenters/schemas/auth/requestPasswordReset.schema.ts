import { z } from 'zod';
import { ZodValidationMessageCommon } from '../utils/commonErrorMessage';
import { INVALID_EMAIL_ERROR_MESSAGE } from '../../../domain/auth/errors';

const requestPasswordResetSchema = z
  .object({
    email: z.string().email({
      message: INVALID_EMAIL_ERROR_MESSAGE,
    }),
  })
  .strict(`${ZodValidationMessageCommon.FIELDS_UNEXPECTED_MESSAGE}`);

export default requestPasswordResetSchema;
