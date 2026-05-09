import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import AdminLayout from "./layout/AdminLayout";
import BicyclesPage from "./pages/BicyclesPage";
import IssuesPage from "./pages/IssuesPage";
import RentalsPage from "./pages/RentalsPage";
import ProfilePage from "./pages/ProfilePage";
import LoginPage from "./auth/LoginPage";
import { Toaster } from "react-hot-toast";

function App() {
	return (
		<BrowserRouter>
			<Toaster 
				position="bottom-center"
			/>
			<Routes>
				<Route path="/login" element={<LoginPage />} />
				<Route element={<AdminLayout />}>
					<Route path="/bicycles" element={<BicyclesPage />} />
					<Route path="/rentals" element={<RentalsPage />} />
					<Route path="/issues" element={<IssuesPage />} />
					<Route path="/profile" element={<ProfilePage />} />
					<Route
						path="*"
						element={<Navigate to="/bicycles" replace />}
					/>
				</Route>
			</Routes>
		</BrowserRouter>
	);
}

export default App;
