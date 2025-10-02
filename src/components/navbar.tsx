import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useRef, useState } from "react";
import { useOutsideClick } from "../hooks/useOutsideClick";
import gsap from "gsap";
import type { NavLinks } from "../types";

const Navbar = () => {
	const navigate = useNavigate();

	const { user, hasRole, logout, currentPage } = useAuth();

	const [showMenu, setShowMenu] = useState<boolean>(false);
	const [showProfileDropdownMenu, setShowProfileDropdownMenu] =
		useState<boolean>(false);
	const [showProfileMenu, setShowProfileMenu] = useState<boolean>(false);

	const profileRef = useRef<HTMLDivElement>(null);

	const mainRefs = useRef<
		(HTMLAnchorElement | HTMLButtonElement | HTMLParagraphElement | null)[]
	>([]);

	const dropdownRefs = useRef<
		(HTMLAnchorElement | HTMLButtonElement | HTMLParagraphElement | null)[]
	>([]);

	// Correct way to set a ref for each element in a dynamic list
	const setMainRef = (
		el: HTMLAnchorElement | HTMLButtonElement | HTMLParagraphElement | null,
		index: number
	) => {
		mainRefs.current[index] = el;
	};

	const setRef = (
		el: HTMLAnchorElement | HTMLButtonElement | HTMLParagraphElement | null,
		index: number
	) => {
		dropdownRefs.current[index] = el;
	};

	const dropdownRef = useOutsideClick<HTMLLIElement>(() => {
		setShowProfileMenu(false);
	});

	const handleLogout = async () => {
		setShowProfileMenu(false);
		await logout();
		navigate("/login");
	};

	const handleProfileMenuClick = () => {
		setShowProfileDropdownMenu(false);
		setShowMenu(false);
	};

	const handleProfileMenuToggle = () => {
		// setShowProfileDropdownMenu((prev) => !prev);
		if (!showProfileDropdownMenu) {
			setShowProfileDropdownMenu(true);
		} else {
			closeAnim("profile", dropdownRefs.current);
		}
	};

	const handleCloseMenu = () => {
		// setShowMenu(false);
		// setShowProfileDropdownMenu(false);
		closeAnimTimeline();
	};

	const closeAnim = (
		type: "menu" | "profile",
		arr: (
			| HTMLAnchorElement
			| HTMLButtonElement
			| HTMLParagraphElement
			| null
		)[]
	) => {
		const tl = gsap.timeline({
			onComplete: () => {
				if (type == "menu") {
					setShowMenu(false);
				} else if (type == "profile") {
					setShowProfileDropdownMenu(false);
				}
			},
		});
		tl.to(arr, {
			scale: 0,
			duration: 0.6,
			ease: "elastic.in(1, 0.8)",
			stagger: {
				from: "end",
				each: 0.1,
			},
		});
		return tl;
	};

	const closeAnimTimeline = () => {
		const masterTimeline = gsap.timeline();

		if (showProfileDropdownMenu) {
			const dropdownAnim = closeAnim("profile", dropdownRefs.current);
			masterTimeline.add(dropdownAnim);
		}
		const mainAnim = closeAnim("menu", mainRefs.current);
		masterTimeline.add(mainAnim, "-=0.5");
	};

	useEffect(() => {
		if (showProfileDropdownMenu && dropdownRefs.current.length > 0) {
			gsap.fromTo(
				dropdownRefs.current,
				{ scale: 0, yPercent: 100 },
				{
					scale: 1,
					yPercent: 0,
					duration: 0.6,
					ease: "elastic.out(1, 0.8)",
					stagger: 0.1,
				}
			);
		}
		return () => {
			if (dropdownRefs.current.length > 0) {
				gsap.killTweensOf(dropdownRef.current);
			}
		};
	}, [showProfileDropdownMenu, dropdownRefs.current]);

	useEffect(() => {
		if (showMenu && mainRefs.current.length > 0) {
			gsap.fromTo(
				mainRefs.current,
				{ scale: 0, yPercent: 100 },
				{
					scale: 1,
					yPercent: 0,
					duration: 0.6,
					ease: "elastic.out(1, 0.8)",
					stagger: 0.1,
				}
			);
		}
		return () => {
			if (mainRefs.current.length > 0) {
				gsap.killTweensOf(mainRefs.current);
			}
		};
	}, [showMenu, mainRefs.current]);

	useEffect(() => {
		if (showProfileMenu && profileRef.current) {
			gsap.fromTo(
				profileRef.current,
				{ height: 0 },
				{
					height: "auto",
					duration: 0.8,
					ease: "elastic.out(1, 0.6)",
					transformOrigin: "top center",
				}
			);
		}
		return () => {
			if (profileRef.current) {
				gsap.killTweensOf(profileRef.current);
			}
		};
	}, [showProfileMenu]);

	const navLinks: NavLinks = {
		public: [
			{ id: 1, name: "home", label: "Home", path: "/" },
			{ id: 2, name: "about", label: "About", path: "/about" },
		],
		unauth: [
			{ id: 3, name: "register", label: "REGISTER", path: "/register" },
			{ id: 4, name: "login", label: "LOGIN", path: "/login" },
		],
		auth: [
			{
				id: 5,
				name: "profile",
				label: "My Profile",
				path: "/profile",
			},
			{
				id: 6,
				name: "medications",
				label: "My Medications",
				path: "/medications",
			},
		],
	};

	return (
		<nav className="w-full bg-gray-800 text-white flex items-center gap-x-4 px-4 py-3 sticky	top-0 z-10">
			<h1 className="text-lg font-bold">
				<Link to="/">{import.meta.env.VITE_APP_NAME}</Link>
			</h1>

			<ul className="hidden sm:flex items-center gap-x-3 bg-gray-800">
				{navLinks.public.map((link) => (
					<li key={link.id}>
						{link.name == currentPage ? (
							<span className="bg-gray-700 border border-gray-600 px-2 rounded select-none">
								{link.label}
							</span>
						) : (
							<Link
								to={link.path}
								className="px-2 bg-transparent border border-transparent hover:border-gray-600 rounded transition duration-300 ease-in-out cursor-pointer"
							>
								{link.label}
							</Link>
						)}
					</li>
				))}
			</ul>

			<ul className="ms-auto hidden sm:flex items-center gap-x-2 bg-gray-800">
				{!user ? (
					<>
						{navLinks.unauth.map((link) => (
							<li key={link.id}>
								{link.name == currentPage ? (
									<span className="bg-gray-700 border border-gray-500 select-none rounded px-4 py-1 font-semibold text-sm">
										{link.label}
									</span>
								) : (
									<Link
										to={link.path}
										className="bg-gray-600 hover:bg-gray-500 border border-gray-400 cursor-pointer transition duration-200 rounded px-4 py-1 font-semibold text-sm"
									>
										{link.label}
									</Link>
								)}
							</li>
						))}
					</>
				) : (
					<>
						<li ref={dropdownRef} className="relative">
							<button
								className="group flex items-center gap-x-1 cursor-pointer"
								onClick={() => setShowProfileMenu((prev) => !prev)}
							>
								<p className="group-hover:bg-gray-500 px-1 aspect-square rounded-full bg-gray-600 border border-gray-500 flex items-center justify-center shadow shadow-gray-500">
									<FontAwesomeIcon icon="user" size="sm" />
								</p>
								<FontAwesomeIcon
									icon="caret-down"
									className="group-hover:text-gray-400"
								/>
							</button>
							{showProfileMenu && (
								<div
									ref={profileRef}
									className="flex flex-col top-8 bg-white border border-gray-400 absolute min-w-50 p-1.5 right-0 rounded overflow-hidden shadow-lg text-black mt-1 z-30 space-y-1"
								>
									<div className="px-2.5 py-2 bg-gray-200 rounded space-y-0.5">
										<p className="text-sm font-bold">
											{user.fullname}
										</p>
										<p className="text-xs text-gray-600 font-semibold">
											{user.email}
										</p>
									</div>

									{navLinks.auth.map((link) =>
										link.name == currentPage ? (
											<p
												key={link.id}
												className="px-2 py-1 rounded flex items-center justify-between gap-x-2 bg-gray-100 select-none"
											>
												<span>{link.label}</span>
												<FontAwesomeIcon icon="check" size="sm" />
											</p>
										) : (
											<Link
												key={link.id}
												to={link.path}
												className="px-2 py-1 rounded hover:bg-gray-100 cursor-pointer"
												onClick={() => setShowProfileMenu(false)}
											>
												{link.label}
											</Link>
										)
									)}

									{hasRole("admin") &&
										(currentPage == "admin" ? (
											<p className="px-2 py-1 rounded flex items-center justify-between gap-x-2 bg-gray-100 select-none">
												<span>Admin Page</span>
												<FontAwesomeIcon icon="check" size="sm" />
											</p>
										) : (
											<Link
												to="/admin"
												className="px-2 py-1 rounded hover:bg-gray-100 cursor-pointer"
												onClick={() => setShowProfileMenu(false)}
											>
												Admin Page
											</Link>
										))}

									<button
										onClick={handleLogout}
										className="w-full text-left rounded px-2 py-1 hover:bg-gray-100 cursor-pointer"
									>
										Log out
									</button>
								</div>
							)}
						</li>
					</>
				)}
			</ul>

			<button
				className="ms-auto sm:hidden cursor-pointer text-white font-bold hover:text-gray-400 w-8 border border-gray-300 rounded"
				onClick={() => setShowMenu((prev) => !prev)}
			>
				<FontAwesomeIcon icon="bars" size="lg" />
			</button>

			{showMenu && (
				<div className="fixed top-0 left-0 w-full h-full bg-gray-900 flex flex-col z-20 md:hidden">
					<div className="w-full text-right border-b border-gray-500">
						<button
							className="text-white font-bold hover:text-gray-400 cursor-pointer p-3"
							onClick={handleCloseMenu}
						>
							<FontAwesomeIcon icon="xmark" size="lg" />
						</button>
					</div>

					<div className="flex-grow p-4 flex flex-col items-center gap-y-2 px-4 overflow-y-auto overflow-x-hidden">
						{navLinks.public.map((link) =>
							link.name == currentPage ? (
								<p
									key={link.id}
									ref={(el) => setMainRef(el, link.id - 1)}
									className="w-full bg-gray-800 border border-gray-300 rounded max-w-sm px-3 py-2 text-center"
								>
									<FontAwesomeIcon
										icon="check"
										size="sm"
										className="me-2"
									/>
									{link.label.toUpperCase()}
								</p>
							) : (
								<Link
									ref={(el) => setMainRef(el, link.id - 1)}
									key={link.id}
									to={link.path}
									className="w-full border border-gray-300 rounded max-w-sm px-3 py-2 text-center hover:bg-gray-500 cursor-pointer"
									onClick={handleProfileMenuClick}
								>
									{link.label.toUpperCase()}
								</Link>
							)
						)}

						{!user ? (
							<>
								{navLinks.unauth.map((link) =>
									link.name == currentPage ? (
										<p
											key={link.id}
											ref={(el) => setMainRef(el, link.id - 1)}
											className="w-full bg-gray-800 border border-gray-300 rounded max-w-sm px-3 py-2 text-center"
										>
											<FontAwesomeIcon
												icon="check"
												size="sm"
												className="me-2"
											/>
											{link.label.toUpperCase()}
										</p>
									) : (
										<Link
											ref={(el) => setMainRef(el, link.id - 1)}
											key={link.id}
											to={link.path}
											className="w-full border border-gray-300 rounded max-w-sm px-3 py-2 text-center hover:bg-gray-500 cursor-pointer"
											onClick={handleProfileMenuClick}
										>
											{link.label.toUpperCase()}
										</Link>
									)
								)}
							</>
						) : (
							<>
								<button
									ref={(el) => setMainRef(el, 2)}
									onClick={handleProfileMenuToggle}
									className="w-full border border-gray-300 rounded max-w-sm px-3 py-2 text-center hover:bg-gray-600 cursor-pointer"
								>
									{/* <FontAwesomeIcon icon="user" className="me-1" /> */}
									<div className="flex items-center gap-x-3 justify-center">
										{/* <FontAwesomeIcon icon="user" /> */}
										<div className="text-right">
											<p className="text-sm font-bold">
												{user.fullname}
											</p>
											<p className="text-xs text-gray-400 font-semibold">
												{user.email}
											</p>
										</div>
										<p className="px-0.5 rounded-full bg-gray-500 aspect-square flex items-center justify-center">
											<FontAwesomeIcon
												icon={
													showProfileDropdownMenu
														? "caret-up"
														: "caret-down"
												}
											/>
										</p>
									</div>
								</button>

								{showProfileDropdownMenu && (
									<>
										{navLinks.auth.map((link, i) =>
											link.name == currentPage ? (
												<p
													key={link.id}
													ref={(el) => setRef(el, i)}
													className="w-full bg-gray-800 border border-gray-300 rounded max-w-sm px-3 py-2 text-center"
												>
													<FontAwesomeIcon
														icon="check"
														size="sm"
														className="me-2"
													/>
													{link.label.toUpperCase()}
												</p>
											) : (
												<Link
													ref={(el) => setRef(el, i)}
													key={link.id}
													to={link.path}
													className="w-full border border-gray-300 rounded max-w-sm px-3 py-2 text-center hover:bg-gray-500 cursor-pointer"
													onClick={handleProfileMenuClick}
												>
													{link.label.toUpperCase()}
												</Link>
											)
										)}

										{
											hasRole("admin") &&
												(currentPage == "admin" ? (
													<p
														ref={(el) => setRef(el, 2)}
														className="w-full bg-gray-800 border border-gray-300 rounded max-w-sm px-3 py-2 text-center"
													>
														<FontAwesomeIcon
															icon="check"
															size="sm"
															className="me-2"
														/>
														ADMIN PAGE
													</p>
												) : (
													<Link
														ref={(el) => setRef(el, 2)}
														to="/admin"
														className="w-full border border-gray-300 rounded max-w-sm px-3 py-2 text-center hover:bg-gray-600 cursor-pointer"
														onClick={handleProfileMenuClick}
													>
														ADMIN PAGE
													</Link>
												))

											// <Link
											// 	ref={(el) => setRef(el, 2)}
											// 	to="/admin"
											// 	className="w-full border border-gray-300 rounded max-w-sm px-3 py-2 text-center hover:bg-gray-600 cursor-pointer"
											// 	onClick={handleProfileMenuClick}
											// >
											// 	ADMIN PAGE
											// </Link>
										}
										<button
											ref={(el) => setRef(el, 3)}
											onClick={handleLogout}
											className="w-full border border-gray-300 rounded max-w-sm px-3 py-2 text-center hover:bg-gray-600 cursor-pointer"
										>
											LOG OUT
										</button>
									</>
								)}
							</>
						)}
					</div>
				</div>
			)}
		</nav>
	);
};

export default Navbar;
