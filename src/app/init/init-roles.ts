import { RoleModel, ROLES, PROJECT_ROLES } from '@app/models';

export default async function(): Promise<void> {
  const count: number = await RoleModel.estimatedDocumentCount({});
  if (count === 0) {
    for (const role of ROLES) {
      await new RoleModel(role).save();
      // console.log(`Added ${role.name} to roles collection`);
    }

    for (const role of PROJECT_ROLES) {
      await new RoleModel(role).save();
      // console.log(`Added ${role.name} to roles collection`);
    }
  }
}
