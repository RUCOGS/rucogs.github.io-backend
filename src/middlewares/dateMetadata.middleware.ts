export function dateMetadataMiddleware(generateDate: () => any) {
  return {
    async before(args: any, context: any) {
      let changes;
      let filter;
      switch (args.operation) {
        case 'insert':
          changes = args.params.record;
          break;
        case 'update':
          changes = args.params.changes;
          break;
        case 'replace':
          changes = args.params.replace;
          args.params.filter
          break;
        default:
          return {
            ...args,
            continue: true
          }
      }
      for (const field in changes) {
        const metadata = context.schema[field].metadata;
        if (metadata) {
          if (args.operation === 'insert' && metadata.createdAt) {
            (<any>changes)[field] = generateDate();
          }
          if (metadata.updateAt) {
            (<any>changes)[field] = generateDate();
          }
        }
      }
    }
  };
}