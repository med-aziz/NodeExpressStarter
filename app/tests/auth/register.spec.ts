import { validateRegisterPayload } from 'app/src/v1/usecases/auth/register.usecase';

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
      console.log('here + ', data.payload.email);
      it('SHOULD RETURN AN ERROR', () => {
        expect(() => {
          validateRegisterPayload(data.payload);
        }).toThrow('Error');
      });
    } else {
      it('SHOULD SUCCEED', () => {
        const result = validateRegisterPayload(data.payload);
        expect(result).toEqual(true);
      });
    }
  }
});
