import passport from 'passport';
import type { Strategy } from 'passport';
import type { GraphqlContextUser } from '@schamane/graphql-middleware';
import { get } from 'lodash';

const CONTEXT_ATTR = 'context';

export type GraphQLAuthCreateContext<T extends GraphqlContextUser> = (user: unknown, authInfo?: unknown) => T | Promise<T>;

export const createContext =
  <T extends GraphqlContextUser>(authStrategy: string | string[] | Strategy, createContextFn?: GraphQLAuthCreateContext<T>) =>
  async ({ req, connection }: { req: Request; connection: unknown }): Promise<T> => {
    if (connection) {
      return get(connection, CONTEXT_ATTR);
    }
    return new Promise((resolve, reject) => passport.authenticate(authStrategy, { session: false }, async (err, user, authInfo) => (err ? reject(err) : resolve(createContextFn ? await createContextFn(user, authInfo) : user)))(req));
  };

export const defaultServerContextCreator: GraphQLAuthCreateContext<GraphqlContextUser> = ({ id, groups }) => ({
  id,
  groups
});
