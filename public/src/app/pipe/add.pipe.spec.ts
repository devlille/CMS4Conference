import { AddPipe } from './add.pipe';

describe('AddPipe', () => {
  it('create an instance', () => {
    const pipe = new AddPipe();
    expect(pipe).toBeTruthy();
  });
});
