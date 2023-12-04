import { z } from 'zod';
import { ZodValidationMessageCommon } from '../utils/commonErrorMessage';
import { ZodValidationMessageAuth } from './utils/errorMessage';

const updateProfileSchema = z
  .object({
    email: z.union([
      z.string().email({
        message: `${ZodValidationMessageAuth.STRING_EMAIL_INVALID_MESSAGE}`,
      }),
      z.undefined(),
    ]),
    firstName: z.union([
      z.string().min(2, {
        message: `nom ${ZodValidationMessageAuth.STRING_NAME_MINIMUM_MESSAGE}`,
      }),
      z.undefined(),
    ]),
    lastName: z.union([
      z.string().min(2, {
        message: `nom de famille ${ZodValidationMessageAuth.STRING_NAME_MINIMUM_MESSAGE}`,
      }),
      z.undefined(),
    ]),
    picture: z.union([z.string(), z.undefined()]),
  })
  .strict(`${ZodValidationMessageCommon.FIELDS_UNEXPECTED_MESSAGE}`)
  .refine((data) => data?.email || data?.firstName || data?.lastName || data?.picture);

export default updateProfileSchema;
