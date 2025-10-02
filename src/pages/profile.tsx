// import StatusMessage from "../components/statusMessage";

import { useEffect, useRef, useState } from "react";
import Loader from "../components/loader";
import Title from "../components/title";
import { useAuth } from "../context/AuthProvider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import UpdateProfile from "../components/profile/updateProfile";
import ChangePassword from "../components/profile/changePassword";
import gsap from "gsap";
import { useOutsideClick } from "../hooks/useOutsideClick";
import DeleteAccount from "../components/profile/deleteAccount";
import AccountSettings from "../components/profile/accountSettings";

const Profile = () => {
	const { isLoading, user, updateCurrentPage } = useAuth();
	const [currentTab, setCurrentTab] = useState<string>("profile");
	const [showDropdown, setShowDropdown] = useState<boolean>(false);

	const dropdownMenuRef = useRef<HTMLDivElement>(null);

	const dropdownRef = useOutsideClick<HTMLDivElement>(() => {
		setShowDropdown(false);
	});

	useEffect(() => {
		updateCurrentPage("profile");
	}, []);

	useEffect(() => {
		if (dropdownMenuRef.current) {
			gsap.fromTo(
				dropdownMenuRef.current,
				{ scale: 0 },
				{
					scale: 1,
					duration: 0.6,
					transformOrigin: "top left",
					ease: "elastic.out(1, 0.5)",
				}
			);
		}
		return () => {
			if (dropdownMenuRef.current) {
				gsap.killTweensOf(dropdownMenuRef.current);
			}
		};
	}, [showDropdown, dropdownMenuRef.current]);

	const handleDropdownTabClick = (tabType: string) => {
		setCurrentTab(tabType);
		setShowDropdown(false);
	};

	const tabs = [
		{ id: 1, label: "Profile Details", type: "profile" },
		{ id: 3, label: "Change Password", type: "password" },
		{ id: 2, label: "Account Settings", type: "settings" },
		{ id: 4, label: "Delete Account", type: "delete" },
	];

	return (
		<>
			<title>{`Profile Page | ${import.meta.env.VITE_APP_NAME}`}</title>
			<Title label="Profile Page" />
			<div className="p-3">
				{user && (
					<div className="flex flex-col sm:flex-row gap-y-3 gap-x-5 rounded h-120 md:h-110">
						<div
							ref={dropdownRef}
							className="block sm:hidden flex-none relative max-w-xl border-b border-gray-300 pb-2"
						>
							<div className="flex items-center gap-x-1 font-semibold">
								<button
									className="px-0.5 hover:bg-gray-200 aspect-square bg-gray-100 flex-none rounded-full cursor-pointer"
									onClick={() => setShowDropdown((prev) => !prev)}
								>
									<FontAwesomeIcon icon="ellipsis-vertical" />
								</button>
								<p>
									{tabs.find((tab) => tab.type == currentTab)?.label ||
										"TAB"}
								</p>
							</div>
							{showDropdown && (
								<div
									ref={dropdownMenuRef}
									className="absolute z-10 top-7 flex flex-col w-38 border border-gray-400 rounded overflow-hidden shadow"
								>
									{tabs.map((tab) => (
										<button
											key={tab.id}
											className={`text-left border-b border-gray-100 last:border-0 text-sm px-2 py-1.5 ${
												tab.type == currentTab
													? "bg-gray-200 font-semibold"
													: "bg-white hover:bg-gray-200 cursor-pointer"
											}`}
											onClick={() =>
												handleDropdownTabClick(tab.type)
											}
										>
											{tab.label}
										</button>
									))}
								</div>
							)}
						</div>

						<div className="hidden sm:block flex-none w-42 space-y-1.5">
							{tabs.map((tab) => (
								<button
									key={tab.id}
									className={`w-full text-left border font-semibold shadow rounded px-2 py-1.5 ${
										tab.type == currentTab
											? "bg-gray-200 border-gray-400"
											: "hover:bg-gray-100 border-gray-300 cursor-pointer"
									}`}
									onClick={() => setCurrentTab(tab.type)}
								>
									{tab.label}
								</button>
							))}
						</div>

						<div className="flex-1 w-full h-full rounded">
							<div className="max-w-xl">
								{currentTab === "profile" && <UpdateProfile />}
								{currentTab === "settings" && <AccountSettings />}
								{currentTab === "password" && <ChangePassword />}
								{currentTab === "delete" && <DeleteAccount />}
							</div>
						</div>
					</div>
				)}
			</div>
			{isLoading && <Loader />}
		</>
	);
};

export default Profile;
