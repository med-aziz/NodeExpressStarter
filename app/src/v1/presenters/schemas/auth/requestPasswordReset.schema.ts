import { z } from 'zod';
import { ZodValidationMessageCommon } from '../utils/commonErrorMessage';
import { ZodValidationMessageAuth } from './utils/errorMessage';

const requestPasswordResetSchema = z
  .object({
    email: z.string().email({
      message: `${ZodValidationMessageAuth.STRING_EMAIL_INVALID_MESSAGE}`,
    }),
  })
  .strict(`${ZodValidationMessageCommon.FIELDS_UNEXPECTED_MESSAGE}`);

export default requestPasswordResetSchema;
