export function dateMetadataMiddleware(generateDate: () => any) {
  return {
    async before(args: any, context: any) {
      let changes;
      switch (args.operation) {
        case 'insert':
          changes = args.params.record;
          break;
        case 'update':
          changes = args.params.changes;
          break;
        case 'replace':
          changes = args.params.replace;
          break;
        default:
          return {
            ...args,
            continue: true,
          };
      }
      const now: Date = generateDate();
      for (const field in context.schema) {
        const metadata = context.schema[field].metadata;
        if (metadata) {
          if ((args.operation === 'insert' && metadata.createdAt) || metadata.updatedAt) {
            (<any>changes)[field] = now;
          }
        }
      }
      return {
        ...args,
        continue: true,
      };
    },
  };
}
