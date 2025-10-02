import Footer from "../footer";
import Navbar from "../navbar";

interface AuthenticatedLayoutProps {
	children: React.ReactNode;
}
const AuthenticatedLayout = ({ children }: AuthenticatedLayoutProps) => {
	return (
		<div className="w-full min-h-dvh flex flex-col items-center justify-center">
			<Navbar />
			<main className="flex-grow w-full">{children}</main>
			<Footer />
		</div>
	);
};
export default AuthenticatedLayout;
