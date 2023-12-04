import { z } from 'zod';
import { ZodValidationMessageCommon } from '../utils/commonErrorMessage';
import { ZodValidationMessageAuth } from './utils/errorMessage';

const registerSchema = z
  .object({
    email: z.string().email({
      message: `${ZodValidationMessageAuth.STRING_EMAIL_INVALID_MESSAGE}`,
    }),
    firstName: z.string().min(2, {
      message: `nom ${ZodValidationMessageAuth.STRING_NAME_MINIMUM_MESSAGE}`,
    }),
    lastName: z.string().min(2, {
      message: `nom de famille ${ZodValidationMessageAuth.STRING_NAME_MINIMUM_MESSAGE}`,
    }),
    password: z
      .string()
      .min(8, {
        message: `${ZodValidationMessageAuth.STRING_PASSWORD_MINIMUM_MESSAGE}`,
      })
      .regex(
        /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@#$%^&+=!]).{8,}$/,
        `${ZodValidationMessageAuth.STRING_PASSWORD_INVALID_MESSAGE}`,
      ),
    picture: z.string(),
  })
  .strict(`${ZodValidationMessageCommon.FIELDS_UNEXPECTED_MESSAGE}`);

export default registerSchema;
