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

export function assertEmailValid(email: string) {
  if (!isEmailValid(email)) throw new HttpError(400, 'Expected a valid email!');
}

const netIdRegex = /^[a-z]*[0-9]+$/;
export function isNetId(netId: string) {
  if (!netId) return false;
  return netIdRegex.test(netId);
}

export function assertNetId(netId: string) {
  if (!isNetId(netId)) throw new HttpError(400, 'Expected a valid NetID!');
}

export function assertRutgersEmailValid(email: string) {
  if (!isRutgersEmail(email)) throw new HttpError(400, 'Expected a valid rutgers scaletmail email!');
}

export function isRutgersEmail(email: string) {
  return isEmailValid(email) && email.endsWith('rutgers.edu');
}

const emailRegex =
  /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;
export function isEmailValid(email: string) {
  if (!email) return false;

  if (email.length > 254) return false;

  var valid = emailRegex.test(email);
  if (!valid) return false;

  // Further checking of some things regex can't handle
  var parts = email.split('@');
  if (parts[0].length > 64) return false;

  var domainParts = parts[1].split('.');
  if (
    domainParts.some(function (part) {
      return part.length > 63;
    })
  )
    return false;

  return true;
}
