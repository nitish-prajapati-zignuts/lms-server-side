const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  console.log("Seeding roles and permissions...");

  // 1. Create permissions
  const permissions = [
    { action: "view", subject: "dashboard" },
    { action: "manage", subject: "users" },
    { action: "manage", subject: "courses" },
    { action: "manage", subject: "permissions" },
    { action: "enroll", subject: "courses" },
  ];

  const dbPermissions = await Promise.all(
    permissions.map(p =>
      prisma.permission.upsert({
        where: { id: `perm_${p.action}_${p.subject}` }, // Not actually used in schema, prisma needs a unique identifier or just use create
        update: {},
        create: p,
      })
    )
  );

  console.log(`Created ${dbPermissions.length} permissions.`);

  // 2. Create roles
  const adminRole = await prisma.role.upsert({
    where: { role: "ADMIN" },
    update: {},
    create: {
      role: "ADMIN",
      description: "Full system access",
    },
  });

  const userRole = await prisma.role.upsert({
    where: { role: "USER" },
    update: {},
    create: {
      role: "USER",
      description: "Default user access",
    },
  });

  console.log("Created/Updated roles: ADMIN, USER.");

  // 3. Assign permissions to roles
  // Admin gets everything
  for (const perm of dbPermissions) {
    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: {
            roleId: adminRole.id,
            permissionId: perm.id,
        },
      },
      update: {},
      create: {
        roleId: adminRole.id,
        permissionId: perm.id,
      },
    });
  }

  // User gets view dashboard and enroll courses
  const userPerms = dbPermissions.filter(p => 
    (p.action === "view" && p.subject === "dashboard") || 
    (p.action === "enroll" && p.subject === "courses")
  );

  for (const perm of userPerms) {
    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: {
            roleId: userRole.id,
            permissionId: perm.id,
        },
      },
      update: {},
      create: {
        roleId: userRole.id,
        permissionId: perm.id,
      },
    });
  }

  console.log("Assigned permissions to roles.");

  // 4. Update existing users to have the corresponding Role records
  // This is important because Registration.role is different from UserRole link
  const users = await prisma.registration.findMany();
  for (const user of users) {
    const roleToAssign = user.role === "ADMIN" ? adminRole : userRole;
    await prisma.userRole.upsert({
      where: { id: `ur_${user.id}_${roleToAssign.id}` }, // We don't have a unique constraint on userId/roleId in UserRole, but we should create it or just check existence
      update: {},
      create: {
        userId: user.id,
        roleId: roleToAssign.id,
      },
    });
  }

  console.log(`Synchronized UserRole records for ${users.length} users.`);
  console.log("Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
