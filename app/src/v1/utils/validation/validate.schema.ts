import { ZodError, ZodSchema } from 'zod';
import { exceptionService } from '../../core/errors/exceptions';
import { ZODERROR_CODES } from '../../presenters/middlewares/schemas/validateSchema.middleware';

export const validatePayloadSchema = (schema: ZodSchema, payload: any) => {
  try {
    schema.parse(payload) as any;
  } catch (err: any) {
    if (err instanceof ZodError) {
      const errorsPayload = {};

      err.errors.forEach((element: any) => {
        if (element?.code === ZODERROR_CODES.UNRECOGNIZED_KEYS) {
          element.keys?.forEach((el: string) => {
            errorsPayload[el] = `${el} is not allowed!`;
          });
        } else {
          errorsPayload[element.path ? element.path[0] : element?.validation || 'error'] =
            element.message;
        }
      });
      exceptionService.unprocessabhleEntityException({
        message: 'Error',
        errors: errorsPayload,
      });
      return errorsPayload;
    }
    exceptionService.internalException({
      message: 'erreur serveur',
    });
  }
};
