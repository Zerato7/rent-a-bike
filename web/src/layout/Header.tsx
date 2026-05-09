import { useEffect, useRef, useState, type ReactNode } from "react";
import logo from "../assets/logo-admin.svg";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import AvatarIcon from "../icons/AvatarIcon";
import { Menu, X } from "lucide-react";

export default function Header() {
	const navigate = useNavigate();
	const location = useLocation();
	const isProfile = location.pathname === "/profile";

	const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

	const dropdownRef = useRef<HTMLDivElement | null>(null);
	useEffect(() => {
		function handleClickOutside(e: MouseEvent) {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(e.target as Node)
			) {
				setIsProfileMenuOpen(false);
			}
		}

		document.addEventListener("mousedown", handleClickOutside);
		return () =>
			document.removeEventListener("mousedown", handleClickOutside);
	}, []);
	
	function handleLogout() {
		localStorage.removeItem("loggedIn");
		navigate("/login");
	}

	return (
		<header className="bg-primary/50 backdrop-blur-sm py-4 px-6">
			<div className="flex items-center">
				<img
					src={logo}
					alt="Admin logo"
					className="md:h-12 h-8 w-auto cursor-pointer"
					onClick={() => navigate("/bicycles")}
				/>

				<div className="ml-auto hidden md:flex items-center gap-8">
					<nav className="flex gap-6 text-base font-bold">
						<TabLink to="/bicycles">Bicycles</TabLink>
						<TabLink to="/rentals">Rentals</TabLink>
						<TabLink to="/issues">Reported Issues</TabLink>
					</nav>

					<div className="relative" ref={dropdownRef}>
						<AvatarIcon
							onClick={() => setIsProfileMenuOpen((v) => !v)}
							className={`h-12 w-auto cursor-pointer transition ${!isProfile ? "text-success/70 hover:text-success" : "text-success"}`}
							isActive={isProfile}
						/>

						{isProfileMenuOpen && (
							<div className="absolute right-0 mt-2 bg-primary-light shadow-lg rounded text-sm z-50">
								<button
									onClick={() => {
										setIsProfileMenuOpen(false);
										navigate("/profile");
									}}
									className="block w-full text-center font-bold text-primary px-4 py-2 transition hover:bg-primary/20"
								>
									Profile
								</button>

								<hr className="border-none h-0.5 bg-primary" />

								<button
									onClick={handleLogout}
									className="block w-full text-center font-bold text-danger px-4 py-2 transition hover:bg-primary/20"
								>
									Logout
								</button>
							</div>
						)}
					</div>
				</div>

				<button
					onClick={() => setIsMobileMenuOpen((v) => !v)}
					className="ml-auto md:hidden text-success p-1"
				>
					{isMobileMenuOpen
						? <X className="h-6 w-auto" />
						: <Menu className="h-6 w-auto" />
					}
				</button>
			</div>

			{isMobileMenuOpen && (
				<div className="w-full md:hidden flex flex-col border-t border-primary/20">
					<nav className="flex flex-col mt-1">
						<MobileTabLink to="/bicycles">Bicycles</MobileTabLink>
						<MobileTabLink to="/rentals">Rentals</MobileTabLink>
						<MobileTabLink to="/issues">Reported Issues</MobileTabLink>
						<hr className="h-[0.125rem] mt-1 border-none bg-primary-light" />
						<MobileTabLink 
							to="/profile"
							labelColor="text-warning"	
						>
							Profile
						</MobileTabLink>
						<button
							onClick={handleLogout}
							className="
								w-full 
								px-6 py-4 mt-1 
								text-left font-bold text-danger 
								transition hover:bg-danger/10"
						>
							Logout
						</button>
					</nav>
				</div>
			)}
		</header>
	);
}

interface TabLinkProps {
	to: string;
	children: ReactNode;
	labelColor?: string;
}

function TabLink({ to, children }: TabLinkProps) {
	return (
		<NavLink
			to={to}
			className={({ isActive }) =>
				`relative transition p-2 rounded-md m-auto ${
					isActive
						? "text-success bg-primary"
						: "text-success/70 hover:text-success"
				}`
			}
		>
			{children}
		</NavLink>
	);
}

function MobileTabLink({ 
	to, 
	children, 
	labelColor = "text-success",
}: TabLinkProps) {
	return (
		<NavLink
			to={to}
			className={({ isActive }) => 
				`w-full mt-1 px-6 py-4 
				font-bold 
				rounded border-b border-primary/10 
				${labelColor} transition ${
					isActive
						? `bg-primary`
						: `opacity-70 hover:${labelColor} hover:bg-primary/50`
				}`
			}
		>
			{children}
		</NavLink>
	);
}
