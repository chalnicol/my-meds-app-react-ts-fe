export interface StockInfo {
	id: number;
	quantity: number;
	price: number;
	source: string;
	createdAt?: string;
	updatedAt?: string;
}
export interface TimeScheduleInfo {
	id: string;
	medication_id?: number;
	schedule_time: string;
	quantity: number | null;
	created_at?: string;
	updated_at?: string;
}

export interface MedsInfo {
	id: number;
	brand_name: string;
	generic_name: string;
	dosage: string;
	drug_form: DrugFormType;
	status: StatusType;
	frequency_type: FrequencyType;
	frequency: number[] | null;
	remaining_stock: number;
	total_quantity: number;
	total_value: number;
	time_schedules: TimeScheduleInfo[];
	created_at?: string;
	updated_at?: string;
}

export interface MedsIntakeInfo {
	id: number;
	time_schedule_id: number;
	user_id: number;
	quantity: number;
	taken_at?: string;
	created_at?: string;
	updated_at?: string;
}

export interface RoleInfo {
	id: number;
	name: string;
	guard: string;
	createdAt?: string;
	updatedAt?: string;
}

export interface UserInfo {
	id: number;
	fullname: string;
	email: string;
	roles: string[]; // Array of role names
	permissions: string[];
	is_blocked: boolean;
	timezone: string;
	social_user: boolean;
	firebase_uid: boolean;
	medications_count?: number;
	stocks_count?: number;
	medications: MedsInfo[];
	stocks: StockInfo[];
	created_at?: string;
	updated_at?: string;
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

export interface BreadCrumbsInfo {
	id: number;
	label: string;
	path: string | null;
}

export type TimeOfDayType = "Morning" | "Afternoon" | "Evening" | "Night";
export type StatusType = "Active" | "Inactive";
export type FrequencyType = "Everyday" | "SpecificDays";

export const strengthUnits = [
	"mg",
	"mcg",
	"IU",
	"g",
	"ml",
	"unit",
	"mEq",
] as const;

// Create a type that is a union of all these string literals
export type StrengthUnit = (typeof strengthUnits)[number];

export const drugForms = [
	"Tablet",
	"Capsule",
	"Liquid",
	"Drops",
	"Injection",
	"Cream",
	"Syrup",
	"Ointment",
	"Suppository",
	"Other",
] as const;

export type DrugFormType = (typeof drugForms)[number];

export interface ScheduleInfo {
	schedule_id: number;
	schedule_time: string;
	dosage_quantity: number;
	brand_name: string;
	generic_name: string;
	remaining_stock: number;
	is_taken: boolean;
	taken_at: string;
}
