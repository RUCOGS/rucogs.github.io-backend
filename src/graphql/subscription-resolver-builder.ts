import { ApolloResolversContext } from "@src/misc/context";
import { FilterFn, withFilter } from "graphql-subscriptions";
import pubsub, { PubSubEvents } from "./pubsub";

export function makeSubscriptionResolver() {
  return new SubscriptionResolverBuilder();
}

export type SubscriptionResolverFunction = (parent: any, args: any, context: ApolloResolversContext, info: any) => AsyncIterator<any> | Promise<AsyncIterator<any>>;
export type SecurityFunction = (parent: any, args: any, context: ApolloResolversContext, info: any) => Promise<void>;

export class SubscriptionResolverBuilder {
  private iteratorFn?: () => AsyncIterator<any>;
  private filterFn?: FilterFn
  private securityFn?: SecurityFunction;

  constructor() {

  }

  pubsub(...events: PubSubEvents[]) {
    this.iteratorFn = () => pubsub.asyncIterator(events);
    return this;
  }

  shallowFilter(payloadTargetPath: string, filterObjectPath: string = "filter") {
    this.filterFn = (payload, args) => {
      if (Object.keys(args.filter).length === 0)
        return false;
      
      for (const key in args.filter) {
        if (args[filterObjectPath][key]) { 
          if (payload[payloadTargetPath][key] !== args[filterObjectPath][key])
            return false;
        }
      }

      return true;
    }
    return this;
  }

  secure(securityFn: SecurityFunction) {
    this.securityFn = securityFn;
    return this;
  }

  build(): any {
    if (!this.iteratorFn) {
      throw new Error("Subscription resolver must have async iterator function!");
    }
    const iteratorFn = this.iteratorFn;
    const securityFn = this.securityFn;
    let baseFn: SubscriptionResolverFunction = (parent, args, context, info) => iteratorFn();
    
    if (this.filterFn)
      baseFn = withFilter(
        iteratorFn,
        this.filterFn
      );

    return async(parent: any, args: any, context: any, info: any) => {
      if (securityFn)
        await securityFn(parent, args, context, info);
      return baseFn(parent, args, context, info);
    };
  }
}