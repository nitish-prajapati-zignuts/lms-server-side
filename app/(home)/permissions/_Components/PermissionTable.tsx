"use client"

import { useTransition } from "react";
import { toggleRolePermission } from "../_ServerActions/action";

interface Props {
    roles: any[];
    permissions: any[];
    rolePermissions: any[];
}

export default function PermissionTable({ roles, permissions, rolePermissions }: Props) {
    const [isPending, startTransition] = useTransition();

    const isChecked = (roleId: string, permId: string) => {
        return rolePermissions.some(rp => rp.roleId === roleId && rp.permissionId === permId);
    };

    const handleToggle = (roleId: string, permId: string, currentStatus: boolean) => {
        startTransition(async () => {
            await toggleRolePermission(roleId, permId, !currentStatus);
        });
    };

    return (
        <div className="rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden">
            <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-gray-600 font-medium border-b">
                    <tr>
                        <th className="py-3 px-6">Permission (Action : Subject)</th>
                        {roles.map(role => (
                            <th key={role.id} className="py-3 px-6 text-center uppercase tracking-wider">
                                {role.role}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y">
                    {permissions.map(perm => (
                        <tr key={perm.id} className="hover:bg-gray-50 transition-colors">
                            <td className="py-4 px-6">
                                <div className="flex flex-col">
                                    <span className="font-semibold text-gray-800 capitalize">{perm.action}</span>
                                    <span className="text-xs text-gray-400 uppercase">{perm.subject}</span>
                                </div>
                            </td>
                            {roles.map(role => {
                                const active = isChecked(role.id, perm.id);
                                return (
                                    <td key={role.id} className="py-4 px-6 text-center">
                                        <input
                                            type="checkbox"
                                            disabled={isPending}
                                            checked={active}
                                            onChange={() => handleToggle(role.id, perm.id, active)}
                                            className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer disabled:opacity-50"
                                        />
                                    </td>
                                );
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}