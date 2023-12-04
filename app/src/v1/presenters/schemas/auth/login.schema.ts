import { z } from 'zod';
import { ZodValidationMessageCommon } from '../utils/commonErrorMessage';
import { INVALID_EMAIL_ERROR_MESSAGE, INVALID_PASSWORD_ERROR_MESSAGE } from '../../../domain/auth/errors';

const loginSchema = z
  .object({
    email: z.string().email({
      message: INVALID_EMAIL_ERROR_MESSAGE,
    }),
    password: z.string().min(8, {
      message: INVALID_PASSWORD_ERROR_MESSAGE,
    }),
  })
  .strict(`${ZodValidationMessageCommon.FIELDS_UNEXPECTED_MESSAGE}`);

export default loginSchema;
