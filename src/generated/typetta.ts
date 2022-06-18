import * as T from '@twinlogix/typetta'
import * as types from './model.types'
import * as M from 'mongodb'

export type ScalarsSpecification = {
  ID: { type: types.Scalars['ID']; isTextual: false; isQuantitative: false }
  String: { type: types.Scalars['String']; isTextual: true; isQuantitative: false }
  Boolean: { type: types.Scalars['Boolean']; isTextual: false; isQuantitative: false }
  Int: { type: types.Scalars['Int']; isTextual: false; isQuantitative: true }
  Float: { type: types.Scalars['Float']; isTextual: false; isQuantitative: true }
  Access: { type: types.Access; isTextual: false; isQuantitative: false }
  Date: { type: types.Scalars['Date']; isTextual: false; isQuantitative: false }
  InviteType: { type: types.InviteType; isTextual: false; isQuantitative: false }
  Json: { type: types.Scalars['Json']; isTextual: false; isQuantitative: false }
  Permission: { type: types.Permission; isTextual: false; isQuantitative: false }
  RoleCode: { type: types.RoleCode; isTextual: false; isQuantitative: false }
  SortDirection: { type: types.SortDirection; isTextual: false; isQuantitative: false }
  StringFilterMode: { type: types.StringFilterMode; isTextual: false; isQuantitative: false }
  Upload: { type: types.Scalars['Upload']; isTextual: false; isQuantitative: false }
  UploadOperation: { type: types.UploadOperation; isTextual: false; isQuantitative: false }
}

