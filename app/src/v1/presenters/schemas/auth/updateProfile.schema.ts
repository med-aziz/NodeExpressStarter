import { z } from 'zod';
import { ZodValidationMessageCommon } from '../utils/commonErrorMessage';
import {
  FIRST_NAME_TOO_SHORT_ERROR_MESSAGE,
  INVALID_EMAIL_ERROR_MESSAGE,
  LAST_NAME_TOO_SHORT_ERROR_MESSAGE,
} from '../../../domain/auth/errors';

const updateProfileSchema = z
  .object({
    email: z.union([
      z.string().email({
        message: INVALID_EMAIL_ERROR_MESSAGE,
      }),
      z.undefined(),
    ]),
    firstName: z.union([
      z.string().min(2, {
        message: FIRST_NAME_TOO_SHORT_ERROR_MESSAGE,
      }),
      z.undefined(),
    ]),
    lastName: z.union([
      z.string().min(2, {
        message: LAST_NAME_TOO_SHORT_ERROR_MESSAGE,
      }),
      z.undefined(),
    ]),
    picture: z.union([z.string(), z.undefined()]),
  })
  .strict(`${ZodValidationMessageCommon.FIELDS_UNEXPECTED_MESSAGE}`)
  .refine((data) => data?.email || data?.firstName || data?.lastName || data?.picture);

export default updateProfileSchema;
