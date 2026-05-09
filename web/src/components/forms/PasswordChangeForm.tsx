import {
	useChangePassword,
	passwordChangeFrontend,
	type PasswordChangeForm,
	type ErrorResponse,
	type User,
} from "@project/shared/index";
import { useZodForm } from "../../hooks/useZodForm";
import { myToast } from "../../utils/toasts";
import { PasswordInput } from "./PasswordInput";

interface PasswordChangeFormProps {
	user: User;
}

export function PasswordChangeForm({ user }: PasswordChangeFormProps) {
	const { mutate, isPending, error, isError } = useChangePassword();

	const form = useZodForm<PasswordChangeForm>(passwordChangeFrontend, {
		oldPassword: "",
		newPassword: "",
		confirmPassword: "",
	});

	function handleUpdateUser(e: React.SubmitEvent) {
		e.preventDefault();

		if (!form.validate(form.values, true)) return;

		console.log({
			id: user!.id,
			...form.values,
		});

		mutate(
			{
				id: user!.id,
				...form.values,
			},
			{
				onSuccess: () => {
					myToast("success", "Successfully changed password!");
					resetForm();
				},
				onError: (err: ErrorResponse) => {
					if (err?.fieldErrors) {
						form.setErrors(err.fieldErrors);
					}
				},
			},
		);
	}

	function resetForm() {
		form.reset({
			oldPassword: "",
			newPassword: "",
			confirmPassword: "",
		});
	}

	return (
		<form
			onSubmit={handleUpdateUser}
			className="
				text-primary max-w-md 
				grid grid-cols-[1fr] gap-2
				px-6 pt-6 pb-2
				bg-primary/30 rounded
			"
		>
			<h2 className="text-lg font-bold text-accent mb-4">
				Password Change
			</h2>

			<PasswordInput
				label="Old Password*"
				value={form.values.oldPassword}
				onChange={(v) => form.setField("oldPassword", v)}
				errors={form.errors.oldPassword}
				placeholder="Enter old password"
				labelClassName="text-accent font-semibold"
				inputClassName="text-accent font-semibold bg-primary-light"
			/>

			<PasswordInput
				label="New Password*"
				value={form.values.newPassword}
				onChange={(v) => form.setField("newPassword", v)}
				errors={form.errors.newPassword}
				placeholder="Enter new password"
				labelClassName="text-accent font-semibold"
				inputClassName="text-accent font-semibold bg-primary-light"
			/>

			<PasswordInput
				label="Confirm Password*"
				value={form.values.confirmPassword}
				onChange={(v) => form.setField("confirmPassword", v)}
				errors={form.errors.confirmPassword}
				placeholder="New password again"
				labelClassName="text-accent font-semibold"
				inputClassName="text-accent font-semibold bg-primary-light"
			/>

			<button
				type="submit"
				disabled={isPending || Object.keys(form.errors).length > 0}
				className={`
					flex items-center justify-center gap-1 w-full
					font-semibold p-2 rounded transition 
					disabled:opacity-50 disabled:cursor-not-allowed ${
						isError
							? "bg-primary-light text-danger hover:bg-primary/30 ring-2 ring-danger ring-inset"
							: "bg-accent text-primary hover:bg-accent/50"
					}`}
			>
				<span className="leading-7">
					{isPending ? "Sending data..." : "Edit Password"}
				</span>
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
	);
}
