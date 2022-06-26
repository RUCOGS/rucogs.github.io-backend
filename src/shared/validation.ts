import { Project, RoleCode } from '@src/generated/graphql-endpoint.types';
import { PartialDeep } from 'type-fest';
import { hasDuplicates, hasDuplicatesDeepEquals, HttpError } from './utils';

export function projectHasName(project: PartialDeep<Project>) {
  return project.name !== '';
}

export function projectHasMember(project: PartialDeep<Project>) {
  return project.members && project.members.length > 0;
}

export function projectHasOwner(project: PartialDeep<Project>) {
  if (!project.members) return false;

  for (const member of project.members)
    if (member?.roles?.some((x) => x?.roleCode === RoleCode.ProjectOwner)) {
      return true;
    }
  return false;
}

export function assertNoDuplicates<T>(arr: T[], equalityFn: (one: T, two: T) => boolean, message: string) {
  if (hasDuplicates(arr, equalityFn)) throw new HttpError(400, message);
}

export function assertNoDuplicatesDeep<T>(arr: T[], message: string) {
  if (hasDuplicatesDeepEquals(arr)) throw new HttpError(400, message);
}

export function assertProjectValid(project: PartialDeep<Project>) {
  assertProjectHasOwner(project);
  assertProjectHasMember(project);
  assertProjectHasName(project);
}

export function assertProjectHasOwner(project: PartialDeep<Project>) {
  if (!projectHasOwner(project)) {
    throw new HttpError(400, 'Project must have at least one owner!');
  }
}

export function assertProjectHasMember(project: PartialDeep<Project>) {
  if (!projectHasMember(project)) {
    throw new HttpError(400, 'Project must have at least one member!');
  }
}

export function assertProjectHasName(project: PartialDeep<Project>) {
  if (!projectHasName(project)) {
    throw new HttpError(400, 'Project must have a name!');
  }
}
