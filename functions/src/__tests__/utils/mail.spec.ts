import { Email } from '../../model';
import { getFrom } from '../../utils/mail';

it('should return from parameters for email', () => {
  const email = {
    from: 'mail',
    fromname: 'GDG Lille'
  } as Email;

  expect(getFrom(email)).toEqual({
    From: {
      Email: 'mail',
      Name: 'GDG Lille'
    }
  });
});
