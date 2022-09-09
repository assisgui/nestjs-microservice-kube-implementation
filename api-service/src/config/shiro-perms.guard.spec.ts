import { ShiroPermsGuard } from './shiro-perms.guard';

describe('ShiroPermsGuard', () => {
  it('should be defined', () => {
    expect(new ShiroPermsGuard()).toBeDefined();
  });
});
