import { z } from 'zod';
import { ZodValidationMessageCommon } from '../utils/commonErrorMessage';
import { ZodValidationMessageAuth } from './utils/errorMessage';

const passwordResetSchema = z
  .object({
    token: z.string().min(1, {
      message: 'veuillez vérifier le jeton',
    }),
    newPassword: z
      .string()
      .min(8, {
        message: `${ZodValidationMessageAuth.STRING_PASSWORD_MINIMUM_MESSAGE}`,
      })
      .regex(
        /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@#$%^&+=!]).{8,}$/,
        `${ZodValidationMessageAuth.STRING_PASSWORD_INVALID_MESSAGE}`,
      ),
  })
  .strict(`${ZodValidationMessageCommon.FIELDS_UNEXPECTED_MESSAGE}`);

export default passwordResetSchema;
