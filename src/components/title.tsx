const Title = ({ label }: { label: string }) => {
	return (
		<div className="bg-gray-500 text-white px-3 py-3">
			<h1 className="text-xl font-bold">{label}</h1>
		</div>
	);
};
export default Title;
