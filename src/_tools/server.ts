import { typeDefs } from '@src/shared/typedefs-resolvers';
import { ApolloServer } from 'apollo-server';
import { exec } from 'child_process';

let start = process.hrtime();

const elapsedTime = function(){
  const precision = 3; // 3 decimal places
  const elapsed = process.hrtime(start)[1] / 1000000; // divide by a million to get nano to milli
  const oldStart = start;
  start = process.hrtime();
  return process.hrtime(oldStart)[0] + " s, " + elapsed.toFixed(precision) + " ms"; // print message + time
}

function execute(command: string, endCallback: (output: string) => void){
    exec(command, function(error, stdout, stderr){ endCallback(stdout); });
};

// Server used for tooling, etc.
// Files under _dev are not compile for
// production builds

// Used to generate endpoint-resolvers.types
// We need to start a server to generate types because
// we can't find a way to load types from a typescript
// file at the moment.
async function startBasicGraphQLServerForCodeGen() {
  const server = new ApolloServer({
    typeDefs,
    csrfPrevention: true,
  });

  // The `listen` method launches a web server.
  server.listen().then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`);
    execute("graphql-codegen --config codegen.yml", () => {
      server.stop();
      console.log(`💫 Endpoint code generation complete in ${elapsedTime()}.`);
    });
  });
}

// Parse command line arguments
const args = process.argv.slice(2);
switch (args[0]) {
  case "graphql-codegen":
    startBasicGraphQLServerForCodeGen();
    break;
}