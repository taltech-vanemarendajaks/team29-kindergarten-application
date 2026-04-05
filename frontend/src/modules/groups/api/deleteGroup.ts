const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function deleteGroup(groupId: number, tenantId: number, token: string): Promise<void> {
    const response = await fetch(`${API_URL}/api/v1/groups/${groupId}?tenantId=${tenantId}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error("Failed to delete group");
    }
}
