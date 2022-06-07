import * as T from '@twinlogix/typetta'
import * as types from './model.types'
import * as M from 'mongodb'

export type EBoardExcludedFields = never
export type EBoardRelationFields = 'roles' | 'user'

export function eBoardSchema(): T.Schema<types.Scalars> {
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
      refFrom: 'eboardId',
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

type EBoardFilterFields = {
  createdAt?: types.Scalars['Date'] | null | T.EqualityOperators<types.Scalars['Date']> | T.ElementOperators
  graduatedAt?: types.Scalars['Date'] | null | T.EqualityOperators<types.Scalars['Date']> | T.ElementOperators
  id?: types.Scalars['ID'] | null | T.EqualityOperators<types.Scalars['ID']> | T.ElementOperators
  userId?: types.Scalars['ID'] | null | T.EqualityOperators<types.Scalars['ID']> | T.ElementOperators
}
export type EBoardFilter = EBoardFilterFields & T.LogicalOperators<EBoardFilterFields | EBoardRawFilter>
export type EBoardRawFilter = () => M.Filter<M.Document>

export type EBoardRelations = {
  roles?: {
    filter?: EBoardRoleFilter
    sorts?: EBoardRoleSort[] | EBoardRoleRawSort
    skip?: number
    limit?: number
    relations?: EBoardRoleRelations
  }
}

export type EBoardProjection = {
  createdAt?: boolean
  graduatedAt?: boolean
  id?: boolean
  roles?: EBoardRoleProjection | boolean
  user?: UserProjection | boolean
  userId?: boolean
}
export type EBoardParam<P extends EBoardProjection> = T.ParamProjection<types.EBoard, EBoardProjection, P>

export type EBoardSortKeys = 'createdAt' | 'graduatedAt' | 'id' | 'userId'
export type EBoardSort = Partial<Record<EBoardSortKeys, T.SortDirection>>
export type EBoardRawSort = () => M.Sort

export type EBoardUpdate = {
  createdAt?: types.Scalars['Date'] | null
  graduatedAt?: types.Scalars['Date'] | null
  id?: types.Scalars['ID'] | null
  userId?: types.Scalars['ID'] | null
}
export type EBoardRawUpdate = () => M.UpdateFilter<M.Document>

export type EBoardInsert = {
  createdAt?: null | types.Scalars['Date']
  graduatedAt?: null | types.Scalars['Date']
  userId: types.Scalars['ID']
}

type EBoardDAOGenerics<MetadataType, OperationMetadataType> = T.MongoDBDAOGenerics<
  types.EBoard,
  'id',
  'ID',
  EBoardFilter,
  EBoardRawFilter,
  EBoardRelations,
  EBoardProjection,
  EBoardSort,
  EBoardRawSort,
  EBoardInsert,
  EBoardUpdate,
  EBoardRawUpdate,
  EBoardExcludedFields,
  EBoardRelationFields,
  MetadataType,
  OperationMetadataType,
  types.Scalars,
  'eBoard',
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

export class EBoardDAO<MetadataType, OperationMetadataType> extends T.AbstractMongoDBDAO<EBoardDAOGenerics<MetadataType, OperationMetadataType>> {
  public static projection<P extends EBoardProjection>(p: P) {
    return p
  }
  public static mergeProjection<P1 extends EBoardProjection, P2 extends EBoardProjection>(p1: P1, p2: P2): T.SelectProjection<EBoardProjection, P1, P2> {
    return T.mergeProjections(p1, p2) as T.SelectProjection<EBoardProjection, P1, P2>
  }

  public constructor(params: EBoardDAOParams<MetadataType, OperationMetadataType>) {
    super({
      ...params,
      schema: eBoardSchema(),
    })
  }
}

export class InMemoryEBoardDAO<MetadataType, OperationMetadataType> extends T.AbstractInMemoryDAO<EBoardDAOGenerics<MetadataType, OperationMetadataType>> {
  public static projection<P extends EBoardProjection>(p: P) {
    return p
  }
  public static mergeProjection<P1 extends EBoardProjection, P2 extends EBoardProjection>(p1: P1, p2: P2): T.SelectProjection<EBoardProjection, P1, P2> {
    return T.mergeProjections(p1, p2) as T.SelectProjection<EBoardProjection, P1, P2>
  }

  public constructor(params: InMemoryEBoardDAOParams<MetadataType, OperationMetadataType>) {
    super({
      ...params,
      schema: eBoardSchema(),
    })
  }
}

export type EBoardRoleExcludedFields = never
export type EBoardRoleRelationFields = 'eboard'

export function eBoardRoleSchema(): T.Schema<types.Scalars> {
  return {
    eboard: {
      type: 'relation',
      relation: 'inner',
      schema: () => eBoardSchema(),
      refFrom: 'eboardId',
      refTo: 'id',
      dao: 'eBoard',
      required: true,
    },
    eboardId: {
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

type EBoardRoleFilterFields = {
  eboardId?: types.Scalars['ID'] | null | T.EqualityOperators<types.Scalars['ID']> | T.ElementOperators
  id?: types.Scalars['ID'] | null | T.EqualityOperators<types.Scalars['ID']> | T.ElementOperators
  roleCode?: types.RoleCode | null | T.EqualityOperators<types.RoleCode> | T.ElementOperators | T.StringOperators
}
export type EBoardRoleFilter = EBoardRoleFilterFields & T.LogicalOperators<EBoardRoleFilterFields | EBoardRoleRawFilter>
export type EBoardRoleRawFilter = () => M.Filter<M.Document>

export type EBoardRoleRelations = Record<never, string>

export type EBoardRoleProjection = {
  eboard?: EBoardProjection | boolean
  eboardId?: boolean
  id?: boolean
  roleCode?: boolean
}
export type EBoardRoleParam<P extends EBoardRoleProjection> = T.ParamProjection<types.EBoardRole, EBoardRoleProjection, P>

export type EBoardRoleSortKeys = 'eboardId' | 'id' | 'roleCode'
export type EBoardRoleSort = Partial<Record<EBoardRoleSortKeys, T.SortDirection>>
export type EBoardRoleRawSort = () => M.Sort

export type EBoardRoleUpdate = {
  eboardId?: types.Scalars['ID'] | null
  id?: types.Scalars['ID'] | null
  roleCode?: types.RoleCode | null
}
export type EBoardRoleRawUpdate = () => M.UpdateFilter<M.Document>

export type EBoardRoleInsert = {
  eboardId: types.Scalars['ID']
  roleCode: types.RoleCode
}

type EBoardRoleDAOGenerics<MetadataType, OperationMetadataType> = T.MongoDBDAOGenerics<
  types.EBoardRole,
  'id',
  'ID',
  EBoardRoleFilter,
  EBoardRoleRawFilter,
  EBoardRoleRelations,
  EBoardRoleProjection,
  EBoardRoleSort,
  EBoardRoleRawSort,
  EBoardRoleInsert,
  EBoardRoleUpdate,
  EBoardRoleRawUpdate,
  EBoardRoleExcludedFields,
  EBoardRoleRelationFields,
  MetadataType,
  OperationMetadataType,
  types.Scalars,
  'eBoardRole',
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

export class EBoardRoleDAO<MetadataType, OperationMetadataType> extends T.AbstractMongoDBDAO<EBoardRoleDAOGenerics<MetadataType, OperationMetadataType>> {
  public static projection<P extends EBoardRoleProjection>(p: P) {
    return p
  }
  public static mergeProjection<P1 extends EBoardRoleProjection, P2 extends EBoardRoleProjection>(p1: P1, p2: P2): T.SelectProjection<EBoardRoleProjection, P1, P2> {
    return T.mergeProjections(p1, p2) as T.SelectProjection<EBoardRoleProjection, P1, P2>
  }

  public constructor(params: EBoardRoleDAOParams<MetadataType, OperationMetadataType>) {
    super({
      ...params,
      schema: eBoardRoleSchema(),
    })
  }
}

export class InMemoryEBoardRoleDAO<MetadataType, OperationMetadataType> extends T.AbstractInMemoryDAO<EBoardRoleDAOGenerics<MetadataType, OperationMetadataType>> {
  public static projection<P extends EBoardRoleProjection>(p: P) {
    return p
  }
  public static mergeProjection<P1 extends EBoardRoleProjection, P2 extends EBoardRoleProjection>(p1: P1, p2: P2): T.SelectProjection<EBoardRoleProjection, P1, P2> {
    return T.mergeProjections(p1, p2) as T.SelectProjection<EBoardRoleProjection, P1, P2>
  }

  public constructor(params: InMemoryEBoardRoleDAOParams<MetadataType, OperationMetadataType>) {
    super({
      ...params,
      schema: eBoardRoleSchema(),
    })
  }
}

export type ProjectExcludedFields = never
export type ProjectRelationFields = 'members'

export function projectSchema(): T.Schema<types.Scalars> {
  return {
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
      required: true,
    },
    downloadLinks: {
      type: 'scalar',
      scalar: 'String',
      isListElementRequired: true,
      required: true,
      isList: true,
    },
    galleryImageLinks: {
      type: 'scalar',
      scalar: 'String',
      isListElementRequired: true,
      required: true,
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
    members: {
      type: 'relation',
      relation: 'foreign',
      schema: () => projectMemberSchema(),
      refFrom: 'projectId',
      refTo: 'id',
      dao: 'projectMember',
      isListElementRequired: true,
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
    updatedAt: {
      type: 'scalar',
      scalar: 'Date',
      metadata: Object.fromEntries([['createdAt', 'true']]),
    },
  }
}

type ProjectFilterFields = {
  bannerLink?: types.Scalars['String'] | null | T.EqualityOperators<types.Scalars['String']> | T.ElementOperators | T.StringOperators
  cardImageLink?: types.Scalars['String'] | null | T.EqualityOperators<types.Scalars['String']> | T.ElementOperators | T.StringOperators
  completedAt?: types.Scalars['Date'] | null | T.EqualityOperators<types.Scalars['Date']> | T.ElementOperators
  createdAt?: types.Scalars['Date'] | null | T.EqualityOperators<types.Scalars['Date']> | T.ElementOperators
  description?: types.Scalars['String'] | null | T.EqualityOperators<types.Scalars['String']> | T.ElementOperators | T.StringOperators
  downloadLinks?: types.Scalars['String'][] | null | T.EqualityOperators<types.Scalars['String'][]> | T.ElementOperators | T.StringOperators
  galleryImageLinks?: types.Scalars['String'][] | null | T.EqualityOperators<types.Scalars['String'][]> | T.ElementOperators | T.StringOperators
  id?: types.Scalars['ID'] | null | T.EqualityOperators<types.Scalars['ID']> | T.ElementOperators
  name?: types.Scalars['String'] | null | T.EqualityOperators<types.Scalars['String']> | T.ElementOperators | T.StringOperators
  pitch?: types.Scalars['String'] | null | T.EqualityOperators<types.Scalars['String']> | T.ElementOperators | T.StringOperators
  soundcloudEmbedSrc?: types.Scalars['String'] | null | T.EqualityOperators<types.Scalars['String']> | T.ElementOperators | T.StringOperators
  updatedAt?: types.Scalars['Date'] | null | T.EqualityOperators<types.Scalars['Date']> | T.ElementOperators
}
export type ProjectFilter = ProjectFilterFields & T.LogicalOperators<ProjectFilterFields | ProjectRawFilter>
export type ProjectRawFilter = () => M.Filter<M.Document>

export type ProjectRelations = {
  members?: {
    filter?: ProjectMemberFilter
    sorts?: ProjectMemberSort[] | ProjectMemberRawSort
    skip?: number
    limit?: number
    relations?: ProjectMemberRelations
  }
}

export type ProjectProjection = {
  bannerLink?: boolean
  cardImageLink?: boolean
  completedAt?: boolean
  createdAt?: boolean
  description?: boolean
  downloadLinks?: boolean
  galleryImageLinks?: boolean
  id?: boolean
  members?: ProjectMemberProjection | boolean
  name?: boolean
  pitch?: boolean
  soundcloudEmbedSrc?: boolean
  updatedAt?: boolean
}
export type ProjectParam<P extends ProjectProjection> = T.ParamProjection<types.Project, ProjectProjection, P>

export type ProjectSortKeys =
  | 'bannerLink'
  | 'cardImageLink'
  | 'completedAt'
  | 'createdAt'
  | 'description'
  | 'downloadLinks'
  | 'galleryImageLinks'
  | 'id'
  | 'name'
  | 'pitch'
  | 'soundcloudEmbedSrc'
  | 'updatedAt'
export type ProjectSort = Partial<Record<ProjectSortKeys, T.SortDirection>>
export type ProjectRawSort = () => M.Sort

export type ProjectUpdate = {
  bannerLink?: types.Scalars['String'] | null
  cardImageLink?: types.Scalars['String'] | null
  completedAt?: types.Scalars['Date'] | null
  createdAt?: types.Scalars['Date'] | null
  description?: types.Scalars['String'] | null
  downloadLinks?: types.Scalars['String'][] | null
  galleryImageLinks?: types.Scalars['String'][] | null
  id?: types.Scalars['ID'] | null
  name?: types.Scalars['String'] | null
  pitch?: types.Scalars['String'] | null
  soundcloudEmbedSrc?: types.Scalars['String'] | null
  updatedAt?: types.Scalars['Date'] | null
}
export type ProjectRawUpdate = () => M.UpdateFilter<M.Document>

export type ProjectInsert = {
  bannerLink?: null | types.Scalars['String']
  cardImageLink?: null | types.Scalars['String']
  completedAt?: null | types.Scalars['Date']
  createdAt?: null | types.Scalars['Date']
  description: types.Scalars['String']
  downloadLinks: types.Scalars['String'][]
  galleryImageLinks: types.Scalars['String'][]
  name: types.Scalars['String']
  pitch: types.Scalars['String']
  soundcloudEmbedSrc?: null | types.Scalars['String']
  updatedAt?: null | types.Scalars['Date']
}

type ProjectDAOGenerics<MetadataType, OperationMetadataType> = T.MongoDBDAOGenerics<
  types.Project,
  'id',
  'ID',
  ProjectFilter,
  ProjectRawFilter,
  ProjectRelations,
  ProjectProjection,
  ProjectSort,
  ProjectRawSort,
  ProjectInsert,
  ProjectUpdate,
  ProjectRawUpdate,
  ProjectExcludedFields,
  ProjectRelationFields,
  MetadataType,
  OperationMetadataType,
  types.Scalars,
  'project',
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

export class ProjectDAO<MetadataType, OperationMetadataType> extends T.AbstractMongoDBDAO<ProjectDAOGenerics<MetadataType, OperationMetadataType>> {
  public static projection<P extends ProjectProjection>(p: P) {
    return p
  }
  public static mergeProjection<P1 extends ProjectProjection, P2 extends ProjectProjection>(p1: P1, p2: P2): T.SelectProjection<ProjectProjection, P1, P2> {
    return T.mergeProjections(p1, p2) as T.SelectProjection<ProjectProjection, P1, P2>
  }

  public constructor(params: ProjectDAOParams<MetadataType, OperationMetadataType>) {
    super({
      ...params,
      schema: projectSchema(),
    })
  }
}

export class InMemoryProjectDAO<MetadataType, OperationMetadataType> extends T.AbstractInMemoryDAO<ProjectDAOGenerics<MetadataType, OperationMetadataType>> {
  public static projection<P extends ProjectProjection>(p: P) {
    return p
  }
  public static mergeProjection<P1 extends ProjectProjection, P2 extends ProjectProjection>(p1: P1, p2: P2): T.SelectProjection<ProjectProjection, P1, P2> {
    return T.mergeProjections(p1, p2) as T.SelectProjection<ProjectProjection, P1, P2>
  }

  public constructor(params: InMemoryProjectDAOParams<MetadataType, OperationMetadataType>) {
    super({
      ...params,
      schema: projectSchema(),
    })
  }
}

export type ProjectMemberExcludedFields = never
export type ProjectMemberRelationFields = 'project' | 'roles' | 'user'

export function projectMemberSchema(): T.Schema<types.Scalars> {
  return {
    contributions: {
      type: 'scalar',
      scalar: 'String',
      required: true,
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

type ProjectMemberFilterFields = {
  contributions?: types.Scalars['String'] | null | T.EqualityOperators<types.Scalars['String']> | T.ElementOperators | T.StringOperators
  createdAt?: types.Scalars['Date'] | null | T.EqualityOperators<types.Scalars['Date']> | T.ElementOperators
  id?: types.Scalars['ID'] | null | T.EqualityOperators<types.Scalars['ID']> | T.ElementOperators
  projectId?: types.Scalars['ID'] | null | T.EqualityOperators<types.Scalars['ID']> | T.ElementOperators
  updatedAt?: types.Scalars['Date'] | null | T.EqualityOperators<types.Scalars['Date']> | T.ElementOperators
  userId?: types.Scalars['ID'] | null | T.EqualityOperators<types.Scalars['ID']> | T.ElementOperators
}
export type ProjectMemberFilter = ProjectMemberFilterFields & T.LogicalOperators<ProjectMemberFilterFields | ProjectMemberRawFilter>
export type ProjectMemberRawFilter = () => M.Filter<M.Document>

export type ProjectMemberRelations = {
  roles?: {
    filter?: ProjectMemberRoleFilter
    sorts?: ProjectMemberRoleSort[] | ProjectMemberRoleRawSort
    skip?: number
    limit?: number
    relations?: ProjectMemberRoleRelations
  }
}

export type ProjectMemberProjection = {
  contributions?: boolean
  createdAt?: boolean
  id?: boolean
  project?: ProjectProjection | boolean
  projectId?: boolean
  roles?: ProjectMemberRoleProjection | boolean
  updatedAt?: boolean
  user?: UserProjection | boolean
  userId?: boolean
}
export type ProjectMemberParam<P extends ProjectMemberProjection> = T.ParamProjection<types.ProjectMember, ProjectMemberProjection, P>

export type ProjectMemberSortKeys = 'contributions' | 'createdAt' | 'id' | 'projectId' | 'updatedAt' | 'userId'
export type ProjectMemberSort = Partial<Record<ProjectMemberSortKeys, T.SortDirection>>
export type ProjectMemberRawSort = () => M.Sort

export type ProjectMemberUpdate = {
  contributions?: types.Scalars['String'] | null
  createdAt?: types.Scalars['Date'] | null
  id?: types.Scalars['ID'] | null
  projectId?: types.Scalars['ID'] | null
  updatedAt?: types.Scalars['Date'] | null
  userId?: types.Scalars['ID'] | null
}
export type ProjectMemberRawUpdate = () => M.UpdateFilter<M.Document>

export type ProjectMemberInsert = {
  contributions: types.Scalars['String']
  createdAt?: null | types.Scalars['Date']
  projectId: types.Scalars['ID']
  updatedAt?: null | types.Scalars['Date']
  userId: types.Scalars['ID']
}

type ProjectMemberDAOGenerics<MetadataType, OperationMetadataType> = T.MongoDBDAOGenerics<
  types.ProjectMember,
  'id',
  'ID',
  ProjectMemberFilter,
  ProjectMemberRawFilter,
  ProjectMemberRelations,
  ProjectMemberProjection,
  ProjectMemberSort,
  ProjectMemberRawSort,
  ProjectMemberInsert,
  ProjectMemberUpdate,
  ProjectMemberRawUpdate,
  ProjectMemberExcludedFields,
  ProjectMemberRelationFields,
  MetadataType,
  OperationMetadataType,
  types.Scalars,
  'projectMember',
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

export class ProjectMemberDAO<MetadataType, OperationMetadataType> extends T.AbstractMongoDBDAO<ProjectMemberDAOGenerics<MetadataType, OperationMetadataType>> {
  public static projection<P extends ProjectMemberProjection>(p: P) {
    return p
  }
  public static mergeProjection<P1 extends ProjectMemberProjection, P2 extends ProjectMemberProjection>(p1: P1, p2: P2): T.SelectProjection<ProjectMemberProjection, P1, P2> {
    return T.mergeProjections(p1, p2) as T.SelectProjection<ProjectMemberProjection, P1, P2>
  }

  public constructor(params: ProjectMemberDAOParams<MetadataType, OperationMetadataType>) {
    super({
      ...params,
      schema: projectMemberSchema(),
    })
  }
}

export class InMemoryProjectMemberDAO<MetadataType, OperationMetadataType> extends T.AbstractInMemoryDAO<ProjectMemberDAOGenerics<MetadataType, OperationMetadataType>> {
  public static projection<P extends ProjectMemberProjection>(p: P) {
    return p
  }
  public static mergeProjection<P1 extends ProjectMemberProjection, P2 extends ProjectMemberProjection>(p1: P1, p2: P2): T.SelectProjection<ProjectMemberProjection, P1, P2> {
    return T.mergeProjections(p1, p2) as T.SelectProjection<ProjectMemberProjection, P1, P2>
  }

  public constructor(params: InMemoryProjectMemberDAOParams<MetadataType, OperationMetadataType>) {
    super({
      ...params,
      schema: projectMemberSchema(),
    })
  }
}

export type ProjectMemberRoleExcludedFields = never
export type ProjectMemberRoleRelationFields = 'projectMember'

export function projectMemberRoleSchema(): T.Schema<types.Scalars> {
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

type ProjectMemberRoleFilterFields = {
  id?: types.Scalars['ID'] | null | T.EqualityOperators<types.Scalars['ID']> | T.ElementOperators
  projectMemberId?: types.Scalars['ID'] | null | T.EqualityOperators<types.Scalars['ID']> | T.ElementOperators
  roleCode?: types.RoleCode | null | T.EqualityOperators<types.RoleCode> | T.ElementOperators | T.StringOperators
}
export type ProjectMemberRoleFilter = ProjectMemberRoleFilterFields & T.LogicalOperators<ProjectMemberRoleFilterFields | ProjectMemberRoleRawFilter>
export type ProjectMemberRoleRawFilter = () => M.Filter<M.Document>

export type ProjectMemberRoleRelations = Record<never, string>

export type ProjectMemberRoleProjection = {
  id?: boolean
  projectMember?: ProjectMemberProjection | boolean
  projectMemberId?: boolean
  roleCode?: boolean
}
export type ProjectMemberRoleParam<P extends ProjectMemberRoleProjection> = T.ParamProjection<types.ProjectMemberRole, ProjectMemberRoleProjection, P>

export type ProjectMemberRoleSortKeys = 'id' | 'projectMemberId' | 'roleCode'
export type ProjectMemberRoleSort = Partial<Record<ProjectMemberRoleSortKeys, T.SortDirection>>
export type ProjectMemberRoleRawSort = () => M.Sort

export type ProjectMemberRoleUpdate = {
  id?: types.Scalars['ID'] | null
  projectMemberId?: types.Scalars['ID'] | null
  roleCode?: types.RoleCode | null
}
export type ProjectMemberRoleRawUpdate = () => M.UpdateFilter<M.Document>

export type ProjectMemberRoleInsert = {
  projectMemberId: types.Scalars['ID']
  roleCode: types.RoleCode
}

type ProjectMemberRoleDAOGenerics<MetadataType, OperationMetadataType> = T.MongoDBDAOGenerics<
  types.ProjectMemberRole,
  'id',
  'ID',
  ProjectMemberRoleFilter,
  ProjectMemberRoleRawFilter,
  ProjectMemberRoleRelations,
  ProjectMemberRoleProjection,
  ProjectMemberRoleSort,
  ProjectMemberRoleRawSort,
  ProjectMemberRoleInsert,
  ProjectMemberRoleUpdate,
  ProjectMemberRoleRawUpdate,
  ProjectMemberRoleExcludedFields,
  ProjectMemberRoleRelationFields,
  MetadataType,
  OperationMetadataType,
  types.Scalars,
  'projectMemberRole',
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

export class ProjectMemberRoleDAO<MetadataType, OperationMetadataType> extends T.AbstractMongoDBDAO<ProjectMemberRoleDAOGenerics<MetadataType, OperationMetadataType>> {
  public static projection<P extends ProjectMemberRoleProjection>(p: P) {
    return p
  }
  public static mergeProjection<P1 extends ProjectMemberRoleProjection, P2 extends ProjectMemberRoleProjection>(p1: P1, p2: P2): T.SelectProjection<ProjectMemberRoleProjection, P1, P2> {
    return T.mergeProjections(p1, p2) as T.SelectProjection<ProjectMemberRoleProjection, P1, P2>
  }

  public constructor(params: ProjectMemberRoleDAOParams<MetadataType, OperationMetadataType>) {
    super({
      ...params,
      schema: projectMemberRoleSchema(),
    })
  }
}

export class InMemoryProjectMemberRoleDAO<MetadataType, OperationMetadataType> extends T.AbstractInMemoryDAO<ProjectMemberRoleDAOGenerics<MetadataType, OperationMetadataType>> {
  public static projection<P extends ProjectMemberRoleProjection>(p: P) {
    return p
  }
  public static mergeProjection<P1 extends ProjectMemberRoleProjection, P2 extends ProjectMemberRoleProjection>(p1: P1, p2: P2): T.SelectProjection<ProjectMemberRoleProjection, P1, P2> {
    return T.mergeProjections(p1, p2) as T.SelectProjection<ProjectMemberRoleProjection, P1, P2>
  }

  public constructor(params: InMemoryProjectMemberRoleDAOParams<MetadataType, OperationMetadataType>) {
    super({
      ...params,
      schema: projectMemberRoleSchema(),
    })
  }
}

export type SomeTypeExcludedFields = never
export type SomeTypeRelationFields = never

export function someTypeSchema(): T.Schema<types.Scalars> {
  return {
    id: {
      type: 'scalar',
      scalar: 'ID',
      isId: true,
      generationStrategy: 'db',
      required: true,
      alias: '_id',
    },
    someField: {
      type: 'scalar',
      scalar: 'Date',
      metadata: Object.fromEntries([
        ['keyOne', '[object Object]'],
        ['keyTwo', 'one,2,three,true'],
      ]),
    },
  }
}

type SomeTypeFilterFields = {
  id?: types.Scalars['ID'] | null | T.EqualityOperators<types.Scalars['ID']> | T.ElementOperators
  someField?: types.Scalars['Date'] | null | T.EqualityOperators<types.Scalars['Date']> | T.ElementOperators
}
export type SomeTypeFilter = SomeTypeFilterFields & T.LogicalOperators<SomeTypeFilterFields | SomeTypeRawFilter>
export type SomeTypeRawFilter = () => M.Filter<M.Document>

export type SomeTypeRelations = Record<never, string>

export type SomeTypeProjection = {
  id?: boolean
  someField?: boolean
}
export type SomeTypeParam<P extends SomeTypeProjection> = T.ParamProjection<types.SomeType, SomeTypeProjection, P>

export type SomeTypeSortKeys = 'id' | 'someField'
export type SomeTypeSort = Partial<Record<SomeTypeSortKeys, T.SortDirection>>
export type SomeTypeRawSort = () => M.Sort

export type SomeTypeUpdate = {
  id?: types.Scalars['ID'] | null
  someField?: types.Scalars['Date'] | null
}
export type SomeTypeRawUpdate = () => M.UpdateFilter<M.Document>

export type SomeTypeInsert = {
  someField?: null | types.Scalars['Date']
}

type SomeTypeDAOGenerics<MetadataType, OperationMetadataType> = T.MongoDBDAOGenerics<
  types.SomeType,
  'id',
  'ID',
  SomeTypeFilter,
  SomeTypeRawFilter,
  SomeTypeRelations,
  SomeTypeProjection,
  SomeTypeSort,
  SomeTypeRawSort,
  SomeTypeInsert,
  SomeTypeUpdate,
  SomeTypeRawUpdate,
  SomeTypeExcludedFields,
  SomeTypeRelationFields,
  MetadataType,
  OperationMetadataType,
  types.Scalars,
  'someType',
  EntityManager<MetadataType, OperationMetadataType>
>
export type SomeTypeDAOParams<MetadataType, OperationMetadataType> = Omit<
  T.MongoDBDAOParams<SomeTypeDAOGenerics<MetadataType, OperationMetadataType>>,
  'idGenerator' | 'idField' | 'schema' | 'idScalar' | 'idGeneration'
>
export type InMemorySomeTypeDAOParams<MetadataType, OperationMetadataType> = Omit<
  T.InMemoryDAOParams<SomeTypeDAOGenerics<MetadataType, OperationMetadataType>>,
  'idGenerator' | 'idField' | 'schema' | 'idScalar' | 'idGeneration'
>

export class SomeTypeDAO<MetadataType, OperationMetadataType> extends T.AbstractMongoDBDAO<SomeTypeDAOGenerics<MetadataType, OperationMetadataType>> {
  public static projection<P extends SomeTypeProjection>(p: P) {
    return p
  }
  public static mergeProjection<P1 extends SomeTypeProjection, P2 extends SomeTypeProjection>(p1: P1, p2: P2): T.SelectProjection<SomeTypeProjection, P1, P2> {
    return T.mergeProjections(p1, p2) as T.SelectProjection<SomeTypeProjection, P1, P2>
  }

  public constructor(params: SomeTypeDAOParams<MetadataType, OperationMetadataType>) {
    super({
      ...params,
      schema: someTypeSchema(),
    })
  }
}

export class InMemorySomeTypeDAO<MetadataType, OperationMetadataType> extends T.AbstractInMemoryDAO<SomeTypeDAOGenerics<MetadataType, OperationMetadataType>> {
  public static projection<P extends SomeTypeProjection>(p: P) {
    return p
  }
  public static mergeProjection<P1 extends SomeTypeProjection, P2 extends SomeTypeProjection>(p1: P1, p2: P2): T.SelectProjection<SomeTypeProjection, P1, P2> {
    return T.mergeProjections(p1, p2) as T.SelectProjection<SomeTypeProjection, P1, P2>
  }

  public constructor(params: InMemorySomeTypeDAOParams<MetadataType, OperationMetadataType>) {
    super({
      ...params,
      schema: someTypeSchema(),
    })
  }
}

export type UserExcludedFields = never
export type UserRelationFields = 'eboard' | 'loginIdentities' | 'projectMembers' | 'roles' | 'socials'

export function userSchema(): T.Schema<types.Scalars> {
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
    eboard: {
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

type UserFilterFields = {
  avatarLink?: types.Scalars['String'] | null | T.EqualityOperators<types.Scalars['String']> | T.ElementOperators | T.StringOperators
  bannerLink?: types.Scalars['String'] | null | T.EqualityOperators<types.Scalars['String']> | T.ElementOperators | T.StringOperators
  bio?: types.Scalars['String'] | null | T.EqualityOperators<types.Scalars['String']> | T.ElementOperators | T.StringOperators
  createdAt?: types.Scalars['Date'] | null | T.EqualityOperators<types.Scalars['Date']> | T.ElementOperators
  displayName?: types.Scalars['String'] | null | T.EqualityOperators<types.Scalars['String']> | T.ElementOperators | T.StringOperators
  email?: types.Scalars['String'] | null | T.EqualityOperators<types.Scalars['String']> | T.ElementOperators | T.StringOperators
  id?: types.Scalars['ID'] | null | T.EqualityOperators<types.Scalars['ID']> | T.ElementOperators
  updatedAt?: types.Scalars['Date'] | null | T.EqualityOperators<types.Scalars['Date']> | T.ElementOperators
  username?: types.Scalars['String'] | null | T.EqualityOperators<types.Scalars['String']> | T.ElementOperators | T.StringOperators
}
export type UserFilter = UserFilterFields & T.LogicalOperators<UserFilterFields | UserRawFilter>
export type UserRawFilter = () => M.Filter<M.Document>

export type UserRelations = {
  loginIdentities?: {
    filter?: UserLoginIdentityFilter
    sorts?: UserLoginIdentitySort[] | UserLoginIdentityRawSort
    skip?: number
    limit?: number
    relations?: UserLoginIdentityRelations
  }
  projectMembers?: {
    filter?: ProjectMemberFilter
    sorts?: ProjectMemberSort[] | ProjectMemberRawSort
    skip?: number
    limit?: number
    relations?: ProjectMemberRelations
  }
  roles?: {
    filter?: UserRoleFilter
    sorts?: UserRoleSort[] | UserRoleRawSort
    skip?: number
    limit?: number
    relations?: UserRoleRelations
  }
  socials?: {
    filter?: UserSocialFilter
    sorts?: UserSocialSort[] | UserSocialRawSort
    skip?: number
    limit?: number
    relations?: UserSocialRelations
  }
}

export type UserProjection = {
  avatarLink?: boolean
  bannerLink?: boolean
  bio?: boolean
  createdAt?: boolean
  displayName?: boolean
  eboard?: EBoardProjection | boolean
  email?: boolean
  id?: boolean
  loginIdentities?: UserLoginIdentityProjection | boolean
  projectMembers?: ProjectMemberProjection | boolean
  roles?: UserRoleProjection | boolean
  socials?: UserSocialProjection | boolean
  updatedAt?: boolean
  username?: boolean
}
export type UserParam<P extends UserProjection> = T.ParamProjection<types.User, UserProjection, P>

export type UserSortKeys = 'avatarLink' | 'bannerLink' | 'bio' | 'createdAt' | 'displayName' | 'email' | 'id' | 'updatedAt' | 'username'
export type UserSort = Partial<Record<UserSortKeys, T.SortDirection>>
export type UserRawSort = () => M.Sort

export type UserUpdate = {
  avatarLink?: types.Scalars['String'] | null
  bannerLink?: types.Scalars['String'] | null
  bio?: types.Scalars['String'] | null
  createdAt?: types.Scalars['Date'] | null
  displayName?: types.Scalars['String'] | null
  email?: types.Scalars['String'] | null
  id?: types.Scalars['ID'] | null
  updatedAt?: types.Scalars['Date'] | null
  username?: types.Scalars['String'] | null
}
export type UserRawUpdate = () => M.UpdateFilter<M.Document>

export type UserInsert = {
  avatarLink?: null | types.Scalars['String']
  bannerLink?: null | types.Scalars['String']
  bio?: null | types.Scalars['String']
  createdAt?: null | types.Scalars['Date']
  displayName?: null | types.Scalars['String']
  email: types.Scalars['String']
  updatedAt?: null | types.Scalars['Date']
  username?: null | types.Scalars['String']
}

type UserDAOGenerics<MetadataType, OperationMetadataType> = T.MongoDBDAOGenerics<
  types.User,
  'id',
  'ID',
  UserFilter,
  UserRawFilter,
  UserRelations,
  UserProjection,
  UserSort,
  UserRawSort,
  UserInsert,
  UserUpdate,
  UserRawUpdate,
  UserExcludedFields,
  UserRelationFields,
  MetadataType,
  OperationMetadataType,
  types.Scalars,
  'user',
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

export class UserDAO<MetadataType, OperationMetadataType> extends T.AbstractMongoDBDAO<UserDAOGenerics<MetadataType, OperationMetadataType>> {
  public static projection<P extends UserProjection>(p: P) {
    return p
  }
  public static mergeProjection<P1 extends UserProjection, P2 extends UserProjection>(p1: P1, p2: P2): T.SelectProjection<UserProjection, P1, P2> {
    return T.mergeProjections(p1, p2) as T.SelectProjection<UserProjection, P1, P2>
  }

  public constructor(params: UserDAOParams<MetadataType, OperationMetadataType>) {
    super({
      ...params,
      schema: userSchema(),
    })
  }
}

export class InMemoryUserDAO<MetadataType, OperationMetadataType> extends T.AbstractInMemoryDAO<UserDAOGenerics<MetadataType, OperationMetadataType>> {
  public static projection<P extends UserProjection>(p: P) {
    return p
  }
  public static mergeProjection<P1 extends UserProjection, P2 extends UserProjection>(p1: P1, p2: P2): T.SelectProjection<UserProjection, P1, P2> {
    return T.mergeProjections(p1, p2) as T.SelectProjection<UserProjection, P1, P2>
  }

  public constructor(params: InMemoryUserDAOParams<MetadataType, OperationMetadataType>) {
    super({
      ...params,
      schema: userSchema(),
    })
  }
}

export type UserLoginIdentityExcludedFields = never
export type UserLoginIdentityRelationFields = 'user'

export function userLoginIdentitySchema(): T.Schema<types.Scalars> {
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

type UserLoginIdentityFilterFields = {
  data?: types.Scalars['Json'] | null | T.EqualityOperators<types.Scalars['Json']> | T.ElementOperators
  id?: types.Scalars['ID'] | null | T.EqualityOperators<types.Scalars['ID']> | T.ElementOperators
  identityId?: types.Scalars['String'] | null | T.EqualityOperators<types.Scalars['String']> | T.ElementOperators | T.StringOperators
  name?: types.Scalars['String'] | null | T.EqualityOperators<types.Scalars['String']> | T.ElementOperators | T.StringOperators
  userId?: types.Scalars['ID'] | null | T.EqualityOperators<types.Scalars['ID']> | T.ElementOperators
}
export type UserLoginIdentityFilter = UserLoginIdentityFilterFields & T.LogicalOperators<UserLoginIdentityFilterFields | UserLoginIdentityRawFilter>
export type UserLoginIdentityRawFilter = () => M.Filter<M.Document>

export type UserLoginIdentityRelations = Record<never, string>

export type UserLoginIdentityProjection = {
  data?: boolean
  id?: boolean
  identityId?: boolean
  name?: boolean
  user?: UserProjection | boolean
  userId?: boolean
}
export type UserLoginIdentityParam<P extends UserLoginIdentityProjection> = T.ParamProjection<types.UserLoginIdentity, UserLoginIdentityProjection, P>

export type UserLoginIdentitySortKeys = 'data' | 'id' | 'identityId' | 'name' | 'userId'
export type UserLoginIdentitySort = Partial<Record<UserLoginIdentitySortKeys, T.SortDirection>>
export type UserLoginIdentityRawSort = () => M.Sort

export type UserLoginIdentityUpdate = {
  data?: types.Scalars['Json'] | null
  id?: types.Scalars['ID'] | null
  identityId?: types.Scalars['String'] | null
  name?: types.Scalars['String'] | null
  userId?: types.Scalars['ID'] | null
}
export type UserLoginIdentityRawUpdate = () => M.UpdateFilter<M.Document>

export type UserLoginIdentityInsert = {
  data?: null | types.Scalars['Json']
  identityId: types.Scalars['String']
  name: types.Scalars['String']
  userId: types.Scalars['ID']
}

type UserLoginIdentityDAOGenerics<MetadataType, OperationMetadataType> = T.MongoDBDAOGenerics<
  types.UserLoginIdentity,
  'id',
  'ID',
  UserLoginIdentityFilter,
  UserLoginIdentityRawFilter,
  UserLoginIdentityRelations,
  UserLoginIdentityProjection,
  UserLoginIdentitySort,
  UserLoginIdentityRawSort,
  UserLoginIdentityInsert,
  UserLoginIdentityUpdate,
  UserLoginIdentityRawUpdate,
  UserLoginIdentityExcludedFields,
  UserLoginIdentityRelationFields,
  MetadataType,
  OperationMetadataType,
  types.Scalars,
  'userLoginIdentity',
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

export class UserLoginIdentityDAO<MetadataType, OperationMetadataType> extends T.AbstractMongoDBDAO<UserLoginIdentityDAOGenerics<MetadataType, OperationMetadataType>> {
  public static projection<P extends UserLoginIdentityProjection>(p: P) {
    return p
  }
  public static mergeProjection<P1 extends UserLoginIdentityProjection, P2 extends UserLoginIdentityProjection>(p1: P1, p2: P2): T.SelectProjection<UserLoginIdentityProjection, P1, P2> {
    return T.mergeProjections(p1, p2) as T.SelectProjection<UserLoginIdentityProjection, P1, P2>
  }

  public constructor(params: UserLoginIdentityDAOParams<MetadataType, OperationMetadataType>) {
    super({
      ...params,
      schema: userLoginIdentitySchema(),
    })
  }
}

export class InMemoryUserLoginIdentityDAO<MetadataType, OperationMetadataType> extends T.AbstractInMemoryDAO<UserLoginIdentityDAOGenerics<MetadataType, OperationMetadataType>> {
  public static projection<P extends UserLoginIdentityProjection>(p: P) {
    return p
  }
  public static mergeProjection<P1 extends UserLoginIdentityProjection, P2 extends UserLoginIdentityProjection>(p1: P1, p2: P2): T.SelectProjection<UserLoginIdentityProjection, P1, P2> {
    return T.mergeProjections(p1, p2) as T.SelectProjection<UserLoginIdentityProjection, P1, P2>
  }

  public constructor(params: InMemoryUserLoginIdentityDAOParams<MetadataType, OperationMetadataType>) {
    super({
      ...params,
      schema: userLoginIdentitySchema(),
    })
  }
}

export type UserRoleExcludedFields = never
export type UserRoleRelationFields = 'user'

export function userRoleSchema(): T.Schema<types.Scalars> {
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

type UserRoleFilterFields = {
  id?: types.Scalars['ID'] | null | T.EqualityOperators<types.Scalars['ID']> | T.ElementOperators
  roleCode?: types.RoleCode | null | T.EqualityOperators<types.RoleCode> | T.ElementOperators | T.StringOperators
  userId?: types.Scalars['ID'] | null | T.EqualityOperators<types.Scalars['ID']> | T.ElementOperators
}
export type UserRoleFilter = UserRoleFilterFields & T.LogicalOperators<UserRoleFilterFields | UserRoleRawFilter>
export type UserRoleRawFilter = () => M.Filter<M.Document>

export type UserRoleRelations = Record<never, string>

export type UserRoleProjection = {
  id?: boolean
  roleCode?: boolean
  user?: UserProjection | boolean
  userId?: boolean
}
export type UserRoleParam<P extends UserRoleProjection> = T.ParamProjection<types.UserRole, UserRoleProjection, P>

export type UserRoleSortKeys = 'id' | 'roleCode' | 'userId'
export type UserRoleSort = Partial<Record<UserRoleSortKeys, T.SortDirection>>
export type UserRoleRawSort = () => M.Sort

export type UserRoleUpdate = {
  id?: types.Scalars['ID'] | null
  roleCode?: types.RoleCode | null
  userId?: types.Scalars['ID'] | null
}
export type UserRoleRawUpdate = () => M.UpdateFilter<M.Document>

export type UserRoleInsert = {
  roleCode: types.RoleCode
  userId: types.Scalars['ID']
}

type UserRoleDAOGenerics<MetadataType, OperationMetadataType> = T.MongoDBDAOGenerics<
  types.UserRole,
  'id',
  'ID',
  UserRoleFilter,
  UserRoleRawFilter,
  UserRoleRelations,
  UserRoleProjection,
  UserRoleSort,
  UserRoleRawSort,
  UserRoleInsert,
  UserRoleUpdate,
  UserRoleRawUpdate,
  UserRoleExcludedFields,
  UserRoleRelationFields,
  MetadataType,
  OperationMetadataType,
  types.Scalars,
  'userRole',
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

export class UserRoleDAO<MetadataType, OperationMetadataType> extends T.AbstractMongoDBDAO<UserRoleDAOGenerics<MetadataType, OperationMetadataType>> {
  public static projection<P extends UserRoleProjection>(p: P) {
    return p
  }
  public static mergeProjection<P1 extends UserRoleProjection, P2 extends UserRoleProjection>(p1: P1, p2: P2): T.SelectProjection<UserRoleProjection, P1, P2> {
    return T.mergeProjections(p1, p2) as T.SelectProjection<UserRoleProjection, P1, P2>
  }

  public constructor(params: UserRoleDAOParams<MetadataType, OperationMetadataType>) {
    super({
      ...params,
      schema: userRoleSchema(),
    })
  }
}

export class InMemoryUserRoleDAO<MetadataType, OperationMetadataType> extends T.AbstractInMemoryDAO<UserRoleDAOGenerics<MetadataType, OperationMetadataType>> {
  public static projection<P extends UserRoleProjection>(p: P) {
    return p
  }
  public static mergeProjection<P1 extends UserRoleProjection, P2 extends UserRoleProjection>(p1: P1, p2: P2): T.SelectProjection<UserRoleProjection, P1, P2> {
    return T.mergeProjections(p1, p2) as T.SelectProjection<UserRoleProjection, P1, P2>
  }

  public constructor(params: InMemoryUserRoleDAOParams<MetadataType, OperationMetadataType>) {
    super({
      ...params,
      schema: userRoleSchema(),
    })
  }
}

export type UserSocialExcludedFields = never
export type UserSocialRelationFields = 'user'

export function userSocialSchema(): T.Schema<types.Scalars> {
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

type UserSocialFilterFields = {
  id?: types.Scalars['ID'] | null | T.EqualityOperators<types.Scalars['ID']> | T.ElementOperators
  link?: types.Scalars['String'] | null | T.EqualityOperators<types.Scalars['String']> | T.ElementOperators | T.StringOperators
  platform?: types.Scalars['String'] | null | T.EqualityOperators<types.Scalars['String']> | T.ElementOperators | T.StringOperators
  userId?: types.Scalars['ID'] | null | T.EqualityOperators<types.Scalars['ID']> | T.ElementOperators
  username?: types.Scalars['String'] | null | T.EqualityOperators<types.Scalars['String']> | T.ElementOperators | T.StringOperators
}
export type UserSocialFilter = UserSocialFilterFields & T.LogicalOperators<UserSocialFilterFields | UserSocialRawFilter>
export type UserSocialRawFilter = () => M.Filter<M.Document>

export type UserSocialRelations = Record<never, string>

export type UserSocialProjection = {
  id?: boolean
  link?: boolean
  platform?: boolean
  user?: UserProjection | boolean
  userId?: boolean
  username?: boolean
}
export type UserSocialParam<P extends UserSocialProjection> = T.ParamProjection<types.UserSocial, UserSocialProjection, P>

export type UserSocialSortKeys = 'id' | 'link' | 'platform' | 'userId' | 'username'
export type UserSocialSort = Partial<Record<UserSocialSortKeys, T.SortDirection>>
export type UserSocialRawSort = () => M.Sort

export type UserSocialUpdate = {
  id?: types.Scalars['ID'] | null
  link?: types.Scalars['String'] | null
  platform?: types.Scalars['String'] | null
  userId?: types.Scalars['ID'] | null
  username?: types.Scalars['String'] | null
}
export type UserSocialRawUpdate = () => M.UpdateFilter<M.Document>

export type UserSocialInsert = {
  link: types.Scalars['String']
  platform: types.Scalars['String']
  userId: types.Scalars['ID']
  username: types.Scalars['String']
}

type UserSocialDAOGenerics<MetadataType, OperationMetadataType> = T.MongoDBDAOGenerics<
  types.UserSocial,
  'id',
  'ID',
  UserSocialFilter,
  UserSocialRawFilter,
  UserSocialRelations,
  UserSocialProjection,
  UserSocialSort,
  UserSocialRawSort,
  UserSocialInsert,
  UserSocialUpdate,
  UserSocialRawUpdate,
  UserSocialExcludedFields,
  UserSocialRelationFields,
  MetadataType,
  OperationMetadataType,
  types.Scalars,
  'userSocial',
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

export class UserSocialDAO<MetadataType, OperationMetadataType> extends T.AbstractMongoDBDAO<UserSocialDAOGenerics<MetadataType, OperationMetadataType>> {
  public static projection<P extends UserSocialProjection>(p: P) {
    return p
  }
  public static mergeProjection<P1 extends UserSocialProjection, P2 extends UserSocialProjection>(p1: P1, p2: P2): T.SelectProjection<UserSocialProjection, P1, P2> {
    return T.mergeProjections(p1, p2) as T.SelectProjection<UserSocialProjection, P1, P2>
  }

  public constructor(params: UserSocialDAOParams<MetadataType, OperationMetadataType>) {
    super({
      ...params,
      schema: userSocialSchema(),
    })
  }
}

export class InMemoryUserSocialDAO<MetadataType, OperationMetadataType> extends T.AbstractInMemoryDAO<UserSocialDAOGenerics<MetadataType, OperationMetadataType>> {
  public static projection<P extends UserSocialProjection>(p: P) {
    return p
  }
  public static mergeProjection<P1 extends UserSocialProjection, P2 extends UserSocialProjection>(p1: P1, p2: P2): T.SelectProjection<UserSocialProjection, P1, P2> {
    return T.mergeProjections(p1, p2) as T.SelectProjection<UserSocialProjection, P1, P2>
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
    projectMember?: Pick<Partial<ProjectMemberDAOParams<MetadataType, OperationMetadataType>>, 'middlewares' | 'metadata'>
    projectMemberRole?: Pick<Partial<ProjectMemberRoleDAOParams<MetadataType, OperationMetadataType>>, 'middlewares' | 'metadata'>
    someType?: Pick<Partial<SomeTypeDAOParams<MetadataType, OperationMetadataType>>, 'middlewares' | 'metadata'>
    user?: Pick<Partial<UserDAOParams<MetadataType, OperationMetadataType>>, 'middlewares' | 'metadata'>
    userLoginIdentity?: Pick<Partial<UserLoginIdentityDAOParams<MetadataType, OperationMetadataType>>, 'middlewares' | 'metadata'>
    userRole?: Pick<Partial<UserRoleDAOParams<MetadataType, OperationMetadataType>>, 'middlewares' | 'metadata'>
    userSocial?: Pick<Partial<UserSocialDAOParams<MetadataType, OperationMetadataType>>, 'middlewares' | 'metadata'>
  }
  mongodb: Record<'default', M.Db | 'mock'>
  scalars?: T.UserInputDriverDataTypeAdapterMap<types.Scalars, 'mongo'>
  log?: T.LogInput<'eBoard' | 'eBoardRole' | 'project' | 'projectMember' | 'projectMemberRole' | 'someType' | 'user' | 'userLoginIdentity' | 'userRole' | 'userSocial'>
  security?: T.EntityManagerSecurtyPolicy<DAOGenericsMap<MetadataType, OperationMetadataType>, OperationMetadataType, Permissions, SecurityDomain>
}

type EntityManagerMiddleware<MetadataType = never, OperationMetadataType = never> = T.DAOMiddleware<DAOGenericsUnion<MetadataType, OperationMetadataType>>

export class EntityManager<
  MetadataType = never,
  OperationMetadataType = never,
  Permissions extends string = never,
  SecurityDomain extends Record<string, unknown> = never,
> extends T.AbstractEntityManager<'default', never, types.Scalars, MetadataType> {
  private _eBoard: EBoardDAO<MetadataType, OperationMetadataType> | undefined
  private _eBoardRole: EBoardRoleDAO<MetadataType, OperationMetadataType> | undefined
  private _project: ProjectDAO<MetadataType, OperationMetadataType> | undefined
  private _projectMember: ProjectMemberDAO<MetadataType, OperationMetadataType> | undefined
  private _projectMemberRole: ProjectMemberRoleDAO<MetadataType, OperationMetadataType> | undefined
  private _someType: SomeTypeDAO<MetadataType, OperationMetadataType> | undefined
  private _user: UserDAO<MetadataType, OperationMetadataType> | undefined
  private _userLoginIdentity: UserLoginIdentityDAO<MetadataType, OperationMetadataType> | undefined
  private _userRole: UserRoleDAO<MetadataType, OperationMetadataType> | undefined
  private _userSocial: UserSocialDAO<MetadataType, OperationMetadataType> | undefined

  private params: EntityManagerParams<MetadataType, OperationMetadataType, Permissions, SecurityDomain>

  private overrides: EntityManagerParams<MetadataType, OperationMetadataType, Permissions, SecurityDomain>['overrides']
  private mongodb: Record<'default', M.Db | 'mock'>

  private middlewares: (EntityManagerMiddleware<MetadataType, OperationMetadataType> | GroupMiddleware<any, MetadataType, OperationMetadataType>)[]

  private logger?: T.LogFunction<'eBoard' | 'eBoardRole' | 'project' | 'projectMember' | 'projectMemberRole' | 'someType' | 'user' | 'userLoginIdentity' | 'userRole' | 'userSocial'>

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
              name: 'eBoard',
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
              name: 'eBoard',
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
              name: 'eBoardRole',
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
              name: 'eBoardRole',
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
              name: 'project',
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
              name: 'project',
              logger: this.logger,
            })
    }
    return this._project
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
              name: 'projectMember',
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
              name: 'projectMember',
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
              name: 'projectMemberRole',
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
              name: 'projectMemberRole',
              logger: this.logger,
            })
    }
    return this._projectMemberRole
  }
  get someType(): SomeTypeDAO<MetadataType, OperationMetadataType> {
    if (!this._someType) {
      const db = this.mongodb.default
      this._someType =
        db === 'mock'
          ? (new InMemorySomeTypeDAO({
              entityManager: this,
              datasource: null,
              metadata: this.metadata,
              ...this.overrides?.someType,
              middlewares: [
                ...(this.overrides?.someType?.middlewares || []),
                ...(selectMiddleware('someType', this.middlewares) as T.DAOMiddleware<SomeTypeDAOGenerics<MetadataType, OperationMetadataType>>[]),
              ],
              name: 'someType',
              logger: this.logger,
            }) as unknown as SomeTypeDAO<MetadataType, OperationMetadataType>)
          : new SomeTypeDAO({
              entityManager: this,
              datasource: 'default',
              metadata: this.metadata,
              ...this.overrides?.someType,
              collection: db.collection('someTypes'),
              middlewares: [
                ...(this.overrides?.someType?.middlewares || []),
                ...(selectMiddleware('someType', this.middlewares) as T.DAOMiddleware<SomeTypeDAOGenerics<MetadataType, OperationMetadataType>>[]),
              ],
              name: 'someType',
              logger: this.logger,
            })
    }
    return this._someType
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
              name: 'user',
              logger: this.logger,
            }) as unknown as UserDAO<MetadataType, OperationMetadataType>)
          : new UserDAO({
              entityManager: this,
              datasource: 'default',
              metadata: this.metadata,
              ...this.overrides?.user,
              collection: db.collection('users'),
              middlewares: [...(this.overrides?.user?.middlewares || []), ...(selectMiddleware('user', this.middlewares) as T.DAOMiddleware<UserDAOGenerics<MetadataType, OperationMetadataType>>[])],
              name: 'user',
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
              name: 'userLoginIdentity',
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
              name: 'userLoginIdentity',
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
              name: 'userRole',
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
              name: 'userRole',
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
              name: 'userSocial',
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
              name: 'userSocial',
              logger: this.logger,
            })
    }
    return this._userSocial
  }

  constructor(params: EntityManagerParams<MetadataType, OperationMetadataType, Permissions, SecurityDomain>) {
    super({
      ...params,
      scalars: params.scalars ? T.userInputDataTypeAdapterToDataTypeAdapter(params.scalars, ['Date', 'Json', 'ID', 'String', 'Boolean', 'Int', 'Float']) : undefined,
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
        projectMember: M.Collection<M.Document> | null
        projectMemberRole: M.Collection<M.Document> | null
        someType: M.Collection<M.Document> | null
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
        projectMember: this.mongodb.default === 'mock' ? null : this.mongodb.default.collection('projectMembers'),
        projectMemberRole: this.mongodb.default === 'mock' ? null : this.mongodb.default.collection('projectMemberRoles'),
        someType: this.mongodb.default === 'mock' ? null : this.mongodb.default.collection('someTypes'),
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
  projectMember: ProjectMemberDAOGenerics<MetadataType, OperationMetadataType>
  projectMemberRole: ProjectMemberRoleDAOGenerics<MetadataType, OperationMetadataType>
  someType: SomeTypeDAOGenerics<MetadataType, OperationMetadataType>
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
