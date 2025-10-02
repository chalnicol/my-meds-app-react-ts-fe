import { useEffect } from "react";
import { useLocation } from "react-router-dom"; // Import useLocation

function ScrollToTop() {
	const location = useLocation(); // Get the current location object from React Router

	// This useEffect hook will run every time the location.pathname changes
	useEffect(() => {
		// Scroll the window to the very top (x=0, y=0)
		window.scrollTo(0, 0);
	}, [location.pathname]); // Dependency array: ensures the effect runs when the path changes

	return null; // This component doesn't render any visible UI
}

export default ScrollToTop;
