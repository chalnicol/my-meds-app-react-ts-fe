import type {
	FrequencyType,
	MedsInfo,
	MedsIntakeInfo,
	PaginatedResponse,
	ScheduleInfo,
	StatusType,
	StockInfo,
	TimeScheduleInfo,
} from "../types";
import apiClient from "../utils/axiosConfig";

export const getMedicationById = async (
	medId: number
): Promise<{ message: string; medication: MedsInfo }> => {
	try {
		const response = await apiClient.get(`/medications/${medId}`);
		return response.data;
	} catch (error) {
		console.error("Error fetching medication by ID:", error);
		throw error;
	}
};

export const getMedications = async (
	page: number,
	search: string
): Promise<PaginatedResponse<MedsInfo>> => {
	try {
		const response = await apiClient.get(
			`/medications?page=${page}&search=${search}`
		);
		return response.data;
	} catch (error) {
		console.error("Error fetching medications:", error);
		// return [];
		throw error;
	}
};

export const addMedication = async (
	brandName: string,
	genericName: string,
	dosage: string,
	drugForm: string,
	status: StatusType,
	frequencyType: FrequencyType,
	frequency: number[] | null,
	timeSchedules: TimeScheduleInfo[],
	remainingStock: number
): Promise<{ message: string; medication: MedsInfo }> => {
	try {
		const response = await apiClient.post("/medications", {
			brandName,
			genericName,
			dosage,
			drugForm,
			status,
			frequencyType,
			frequency,
			timeSchedules,
			remainingStock,
		});
		return response.data;
	} catch (error) {
		console.error("Error adding medication:", error);
		// return null;
		throw error;
	}
};

export const updateMedication = async (
	medicationId: number,
	brandName: string,
	genericName: string,
	dosage: string,
	drugForm: string,
	status: StatusType,
	frequencyType: FrequencyType,
	frequency: number[] | null,
	timeSchedules: TimeScheduleInfo[]
): Promise<{ message: string; medication: MedsInfo }> => {
	try {
		const response = await apiClient.put(`/medications/${medicationId}`, {
			brandName,
			genericName,
			dosage,
			drugForm,
			status,
			frequencyType,
			frequency,
			timeSchedules,
		});
		return response.data;
	} catch (error) {
		console.error("Error updating medication:", error);
		// return null;
		throw error;
	}
};

export const updateMedicationStatus = async (
	medicationId: number
): Promise<{ message: string; medication: MedsInfo }> => {
	try {
		const response = await apiClient.patch(
			`/medications/${medicationId}/toggleStatus`
		);
		return response.data;
	} catch (error) {
		console.error("Error updating medication status:", error);
		// return null;
		throw error;
	}
};

export const deleteMedication = async (
	medId: number
): Promise<{ message: string }> => {
	try {
		const response = await apiClient.delete(`/medications/${medId}`);
		return response.data;
	} catch (error) {
		console.error("Error deleting medication:", error);
		// return null;
		throw error;
	}
};

export const addStock = async (
	medicationId: number,
	quantity: number,
	price: number,
	source: string
): Promise<{ message: string; stock: StockInfo }> => {
	try {
		const response = await apiClient.post(
			`/medications/${medicationId}/stocks`,
			{ quantity, price, source }
		);
		return {
			message: response.data.message,
			stock: response.data.stock,
		};
	} catch (error) {
		console.error("Error adding stock:", error);
		throw error;
	}
};

export const updateStock = async (
	medicationId: number,
	stockId: number,
	quantity: number,
	price: number,
	source: string
): Promise<{ message: string; stock: StockInfo }> => {
	try {
		const response = await apiClient.put(
			`/medications/${medicationId}/stocks/${stockId}`,
			{ quantity, price, source }
		);
		return response.data;
	} catch (error: any) {
		console.error("Error editing stock:", error);
		throw error;
	}
};

export const getStocks = async (
	medicationId: number,
	page: number,
	search: string
): Promise<PaginatedResponse<StockInfo>> => {
	try {
		const response = await apiClient.get(
			`/medications/${medicationId}/stocks?page=${page}&search=${search}`
		);
		return response.data;
	} catch (error) {
		console.error("Error getting stocks:", error);
		throw error;
	}
};

// export const getTodaysMedications = async (): Promise<{
// 	message: string;
// 	schedules: ScheduleInfo[];
// }> => {
// 	try {
// 		const response = await apiClient.get("/medications/today");
// 		return response.data;
// 	} catch (error) {
// 		console.error("Error fetching today's medications:", error);
// 		throw error;
// 	}
// };

// export const takeMedication = async (
// 	time_schedule_id: number
// ): Promise<{ message: string }> => {
// 	try {
// 		const response = await apiClient.post("/medications/take", {
// 			time_schedule_id,
// 		});
// 		return response.data;
// 	} catch (error) {
// 		throw error;
// 	}
// };

export const getTodaysMedications = async (): Promise<{
	message: string;
	medications: MedsInfo[];
	intake_records: MedsIntakeInfo[];
}> => {
	try {
		const response = await apiClient.get("/medications/today");
		return response.data;
	} catch (error) {
		console.error("Error fetching today's medications:", error);
		throw error;
	}
};

export const takeMedication = async (
	timeScheduleId: number
): Promise<{ message: string }> => {
	try {
		const response = await apiClient.post("/medications/take", {
			timeScheduleId,
		});
		return response.data;
	} catch (error) {
		throw error;
	}
};
