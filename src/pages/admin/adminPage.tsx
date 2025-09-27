import { faMedkit, faUser } from "@fortawesome/free-solid-svg-icons";
import AdminThumbs from "../../components/admin/adminThumbs";
import Header from "../../components/header";
import { useAuth } from "../../context/AuthProvider";
import { useEffect } from "react";

const AdminPage = () => {
	const { updateCurrentPage } = useAuth();
	useEffect(() => {
		updateCurrentPage("admin");
	}, []);
	return (
		<>
			<title>{`ADMIN PAGE | ${import.meta.env.VITE_APP_NAME}`}</title>
			<Header>
				<p className="text-xl font-bold">Admin Dashboard</p>
			</Header>
			<div className="p-3">
				<div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-3 gap-y-2">
					<AdminThumbs resource="Users" count={10} icon={faUser} />
					<AdminThumbs resource="Medications" count={10} icon={faMedkit} />
				</div>
			</div>
		</>
	);
};

export default AdminPage;
