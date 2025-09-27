const AuthLoader = () => {
	return (
		<div className="fixed top-0 left-0 w-full h-dvh bg-gray-900 flex flex-col items-center justify-center space-y-2">
			<div className="w-8 h-auto aspect-square rounded-full border-6 border-gray-400 border-t-gray-600  animate-spin"></div>
			<div className="text-white">LOADING AUTHENTICATION..</div>
		</div>
	);
};

export default AuthLoader;
