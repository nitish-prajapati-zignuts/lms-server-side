import prisma from "@/_dbConfig/dbConfig";
import PermissionTable from "./_Components/PermissionTable";


export default async function PermissionsPage() {
    // Fetch everything in parallel
    const [roles, permissions, rolePermissions] = await Promise.all([
        prisma.role.findMany(),
        prisma.permission.findMany(),
        prisma.rolePermission.findMany()
    ]);

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <header className="mb-8 flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Permissions Manager</h1>
                    <p className="text-gray-500">Define access control for dynamic user roles</p>
                </div>

                <button className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition">
                    + Add New Role
                </button>
            </header>

            <PermissionTable
                roles={roles}
                permissions={permissions}
                rolePermissions={rolePermissions}
            />
        </div>
    );
}