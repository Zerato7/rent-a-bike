import AvatarIcon from "../icons/AvatarIcon";
import { Navigate, useNavigate } from "react-router-dom";
import Footer from "../layout/Footer";
import { isAuth } from "../utils/isAuth";
import logo from "../assets/logo-admin.svg";

import {
	useLoginUser,
	type ErrorResponse,
	type LoginUserForm,
	loginRequest,
	type User,
} from "@project/shared/index";
import { FormInput } from "../components/forms/FormInput";
import { useZodForm } from "../hooks/useZodForm";
import { PasswordInput } from "../components/forms/PasswordInput";

export default function LoginPage() {
	const navigate = useNavigate();
	const { mutate, isPending, error, isError } = useLoginUser();

	const form = useZodForm<LoginUserForm>(loginRequest, {
		username: "",
		password: "",
		role: "admin",
	});

	if (isAuth()) {
		return <Navigate to="/bicycles" replace />;
	}

	function handleLogin(e: React.SubmitEvent) {
		e.preventDefault();

		if (!form.validate(form.values, true)) return;

		mutate(form.values, {
			onSuccess: (user: User) => {
				localStorage.setItem("loggedIn", JSON.stringify(user));
				navigate("/bicycles");
			},
			onError: (err: ErrorResponse) => {
				if (err?.fieldErrors) {
					form.setErrors(err.fieldErrors);
				}
			},
		});
	}

	return (
		<div className="min-h-screen bg-primary/30 flex flex-col">
			<div className="flex-1 flex flex-col items-center justify-center p-6">
				<img
					src={logo}
					alt="Admin logo"
					className="md:h-20 h-12 w-auto mb-8"
					onClick={() => navigate("/bicycles")}
				/>
				<form
					onSubmit={handleLogin}
					className="md:min-w-[360px] bg-success-light border-2 border-primary rounded-xl shadow-lg px-8 pt-8 pb-6"
				>
					<div className="flex flex-col items-center mb-2">
						<AvatarIcon
							className="h-12 w-auto text-white"
							isActive={true}
						/>
						<h2 className="text-primary font-bold tracking-wide">
							LOGIN
						</h2>
					</div>

					<FormInput
						label="Username*"
						value={form.values.username}
						placeholder="Enter your username"
						onChange={(v) => form.setField("username", v)}
						errors={form.errors.username}
					/>

					<PasswordInput
						label="Password*"
						value={form.values.password}
						placeholder="Enter your password"
						onChange={(v) => form.setField("password", v)}
						errors={form.errors.password}
					/>

					<button
						type="submit"
						disabled={
							isPending || Object.keys(form.errors).length > 0
						}
						className={`w-full font-semibold py-2 rounded transition disabled:opacity-50 disabled:cursor-not-allowed ${
							isError
								? "bg-primary-light text-danger hover:bg-primary/30 ring-2 ring-danger ring-inset"
								: "bg-primary text-white hover:bg-primary/50 "
						}`}
					>
						{isPending ? "Logging in..." : "Login"}
					</button>
					<div className="min-h-[1.25rem]">
						{isError && !error?.fieldErrors ? (
							<p className="text-danger text-sm font-bold">
								{error?.error}
							</p>
						) : (
							<></>
						)}
					</div>
				</form>
			</div>

			<Footer />
		</div>
	);
}
