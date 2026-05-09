import { Navigate, Outlet } from "react-router-dom";
import Footer from "./Footer";
import Header from "./Header";
import { isAuth } from "../utils/isAuth";

export default function AdminLayout() {
	if (!isAuth()) {
		return <Navigate to="/login" replace />;
	}

	return (
		<div className="min-h-screen bg-primary/30 flex flex-col">
			<Header />
			<main className="flex-1 p-6">
				<Outlet />
			</main>
			<Footer />
		</div>
	);
}
