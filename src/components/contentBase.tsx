interface ContentBaseProps {
	children: React.ReactNode;
}
const ContentBase = ({ children }: ContentBaseProps) => {
	return <div className="w-full h-full">{children}</div>;
};

export default ContentBase;
