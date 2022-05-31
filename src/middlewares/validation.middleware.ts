export type ValidationParams = {
  [entity: string]: {
    [field: string]: ((newValue: any) => Promise<Error | void>)[]
  }
}

export function mergeValidationParams(... params: ValidationParams[]) {
  return mergeUnionArraysMany(...params) as ValidationParams;
}

export function mergeUnionArraysMany(... elements: any[]) {
  if (elements.length == 1)
    return elements[0];
  let finalObject: any = mergeUnionArrays(elements[0], elements[1])
  for (let i = 1; i < elements.length - 1; i++) {
    finalObject = mergeUnionArrays(elements[i], elements[i + 1]);
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
      if (Array.isArray(oneValue) && Array.isArray(twoValue)) {
        finalObject[oneProp] = [ ...oneValue, ...twoValue ];
      } else if (typeof twoValue === "object" && typeof oneValue === "object") {
        finalObject[oneProp] = mergeUnionArrays(twoValue, oneValue);
      } else {
        // We are a non mergable type, so do nothing
      }
    } else {
      finalObject[oneProp] = oneValue;
    }
  }
  return finalObject;
}

export function validationMiddleware(...allParams: ValidationParams[]) {
  const validationParams = mergeValidationParams(...allParams);
  return {
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
      const validationFns = validationParams[context.daoName];
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
          const error = await validationFn(changes[key]);
          if (error) {
            error.message = `Validation failed on field "${context.daoName}.${key}": ${error.message}`;
            throw error;
          }
        }
      }
      return {
        ...args,
        continue: true
      }
    }
  }
}