interface HeaderProps {
	children: React.ReactNode;
	className?: string;
}
const Header = ({ children, className }: HeaderProps) => {
	return (
		<header className={`bg-gray-500 text-white px-4 py-3 ${className}`}>
			{children}
		</header>
	);
};
export default Header;
