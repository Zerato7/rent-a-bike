import {
	useUpdateUser,
	updateUserRequest,
	type UpdateUserForm,
	type ErrorResponse,
	type User,
} from "@project/shared/index";
import { useZodForm } from "../../hooks/useZodForm";
import { myToast } from "../../utils/toasts";
import { FormInput } from "./FormInput";
import { useState } from "react";
import { CircleX, Pencil, SquareCheck } from "lucide-react";

interface PersonalInfoFormProps {
	user: User;
}

export function PersonalInfoForm({ user }: PersonalInfoFormProps) {
	const { mutate, isPending, error, isError } = useUpdateUser();

	const [isEditing, setIsEditing] = useState(false);

	const form = useZodForm<UpdateUserForm>(updateUserRequest, {
		firstName: user?.firstName,
		lastName: user?.lastName,
		phone: user?.phone,
		email: user?.email,
	});

	function handleUpdateUser(e: React.SubmitEvent) {
		e.preventDefault();

		if (!isEditing) return;

		if (!form.validate(form.values, true)) return;

		mutate(
			{
				id: user!.id,
				...form.values,
			},
			{
				onSuccess: (updatedUser: User) => {
					myToast("success", "Successfully edited personal info!");
					user = updatedUser;
					doneEditing();
				},
				onError: (err: ErrorResponse) => {
					if (err?.fieldErrors) {
						form.setErrors(err.fieldErrors);
					}
				},
			},
		);
	}

	function doneEditing() {
		setIsEditing(false);

		form.reset({
			firstName: user.firstName,
			lastName: user.lastName,
			phone: user.phone,
			email: user.email,
		});
	}

	return (
		<form
			onSubmit={handleUpdateUser}
			className={`
				text-primary max-w-md 
				grid sm:grid-cols-[1fr_1fr] grid-cols-[1fr] gap-2
				px-6 pt-6 ${isEditing ? "pb-2" : "pb-10"}
				bg-primary/30 rounded
			`}
		>
			<h2 className="text-lg font-bold text-success-light col-span-2 mb-4">
				Personal Info
			</h2>

			<FormInput
				label="Username"
				value={user.username}
				onChange={() => {}}
				labelClassName="text-success-light font-semibold"
				inputClassName="text-success font-semibold bg-primary-light"
				disabled={true}
			/>
			<div></div>

			<FormInput
				label="First Name"
				value={form.values.firstName!}
				onChange={(v) => form.setField("firstName", v)}
				errors={form.errors.firstName}
				labelClassName="text-success-light font-semibold"
				inputClassName="text-success font-semibold bg-primary-light"
				disabled={!isEditing}
			/>

			<FormInput
				label="Last Name"
				value={form.values.lastName!}
				onChange={(v) => form.setField("lastName", v)}
				errors={form.errors.lastName}
				labelClassName="text-success-light font-semibold"
				inputClassName="text-success font-semibold bg-primary-light"
				disabled={!isEditing}
			/>

			<FormInput
				label="Phone"
				value={form.values.phone ?? ""}
				onChange={(v) => form.setField("phone", v)}
				errors={form.errors.phone}
				labelClassName="text-success-light font-semibold"
				inputClassName="text-success font-semibold bg-primary-light"
				disabled={!isEditing}
			/>

			<FormInput
				type="email"
				label="E-mail"
				value={form.values.email!}
				onChange={(v) => form.setField("email", v)}
				errors={form.errors.email}
				labelClassName="text-success-light font-semibold"
				inputClassName="text-success font-semibold bg-primary-light"
				disabled={!isEditing}
			/>

			{!isEditing && (
				<button
					type="button"
					className="
						flex items-center justify-center gap-1 w-full
						font-semibold p-2 rounded 
						transition bg-warning text-primary hover:bg-warning/50
					"
					onClick={() => setIsEditing(true)}
				>
					<Pencil className="h-5 w-auto shrink-0" /> Edit Personal
					Info
				</button>
			)}
			{isEditing && (
				<button
					type="submit"
					disabled={isPending || Object.keys(form.errors).length > 0}
					className={`
						flex items-center justify-center gap-1 w-full
						font-semibold p-2 rounded transition 
						disabled:opacity-50 disabled:cursor-not-allowed ${
							isError
								? "bg-primary-light text-danger hover:bg-primary/30 ring-2 ring-danger ring-inset"
								: "bg-primary text-warning hover:bg-primary/50 border-2 border-warning"
						}`}
				>
					{isPending ? (
						"Sending data..."
					) : (
						<>
							<SquareCheck className="h-5 w-auto shrink-0" /> Save
							Changes
						</>
					)}
				</button>
			)}
			{isEditing && (
				<button
					type="button"
					disabled={isPending}
					className="
						flex items-center justify-center gap-1 w-full
						font-semibold p-2 rounded 
						transition disabled:opacity-50 disabled:cursor-not-allowed
						bg-neutral text-white hover:bg-neutral/50
					"
					onClick={() => doneEditing()}
				>
					<CircleX className="h-5 w-auto shrink-0" /> Cancel
				</button>
			)}
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
