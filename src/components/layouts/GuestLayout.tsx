import Navbar from "../navbar";

interface GuestLayoutProps {
	children: React.ReactNode;
}
const GuestLayout = ({ children }: GuestLayoutProps) => {
	return (
		<div className="w-full h-dvh flex flex-col">
			{/* <div className="my-3 flex items-center justify-center gap-x-2">
				<Link
					to="/login"
					className="px-2 py-1 font-bold bg-gray-200 border border-gray-300 rounded-xl min-w-25 text-center shadow"
				>
					Login
				</Link>
				<Link
					to="/register"
					className="px-2 py-1 font-bold bg-gray-200 border border-gray-300 rounded-xl min-w-25 text-center shadow"
				>
					Register
				</Link>
			</div> */}
			<Navbar />
			<main className="flex-grow bg-gray-200">{children}</main>
		</div>
	);
};
export default GuestLayout;
