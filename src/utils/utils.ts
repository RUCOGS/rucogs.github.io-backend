import { AnyEntityManager } from "@src/controllers/entity-manager.controller";
import { SecurityDomain } from "@src/shared/security.types";
import { ProjectMemberRoleCodeRanking, UserRoleCodeRanking } from "@src/controllers/auth.controller";
import { RoleCode } from "@src/generated/model.types";
import { EntityManager } from "@src/generated/typetta";
import { AbstractDAO, DAOGenerics } from "@twinlogix/typetta";

interface FindOrCreateParams {
  filter: any;
  changes: any;
  record?: any;
}

export type Nullable<T> = { [K in keyof T]: T[K] | null };

// Compares the properties of one object against the
// properties of another object.
export function isShallowEquals(o1: any, o2: any){
    for(var p in o1){
        if(o1.hasOwnProperty(p)){
            if(o1[p] !== o2[p]){
                return false;
            }
        }
    }
    for(var p in o2){
        if(o2.hasOwnProperty(p)){
            if(o1[p] !== o2[p]){
                return false;
            }
        }
    }
    return true;
};

export class TwoWayMap<K extends string | number | symbol, V extends string | number | symbol> {
  map: Record<K, V>;
  reverseMap: Record<V, K>;
  length: number;

  constructor(map: Record<K, V>) {
    this.map = map;
    this.reverseMap = {} as Record<V, K>;
    for(const key in map) {
      const value = map[key];
      this.reverseMap[value] = key;   
    }
    this.length = Object.keys(this.map).length;
  }

  get(key: K) { 
    return this.map[key]; 
  }

  revGet(key: V) { 
    return this.reverseMap[key]; 
  }

  set(key: K, value: V) {
    this.map[key] = value;
    this.reverseMap[value] = key;
    this.length = Object.keys(this.map).length;
  }

  unset(key: K) {
    const value = this.map[key];
    delete this.map[key];
    delete this.reverseMap[value];
    this.length = Object.keys(this.map).length;
  }

  revUnset(key: V) {
    const value = this.reverseMap[key];
    delete this.reverseMap[key];
    delete this.map[value];
    this.length = Object.keys(this.map).length;
  }

  has(key: K) {
    return key in this.map;
  }

  revHas(key: V) {
    return key in this.reverseMap;
  }
}

export namespace Extensions {
  async function modifyOrCreate<T extends DAOGenerics>(dao: AbstractDAO<T>, params: FindOrCreateParams) {
    try {
      await dao.updateOne({ filter: params.filter, changes: params.changes});
    } catch(e) {
      await dao.insertOne({ record: params.record ?? params.changes });
    }
  }

  async function findAndModifyOrCreate<T extends DAOGenerics>(dao: AbstractDAO<T>, params: FindOrCreateParams) {
    await modifyOrCreate(dao, params);
    return dao.findOne({ filter: params.filter });
  }
}

export namespace EntityManagerExtensions {
  export async function getOwnedProjectIds(entityManager: AnyEntityManager, userId: string) {
    const members = await entityManager.projectMember.findAll({
      filter: {
        userId: { eq: userId },
      }
    });
    const ownershipRoles = await entityManager.projectMemberRole.findAll({
      filter: {
        projectMemberId: { in: members.map(m => m.id) },
        roleCode: { eq: RoleCode.ProjectOwner }
      }
    });
    const ownedProjectIds = members.filter(member => ownershipRoles.some(role => role.projectMemberId == member.id)).map(member => member.projectId);
    return ownedProjectIds;
  }

  export async function getUserMaxRoleCode(entityManager: AnyEntityManager, userId: string) {
    const roles = await entityManager.userRole.findAll({
      filter: {
        userId: userId
      },
      projection: {
        roleCode: true
      }
    });
    const maxRoleCode = roles.reduce((prev, curr) => UserRoleCodeRanking.get(curr.roleCode) > UserRoleCodeRanking.get(prev.roleCode) ? curr : prev).roleCode;
    return maxRoleCode;
  }

  export async function getProjectMemberMaxRoleCode(entityManager: AnyEntityManager, projectMemberId: string) {
    const roles = await entityManager.projectMemberRole.findAll({
      filter: {
        projectMemberId: projectMemberId
      },
      projection: {
        roleCode: true
      }
    });
    const maxRoleCode = roles.reduce((prev, curr) => ProjectMemberRoleCodeRanking.get(curr.roleCode) > ProjectMemberRoleCodeRanking.get(prev.roleCode) ? curr : prev).roleCode;
    return maxRoleCode;
  }

  export async function getUserRoleDomains(entityManager: AnyEntityManager, userId: string): Promise<SecurityDomain[]> {
    const maxRoleCode = await getUserMaxRoleCode(entityManager, userId);
    
    // Add all roles with lower precedence
    let domains = [];
    for (let i = 0; i < UserRoleCodeRanking.length; i++) {
      if (UserRoleCodeRanking.revHas(i)) {
        const roleCode = UserRoleCodeRanking.revGet(i);
        domains.push({
          userId,
          roleCode,
        })
        if (roleCode === maxRoleCode) {
          break;
        }
      }
    }

    return domains;
  }

  export async function getProjectMemberRoleDomains(entityManager: AnyEntityManager, projectMemberId: string): Promise<SecurityDomain[]> {
    const maxRoleCode = await getProjectMemberMaxRoleCode(entityManager, projectMemberId);
    
    // Add all roles with lower precedence
    let domains = [];
    for (let i = 0; i < ProjectMemberRoleCodeRanking.length; i++) {
      if (ProjectMemberRoleCodeRanking.revHas(i)) {
        const roleCode = ProjectMemberRoleCodeRanking.revGet(i);
        domains.push({
          projectMemberId,
          roleCode,
        })
        if (roleCode === maxRoleCode) {
          break;
        }
      }
    }

    return domains;
  }
}
