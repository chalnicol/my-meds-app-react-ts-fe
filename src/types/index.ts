export interface StockInfo {
	id: number;
	quantity: number;
	price: number;
	source: string;
	createdAt?: string;
	updatedAt?: string;
}
export interface DailyScheduleInfo {
	id: string;
	time: string;
}

export interface MedsInfo {
	id: number;
	brandName: string;
	genericName: string;
	dosage: string;
	status: StatusType;
	frequencyType: FrequencyType;
	frequency: number[] | null;
	dailySchedule: DailyScheduleInfo[];
	remainingStock: number;
	totalQuantity?: number;
	totalValue?: number;
	createdAt?: string;
	updatedAt?: string;
}

export interface MedsIntakeInfo {
	id: number;
	medication_id: number;
	user_id: number;
	scheduled_time: string;
	taken_at?: string;
	created_at?: string;
	updated_at?: string;
}

export interface RoleInfo {
	id: number;
	name: string;
}

export interface UserInfo {
	id: number;
	fullname: string;
	email: string;
	roles: string[]; // Array of role names
	permissions: string[];
	isBlocked: boolean;
	timezone: string;
	social_user: boolean;
	medications_count?: number;
	stocks_count?: number;
	medications: MedsInfo[];
	stocks: StockInfo[];
	createdAt?: string;
	updatedAt?: string;
}

export interface PageLink {
	url: string | null;
	label: string;
	active: boolean;
}

export interface MetaInfo {
	current_page: number;
	from: number;
	last_page: number;
	to: number;
	total: number;
	per_page: number;
	path: string;
	links: PageLink[];
}

export interface PaginatedResponse<T> {
	data: T[];
	meta: MetaInfo;
	link: {
		first: string;
		last: string;
		prev: string | null;
		next: string | null;
	};
}

export interface OptionMenuInfo {
	id: number;
	label: string;
	value: string;
}

export interface NavLinkInfo {
	id: number;
	name: string;
	label: string;
	path: string;
	role?: string;
}

export interface NavLinks {
	public: NavLinkInfo[];
	unauth: NavLinkInfo[];
	auth: NavLinkInfo[];
}

export type TimeOfDayType = "Morning" | "Afternoon" | "Evening" | "Night";
export type StatusType = "Active" | "Inactive";
export type FrequencyType = "Everyday" | "SpecificDays";
