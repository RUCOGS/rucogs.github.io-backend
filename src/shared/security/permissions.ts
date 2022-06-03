import { OperationSecurityDomain, PermissionCode } from "./types";

type PermissionData = {
  mergeExtraData?: (dataOne: any, dataTwo: any) => any
  isExtraDataValidForOpDomain?: (data: any, domain: OperationSecurityDomain) => boolean
}

// CONFIG: Permissions data (Extra data, etc.)
export const PermissionDataDict: {
  [key in PermissionCode]?: PermissionData
} = {

}