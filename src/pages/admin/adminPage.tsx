import {
	faArrowTrendUp,
	faMedkit,
	faThumbsUp,
	faUser,
} from "@fortawesome/free-solid-svg-icons";
import AdminThumbs from "../../components/admin/adminThumbs";
import Header from "../../components/header";
import { useAuth } from "../../context/AuthProvider";
import { useEffect, useState } from "react";
import apiClient from "../../utils/axiosConfig";
import Loader from "../../components/loader";

interface Counts {
	users: number;
	medications: number;
	roles: number;
	stocks: number;
}

const AdminPage = () => {
	const { updateCurrentPage } = useAuth();

	const [isLoading, setIsLoading] = useState(false);
	const [counts, setCounts] = useState<Counts>({
		users: 0,
		medications: 0,
		roles: 0,
		stocks: 0,
	});

	const fetchCounts = async () => {
		setIsLoading(true);
		try {
			const response = await apiClient.get("/admin");
			setCounts(response.data.counts);
			console.log(response);
		} catch (error) {
			console.error(error);
		} finally {
			setIsLoading(false);
		}
	};
	useEffect(() => {
		updateCurrentPage("admin");
		fetchCounts();
	}, []);
	return (
		<>
			<title>{`ADMIN PAGE | ${import.meta.env.VITE_APP_NAME}`}</title>
			<Header>
				<p className="text-xl font-bold">Admin Dashboard</p>
			</Header>
			<div className="p-3">
				<div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-3 gap-y-2">
					<AdminThumbs
						resource="Users"
						count={counts.users}
						icon={faUser}
						buttons={["view"]}
					/>
					<AdminThumbs
						resource="Medications"
						count={counts.medications}
						icon={faMedkit}
					/>
					<AdminThumbs
						resource="Stocks"
						count={counts.stocks}
						icon={faArrowTrendUp}
					/>
					<AdminThumbs
						resource="Roles"
						count={counts.roles}
						icon={faThumbsUp}
					/>
				</div>
			</div>
			{isLoading && <Loader />}
		</>
	);
};

export default AdminPage;
