import { Strategy } from 'passport';
import { values } from 'lodash';
import { DEFAULT_ACCESS_ROLES, DEFAULT_USER_ID } from '@schamane/graphql-middleware';
import type { GraphqlContextUser } from '@schamane/graphql-middleware';

export const MOCK_STRATEGY = 'mock';

export type MockVerifyFunction = (username: string, password: string, done: (error: unknown, user?: unknown) => void) => unknown;

export const LocalUser: GraphqlContextUser = {
  id: DEFAULT_USER_ID,
  groups: values(DEFAULT_ACCESS_ROLES)
};

export class MockStrategy extends Strategy {
  public name?: string;

  private mockVerify: MockVerifyFunction;

  public constructor(verify: MockVerifyFunction) {
    super();
    this.name = MOCK_STRATEGY;
    this.mockVerify = verify;
  }

  public authenticate(): void {
    this.mockVerify(DEFAULT_USER_ID, 'password', this.verified.bind(this));
  }

  private verified(err: unknown, user?: Record<string, unknown>): void {
    if (err) {
      return this.error(err);
    }
    if (!user) {
      return this.fail('no user');
    }
    return this.success(user);
  }
}
