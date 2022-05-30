import { EntityManager } from "@src/generated/typetta";

export type ValidationOptions = {
  [entity: string]: {
    [field: string]: (() => Promise<boolean>)[]
  }
}

export function mergeValidationOptions(... options: ValidationOptions[]) {
  return mergeUnionArraysMany(options) as ValidationOptions;
}

export function mergeUnionArraysMany(... elements: any[]) {
  if (elements.length == 1)
    return elements[0];
  let finalObject: any = mergeUnionArraysMany(elements[0], elements[1])
  for (let i = 1; i < elements.length - 1; i++) {
    finalObject = mergeUnionArraysMany(elements[i], elements[i + 1]);
  }
  return finalObject;
}

export function mergeUnionArrays(one: any, two: any) {
  const checkedProps = new Set<string>();
  return {
    ...mergeUnionArraysHalf(one, two, checkedProps),
    ...mergeUnionArraysHalf(two, one, checkedProps)
  }
}

export function mergeUnionArraysHalf(one: any, two: any, checkedProps: Set<string>) {
  const finalObject: any = {};
  for (const oneProp in one) {
    if (checkedProps.has(oneProp))
      continue;
    checkedProps.add(oneProp);
    const oneValue = one[oneProp];
    const twoValue = two[oneProp]; 
    if (!oneValue)
      continue;
    if (twoValue) {
      if (typeof twoValue === "object" && typeof oneValue === "object") {
        finalObject[oneProp] = mergeUnionArrays(twoValue, oneValue);
      } else if (Array.isArray(oneValue) && Array.isArray(twoValue)) {
        finalObject[oneProp] = [ ...oneValue, ...twoValue ];
      } else {
        // We are a non mergable type, so do nothing
      }
    } else {
      finalObject[oneProp] = oneValue;
    }
  }
  return finalObject;
}

export class ValidationMiddleware {
  constructor(
    public validationOptions: ValidationOptions
  ) {}

  async before(args: any, context: any) {
    let changes;
    switch(args.operation) {
      case 'insert':
        changes = args.params.record
        break;  
      case 'replace':
        changes = args.params.replace
        break;
      case 'update':
        changes = args.params.changes
        break;
      default:
        return {
          ...args,
          continue: true
        }
    }
    // Find the set of validation functions for this object
    const validationFns = this.validationOptions[context.daoName];
    if (!validationFns) {
      return {
        ...args,
        continue: true
      }
    }
    // Apply the validation functions corresopnding to each
    // field for the fields that have changed.
    for (const key in changes) {
      if (!validationFns[key])
        continue;
      for (const validationFn of validationFns[key]) {
        const valid = await validationFn();
        if (!valid) {
          return <any>{
            ...args,
            continue: false
          }
        }
      }
    }
    return {
      ...args,
      continue: true
    }
  }
}