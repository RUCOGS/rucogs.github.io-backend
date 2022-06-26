import { gql } from 'graphql-tag';

export default gql`
  scalar Upload

  enum UploadOperation {
    INSERT
    DELETE
  }

  input UploadWithOperation {
    upload: Upload
    operation: UploadOperation
  }

  input UploadOrSource {
    upload: Upload
    source: String
  }

  type Subscription
`;
