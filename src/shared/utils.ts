import { Project, RoleCode } from '@src/generated/graphql-endpoint.types';
import { PartialDeep } from 'type-fest';
import equal from 'deep-equal';

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

export class OneToManyTwoWayMap<TOne extends string | number | symbol, TMany extends string | number | symbol> {
  map: Record<TOne, TMany[]>;
  manyToOne: Record<TMany, TOne>;
  
  constructor(map: Record<TOne, TMany[]>) {
    this.map = map;
    this.manyToOne = {} as Record<TMany, TOne>;
    for(const oneKey in map) {
      const manyValues = map[oneKey];
      for (const manyKey of manyValues) {
        this.manyToOne[manyKey] = oneKey;
      }   
    }
  }

  getMany(key: TOne) { 
    return this.map[key]; 
  }

  getOne(key: TMany) {
    return this.manyToOne[key];
  }

  set(key: TOne, value: TMany) {
    if (!this.map[key]) {
      this.map[key] = [];
    }
    
    if (!this.map[key].includes(value))
      this.map[key].push(value);
    
    this.manyToOne[value] = key;
  }

  unsetMany(key: TOne) {
    const values = this.map[key];
    delete this.map[key];
    for (const value of values)
      delete this.manyToOne[value];
  }

  unsetOne(key: TMany) {
    const one = this.manyToOne[key];
    delete this.manyToOne[key];
    const index = this.map[one].indexOf(key);
    if (index >= 0) {
      this.map[one].splice(index, 1);
    }
    if (this.map[one].length == 0)
      delete this.map[one];
  }

  hasOneKey(key: TOne) {
    return key in this.map;
  }
  
  hasManyKey(key: TMany) {
    return key in this.manyToOne;
  }
}

export function hasDuplicates<T>(arr: T[], equalityFn: (one: T, two: T) => boolean) {
  for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      if (equalityFn(arr[i], arr[j])) {
        return true;
      }
    }
  }
  return false;
}

export function hasDuplicatesDeepEquals<T>(arr: T[]) {
  return hasDuplicates(arr, isDeepEquals);
}

export function assertNoDuplicates<T>(arr: T[], equalityFn: (one: T, two: T) => boolean, message: string) {
  if (hasDuplicates(arr, equalityFn))
    throw new Error(message);
}

export function assertNoDuplicatesDeep<T>(arr: T[], message: string) {
  if (hasDuplicatesDeepEquals(arr))
    throw new Error(message);
}

export function assertProjectValid(project: PartialDeep<Project>) {
  // Project has at least one owner
  if (!projectHasOwner(project)) {
    throw new Error("Project must have at least one owner!");
  }
  if (!projectHasMember(project)) {
    throw new Error("Project must have at least one member!");
  }
  if (!projectHasName(project)) {
    throw new Error("Project must have a name!");
  }
}

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

export function isDeepEquals(o1: any, o2: any) {
	return equal(o1, o2);
}

export function projectHasName(project: PartialDeep<Project>) {
  return project.name !== "";
}

export function projectHasMember(project: PartialDeep<Project>) {
  return project.members && project.members.length > 0;
}

export function projectHasOwner(project: PartialDeep<Project>) {
  if (!project.members)
    return false;
  
  for (const member of project.members)
    if (member?.roles?.some(x => x?.roleCode === RoleCode.ProjectOwner)) {
      return true;
    }
  return false;
}