export type AST = {
  EBoard: {
    fields: {
      createdAt: { type: 'scalar'; isList: false; astName: 'Date'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'generator' }
      graduatedAt: { type: 'scalar'; isList: false; astName: 'Date'; isRequired: false; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
      id: { type: 'scalar'; isList: false; astName: 'ID'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: true; generationStrategy: 'db' }
      roles: {
        type: 'relation'
        relation: 'foreign'
        isList: true
        astName: 'EBoardRole'
        isRequired: true
        isListElementRequired: true
        isExcluded: false
        isId: false
        generationStrategy: 'undefined'
      }
      user: { type: 'relation'; relation: 'inner'; isList: false; astName: 'User'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
      userId: { type: 'scalar'; isList: false; astName: 'ID'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
    }
    driverSpecification: {
      rawFilter: () => M.Filter<M.Document>
      rawUpdate: () => M.UpdateFilter<M.Document>
      rawSorts: () => M.Sort
    }
  }
  EBoardRole: {
    fields: {
      eBoard: { type: 'relation'; relation: 'inner'; isList: false; astName: 'EBoard'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
      eBoardId: { type: 'scalar'; isList: false; astName: 'ID'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
      id: { type: 'scalar'; isList: false; astName: 'ID'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: true; generationStrategy: 'db' }
      roleCode: { type: 'scalar'; isList: false; astName: 'RoleCode'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
    }
    driverSpecification: {
      rawFilter: () => M.Filter<M.Document>
      rawUpdate: () => M.UpdateFilter<M.Document>
      rawSorts: () => M.Sort
    }
  }
  Project: {
    fields: {
      access: { type: 'scalar'; isList: false; astName: 'Access'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
      bannerLink: { type: 'scalar'; isList: false; astName: 'String'; isRequired: false; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
      cardImageLink: { type: 'scalar'; isList: false; astName: 'String'; isRequired: false; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
      completedAt: { type: 'scalar'; isList: false; astName: 'Date'; isRequired: false; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
      createdAt: { type: 'scalar'; isList: false; astName: 'Date'; isRequired: false; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
      description: { type: 'scalar'; isList: false; astName: 'String'; isRequired: false; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
      downloadLinks: { type: 'scalar'; isList: true; astName: 'String'; isRequired: false; isListElementRequired: true; isExcluded: false; isId: false; generationStrategy: 'undefined' }
      galleryImageLinks: { type: 'scalar'; isList: true; astName: 'String'; isRequired: false; isListElementRequired: true; isExcluded: false; isId: false; generationStrategy: 'undefined' }
      id: { type: 'scalar'; isList: false; astName: 'ID'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: true; generationStrategy: 'db' }
      invites: {
        type: 'relation'
        relation: 'foreign'
        isList: true
        astName: 'ProjectInvite'
        isRequired: true
        isListElementRequired: true
        isExcluded: false
        isId: false
        generationStrategy: 'undefined'
      }
      members: {
        type: 'relation'
        relation: 'foreign'
        isList: true
        astName: 'ProjectMember'
        isRequired: true
        isListElementRequired: true
        isExcluded: false
        isId: false
        generationStrategy: 'undefined'
      }
      name: { type: 'scalar'; isList: false; astName: 'String'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
      pitch: { type: 'scalar'; isList: false; astName: 'String'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
      soundcloudEmbedSrc: { type: 'scalar'; isList: false; astName: 'String'; isRequired: false; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
      tags: { type: 'scalar'; isList: true; astName: 'String'; isRequired: false; isListElementRequired: true; isExcluded: false; isId: false; generationStrategy: 'undefined' }
      updatedAt: { type: 'scalar'; isList: false; astName: 'Date'; isRequired: false; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
    }
    driverSpecification: {
      rawFilter: () => M.Filter<M.Document>
      rawUpdate: () => M.UpdateFilter<M.Document>
      rawSorts: () => M.Sort
    }
  }
  ProjectInvite: {
    fields: {
      createdAt: { type: 'scalar'; isList: false; astName: 'Date'; isRequired: false; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
      id: { type: 'scalar'; isList: false; astName: 'ID'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: true; generationStrategy: 'db' }
      project: {
        type: 'relation'
        relation: 'inner'
        isList: false
        astName: 'Project'
        isRequired: true
        isListElementRequired: false
        isExcluded: false
        isId: false
        generationStrategy: 'undefined'
      }
      projectId: { type: 'scalar'; isList: false; astName: 'ID'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
      type: { type: 'scalar'; isList: false; astName: 'InviteType'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
      user: { type: 'relation'; relation: 'inner'; isList: false; astName: 'User'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
      userId: { type: 'scalar'; isList: false; astName: 'ID'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
    }
    driverSpecification: {
      rawFilter: () => M.Filter<M.Document>
      rawUpdate: () => M.UpdateFilter<M.Document>
      rawSorts: () => M.Sort
    }
  }
  ProjectMember: {
    fields: {
      contributions: { type: 'scalar'; isList: false; astName: 'String'; isRequired: false; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
      createdAt: { type: 'scalar'; isList: false; astName: 'Date'; isRequired: false; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
      id: { type: 'scalar'; isList: false; astName: 'ID'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: true; generationStrategy: 'db' }
      project: {
        type: 'relation'
        relation: 'inner'
        isList: false
        astName: 'Project'
        isRequired: true
        isListElementRequired: false
        isExcluded: false
        isId: false
        generationStrategy: 'undefined'
      }
      projectId: { type: 'scalar'; isList: false; astName: 'ID'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
      roles: {
        type: 'relation'
        relation: 'foreign'
        isList: true
        astName: 'ProjectMemberRole'
        isRequired: true
        isListElementRequired: true
        isExcluded: false
        isId: false
        generationStrategy: 'undefined'
      }
      updatedAt: { type: 'scalar'; isList: false; astName: 'Date'; isRequired: false; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
      user: { type: 'relation'; relation: 'inner'; isList: false; astName: 'User'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
      userId: { type: 'scalar'; isList: false; astName: 'ID'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
    }
    driverSpecification: {
      rawFilter: () => M.Filter<M.Document>
      rawUpdate: () => M.UpdateFilter<M.Document>
      rawSorts: () => M.Sort
    }
  }
  ProjectMemberRole: {
    fields: {
      id: { type: 'scalar'; isList: false; astName: 'ID'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: true; generationStrategy: 'db' }
      projectMember: {
        type: 'relation'
        relation: 'inner'
        isList: false
        astName: 'ProjectMember'
        isRequired: true
        isListElementRequired: false
        isExcluded: false
        isId: false
        generationStrategy: 'undefined'
      }
      projectMemberId: { type: 'scalar'; isList: false; astName: 'ID'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
      roleCode: { type: 'scalar'; isList: false; astName: 'RoleCode'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
    }
    driverSpecification: {
      rawFilter: () => M.Filter<M.Document>
      rawUpdate: () => M.UpdateFilter<M.Document>
      rawSorts: () => M.Sort
    }
  }
  Subscription: {
    fields: {
      eBoardCreated: { type: 'scalar'; isList: false; astName: 'ID'; isRequired: false; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
      eBoardDeleted: { type: 'scalar'; isList: false; astName: 'ID'; isRequired: false; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
      eBoardUpdated: { type: 'scalar'; isList: false; astName: 'ID'; isRequired: false; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
      projectCreated: { type: 'scalar'; isList: false; astName: 'ID'; isRequired: false; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
      projectDeleted: { type: 'scalar'; isList: false; astName: 'ID'; isRequired: false; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
      projectInviteCreated: { type: 'scalar'; isList: false; astName: 'ID'; isRequired: false; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
      projectInviteDeleted: { type: 'scalar'; isList: false; astName: 'ID'; isRequired: false; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
      projectMemberCreated: { type: 'scalar'; isList: false; astName: 'ID'; isRequired: false; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
      projectMemberDeleted: { type: 'scalar'; isList: false; astName: 'ID'; isRequired: false; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
      projectMemberUpdated: { type: 'scalar'; isList: false; astName: 'ID'; isRequired: false; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
      projectUpdated: { type: 'scalar'; isList: false; astName: 'ID'; isRequired: false; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
      userCreated: { type: 'scalar'; isList: false; astName: 'ID'; isRequired: false; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
      userDeleted: { type: 'scalar'; isList: false; astName: 'ID'; isRequired: false; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
      userUpdated: { type: 'scalar'; isList: false; astName: 'ID'; isRequired: false; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
    }
    driverSpecification: {
      rawFilter: never
      rawUpdate: never
      rawSorts: never
    }
  }
  User: {
    fields: {
      avatarLink: { type: 'scalar'; isList: false; astName: 'String'; isRequired: false; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
      bannerLink: { type: 'scalar'; isList: false; astName: 'String'; isRequired: false; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
      bio: { type: 'scalar'; isList: false; astName: 'String'; isRequired: false; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
      createdAt: { type: 'scalar'; isList: false; astName: 'Date'; isRequired: false; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
      displayName: { type: 'scalar'; isList: false; astName: 'String'; isRequired: false; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
      eBoard: {
        type: 'relation'
        relation: 'foreign'
        isList: false
        astName: 'EBoard'
        isRequired: false
        isListElementRequired: false
        isExcluded: false
        isId: false
        generationStrategy: 'undefined'
      }
      email: { type: 'scalar'; isList: false; astName: 'String'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
      id: { type: 'scalar'; isList: false; astName: 'ID'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: true; generationStrategy: 'db' }
      loginIdentities: {
        type: 'relation'
        relation: 'foreign'
        isList: true
        astName: 'UserLoginIdentity'
        isRequired: true
        isListElementRequired: true
        isExcluded: false
        isId: false
        generationStrategy: 'undefined'
      }
      projectInvites: {
        type: 'relation'
        relation: 'foreign'
        isList: true
        astName: 'ProjectInvite'
        isRequired: true
        isListElementRequired: true
        isExcluded: false
        isId: false
        generationStrategy: 'undefined'
      }
      projectMembers: {
        type: 'relation'
        relation: 'foreign'
        isList: true
        astName: 'ProjectMember'
        isRequired: true
        isListElementRequired: true
        isExcluded: false
        isId: false
        generationStrategy: 'undefined'
      }
      roles: {
        type: 'relation'
        relation: 'foreign'
        isList: true
        astName: 'UserRole'
        isRequired: true
        isListElementRequired: true
        isExcluded: false
        isId: false
        generationStrategy: 'undefined'
      }
      socials: {
        type: 'relation'
        relation: 'foreign'
        isList: true
        astName: 'UserSocial'
        isRequired: true
        isListElementRequired: true
        isExcluded: false
        isId: false
        generationStrategy: 'undefined'
      }
      updatedAt: { type: 'scalar'; isList: false; astName: 'Date'; isRequired: false; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
      username: { type: 'scalar'; isList: false; astName: 'String'; isRequired: false; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
    }
    driverSpecification: {
      rawFilter: () => M.Filter<M.Document>
      rawUpdate: () => M.UpdateFilter<M.Document>
      rawSorts: () => M.Sort
    }
  }
  UserLoginIdentity: {
    fields: {
      data: { type: 'scalar'; isList: false; astName: 'Json'; isRequired: false; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
      id: { type: 'scalar'; isList: false; astName: 'ID'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: true; generationStrategy: 'db' }
      identityId: { type: 'scalar'; isList: false; astName: 'String'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
      name: { type: 'scalar'; isList: false; astName: 'String'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
      user: { type: 'relation'; relation: 'inner'; isList: false; astName: 'User'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
      userId: { type: 'scalar'; isList: false; astName: 'ID'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
    }
    driverSpecification: {
      rawFilter: () => M.Filter<M.Document>
      rawUpdate: () => M.UpdateFilter<M.Document>
      rawSorts: () => M.Sort
    }
  }
  UserRole: {
    fields: {
      id: { type: 'scalar'; isList: false; astName: 'ID'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: true; generationStrategy: 'db' }
      roleCode: { type: 'scalar'; isList: false; astName: 'RoleCode'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
      user: { type: 'relation'; relation: 'inner'; isList: false; astName: 'User'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
      userId: { type: 'scalar'; isList: false; astName: 'ID'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
    }
    driverSpecification: {
      rawFilter: () => M.Filter<M.Document>
      rawUpdate: () => M.UpdateFilter<M.Document>
      rawSorts: () => M.Sort
    }
  }
  UserSocial: {
    fields: {
      id: { type: 'scalar'; isList: false; astName: 'ID'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: true; generationStrategy: 'db' }
      link: { type: 'scalar'; isList: false; astName: 'String'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
      platform: { type: 'scalar'; isList: false; astName: 'String'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
      user: { type: 'relation'; relation: 'inner'; isList: false; astName: 'User'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
      userId: { type: 'scalar'; isList: false; astName: 'ID'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
      username: { type: 'scalar'; isList: false; astName: 'String'; isRequired: true; isListElementRequired: false; isExcluded: false; isId: false; generationStrategy: 'undefined' }
    }
    driverSpecification: {
      rawFilter: () => M.Filter<M.Document>
      rawUpdate: () => M.UpdateFilter<M.Document>
      rawSorts: () => M.Sort
    }
  }
}

export function eBoardSchema(): T.Schema<ScalarsSpecification> {
  return {
    createdAt: {
      type: 'scalar',
      scalar: 'Date',
      required: true,
      generationStrategy: 'generator',
    },
    graduatedAt: {
      type: 'scalar',
      scalar: 'Date',
    },
    id: {
      type: 'scalar',
      scalar: 'ID',
      isId: true,
      generationStrategy: 'db',
      required: true,
      alias: '_id',
    },
    roles: {
      type: 'relation',
      relation: 'foreign',
      schema: () => eBoardRoleSchema(),
      refFrom: 'eBoardId',
      refTo: 'id',
      dao: 'eBoardRole',
      isListElementRequired: true,
      required: true,
      isList: true,
    },
    user: {
      type: 'relation',
      relation: 'inner',
      schema: () => userSchema(),
      refFrom: 'userId',
      refTo: 'id',
      dao: 'user',
      required: true,
    },
    userId: {
      type: 'scalar',
      scalar: 'ID',
      required: true,
    },
  }
}

type EBoardDAOGenerics<MetadataType, OperationMetadataType> = T.MongoDBDAOGenerics<
  'EBoard',
  AST,
  ScalarsSpecification,
  EBoardCachedTypes,
  MetadataType,
  OperationMetadataType,
  EntityManager<MetadataType, OperationMetadataType>
>
export type EBoardDAOParams<MetadataType, OperationMetadataType> = Omit<
  T.MongoDBDAOParams<EBoardDAOGenerics<MetadataType, OperationMetadataType>>,
  'idGenerator' | 'idField' | 'schema' | 'idScalar' | 'idGeneration'
>
export type InMemoryEBoardDAOParams<MetadataType, OperationMetadataType> = Omit<
  T.InMemoryDAOParams<EBoardDAOGenerics<MetadataType, OperationMetadataType>>,
  'idGenerator' | 'idField' | 'schema' | 'idScalar' | 'idGeneration'
>

export type EBoardIdFields = T.IdFields<'EBoard', AST>
export interface EBoardModel extends types.EBoard {}
export interface EBoardInsert extends T.Insert<'EBoard', AST, ScalarsSpecification> {}
export interface EBoardPlainModel extends T.GenerateModel<'EBoard', AST, ScalarsSpecification, 'relation'> {}
export interface EBoardProjection extends T.Projection<'EBoard', AST> {}
export interface EBoardUpdate extends T.Update<'EBoard', AST, ScalarsSpecification> {}
export interface EBoardFilter extends T.Filter<'EBoard', AST, ScalarsSpecification> {}
export interface EBoardSortElement extends T.SortElement<'EBoard', AST> {}
export interface EBoardRelationsFindParams extends T.RelationsFindParams<'EBoard', AST, ScalarsSpecification> {}
export type EBoardParams<P extends EBoardProjection> = T.Params<'EBoard', AST, ScalarsSpecification, P>
export type EBoardCachedTypes = T.CachedTypes<EBoardIdFields, EBoardModel, EBoardInsert, EBoardPlainModel, EBoardProjection, EBoardUpdate, EBoardFilter, EBoardSortElement, EBoardRelationsFindParams>

export class EBoardDAO<MetadataType, OperationMetadataType> extends T.AbstractMongoDBDAO<EBoardDAOGenerics<MetadataType, OperationMetadataType>> {
  public static projection<P extends T.Projection<'EBoard', AST>>(p: P) {
    return p
  }
  public static mergeProjection<P1 extends T.Projection<'EBoard', AST>, P2 extends T.Projection<'EBoard', AST>>(p1: P1, p2: P2): T.SelectProjection<T.Projection<'EBoard', AST>, P1, P2> {
    return T.mergeProjections(p1, p2) as T.SelectProjection<T.Projection<'EBoard', AST>, P1, P2>
  }
  public constructor(params: EBoardDAOParams<MetadataType, OperationMetadataType>) {
    super({
      ...params,
      schema: eBoardSchema(),
    })
  }
}

export class InMemoryEBoardDAO<MetadataType, OperationMetadataType> extends T.AbstractInMemoryDAO<EBoardDAOGenerics<MetadataType, OperationMetadataType>> {
  public static projection<P extends T.Projection<'EBoard', AST>>(p: P) {
    return p
  }
  public static mergeProjection<P1 extends T.Projection<'EBoard', AST>, P2 extends T.Projection<'EBoard', AST>>(p1: P1, p2: P2): T.SelectProjection<T.Projection<'EBoard', AST>, P1, P2> {
    return T.mergeProjections(p1, p2) as T.SelectProjection<T.Projection<'EBoard', AST>, P1, P2>
  }
  public constructor(params: InMemoryEBoardDAOParams<MetadataType, OperationMetadataType>) {
    super({
      ...params,
      schema: eBoardSchema(),
    })
  }
}
export function eBoardRoleSchema(): T.Schema<ScalarsSpecification> {
  return {
    eBoard: {
      type: 'relation',
      relation: 'inner',
      schema: () => eBoardSchema(),
      refFrom: 'eBoardId',
      refTo: 'id',
      dao: 'eBoard',
      required: true,
    },
    eBoardId: {
      type: 'scalar',
      scalar: 'ID',
      required: true,
    },
    id: {
      type: 'scalar',
      scalar: 'ID',
      isId: true,
      generationStrategy: 'db',
      required: true,
      alias: '_id',
    },
    roleCode: {
      type: 'scalar',
      scalar: 'String',
      required: true,
      isEnum: true,
    },
  }
}

type EBoardRoleDAOGenerics<MetadataType, OperationMetadataType> = T.MongoDBDAOGenerics<
  'EBoardRole',
  AST,
  ScalarsSpecification,
  EBoardRoleCachedTypes,
  MetadataType,
  OperationMetadataType,
  EntityManager<MetadataType, OperationMetadataType>
>
export type EBoardRoleDAOParams<MetadataType, OperationMetadataType> = Omit<
  T.MongoDBDAOParams<EBoardRoleDAOGenerics<MetadataType, OperationMetadataType>>,
  'idGenerator' | 'idField' | 'schema' | 'idScalar' | 'idGeneration'
>
export type InMemoryEBoardRoleDAOParams<MetadataType, OperationMetadataType> = Omit<
  T.InMemoryDAOParams<EBoardRoleDAOGenerics<MetadataType, OperationMetadataType>>,
  'idGenerator' | 'idField' | 'schema' | 'idScalar' | 'idGeneration'
>

export type EBoardRoleIdFields = T.IdFields<'EBoardRole', AST>
export interface EBoardRoleModel extends types.EBoardRole {}
export interface EBoardRoleInsert extends T.Insert<'EBoardRole', AST, ScalarsSpecification> {}
export interface EBoardRolePlainModel extends T.GenerateModel<'EBoardRole', AST, ScalarsSpecification, 'relation'> {}
export interface EBoardRoleProjection extends T.Projection<'EBoardRole', AST> {}
export interface EBoardRoleUpdate extends T.Update<'EBoardRole', AST, ScalarsSpecification> {}
export interface EBoardRoleFilter extends T.Filter<'EBoardRole', AST, ScalarsSpecification> {}
export interface EBoardRoleSortElement extends T.SortElement<'EBoardRole', AST> {}
export interface EBoardRoleRelationsFindParams extends T.RelationsFindParams<'EBoardRole', AST, ScalarsSpecification> {}
export type EBoardRoleParams<P extends EBoardRoleProjection> = T.Params<'EBoardRole', AST, ScalarsSpecification, P>
export type EBoardRoleCachedTypes = T.CachedTypes<
  EBoardRoleIdFields,
  EBoardRoleModel,
  EBoardRoleInsert,
  EBoardRolePlainModel,
  EBoardRoleProjection,
  EBoardRoleUpdate,
  EBoardRoleFilter,
  EBoardRoleSortElement,
  EBoardRoleRelationsFindParams
>

export class EBoardRoleDAO<MetadataType, OperationMetadataType> extends T.AbstractMongoDBDAO<EBoardRoleDAOGenerics<MetadataType, OperationMetadataType>> {
  public static projection<P extends T.Projection<'EBoardRole', AST>>(p: P) {
    return p
  }
  public static mergeProjection<P1 extends T.Projection<'EBoardRole', AST>, P2 extends T.Projection<'EBoardRole', AST>>(p1: P1, p2: P2): T.SelectProjection<T.Projection<'EBoardRole', AST>, P1, P2> {
    return T.mergeProjections(p1, p2) as T.SelectProjection<T.Projection<'EBoardRole', AST>, P1, P2>
  }
  public constructor(params: EBoardRoleDAOParams<MetadataType, OperationMetadataType>) {
    super({
      ...params,
      schema: eBoardRoleSchema(),
    })
  }
}

export class InMemoryEBoardRoleDAO<MetadataType, OperationMetadataType> extends T.AbstractInMemoryDAO<EBoardRoleDAOGenerics<MetadataType, OperationMetadataType>> {
  public static projection<P extends T.Projection<'EBoardRole', AST>>(p: P) {
    return p
  }
  public static mergeProjection<P1 extends T.Projection<'EBoardRole', AST>, P2 extends T.Projection<'EBoardRole', AST>>(p1: P1, p2: P2): T.SelectProjection<T.Projection<'EBoardRole', AST>, P1, P2> {
    return T.mergeProjections(p1, p2) as T.SelectProjection<T.Projection<'EBoardRole', AST>, P1, P2>
  }
  public constructor(params: InMemoryEBoardRoleDAOParams<MetadataType, OperationMetadataType>) {
    super({
      ...params,
      schema: eBoardRoleSchema(),
    })
  }
}
export function projectSchema(): T.Schema<ScalarsSpecification> {
  return {
    access: {
      type: 'scalar',
      scalar: 'String',
      required: true,
      isEnum: true,
    },
    bannerLink: {
      type: 'scalar',
      scalar: 'String',
    },
    cardImageLink: {
      type: 'scalar',
      scalar: 'String',
    },
    completedAt: {
      type: 'scalar',
      scalar: 'Date',
    },
    createdAt: {
      type: 'scalar',
      scalar: 'Date',
      metadata: Object.fromEntries([['createdAt', 'true']]),
    },
    description: {
      type: 'scalar',
      scalar: 'String',
    },
    downloadLinks: {
      type: 'scalar',
      scalar: 'String',
      isListElementRequired: true,
      isList: true,
    },
    galleryImageLinks: {
      type: 'scalar',
      scalar: 'String',
      isListElementRequired: true,
      isList: true,
    },
    id: {
      type: 'scalar',
      scalar: 'ID',
      isId: true,
      generationStrategy: 'db',
      required: true,
      alias: '_id',
    },
    invites: {
      type: 'relation',
      relation: 'foreign',
      schema: () => projectInviteSchema(),
      refFrom: 'projectId',
      refTo: 'id',
      dao: 'projectInvite',
      isListElementRequired: true,
      required: true,
      isList: true,
    },
    members: {
      type: 'relation',
      relation: 'foreign',
      schema: () => projectMemberSchema(),
      refFrom: 'projectId',
      refTo: 'id',
      dao: 'projectMember',
      isListElementRequired: true,
      required: true,
      isList: true,
    },
    name: {
      type: 'scalar',
      scalar: 'String',
      required: true,
    },
    pitch: {
      type: 'scalar',
      scalar: 'String',
      required: true,
    },
    soundcloudEmbedSrc: {
      type: 'scalar',
      scalar: 'String',
    },
    tags: {
      type: 'scalar',
      scalar: 'String',
      isListElementRequired: true,
      isList: true,
    },
    updatedAt: {
      type: 'scalar',
      scalar: 'Date',
      metadata: Object.fromEntries([['createdAt', 'true']]),
    },
  }
}

type ProjectDAOGenerics<MetadataType, OperationMetadataType> = T.MongoDBDAOGenerics<
  'Project',
  AST,
  ScalarsSpecification,
  ProjectCachedTypes,
  MetadataType,
  OperationMetadataType,
  EntityManager<MetadataType, OperationMetadataType>
>
export type ProjectDAOParams<MetadataType, OperationMetadataType> = Omit<
  T.MongoDBDAOParams<ProjectDAOGenerics<MetadataType, OperationMetadataType>>,
  'idGenerator' | 'idField' | 'schema' | 'idScalar' | 'idGeneration'
>
export type InMemoryProjectDAOParams<MetadataType, OperationMetadataType> = Omit<
  T.InMemoryDAOParams<ProjectDAOGenerics<MetadataType, OperationMetadataType>>,
  'idGenerator' | 'idField' | 'schema' | 'idScalar' | 'idGeneration'
>

export type ProjectIdFields = T.IdFields<'Project', AST>
export interface ProjectModel extends types.Project {}
export interface ProjectInsert extends T.Insert<'Project', AST, ScalarsSpecification> {}
export interface ProjectPlainModel extends T.GenerateModel<'Project', AST, ScalarsSpecification, 'relation'> {}
export interface ProjectProjection extends T.Projection<'Project', AST> {}
export interface ProjectUpdate extends T.Update<'Project', AST, ScalarsSpecification> {}
export interface ProjectFilter extends T.Filter<'Project', AST, ScalarsSpecification> {}
export interface ProjectSortElement extends T.SortElement<'Project', AST> {}
export interface ProjectRelationsFindParams extends T.RelationsFindParams<'Project', AST, ScalarsSpecification> {}
export type ProjectParams<P extends ProjectProjection> = T.Params<'Project', AST, ScalarsSpecification, P>
export type ProjectCachedTypes = T.CachedTypes<
  ProjectIdFields,
  ProjectModel,
  ProjectInsert,
  ProjectPlainModel,
  ProjectProjection,
  ProjectUpdate,
  ProjectFilter,
  ProjectSortElement,
  ProjectRelationsFindParams
>

export class ProjectDAO<MetadataType, OperationMetadataType> extends T.AbstractMongoDBDAO<ProjectDAOGenerics<MetadataType, OperationMetadataType>> {
  public static projection<P extends T.Projection<'Project', AST>>(p: P) {
    return p
  }
  public static mergeProjection<P1 extends T.Projection<'Project', AST>, P2 extends T.Projection<'Project', AST>>(p1: P1, p2: P2): T.SelectProjection<T.Projection<'Project', AST>, P1, P2> {
    return T.mergeProjections(p1, p2) as T.SelectProjection<T.Projection<'Project', AST>, P1, P2>
  }
  public constructor(params: ProjectDAOParams<MetadataType, OperationMetadataType>) {
    super({
      ...params,
      schema: projectSchema(),
    })
  }
}

export class InMemoryProjectDAO<MetadataType, OperationMetadataType> extends T.AbstractInMemoryDAO<ProjectDAOGenerics<MetadataType, OperationMetadataType>> {
  public static projection<P extends T.Projection<'Project', AST>>(p: P) {
    return p
  }
  public static mergeProjection<P1 extends T.Projection<'Project', AST>, P2 extends T.Projection<'Project', AST>>(p1: P1, p2: P2): T.SelectProjection<T.Projection<'Project', AST>, P1, P2> {
    return T.mergeProjections(p1, p2) as T.SelectProjection<T.Projection<'Project', AST>, P1, P2>
  }
  public constructor(params: InMemoryProjectDAOParams<MetadataType, OperationMetadataType>) {
    super({
      ...params,
      schema: projectSchema(),
    })
  }
}
export function projectInviteSchema(): T.Schema<ScalarsSpecification> {
  return {
    createdAt: {
      type: 'scalar',
      scalar: 'Date',
      metadata: Object.fromEntries([['createdAt', 'true']]),
    },
    id: {
      type: 'scalar',
      scalar: 'ID',
      isId: true,
      generationStrategy: 'db',
      required: true,
      alias: '_id',
    },
    project: {
      type: 'relation',
      relation: 'inner',
      schema: () => projectSchema(),
      refFrom: 'projectId',
      refTo: 'id',
      dao: 'project',
      required: true,
    },
    projectId: {
      type: 'scalar',
      scalar: 'ID',
      required: true,
      metadata: Object.fromEntries([['undefined', 'undefined']]),
    },
    type: {
      type: 'scalar',
      scalar: 'String',
      required: true,
      isEnum: true,
    },
    user: {
      type: 'relation',
      relation: 'inner',
      schema: () => userSchema(),
      refFrom: 'userId',
      refTo: 'id',
      dao: 'user',
      required: true,
    },
    userId: {
      type: 'scalar',
      scalar: 'ID',
      required: true,
      metadata: Object.fromEntries([['undefined', 'undefined']]),
    },
  }
}

type ProjectInviteDAOGenerics<MetadataType, OperationMetadataType> = T.MongoDBDAOGenerics<
  'ProjectInvite',
  AST,
  ScalarsSpecification,
  ProjectInviteCachedTypes,
  MetadataType,
  OperationMetadataType,
  EntityManager<MetadataType, OperationMetadataType>
>
export type ProjectInviteDAOParams<MetadataType, OperationMetadataType> = Omit<
  T.MongoDBDAOParams<ProjectInviteDAOGenerics<MetadataType, OperationMetadataType>>,
  'idGenerator' | 'idField' | 'schema' | 'idScalar' | 'idGeneration'
>
export type InMemoryProjectInviteDAOParams<MetadataType, OperationMetadataType> = Omit<
  T.InMemoryDAOParams<ProjectInviteDAOGenerics<MetadataType, OperationMetadataType>>,
  'idGenerator' | 'idField' | 'schema' | 'idScalar' | 'idGeneration'
>

export type ProjectInviteIdFields = T.IdFields<'ProjectInvite', AST>
export interface ProjectInviteModel extends types.ProjectInvite {}
export interface ProjectInviteInsert extends T.Insert<'ProjectInvite', AST, ScalarsSpecification> {}
export interface ProjectInvitePlainModel extends T.GenerateModel<'ProjectInvite', AST, ScalarsSpecification, 'relation'> {}
export interface ProjectInviteProjection extends T.Projection<'ProjectInvite', AST> {}
export interface ProjectInviteUpdate extends T.Update<'ProjectInvite', AST, ScalarsSpecification> {}
export interface ProjectInviteFilter extends T.Filter<'ProjectInvite', AST, ScalarsSpecification> {}
export interface ProjectInviteSortElement extends T.SortElement<'ProjectInvite', AST> {}
export interface ProjectInviteRelationsFindParams extends T.RelationsFindParams<'ProjectInvite', AST, ScalarsSpecification> {}
export type ProjectInviteParams<P extends ProjectInviteProjection> = T.Params<'ProjectInvite', AST, ScalarsSpecification, P>
export type ProjectInviteCachedTypes = T.CachedTypes<
  ProjectInviteIdFields,
  ProjectInviteModel,
  ProjectInviteInsert,
  ProjectInvitePlainModel,
  ProjectInviteProjection,
  ProjectInviteUpdate,
  ProjectInviteFilter,
  ProjectInviteSortElement,
  ProjectInviteRelationsFindParams
>

export class ProjectInviteDAO<MetadataType, OperationMetadataType> extends T.AbstractMongoDBDAO<ProjectInviteDAOGenerics<MetadataType, OperationMetadataType>> {
  public static projection<P extends T.Projection<'ProjectInvite', AST>>(p: P) {
    return p
  }
  public static mergeProjection<P1 extends T.Projection<'ProjectInvite', AST>, P2 extends T.Projection<'ProjectInvite', AST>>(
    p1: P1,
    p2: P2,
  ): T.SelectProjection<T.Projection<'ProjectInvite', AST>, P1, P2> {
    return T.mergeProjections(p1, p2) as T.SelectProjection<T.Projection<'ProjectInvite', AST>, P1, P2>
  }
  public constructor(params: ProjectInviteDAOParams<MetadataType, OperationMetadataType>) {
    super({
      ...params,
      schema: projectInviteSchema(),
    })
  }
}

export class InMemoryProjectInviteDAO<MetadataType, OperationMetadataType> extends T.AbstractInMemoryDAO<ProjectInviteDAOGenerics<MetadataType, OperationMetadataType>> {
  public static projection<P extends T.Projection<'ProjectInvite', AST>>(p: P) {
    return p
  }
  public static mergeProjection<P1 extends T.Projection<'ProjectInvite', AST>, P2 extends T.Projection<'ProjectInvite', AST>>(
    p1: P1,
    p2: P2,
  ): T.SelectProjection<T.Projection<'ProjectInvite', AST>, P1, P2> {
    return T.mergeProjections(p1, p2) as T.SelectProjection<T.Projection<'ProjectInvite', AST>, P1, P2>
  }
  public constructor(params: InMemoryProjectInviteDAOParams<MetadataType, OperationMetadataType>) {
    super({
      ...params,
      schema: projectInviteSchema(),
    })
  }
}
export function projectMemberSchema(): T.Schema<ScalarsSpecification> {
  return {
    contributions: {
      type: 'scalar',
      scalar: 'String',
    },
    createdAt: {
      type: 'scalar',
      scalar: 'Date',
      metadata: Object.fromEntries([['createdAt', 'true']]),
    },
    id: {
      type: 'scalar',
      scalar: 'ID',
      isId: true,
      generationStrategy: 'db',
      required: true,
      alias: '_id',
    },
    project: {
      type: 'relation',
      relation: 'inner',
      schema: () => projectSchema(),
      refFrom: 'projectId',
      refTo: 'id',
      dao: 'project',
      required: true,
    },
    projectId: {
      type: 'scalar',
      scalar: 'ID',
      required: true,
    },
    roles: {
      type: 'relation',
      relation: 'foreign',
      schema: () => projectMemberRoleSchema(),
      refFrom: 'projectMemberId',
      refTo: 'id',
      dao: 'projectMemberRole',
      isListElementRequired: true,
      required: true,
      isList: true,
    },
    updatedAt: {
      type: 'scalar',
      scalar: 'Date',
      metadata: Object.fromEntries([['createdAt', 'true']]),
    },
    user: {
      type: 'relation',
      relation: 'inner',
      schema: () => userSchema(),
      refFrom: 'userId',
      refTo: 'id',
      dao: 'user',
      required: true,
    },
    userId: {
      type: 'scalar',
      scalar: 'ID',
      required: true,
      metadata: Object.fromEntries([['undefined', 'undefined']]),
    },
  }
}

type ProjectMemberDAOGenerics<MetadataType, OperationMetadataType> = T.MongoDBDAOGenerics<
  'ProjectMember',
  AST,
  ScalarsSpecification,
  ProjectMemberCachedTypes,
  MetadataType,
  OperationMetadataType,
  EntityManager<MetadataType, OperationMetadataType>
>
export type ProjectMemberDAOParams<MetadataType, OperationMetadataType> = Omit<
  T.MongoDBDAOParams<ProjectMemberDAOGenerics<MetadataType, OperationMetadataType>>,
  'idGenerator' | 'idField' | 'schema' | 'idScalar' | 'idGeneration'
>
export type InMemoryProjectMemberDAOParams<MetadataType, OperationMetadataType> = Omit<
  T.InMemoryDAOParams<ProjectMemberDAOGenerics<MetadataType, OperationMetadataType>>,
  'idGenerator' | 'idField' | 'schema' | 'idScalar' | 'idGeneration'
>

export type ProjectMemberIdFields = T.IdFields<'ProjectMember', AST>
export interface ProjectMemberModel extends types.ProjectMember {}
export interface ProjectMemberInsert extends T.Insert<'ProjectMember', AST, ScalarsSpecification> {}
export interface ProjectMemberPlainModel extends T.GenerateModel<'ProjectMember', AST, ScalarsSpecification, 'relation'> {}
export interface ProjectMemberProjection extends T.Projection<'ProjectMember', AST> {}
export interface ProjectMemberUpdate extends T.Update<'ProjectMember', AST, ScalarsSpecification> {}
export interface ProjectMemberFilter extends T.Filter<'ProjectMember', AST, ScalarsSpecification> {}
export interface ProjectMemberSortElement extends T.SortElement<'ProjectMember', AST> {}
export interface ProjectMemberRelationsFindParams extends T.RelationsFindParams<'ProjectMember', AST, ScalarsSpecification> {}
export type ProjectMemberParams<P extends ProjectMemberProjection> = T.Params<'ProjectMember', AST, ScalarsSpecification, P>
export type ProjectMemberCachedTypes = T.CachedTypes<
  ProjectMemberIdFields,
  ProjectMemberModel,
  ProjectMemberInsert,
  ProjectMemberPlainModel,
  ProjectMemberProjection,
  ProjectMemberUpdate,
  ProjectMemberFilter,
  ProjectMemberSortElement,
  ProjectMemberRelationsFindParams
>

export class ProjectMemberDAO<MetadataType, OperationMetadataType> extends T.AbstractMongoDBDAO<ProjectMemberDAOGenerics<MetadataType, OperationMetadataType>> {
  public static projection<P extends T.Projection<'ProjectMember', AST>>(p: P) {
    return p
  }
  public static mergeProjection<P1 extends T.Projection<'ProjectMember', AST>, P2 extends T.Projection<'ProjectMember', AST>>(
    p1: P1,
    p2: P2,
  ): T.SelectProjection<T.Projection<'ProjectMember', AST>, P1, P2> {
    return T.mergeProjections(p1, p2) as T.SelectProjection<T.Projection<'ProjectMember', AST>, P1, P2>
  }
  public constructor(params: ProjectMemberDAOParams<MetadataType, OperationMetadataType>) {
    super({
      ...params,
      schema: projectMemberSchema(),
    })
  }
}

export class InMemoryProjectMemberDAO<MetadataType, OperationMetadataType> extends T.AbstractInMemoryDAO<ProjectMemberDAOGenerics<MetadataType, OperationMetadataType>> {
  public static projection<P extends T.Projection<'ProjectMember', AST>>(p: P) {
    return p
  }
  public static mergeProjection<P1 extends T.Projection<'ProjectMember', AST>, P2 extends T.Projection<'ProjectMember', AST>>(
    p1: P1,
    p2: P2,
  ): T.SelectProjection<T.Projection<'ProjectMember', AST>, P1, P2> {
    return T.mergeProjections(p1, p2) as T.SelectProjection<T.Projection<'ProjectMember', AST>, P1, P2>
  }
  public constructor(params: InMemoryProjectMemberDAOParams<MetadataType, OperationMetadataType>) {
    super({
      ...params,
      schema: projectMemberSchema(),
    })
  }
}
export function projectMemberRoleSchema(): T.Schema<ScalarsSpecification> {
  return {
    id: {
      type: 'scalar',
      scalar: 'ID',
      isId: true,
      generationStrategy: 'db',
      required: true,
      alias: '_id',
    },
    projectMember: {
      type: 'relation',
      relation: 'inner',
      schema: () => projectMemberSchema(),
      refFrom: 'projectMemberId',
      refTo: 'id',
      dao: 'projectMember',
      required: true,
    },
    projectMemberId: {
      type: 'scalar',
      scalar: 'ID',
      required: true,
    },
    roleCode: {
      type: 'scalar',
      scalar: 'String',
      required: true,
      isEnum: true,
      metadata: Object.fromEntries([['undefined', 'undefined']]),
    },
  }
}

type ProjectMemberRoleDAOGenerics<MetadataType, OperationMetadataType> = T.MongoDBDAOGenerics<
  'ProjectMemberRole',
  AST,
  ScalarsSpecification,
  ProjectMemberRoleCachedTypes,
  MetadataType,
  OperationMetadataType,
  EntityManager<MetadataType, OperationMetadataType>
>
export type ProjectMemberRoleDAOParams<MetadataType, OperationMetadataType> = Omit<
  T.MongoDBDAOParams<ProjectMemberRoleDAOGenerics<MetadataType, OperationMetadataType>>,
  'idGenerator' | 'idField' | 'schema' | 'idScalar' | 'idGeneration'
>
export type InMemoryProjectMemberRoleDAOParams<MetadataType, OperationMetadataType> = Omit<
  T.InMemoryDAOParams<ProjectMemberRoleDAOGenerics<MetadataType, OperationMetadataType>>,
  'idGenerator' | 'idField' | 'schema' | 'idScalar' | 'idGeneration'
>

export type ProjectMemberRoleIdFields = T.IdFields<'ProjectMemberRole', AST>
export interface ProjectMemberRoleModel extends types.ProjectMemberRole {}
export interface ProjectMemberRoleInsert extends T.Insert<'ProjectMemberRole', AST, ScalarsSpecification> {}
export interface ProjectMemberRolePlainModel extends T.GenerateModel<'ProjectMemberRole', AST, ScalarsSpecification, 'relation'> {}
export interface ProjectMemberRoleProjection extends T.Projection<'ProjectMemberRole', AST> {}
export interface ProjectMemberRoleUpdate extends T.Update<'ProjectMemberRole', AST, ScalarsSpecification> {}
export interface ProjectMemberRoleFilter extends T.Filter<'ProjectMemberRole', AST, ScalarsSpecification> {}
export interface ProjectMemberRoleSortElement extends T.SortElement<'ProjectMemberRole', AST> {}
export interface ProjectMemberRoleRelationsFindParams extends T.RelationsFindParams<'ProjectMemberRole', AST, ScalarsSpecification> {}
export type ProjectMemberRoleParams<P extends ProjectMemberRoleProjection> = T.Params<'ProjectMemberRole', AST, ScalarsSpecification, P>
export type ProjectMemberRoleCachedTypes = T.CachedTypes<
  ProjectMemberRoleIdFields,
  ProjectMemberRoleModel,
  ProjectMemberRoleInsert,
  ProjectMemberRolePlainModel,
  ProjectMemberRoleProjection,
  ProjectMemberRoleUpdate,
  ProjectMemberRoleFilter,
  ProjectMemberRoleSortElement,
  ProjectMemberRoleRelationsFindParams
>

export class ProjectMemberRoleDAO<MetadataType, OperationMetadataType> extends T.AbstractMongoDBDAO<ProjectMemberRoleDAOGenerics<MetadataType, OperationMetadataType>> {
  public static projection<P extends T.Projection<'ProjectMemberRole', AST>>(p: P) {
    return p
  }
  public static mergeProjection<P1 extends T.Projection<'ProjectMemberRole', AST>, P2 extends T.Projection<'ProjectMemberRole', AST>>(
    p1: P1,
    p2: P2,
  ): T.SelectProjection<T.Projection<'ProjectMemberRole', AST>, P1, P2> {
    return T.mergeProjections(p1, p2) as T.SelectProjection<T.Projection<'ProjectMemberRole', AST>, P1, P2>
  }
  public constructor(params: ProjectMemberRoleDAOParams<MetadataType, OperationMetadataType>) {
    super({
      ...params,
      schema: projectMemberRoleSchema(),
    })
  }
}

export class InMemoryProjectMemberRoleDAO<MetadataType, OperationMetadataType> extends T.AbstractInMemoryDAO<ProjectMemberRoleDAOGenerics<MetadataType, OperationMetadataType>> {
  public static projection<P extends T.Projection<'ProjectMemberRole', AST>>(p: P) {
    return p
  }
  public static mergeProjection<P1 extends T.Projection<'ProjectMemberRole', AST>, P2 extends T.Projection<'ProjectMemberRole', AST>>(
    p1: P1,
    p2: P2,
  ): T.SelectProjection<T.Projection<'ProjectMemberRole', AST>, P1, P2> {
    return T.mergeProjections(p1, p2) as T.SelectProjection<T.Projection<'ProjectMemberRole', AST>, P1, P2>
  }
  public constructor(params: InMemoryProjectMemberRoleDAOParams<MetadataType, OperationMetadataType>) {
    super({
      ...params,
      schema: projectMemberRoleSchema(),
    })
  }
}
export function subscriptionSchema(): T.Schema<ScalarsSpecification> {
  return {
    eBoardCreated: {
      type: 'scalar',
      scalar: 'ID',
    },
    eBoardDeleted: {
      type: 'scalar',
      scalar: 'ID',
    },
    eBoardUpdated: {
      type: 'scalar',
      scalar: 'ID',
    },
    projectCreated: {
      type: 'scalar',
      scalar: 'ID',
    },
    projectDeleted: {
      type: 'scalar',
      scalar: 'ID',
    },
    projectInviteCreated: {
      type: 'scalar',
      scalar: 'ID',
    },
    projectInviteDeleted: {
      type: 'scalar',
      scalar: 'ID',
    },
    projectMemberCreated: {
      type: 'scalar',
      scalar: 'ID',
    },
    projectMemberDeleted: {
      type: 'scalar',
      scalar: 'ID',
    },
    projectMemberUpdated: {
      type: 'scalar',
      scalar: 'ID',
    },
    projectUpdated: {
      type: 'scalar',
      scalar: 'ID',
    },
    userCreated: {
      type: 'scalar',
      scalar: 'ID',
    },
    userDeleted: {
      type: 'scalar',
      scalar: 'ID',
    },
    userUpdated: {
      type: 'scalar',
      scalar: 'ID',
    },
  }
}
export function userSchema(): T.Schema<ScalarsSpecification> {
  return {
    avatarLink: {
      type: 'scalar',
      scalar: 'String',
    },
    bannerLink: {
      type: 'scalar',
      scalar: 'String',
    },
    bio: {
      type: 'scalar',
      scalar: 'String',
    },
    createdAt: {
      type: 'scalar',
      scalar: 'Date',
      metadata: Object.fromEntries([['createdAt', 'true']]),
    },
    displayName: {
      type: 'scalar',
      scalar: 'String',
    },
    eBoard: {
      type: 'relation',
      relation: 'foreign',
      schema: () => eBoardSchema(),
      refFrom: 'userId',
      refTo: 'id',
      dao: 'eBoard',
    },
    email: {
      type: 'scalar',
      scalar: 'String',
      required: true,
    },
    id: {
      type: 'scalar',
      scalar: 'ID',
      isId: true,
      generationStrategy: 'db',
      required: true,
      alias: '_id',
    },
    loginIdentities: {
      type: 'relation',
      relation: 'foreign',
      schema: () => userLoginIdentitySchema(),
      refFrom: 'userId',
      refTo: 'id',
      dao: 'userLoginIdentity',
      isListElementRequired: true,
      required: true,
      isList: true,
    },
    projectInvites: {
      type: 'relation',
      relation: 'foreign',
      schema: () => projectInviteSchema(),
      refFrom: 'userId',
      refTo: 'id',
      dao: 'projectInvite',
      isListElementRequired: true,
      required: true,
      isList: true,
    },
    projectMembers: {
      type: 'relation',
      relation: 'foreign',
      schema: () => projectMemberSchema(),
      refFrom: 'userId',
      refTo: 'id',
      dao: 'projectMember',
      isListElementRequired: true,
      required: true,
      isList: true,
    },
    roles: {
      type: 'relation',
      relation: 'foreign',
      schema: () => userRoleSchema(),
      refFrom: 'userId',
      refTo: 'id',
      dao: 'userRole',
      isListElementRequired: true,
      required: true,
      isList: true,
    },
    socials: {
      type: 'relation',
      relation: 'foreign',
      schema: () => userSocialSchema(),
      refFrom: 'userId',
      refTo: 'id',
      dao: 'userSocial',
      isListElementRequired: true,
      required: true,
      isList: true,
    },
    updatedAt: {
      type: 'scalar',
      scalar: 'Date',
      metadata: Object.fromEntries([['createdAt', 'true']]),
    },
    username: {
      type: 'scalar',
      scalar: 'String',
    },
  }
}

type UserDAOGenerics<MetadataType, OperationMetadataType> = T.MongoDBDAOGenerics<
  'User',
  AST,
  ScalarsSpecification,
  UserCachedTypes,
  MetadataType,
  OperationMetadataType,
  EntityManager<MetadataType, OperationMetadataType>
>
export type UserDAOParams<MetadataType, OperationMetadataType> = Omit<
  T.MongoDBDAOParams<UserDAOGenerics<MetadataType, OperationMetadataType>>,
  'idGenerator' | 'idField' | 'schema' | 'idScalar' | 'idGeneration'
>
export type InMemoryUserDAOParams<MetadataType, OperationMetadataType> = Omit<
  T.InMemoryDAOParams<UserDAOGenerics<MetadataType, OperationMetadataType>>,
  'idGenerator' | 'idField' | 'schema' | 'idScalar' | 'idGeneration'
>

export type UserIdFields = T.IdFields<'User', AST>
export interface UserModel extends types.User {}
export interface UserInsert extends T.Insert<'User', AST, ScalarsSpecification> {}
export interface UserPlainModel extends T.GenerateModel<'User', AST, ScalarsSpecification, 'relation'> {}
export interface UserProjection extends T.Projection<'User', AST> {}
export interface UserUpdate extends T.Update<'User', AST, ScalarsSpecification> {}
export interface UserFilter extends T.Filter<'User', AST, ScalarsSpecification> {}
export interface UserSortElement extends T.SortElement<'User', AST> {}
export interface UserRelationsFindParams extends T.RelationsFindParams<'User', AST, ScalarsSpecification> {}
export type UserParams<P extends UserProjection> = T.Params<'User', AST, ScalarsSpecification, P>
export type UserCachedTypes = T.CachedTypes<UserIdFields, UserModel, UserInsert, UserPlainModel, UserProjection, UserUpdate, UserFilter, UserSortElement, UserRelationsFindParams>

export class UserDAO<MetadataType, OperationMetadataType> extends T.AbstractMongoDBDAO<UserDAOGenerics<MetadataType, OperationMetadataType>> {
  public static projection<P extends T.Projection<'User', AST>>(p: P) {
    return p
  }
  public static mergeProjection<P1 extends T.Projection<'User', AST>, P2 extends T.Projection<'User', AST>>(p1: P1, p2: P2): T.SelectProjection<T.Projection<'User', AST>, P1, P2> {
    return T.mergeProjections(p1, p2) as T.SelectProjection<T.Projection<'User', AST>, P1, P2>
  }
  public constructor(params: UserDAOParams<MetadataType, OperationMetadataType>) {
    super({
      ...params,
      schema: userSchema(),
    })
  }
}

export class InMemoryUserDAO<MetadataType, OperationMetadataType> extends T.AbstractInMemoryDAO<UserDAOGenerics<MetadataType, OperationMetadataType>> {
  public static projection<P extends T.Projection<'User', AST>>(p: P) {
    return p
  }
  public static mergeProjection<P1 extends T.Projection<'User', AST>, P2 extends T.Projection<'User', AST>>(p1: P1, p2: P2): T.SelectProjection<T.Projection<'User', AST>, P1, P2> {
    return T.mergeProjections(p1, p2) as T.SelectProjection<T.Projection<'User', AST>, P1, P2>
  }
  public constructor(params: InMemoryUserDAOParams<MetadataType, OperationMetadataType>) {
    super({
      ...params,
      schema: userSchema(),
    })
  }
}
export function userLoginIdentitySchema(): T.Schema<ScalarsSpecification> {
  return {
    data: {
      type: 'scalar',
      scalar: 'Json',
    },
    id: {
      type: 'scalar',
      scalar: 'ID',
      isId: true,
      generationStrategy: 'db',
      required: true,
      alias: '_id',
    },
    identityId: {
      type: 'scalar',
      scalar: 'String',
      required: true,
    },
    name: {
      type: 'scalar',
      scalar: 'String',
      required: true,
      metadata: Object.fromEntries([['undefined', 'undefined']]),
    },
    user: {
      type: 'relation',
      relation: 'inner',
      schema: () => userSchema(),
      refFrom: 'userId',
      refTo: 'id',
      dao: 'user',
      required: true,
    },
    userId: {
      type: 'scalar',
      scalar: 'ID',
      required: true,
    },
  }
}

type UserLoginIdentityDAOGenerics<MetadataType, OperationMetadataType> = T.MongoDBDAOGenerics<
  'UserLoginIdentity',
  AST,
  ScalarsSpecification,
  UserLoginIdentityCachedTypes,
  MetadataType,
  OperationMetadataType,
  EntityManager<MetadataType, OperationMetadataType>
>
export type UserLoginIdentityDAOParams<MetadataType, OperationMetadataType> = Omit<
  T.MongoDBDAOParams<UserLoginIdentityDAOGenerics<MetadataType, OperationMetadataType>>,
  'idGenerator' | 'idField' | 'schema' | 'idScalar' | 'idGeneration'
>
export type InMemoryUserLoginIdentityDAOParams<MetadataType, OperationMetadataType> = Omit<
  T.InMemoryDAOParams<UserLoginIdentityDAOGenerics<MetadataType, OperationMetadataType>>,
  'idGenerator' | 'idField' | 'schema' | 'idScalar' | 'idGeneration'
>

export type UserLoginIdentityIdFields = T.IdFields<'UserLoginIdentity', AST>
export interface UserLoginIdentityModel extends types.UserLoginIdentity {}
export interface UserLoginIdentityInsert extends T.Insert<'UserLoginIdentity', AST, ScalarsSpecification> {}
export interface UserLoginIdentityPlainModel extends T.GenerateModel<'UserLoginIdentity', AST, ScalarsSpecification, 'relation'> {}
export interface UserLoginIdentityProjection extends T.Projection<'UserLoginIdentity', AST> {}
export interface UserLoginIdentityUpdate extends T.Update<'UserLoginIdentity', AST, ScalarsSpecification> {}
export interface UserLoginIdentityFilter extends T.Filter<'UserLoginIdentity', AST, ScalarsSpecification> {}
export interface UserLoginIdentitySortElement extends T.SortElement<'UserLoginIdentity', AST> {}
export interface UserLoginIdentityRelationsFindParams extends T.RelationsFindParams<'UserLoginIdentity', AST, ScalarsSpecification> {}
export type UserLoginIdentityParams<P extends UserLoginIdentityProjection> = T.Params<'UserLoginIdentity', AST, ScalarsSpecification, P>
export type UserLoginIdentityCachedTypes = T.CachedTypes<
  UserLoginIdentityIdFields,
  UserLoginIdentityModel,
  UserLoginIdentityInsert,
  UserLoginIdentityPlainModel,
  UserLoginIdentityProjection,
  UserLoginIdentityUpdate,
  UserLoginIdentityFilter,
  UserLoginIdentitySortElement,
  UserLoginIdentityRelationsFindParams
>

export class UserLoginIdentityDAO<MetadataType, OperationMetadataType> extends T.AbstractMongoDBDAO<UserLoginIdentityDAOGenerics<MetadataType, OperationMetadataType>> {
  public static projection<P extends T.Projection<'UserLoginIdentity', AST>>(p: P) {
    return p
  }
  public static mergeProjection<P1 extends T.Projection<'UserLoginIdentity', AST>, P2 extends T.Projection<'UserLoginIdentity', AST>>(
    p1: P1,
    p2: P2,
  ): T.SelectProjection<T.Projection<'UserLoginIdentity', AST>, P1, P2> {
    return T.mergeProjections(p1, p2) as T.SelectProjection<T.Projection<'UserLoginIdentity', AST>, P1, P2>
  }
  public constructor(params: UserLoginIdentityDAOParams<MetadataType, OperationMetadataType>) {
    super({
      ...params,
      schema: userLoginIdentitySchema(),
    })
  }
}

export class InMemoryUserLoginIdentityDAO<MetadataType, OperationMetadataType> extends T.AbstractInMemoryDAO<UserLoginIdentityDAOGenerics<MetadataType, OperationMetadataType>> {
  public static projection<P extends T.Projection<'UserLoginIdentity', AST>>(p: P) {
    return p
  }
  public static mergeProjection<P1 extends T.Projection<'UserLoginIdentity', AST>, P2 extends T.Projection<'UserLoginIdentity', AST>>(
    p1: P1,
    p2: P2,
  ): T.SelectProjection<T.Projection<'UserLoginIdentity', AST>, P1, P2> {
    return T.mergeProjections(p1, p2) as T.SelectProjection<T.Projection<'UserLoginIdentity', AST>, P1, P2>
  }
  public constructor(params: InMemoryUserLoginIdentityDAOParams<MetadataType, OperationMetadataType>) {
    super({
      ...params,
      schema: userLoginIdentitySchema(),
    })
  }
}
export function userRoleSchema(): T.Schema<ScalarsSpecification> {
  return {
    id: {
      type: 'scalar',
      scalar: 'ID',
      isId: true,
      generationStrategy: 'db',
      required: true,
      alias: '_id',
    },
    roleCode: {
      type: 'scalar',
      scalar: 'String',
      required: true,
      isEnum: true,
      metadata: Object.fromEntries([['undefined', 'undefined']]),
    },
    user: {
      type: 'relation',
      relation: 'inner',
      schema: () => userSchema(),
      refFrom: 'userId',
      refTo: 'id',
      dao: 'user',
      required: true,
    },
    userId: {
      type: 'scalar',
      scalar: 'ID',
      required: true,
      metadata: Object.fromEntries([['undefined', 'undefined']]),
    },
  }
}

type UserRoleDAOGenerics<MetadataType, OperationMetadataType> = T.MongoDBDAOGenerics<
  'UserRole',
  AST,
  ScalarsSpecification,
  UserRoleCachedTypes,
  MetadataType,
  OperationMetadataType,
  EntityManager<MetadataType, OperationMetadataType>
>
export type UserRoleDAOParams<MetadataType, OperationMetadataType> = Omit<
  T.MongoDBDAOParams<UserRoleDAOGenerics<MetadataType, OperationMetadataType>>,
  'idGenerator' | 'idField' | 'schema' | 'idScalar' | 'idGeneration'
>
export type InMemoryUserRoleDAOParams<MetadataType, OperationMetadataType> = Omit<
  T.InMemoryDAOParams<UserRoleDAOGenerics<MetadataType, OperationMetadataType>>,
  'idGenerator' | 'idField' | 'schema' | 'idScalar' | 'idGeneration'
>

export type UserRoleIdFields = T.IdFields<'UserRole', AST>
export interface UserRoleModel extends types.UserRole {}
export interface UserRoleInsert extends T.Insert<'UserRole', AST, ScalarsSpecification> {}
export interface UserRolePlainModel extends T.GenerateModel<'UserRole', AST, ScalarsSpecification, 'relation'> {}
export interface UserRoleProjection extends T.Projection<'UserRole', AST> {}
export interface UserRoleUpdate extends T.Update<'UserRole', AST, ScalarsSpecification> {}
export interface UserRoleFilter extends T.Filter<'UserRole', AST, ScalarsSpecification> {}
export interface UserRoleSortElement extends T.SortElement<'UserRole', AST> {}
export interface UserRoleRelationsFindParams extends T.RelationsFindParams<'UserRole', AST, ScalarsSpecification> {}
export type UserRoleParams<P extends UserRoleProjection> = T.Params<'UserRole', AST, ScalarsSpecification, P>
export type UserRoleCachedTypes = T.CachedTypes<
  UserRoleIdFields,
  UserRoleModel,
  UserRoleInsert,
  UserRolePlainModel,
  UserRoleProjection,
  UserRoleUpdate,
  UserRoleFilter,
  UserRoleSortElement,
  UserRoleRelationsFindParams
>

export class UserRoleDAO<MetadataType, OperationMetadataType> extends T.AbstractMongoDBDAO<UserRoleDAOGenerics<MetadataType, OperationMetadataType>> {
  public static projection<P extends T.Projection<'UserRole', AST>>(p: P) {
    return p
  }
  public static mergeProjection<P1 extends T.Projection<'UserRole', AST>, P2 extends T.Projection<'UserRole', AST>>(p1: P1, p2: P2): T.SelectProjection<T.Projection<'UserRole', AST>, P1, P2> {
    return T.mergeProjections(p1, p2) as T.SelectProjection<T.Projection<'UserRole', AST>, P1, P2>
  }
  public constructor(params: UserRoleDAOParams<MetadataType, OperationMetadataType>) {
    super({
      ...params,
      schema: userRoleSchema(),
    })
  }
}

export class InMemoryUserRoleDAO<MetadataType, OperationMetadataType> extends T.AbstractInMemoryDAO<UserRoleDAOGenerics<MetadataType, OperationMetadataType>> {
  public static projection<P extends T.Projection<'UserRole', AST>>(p: P) {
    return p
  }
  public static mergeProjection<P1 extends T.Projection<'UserRole', AST>, P2 extends T.Projection<'UserRole', AST>>(p1: P1, p2: P2): T.SelectProjection<T.Projection<'UserRole', AST>, P1, P2> {
    return T.mergeProjections(p1, p2) as T.SelectProjection<T.Projection<'UserRole', AST>, P1, P2>
  }
  public constructor(params: InMemoryUserRoleDAOParams<MetadataType, OperationMetadataType>) {
    super({
      ...params,
      schema: userRoleSchema(),
    })
  }
}
export function userSocialSchema(): T.Schema<ScalarsSpecification> {
  return {
    id: {
      type: 'scalar',
      scalar: 'ID',
      isId: true,
      generationStrategy: 'db',
      required: true,
      alias: '_id',
    },
    link: {
      type: 'scalar',
      scalar: 'String',
      required: true,
    },
    platform: {
      type: 'scalar',
      scalar: 'String',
      required: true,
    },
    user: {
      type: 'relation',
      relation: 'inner',
      schema: () => userSchema(),
      refFrom: 'userId',
      refTo: 'id',
      dao: 'user',
      required: true,
    },
    userId: {
      type: 'scalar',
      scalar: 'ID',
      required: true,
    },
    username: {
      type: 'scalar',
      scalar: 'String',
      required: true,
    },
  }
}

type UserSocialDAOGenerics<MetadataType, OperationMetadataType> = T.MongoDBDAOGenerics<
  'UserSocial',
  AST,
  ScalarsSpecification,
  UserSocialCachedTypes,
  MetadataType,
  OperationMetadataType,
  EntityManager<MetadataType, OperationMetadataType>
>
export type UserSocialDAOParams<MetadataType, OperationMetadataType> = Omit<
  T.MongoDBDAOParams<UserSocialDAOGenerics<MetadataType, OperationMetadataType>>,
  'idGenerator' | 'idField' | 'schema' | 'idScalar' | 'idGeneration'
>
export type InMemoryUserSocialDAOParams<MetadataType, OperationMetadataType> = Omit<
  T.InMemoryDAOParams<UserSocialDAOGenerics<MetadataType, OperationMetadataType>>,
  'idGenerator' | 'idField' | 'schema' | 'idScalar' | 'idGeneration'
>

export type UserSocialIdFields = T.IdFields<'UserSocial', AST>
export interface UserSocialModel extends types.UserSocial {}
export interface UserSocialInsert extends T.Insert<'UserSocial', AST, ScalarsSpecification> {}
export interface UserSocialPlainModel extends T.GenerateModel<'UserSocial', AST, ScalarsSpecification, 'relation'> {}
export interface UserSocialProjection extends T.Projection<'UserSocial', AST> {}
export interface UserSocialUpdate extends T.Update<'UserSocial', AST, ScalarsSpecification> {}
export interface UserSocialFilter extends T.Filter<'UserSocial', AST, ScalarsSpecification> {}
export interface UserSocialSortElement extends T.SortElement<'UserSocial', AST> {}
export interface UserSocialRelationsFindParams extends T.RelationsFindParams<'UserSocial', AST, ScalarsSpecification> {}
export type UserSocialParams<P extends UserSocialProjection> = T.Params<'UserSocial', AST, ScalarsSpecification, P>
export type UserSocialCachedTypes = T.CachedTypes<
  UserSocialIdFields,
  UserSocialModel,
  UserSocialInsert,
  UserSocialPlainModel,
  UserSocialProjection,
  UserSocialUpdate,
  UserSocialFilter,
  UserSocialSortElement,
  UserSocialRelationsFindParams
>

export class UserSocialDAO<MetadataType, OperationMetadataType> extends T.AbstractMongoDBDAO<UserSocialDAOGenerics<MetadataType, OperationMetadataType>> {
  public static projection<P extends T.Projection<'UserSocial', AST>>(p: P) {
    return p
  }
  public static mergeProjection<P1 extends T.Projection<'UserSocial', AST>, P2 extends T.Projection<'UserSocial', AST>>(p1: P1, p2: P2): T.SelectProjection<T.Projection<'UserSocial', AST>, P1, P2> {
    return T.mergeProjections(p1, p2) as T.SelectProjection<T.Projection<'UserSocial', AST>, P1, P2>
  }
  public constructor(params: UserSocialDAOParams<MetadataType, OperationMetadataType>) {
    super({
      ...params,
      schema: userSocialSchema(),
    })
  }
}

export class InMemoryUserSocialDAO<MetadataType, OperationMetadataType> extends T.AbstractInMemoryDAO<UserSocialDAOGenerics<MetadataType, OperationMetadataType>> {
  public static projection<P extends T.Projection<'UserSocial', AST>>(p: P) {
    return p
  }
  public static mergeProjection<P1 extends T.Projection<'UserSocial', AST>, P2 extends T.Projection<'UserSocial', AST>>(p1: P1, p2: P2): T.SelectProjection<T.Projection<'UserSocial', AST>, P1, P2> {
    return T.mergeProjections(p1, p2) as T.SelectProjection<T.Projection<'UserSocial', AST>, P1, P2>
  }
  public constructor(params: InMemoryUserSocialDAOParams<MetadataType, OperationMetadataType>) {
    super({
      ...params,
      schema: userSocialSchema(),
    })
  }
}

export type EntityManagerParams<MetadataType, OperationMetadataType, Permissions extends string, SecurityDomain extends Record<string, unknown>> = {
  metadata?: MetadataType
  middlewares?: (EntityManagerMiddleware<MetadataType, OperationMetadataType> | GroupMiddleware<any, MetadataType, OperationMetadataType>)[]
  overrides?: {
    eBoard?: Pick<Partial<EBoardDAOParams<MetadataType, OperationMetadataType>>, 'middlewares' | 'metadata'>
    eBoardRole?: Pick<Partial<EBoardRoleDAOParams<MetadataType, OperationMetadataType>>, 'middlewares' | 'metadata'>
    project?: Pick<Partial<ProjectDAOParams<MetadataType, OperationMetadataType>>, 'middlewares' | 'metadata'>
    projectInvite?: Pick<Partial<ProjectInviteDAOParams<MetadataType, OperationMetadataType>>, 'middlewares' | 'metadata'>
    projectMember?: Pick<Partial<ProjectMemberDAOParams<MetadataType, OperationMetadataType>>, 'middlewares' | 'metadata'>
    projectMemberRole?: Pick<Partial<ProjectMemberRoleDAOParams<MetadataType, OperationMetadataType>>, 'middlewares' | 'metadata'>
    user?: Pick<Partial<UserDAOParams<MetadataType, OperationMetadataType>>, 'middlewares' | 'metadata'>
    userLoginIdentity?: Pick<Partial<UserLoginIdentityDAOParams<MetadataType, OperationMetadataType>>, 'middlewares' | 'metadata'>
    userRole?: Pick<Partial<UserRoleDAOParams<MetadataType, OperationMetadataType>>, 'middlewares' | 'metadata'>
    userSocial?: Pick<Partial<UserSocialDAOParams<MetadataType, OperationMetadataType>>, 'middlewares' | 'metadata'>
  }
  mongodb: Record<'default', M.Db | 'mock'>
  scalars?: T.UserInputDriverDataTypeAdapterMap<ScalarsSpecification, 'mongo'>
  log?: T.LogInput<'EBoard' | 'EBoardRole' | 'Project' | 'ProjectInvite' | 'ProjectMember' | 'ProjectMemberRole' | 'User' | 'UserLoginIdentity' | 'UserRole' | 'UserSocial'>
  security?: T.EntityManagerSecurtyPolicy<DAOGenericsMap<MetadataType, OperationMetadataType>, OperationMetadataType, Permissions, SecurityDomain>
}
type EntityManagerMiddleware<MetadataType = never, OperationMetadataType = never> = T.DAOMiddleware<DAOGenericsUnion<MetadataType, OperationMetadataType>>
export class EntityManager<
  MetadataType = never,
  OperationMetadataType = never,
  Permissions extends string = never,
  SecurityDomain extends Record<string, unknown> = never,
> extends T.AbstractEntityManager<'default', never, ScalarsSpecification, MetadataType> {
  private _eBoard: EBoardDAO<MetadataType, OperationMetadataType> | undefined
  private _eBoardRole: EBoardRoleDAO<MetadataType, OperationMetadataType> | undefined
  private _project: ProjectDAO<MetadataType, OperationMetadataType> | undefined
  private _projectInvite: ProjectInviteDAO<MetadataType, OperationMetadataType> | undefined
  private _projectMember: ProjectMemberDAO<MetadataType, OperationMetadataType> | undefined
  private _projectMemberRole: ProjectMemberRoleDAO<MetadataType, OperationMetadataType> | undefined
  private _user: UserDAO<MetadataType, OperationMetadataType> | undefined
  private _userLoginIdentity: UserLoginIdentityDAO<MetadataType, OperationMetadataType> | undefined
  private _userRole: UserRoleDAO<MetadataType, OperationMetadataType> | undefined
  private _userSocial: UserSocialDAO<MetadataType, OperationMetadataType> | undefined

  private params: EntityManagerParams<MetadataType, OperationMetadataType, Permissions, SecurityDomain>

  private overrides: EntityManagerParams<MetadataType, OperationMetadataType, Permissions, SecurityDomain>['overrides']
  private mongodb: Record<'default', M.Db | 'mock'>

  private middlewares: (EntityManagerMiddleware<MetadataType, OperationMetadataType> | GroupMiddleware<any, MetadataType, OperationMetadataType>)[]

  private logger?: T.LogFunction<'EBoard' | 'EBoardRole' | 'Project' | 'ProjectInvite' | 'ProjectMember' | 'ProjectMemberRole' | 'User' | 'UserLoginIdentity' | 'UserRole' | 'UserSocial'>

  get eBoard(): EBoardDAO<MetadataType, OperationMetadataType> {
    if (!this._eBoard) {
      const db = this.mongodb.default
      this._eBoard =
        db === 'mock'
          ? (new InMemoryEBoardDAO({
              entityManager: this,
              datasource: null,
              metadata: this.metadata,
              ...this.overrides?.eBoard,
              middlewares: [
                ...(this.overrides?.eBoard?.middlewares || []),
                ...(selectMiddleware('eBoard', this.middlewares) as T.DAOMiddleware<EBoardDAOGenerics<MetadataType, OperationMetadataType>>[]),
              ],
              name: 'EBoard',
              logger: this.logger,
            }) as unknown as EBoardDAO<MetadataType, OperationMetadataType>)
          : new EBoardDAO({
              entityManager: this,
              datasource: 'default',
              metadata: this.metadata,
              ...this.overrides?.eBoard,
              collection: db.collection('eBoards'),
              middlewares: [
                ...(this.overrides?.eBoard?.middlewares || []),
                ...(selectMiddleware('eBoard', this.middlewares) as T.DAOMiddleware<EBoardDAOGenerics<MetadataType, OperationMetadataType>>[]),
              ],
              name: 'EBoard',
              logger: this.logger,
            })
    }
    return this._eBoard
  }
  get eBoardRole(): EBoardRoleDAO<MetadataType, OperationMetadataType> {
    if (!this._eBoardRole) {
      const db = this.mongodb.default
      this._eBoardRole =
        db === 'mock'
          ? (new InMemoryEBoardRoleDAO({
              entityManager: this,
              datasource: null,
              metadata: this.metadata,
              ...this.overrides?.eBoardRole,
              middlewares: [
                ...(this.overrides?.eBoardRole?.middlewares || []),
                ...(selectMiddleware('eBoardRole', this.middlewares) as T.DAOMiddleware<EBoardRoleDAOGenerics<MetadataType, OperationMetadataType>>[]),
              ],
              name: 'EBoardRole',
              logger: this.logger,
            }) as unknown as EBoardRoleDAO<MetadataType, OperationMetadataType>)
          : new EBoardRoleDAO({
              entityManager: this,
              datasource: 'default',
              metadata: this.metadata,
              ...this.overrides?.eBoardRole,
              collection: db.collection('eBoardRoles'),
              middlewares: [
                ...(this.overrides?.eBoardRole?.middlewares || []),
                ...(selectMiddleware('eBoardRole', this.middlewares) as T.DAOMiddleware<EBoardRoleDAOGenerics<MetadataType, OperationMetadataType>>[]),
              ],
              name: 'EBoardRole',
              logger: this.logger,
            })
    }
    return this._eBoardRole
  }
  get project(): ProjectDAO<MetadataType, OperationMetadataType> {
    if (!this._project) {
      const db = this.mongodb.default
      this._project =
        db === 'mock'
          ? (new InMemoryProjectDAO({
              entityManager: this,
              datasource: null,
              metadata: this.metadata,
              ...this.overrides?.project,
              middlewares: [
                ...(this.overrides?.project?.middlewares || []),
                ...(selectMiddleware('project', this.middlewares) as T.DAOMiddleware<ProjectDAOGenerics<MetadataType, OperationMetadataType>>[]),
              ],
              name: 'Project',
              logger: this.logger,
            }) as unknown as ProjectDAO<MetadataType, OperationMetadataType>)
          : new ProjectDAO({
              entityManager: this,
              datasource: 'default',
              metadata: this.metadata,
              ...this.overrides?.project,
              collection: db.collection('projects'),
              middlewares: [
                ...(this.overrides?.project?.middlewares || []),
                ...(selectMiddleware('project', this.middlewares) as T.DAOMiddleware<ProjectDAOGenerics<MetadataType, OperationMetadataType>>[]),
              ],
              name: 'Project',
              logger: this.logger,
            })
    }
    return this._project
  }
  get projectInvite(): ProjectInviteDAO<MetadataType, OperationMetadataType> {
    if (!this._projectInvite) {
      const db = this.mongodb.default
      this._projectInvite =
        db === 'mock'
          ? (new InMemoryProjectInviteDAO({
              entityManager: this,
              datasource: null,
              metadata: this.metadata,
              ...this.overrides?.projectInvite,
              middlewares: [
                ...(this.overrides?.projectInvite?.middlewares || []),
                ...(selectMiddleware('projectInvite', this.middlewares) as T.DAOMiddleware<ProjectInviteDAOGenerics<MetadataType, OperationMetadataType>>[]),
              ],
              name: 'ProjectInvite',
              logger: this.logger,
            }) as unknown as ProjectInviteDAO<MetadataType, OperationMetadataType>)
          : new ProjectInviteDAO({
              entityManager: this,
              datasource: 'default',
              metadata: this.metadata,
              ...this.overrides?.projectInvite,
              collection: db.collection('projectInvites'),
              middlewares: [
                ...(this.overrides?.projectInvite?.middlewares || []),
                ...(selectMiddleware('projectInvite', this.middlewares) as T.DAOMiddleware<ProjectInviteDAOGenerics<MetadataType, OperationMetadataType>>[]),
              ],
              name: 'ProjectInvite',
              logger: this.logger,
            })
    }
    return this._projectInvite
  }
  get projectMember(): ProjectMemberDAO<MetadataType, OperationMetadataType> {
    if (!this._projectMember) {
      const db = this.mongodb.default
      this._projectMember =
        db === 'mock'
          ? (new InMemoryProjectMemberDAO({
              entityManager: this,
              datasource: null,
              metadata: this.metadata,
              ...this.overrides?.projectMember,
              middlewares: [
                ...(this.overrides?.projectMember?.middlewares || []),
                ...(selectMiddleware('projectMember', this.middlewares) as T.DAOMiddleware<ProjectMemberDAOGenerics<MetadataType, OperationMetadataType>>[]),
              ],
              name: 'ProjectMember',
              logger: this.logger,
            }) as unknown as ProjectMemberDAO<MetadataType, OperationMetadataType>)
          : new ProjectMemberDAO({
              entityManager: this,
              datasource: 'default',
              metadata: this.metadata,
              ...this.overrides?.projectMember,
              collection: db.collection('projectMembers'),
              middlewares: [
                ...(this.overrides?.projectMember?.middlewares || []),
                ...(selectMiddleware('projectMember', this.middlewares) as T.DAOMiddleware<ProjectMemberDAOGenerics<MetadataType, OperationMetadataType>>[]),
              ],
              name: 'ProjectMember',
              logger: this.logger,
            })
    }
    return this._projectMember
  }
  get projectMemberRole(): ProjectMemberRoleDAO<MetadataType, OperationMetadataType> {
    if (!this._projectMemberRole) {
      const db = this.mongodb.default
      this._projectMemberRole =
        db === 'mock'
          ? (new InMemoryProjectMemberRoleDAO({
              entityManager: this,
              datasource: null,
              metadata: this.metadata,
              ...this.overrides?.projectMemberRole,
              middlewares: [
                ...(this.overrides?.projectMemberRole?.middlewares || []),
                ...(selectMiddleware('projectMemberRole', this.middlewares) as T.DAOMiddleware<ProjectMemberRoleDAOGenerics<MetadataType, OperationMetadataType>>[]),
              ],
              name: 'ProjectMemberRole',
              logger: this.logger,
            }) as unknown as ProjectMemberRoleDAO<MetadataType, OperationMetadataType>)
          : new ProjectMemberRoleDAO({
              entityManager: this,
              datasource: 'default',
              metadata: this.metadata,
              ...this.overrides?.projectMemberRole,
              collection: db.collection('projectMemberRoles'),
              middlewares: [
                ...(this.overrides?.projectMemberRole?.middlewares || []),
                ...(selectMiddleware('projectMemberRole', this.middlewares) as T.DAOMiddleware<ProjectMemberRoleDAOGenerics<MetadataType, OperationMetadataType>>[]),
              ],
              name: 'ProjectMemberRole',
              logger: this.logger,
            })
    }
    return this._projectMemberRole
  }
  get user(): UserDAO<MetadataType, OperationMetadataType> {
    if (!this._user) {
      const db = this.mongodb.default
      this._user =
        db === 'mock'
          ? (new InMemoryUserDAO({
              entityManager: this,
              datasource: null,
              metadata: this.metadata,
              ...this.overrides?.user,
              middlewares: [...(this.overrides?.user?.middlewares || []), ...(selectMiddleware('user', this.middlewares) as T.DAOMiddleware<UserDAOGenerics<MetadataType, OperationMetadataType>>[])],
              name: 'User',
              logger: this.logger,
            }) as unknown as UserDAO<MetadataType, OperationMetadataType>)
          : new UserDAO({
              entityManager: this,
              datasource: 'default',
              metadata: this.metadata,
              ...this.overrides?.user,
              collection: db.collection('users'),
              middlewares: [...(this.overrides?.user?.middlewares || []), ...(selectMiddleware('user', this.middlewares) as T.DAOMiddleware<UserDAOGenerics<MetadataType, OperationMetadataType>>[])],
              name: 'User',
              logger: this.logger,
            })
    }
    return this._user
  }
  get userLoginIdentity(): UserLoginIdentityDAO<MetadataType, OperationMetadataType> {
    if (!this._userLoginIdentity) {
      const db = this.mongodb.default
      this._userLoginIdentity =
        db === 'mock'
          ? (new InMemoryUserLoginIdentityDAO({
              entityManager: this,
              datasource: null,
              metadata: this.metadata,
              ...this.overrides?.userLoginIdentity,
              middlewares: [
                ...(this.overrides?.userLoginIdentity?.middlewares || []),
                ...(selectMiddleware('userLoginIdentity', this.middlewares) as T.DAOMiddleware<UserLoginIdentityDAOGenerics<MetadataType, OperationMetadataType>>[]),
              ],
              name: 'UserLoginIdentity',
              logger: this.logger,
            }) as unknown as UserLoginIdentityDAO<MetadataType, OperationMetadataType>)
          : new UserLoginIdentityDAO({
              entityManager: this,
              datasource: 'default',
              metadata: this.metadata,
              ...this.overrides?.userLoginIdentity,
              collection: db.collection('userLoginIdentitys'),
              middlewares: [
                ...(this.overrides?.userLoginIdentity?.middlewares || []),
                ...(selectMiddleware('userLoginIdentity', this.middlewares) as T.DAOMiddleware<UserLoginIdentityDAOGenerics<MetadataType, OperationMetadataType>>[]),
              ],
              name: 'UserLoginIdentity',
              logger: this.logger,
            })
    }
    return this._userLoginIdentity
  }
  get userRole(): UserRoleDAO<MetadataType, OperationMetadataType> {
    if (!this._userRole) {
      const db = this.mongodb.default
      this._userRole =
        db === 'mock'
          ? (new InMemoryUserRoleDAO({
              entityManager: this,
              datasource: null,
              metadata: this.metadata,
              ...this.overrides?.userRole,
              middlewares: [
                ...(this.overrides?.userRole?.middlewares || []),
                ...(selectMiddleware('userRole', this.middlewares) as T.DAOMiddleware<UserRoleDAOGenerics<MetadataType, OperationMetadataType>>[]),
              ],
              name: 'UserRole',
              logger: this.logger,
            }) as unknown as UserRoleDAO<MetadataType, OperationMetadataType>)
          : new UserRoleDAO({
              entityManager: this,
              datasource: 'default',
              metadata: this.metadata,
              ...this.overrides?.userRole,
              collection: db.collection('userRoles'),
              middlewares: [
                ...(this.overrides?.userRole?.middlewares || []),
                ...(selectMiddleware('userRole', this.middlewares) as T.DAOMiddleware<UserRoleDAOGenerics<MetadataType, OperationMetadataType>>[]),
              ],
              name: 'UserRole',
              logger: this.logger,
            })
    }
    return this._userRole
  }
  get userSocial(): UserSocialDAO<MetadataType, OperationMetadataType> {
    if (!this._userSocial) {
      const db = this.mongodb.default
      this._userSocial =
        db === 'mock'
          ? (new InMemoryUserSocialDAO({
              entityManager: this,
              datasource: null,
              metadata: this.metadata,
              ...this.overrides?.userSocial,
              middlewares: [
                ...(this.overrides?.userSocial?.middlewares || []),
                ...(selectMiddleware('userSocial', this.middlewares) as T.DAOMiddleware<UserSocialDAOGenerics<MetadataType, OperationMetadataType>>[]),
              ],
              name: 'UserSocial',
              logger: this.logger,
            }) as unknown as UserSocialDAO<MetadataType, OperationMetadataType>)
          : new UserSocialDAO({
              entityManager: this,
              datasource: 'default',
              metadata: this.metadata,
              ...this.overrides?.userSocial,
              collection: db.collection('userSocials'),
              middlewares: [
                ...(this.overrides?.userSocial?.middlewares || []),
                ...(selectMiddleware('userSocial', this.middlewares) as T.DAOMiddleware<UserSocialDAOGenerics<MetadataType, OperationMetadataType>>[]),
              ],
              name: 'UserSocial',
              logger: this.logger,
            })
    }
    return this._userSocial
  }

  constructor(params: EntityManagerParams<MetadataType, OperationMetadataType, Permissions, SecurityDomain>) {
    super({
      ...params,
      scalars: params.scalars
        ? T.userInputDataTypeAdapterToDataTypeAdapter(params.scalars, [
            'Access',
            'Date',
            'InviteType',
            'Json',
            'Permission',
            'RoleCode',
            'SortDirection',
            'StringFilterMode',
            'Upload',
            'UploadOperation',
            'ID',
            'String',
            'Boolean',
            'Int',
            'Float',
          ])
        : undefined,
    })
    this.overrides = params.overrides
    this.mongodb = params.mongodb
    this.middlewares = params.middlewares || []
    this.logger = T.logInputToLogger(params.log)
    if (params.security && params.security.applySecurity !== false) {
      const securityMiddlewares = T.createSecurityPolicyMiddlewares(params.security)
      const defaultMiddleware = securityMiddlewares.others
        ? [groupMiddleware.excludes(Object.fromEntries(Object.keys(securityMiddlewares.middlewares).map((k) => [k, true])) as any, securityMiddlewares.others as any)]
        : []
      this.middlewares = [
        ...(params.middlewares ?? []),
        ...defaultMiddleware,
        ...Object.entries(securityMiddlewares.middlewares).map(([name, middleware]) => groupMiddleware.includes({ [name]: true } as any, middleware as any)),
      ]
    }
    this.params = params
  }

  public async execQuery<T>(
    run: (
      dbs: { mongodb: Record<'default', M.Db | 'mock'> },
      entities: {
        eBoard: M.Collection<M.Document> | null
        eBoardRole: M.Collection<M.Document> | null
        project: M.Collection<M.Document> | null
        projectInvite: M.Collection<M.Document> | null
        projectMember: M.Collection<M.Document> | null
        projectMemberRole: M.Collection<M.Document> | null
        user: M.Collection<M.Document> | null
        userLoginIdentity: M.Collection<M.Document> | null
        userRole: M.Collection<M.Document> | null
        userSocial: M.Collection<M.Document> | null
      },
    ) => Promise<T>,
  ): Promise<T> {
    return run(
      { mongodb: this.mongodb },
      {
        eBoard: this.mongodb.default === 'mock' ? null : this.mongodb.default.collection('eBoards'),
        eBoardRole: this.mongodb.default === 'mock' ? null : this.mongodb.default.collection('eBoardRoles'),
        project: this.mongodb.default === 'mock' ? null : this.mongodb.default.collection('projects'),
        projectInvite: this.mongodb.default === 'mock' ? null : this.mongodb.default.collection('projectInvites'),
        projectMember: this.mongodb.default === 'mock' ? null : this.mongodb.default.collection('projectMembers'),
        projectMemberRole: this.mongodb.default === 'mock' ? null : this.mongodb.default.collection('projectMemberRoles'),
        user: this.mongodb.default === 'mock' ? null : this.mongodb.default.collection('users'),
        userLoginIdentity: this.mongodb.default === 'mock' ? null : this.mongodb.default.collection('userLoginIdentitys'),
        userRole: this.mongodb.default === 'mock' ? null : this.mongodb.default.collection('userRoles'),
        userSocial: this.mongodb.default === 'mock' ? null : this.mongodb.default.collection('userSocials'),
      },
    )
  }

  protected clone(): this {
    return new EntityManager<MetadataType, OperationMetadataType, Permissions, SecurityDomain>(this.params) as this
  }
}

type DAOName = keyof DAOGenericsMap<never, never>
type DAOGenericsMap<MetadataType, OperationMetadataType> = {
  eBoard: EBoardDAOGenerics<MetadataType, OperationMetadataType>
  eBoardRole: EBoardRoleDAOGenerics<MetadataType, OperationMetadataType>
  project: ProjectDAOGenerics<MetadataType, OperationMetadataType>
  projectInvite: ProjectInviteDAOGenerics<MetadataType, OperationMetadataType>
  projectMember: ProjectMemberDAOGenerics<MetadataType, OperationMetadataType>
  projectMemberRole: ProjectMemberRoleDAOGenerics<MetadataType, OperationMetadataType>
  user: UserDAOGenerics<MetadataType, OperationMetadataType>
  userLoginIdentity: UserLoginIdentityDAOGenerics<MetadataType, OperationMetadataType>
  userRole: UserRoleDAOGenerics<MetadataType, OperationMetadataType>
  userSocial: UserSocialDAOGenerics<MetadataType, OperationMetadataType>
}
type DAOGenericsUnion<MetadataType, OperationMetadataType> = DAOGenericsMap<MetadataType, OperationMetadataType>[DAOName]
type GroupMiddleware<N extends DAOName, MetadataType, OperationMetadataType> =
  | IncludeGroupMiddleware<N, MetadataType, OperationMetadataType>
  | ExcludeGroupMiddleware<N, MetadataType, OperationMetadataType>
type IncludeGroupMiddleware<N extends DAOName, MetadataType, OperationMetadataType> = {
  include: { [K in N]: true }
  middleware: T.DAOMiddleware<DAOGenericsMap<MetadataType, OperationMetadataType>[N]>
}
type ExcludeGroupMiddleware<N extends DAOName, MetadataType, OperationMetadataType> = {
  exclude: { [K in N]: true }
  middleware: T.DAOMiddleware<DAOGenericsMap<MetadataType, OperationMetadataType>[Exclude<DAOName, N>]>
}
export const groupMiddleware = {
  includes<N extends DAOName, MetadataType, OperationMetadataType>(
    include: { [K in N]: true },
    middleware: T.DAOMiddleware<DAOGenericsMap<MetadataType, OperationMetadataType>[N]>,
  ): IncludeGroupMiddleware<N, MetadataType, OperationMetadataType> {
    return { include, middleware }
  },
  excludes<N extends DAOName, MetadataType, OperationMetadataType>(
    exclude: { [K in N]: true },
    middleware: ExcludeGroupMiddleware<N, MetadataType, OperationMetadataType>['middleware'],
  ): ExcludeGroupMiddleware<N, MetadataType, OperationMetadataType> {
    return { exclude, middleware }
  },
}
function selectMiddleware<MetadataType, OperationMetadataType>(
  name: DAOName,
  middlewares: (EntityManagerMiddleware<MetadataType, OperationMetadataType> | GroupMiddleware<DAOName, MetadataType, OperationMetadataType>)[],
): EntityManagerMiddleware<MetadataType, OperationMetadataType>[] {
  return middlewares.flatMap((m) =>
    'include' in m
      ? Object.keys(m.include).includes(name)
        ? [m.middleware]
        : []
      : 'exclude' in m
      ? !Object.keys(m.exclude).includes(name)
        ? [m.middleware as EntityManagerMiddleware<MetadataType, OperationMetadataType>]
        : []
      : [m],
  )
}
