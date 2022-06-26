import { ApolloResolversContext } from '@src/misc/context';
import { FilterFn, withFilter } from 'graphql-subscriptions';
import pubsub, { PubSubEvents } from './pubsub';

export function makeSubscriptionResolver() {
  return new SubscriptionResolverBuilder();
}

export type SubscriptionResolverFunction = (
  parent: any,
  args: any,
  context: ApolloResolversContext,
  info: any,
) => AsyncIterator<any>;
export type SecurityFunction = (parent: any, args: any, context: ApolloResolversContext, info: any) => Promise<void>;

export class SubscriptionResolverBuilder {
  private iteratorFn?: () => AsyncIterator<any>;
  private filterFns: FilterFn[] = [];
  private securityFn?: SecurityFunction;
  private mapFns: ((payload: any, args: any, context: any, info: any) => any)[] = [];

  pubsub(...events: PubSubEvents[]) {
    this.iteratorFn = () => pubsub.asyncIterator(events);
    return this;
  }

  mapId() {
    this.map((payload) => payload.id);
    return this;
  }

  map(mapFn: (payload: any, args: any, context: any, info: any) => any) {
    this.mapFns.push(mapFn);
    return this;
  }

  filter(filter: FilterFn) {
    this.filterFns.push(filter);
  }

  shallowOneToOneFilter(payloadTargetPath = '', filterObjectPath = 'filter') {
    this.filterFns.push((payload, args) => {
      if (Object.keys(args.filter).length === 0) return false;

      const payloadTarget = payloadTargetPath ? payload[payloadTargetPath] : payload;
      for (const key in args.filter) {
        if (payloadTarget[key] !== args[filterObjectPath][key]) return false;
      }

      return true;
    });
    return this;
  }

  secure(securityFn: SecurityFunction) {
    this.securityFn = securityFn;
    return this;
  }

  build(): any {
    if (!this.iteratorFn) {
      throw new Error('Subscription resolver must have iterator function!');
    }

    // pipe() technically accepts a spread of operations, but TS typings
    // use generics, which only applies up to 11 operations
    const iteratorFn = this.iteratorFn;
    const securityFn = this.securityFn;
    const filterFns = this.filterFns;
    const mapFns = this.mapFns;
    let baseFn: SubscriptionResolverFunction = iteratorFn;

    if (filterFns.length > 0)
      baseFn = withFilter(baseFn, async (payload: any, variables: any) => {
        for (const filterFn of filterFns) if (!(await filterFn(payload, variables))) return false;
        return true;
      });

    return {
      subscribe: async (parent: any, args: any, context: any, info: any) => {
        if (securityFn) await securityFn(parent, args, context, info);
        return baseFn(parent, args, context, info);
      },
      resolve: (payload: any, args: any, context: any, info: any) => {
        let processedPayload = payload;
        for (const mapFn of mapFns) {
          processedPayload = mapFn(processedPayload, args, context, info);
        }
        return processedPayload;
      },
    };
  }
}
