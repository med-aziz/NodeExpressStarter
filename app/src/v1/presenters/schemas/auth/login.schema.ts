import { z } from 'zod';
import { ZodValidationMessageCommon } from '../utils/commonErrorMessage';
import { ZodValidationMessageAuth } from './utils/errorMessage';

const loginSchema = z
  .object({
    email: z.string().email({
      message: `${ZodValidationMessageAuth.STRING_EMAIL_INVALID_MESSAGE}`,
    }),
    password: z.string().min(8, {
      message: `${ZodValidationMessageAuth.STRING_PASSWORD_MINIMUM_MESSAGE}`,
    }),
  })
  .strict(`${ZodValidationMessageCommon.FIELDS_UNEXPECTED_MESSAGE}`);

export default loginSchema;
