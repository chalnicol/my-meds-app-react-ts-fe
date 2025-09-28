import apiClient from "../utils/axiosConfig";

export const toggleBlockUser = async (
	userId: number
): Promise<{
	message: string;
}> => {
	try {
		const response = await apiClient.patch(
			`/admin/users/${userId}/toggleBlock`
		);
		return response.data;
	} catch (error) {
		console.error(error);
		throw error;
	}
};

export const updateUserRoles = async (
	userId: number,
	role: string
): Promise<{
	message: string;
}> => {
	try {
		const response = await apiClient.patch(
			`/admin/users/${userId}/updateRoles`,
			{ role }
		);
		return response.data;
	} catch (error) {
		console.log(error);
		throw error;
	}
};
