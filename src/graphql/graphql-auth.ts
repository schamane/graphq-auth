import { AuthenticationError } from 'apollo-server-express';
import { includes, isNil } from 'lodash';
import type { GraphqlContextUser } from '@schamane/graphql-middleware';

const validContext = (ctx: GraphqlContextUser): boolean => !isNil(ctx.id);

export const hasRole = (ctx: GraphqlContextUser, group: string): boolean => {
  if (!validContext(ctx) || !ctx.groups) {
    // eslint-disable-next-line no-console
    console.error('GrapqhlContext for user', JSON.stringify(ctx.id), JSON.stringify(ctx.groups));
    throw new AuthenticationError(`No user context!`);
  }

  return includes(ctx.groups, group);
};

export const assertRole = (ctx: GraphqlContextUser): void => {
  if (!validContext(ctx)) {
    throw new AuthenticationError(`No user context!`);
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type MyResolverFn<T = unknown> = (rootValue?: any, args?: any, context?: any, info?: any) => T;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const authenticated =
  <T>(next: MyResolverFn<T>) =>
  (...args: unknown[]): T => {
    if (!validContext(args[2] as GraphqlContextUser)) {
      throw new AuthenticationError(`Forbidden`);
    }

    return next(...args);
  };

export const onlyWithAdminRole =
  <T>(next: MyResolverFn<T>, group = 'admin') =>
  (...args: unknown[]): T => {
    const context = args[2] as GraphqlContextUser;
    if (!includes(context.groups, group)) {
      throw new AuthenticationError(`Missing admin permissions!`);
    }
    return next(...args);
  };
