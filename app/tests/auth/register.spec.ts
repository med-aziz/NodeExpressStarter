import { validateRegisterPayload } from 'app/src/v1/usecases/auth/register.usecase';
import { VALIDATION_ERROR_MESSAGE } from 'app/src/v1/utils/validation/validate.schema';

const payload: Array<{ payload: any; err: boolean }> = [
  {
    payload: {
      email: 'notemail',
      firstName: 'firstname',
      lastName: 'lastname',
      password: 'passwordA@1',
      picture: '',
    },
    err: true,
  },
  {
    payload: {
      email: 'notemail@gmail.com',
      firstName: '1',
      lastName: 'lastname',
      password: 'passwordA@1',
      picture: '',
    },
    err: true,
  },
  {
    payload: {
      email: 'notemail@gmail.com',
      firstName: 'firstname',
      lastName: 'lastname',
      password: 'password',
      picture: '',
    },
    err: true,
  },
  {
    payload: {
      email: 'notemail@gmail.com',
      firstName: 'firstname',
      lastName: 'lastname',
      password: 'password@A1',
      picture: '',
    },
    err: false,
  },
];

describe('RESIGTER USER', () => {
  for (const data of payload) {
    if (data.err) {
      it('SHOULD RETURN AN ERROR', () => {
        expect(() => {
          validateRegisterPayload(data.payload);
        }).toThrow(VALIDATION_ERROR_MESSAGE);
      });
    } else {
      it('SHOULD SUCCEED', () => {
        const result = validateRegisterPayload(data.payload);
        expect(result).toEqual(true);
      });
    }
  }
});
