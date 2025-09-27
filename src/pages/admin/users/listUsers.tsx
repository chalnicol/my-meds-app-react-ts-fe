import { useCallback, useEffect, useState } from "react";
import Header from "../../../components/header";
import type {
	OptionMenuInfo,
	PaginatedResponse,
	UserInfo,
} from "../../../types";
import apiClient from "../../../utils/axiosConfig";
import Loader from "../../../components/loader";
import { useAuth } from "../../../context/AuthProvider";
import useDebounce from "../../../hooks/useDebounce";
import { useNavigate, useSearchParams } from "react-router-dom";
import OptionButton from "../../../components/meds/optionButton";

const ListUsers = () => {
	const { isAuthenticated, updateCurrentPage } = useAuth();
	const [searchParams, setSearchParams] = useSearchParams();
	const navigate = useNavigate();

	const [isLoading, setIsLoading] = useState(false);
	const [users, setUsers] = useState<UserInfo[]>([]);
	const [currentPage, setCurrentPage] = useState<number>(1);
	const [lastPage, setLastPage] = useState<number>(1);

	const searchTerm = searchParams.get("search") || "";
	const debouncedSearchTerm = useDebounce(searchTerm, 500); // 500ms delay

	const fetchUsers = async (page: number, term: string) => {
		setIsLoading(true);
		try {
			const response = await apiClient.get<PaginatedResponse<UserInfo>>(
				`/admin/users?page=${page}&search=${term}`
			);

			const { data, meta } = response.data;
			setUsers((prev) => {
				if (page === 1) {
					return data;
				}

				// Step 1: Filter out any new meds that are already in the previous list.
				const newUniques = data.filter((newEntry) => {
					return !prev.some((prevEntry) => prevEntry.id === newEntry.id);
				});

				// Step 2: Combine the old list with only the new, unique meds.
				return [...prev, ...newUniques];
			});

			setCurrentPage(meta.current_page);
			setLastPage(meta.last_page);
			// console.log(data);
		} catch (error) {
			console.error(error);
		} finally {
			setIsLoading(false);
		}
	};
	useEffect(() => {
		if (isAuthenticated) {
			fetchUsers(1, debouncedSearchTerm);
		}
	}, [isAuthenticated, debouncedSearchTerm]);

	useEffect(() => {
		updateCurrentPage("admin-users");
	}, []);

	const loadMoreUsers = () => {
		if (currentPage < lastPage) {
			fetchUsers(currentPage + 1, debouncedSearchTerm);
		}
	};

	const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const newSearchParams = new URLSearchParams(searchParams.toString());
		if (e.target.value) {
			newSearchParams.set("search", e.target.value);
		} else {
			newSearchParams.delete("search");
		}
		// Use replace: true to avoid creating new history entries for every keystroke
		setSearchParams(newSearchParams, { replace: true });
	};

	const handleOptionsClick = (id: number, optionClick: string) => {
		console.log(id, optionClick);
		switch (optionClick) {
			case "view":
				navigate(`/admin/users/${id}`);
				break;
			case "delete":
				//
				break;
			case "toggle":
				//
				break;
			default:
			//
		}
	};

	const getOptions = useCallback(
		(userID: number): OptionMenuInfo[] => {
			const isBlocked =
				users.find((user) => user.id == userID)?.isBlocked || false;

			return [
				{ id: 1, label: "View Details", value: "view" },
				{
					id: 2,
					label: isBlocked ? "Unblock" : "Block",
					value: "toggle",
				},
				{ id: 3, label: "Delete", value: "delete" },
			];
		},
		[users]
	);

	return (
		<>
			<title>{`Users - Admin | ${import.meta.env.VITE_APP_NAME}`}</title>
			<Header>
				<p className="text-xl font-bold">Users</p>
			</Header>
			<div className="p-3">
				<input
					type="search"
					value={searchTerm}
					onChange={handleSearchInputChange}
					className="flex-1 py-1 border-b border-gray-400 w-full focus:outline-none order-1 sm:order-2"
					placeholder="Filter search users..."
				/>
				<div className="mt-2">
					{users.length > 0 ? (
						users.map((user) => (
							<div
								key={user.id}
								className="border-t last:border-b border-gray-300 p-2 odd:bg-gray-100 flex items-start justify-between"
							>
								<div className="flex-1 grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-4 gap-y-3">
									{/* <div>
										<p className="text-xs text-gray-500 font-bold">
											ID
										</p>
										<p className="text-sm text-gray-600">
											{padNumber(user.id, 4)}
										</p>
									</div> */}
									<div>
										<p className="text-xs text-gray-500 font-bold">
											Full Name
										</p>
										<p className="text-sm text-gray-600">
											{user.fullname}
										</p>
									</div>
									<div>
										<p className="text-xs text-gray-500 font-bold">
											Email
										</p>
										<p className="text-sm text-gray-600">
											{user.email}
										</p>
									</div>

									<div>
										<p className="text-xs text-gray-500 font-bold">
											Account Status
										</p>
										<span
											className={`text-xs px-2 rounded-lg text-white font-semibold text-gray-600 ${
												user.isBlocked
													? "bg-red-500"
													: "bg-green-500"
											}`}
										>
											{user.isBlocked ? "BLOCKED" : "ACTIVE"}
										</span>
									</div>
									<div>
										<p className="text-xs text-gray-500 font-bold">
											Meds Count
										</p>
										<p className="text-lg text-gray-600 font-bold">
											{user.medications_count}
										</p>
									</div>
								</div>
								<div>
									<OptionButton
										medicationId={user.id}
										options={getOptions(user.id)}
										onMenuClick={handleOptionsClick}
									/>
								</div>
							</div>
						))
					) : (
						<p className="px-3 py-2 bg-gray-200 text-gray-500 rounded">
							{isLoading ? "Loading..." : "No user data found."}
						</p>
					)}
				</div>
				<div className="mt-3">
					{currentPage < lastPage ? (
						<button
							className="bg-gray-600 hover:bg-gray-500 text-white px-3 py-1 w-full rounded font-semibold cursor-pointer"
							onClick={loadMoreUsers}
						>
							LOAD MORE
						</button>
					) : (
						<p className="text-sm font-semibold text-center text-gray-400">
							- End of Users -
						</p>
					)}
				</div>
			</div>

			{isLoading && <Loader />}
		</>
	);
};

export default ListUsers;
