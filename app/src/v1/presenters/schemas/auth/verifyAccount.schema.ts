import { z } from 'zod';
import { ZodValidationMessageCommon } from '../utils/commonErrorMessage';

const verifyAccountSchema = z
  .object({
    code: z.string().min(1, {
      message: 'veuillez utiliser le code reçu dans votre email',
    }),
  })
  .strict(`${ZodValidationMessageCommon.FIELDS_UNEXPECTED_MESSAGE}`);

export default verifyAccountSchema;
