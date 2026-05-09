import {
	BIKETYPE,
	type Bicycle,
	type BikeType,
	type Location,
	registerBikeRequest,
	type RegisterBikeForm,
	useRegisterBike,
	type ErrorResponse,
} from "@project/shared/index";
import { useZodForm } from "../../hooks/useZodForm";
import { FormInput } from "./FormInput";
import { FormSelect } from "./FormSelect";
import { myToast } from "../../utils/toasts";
import { QrCodeInfo } from "../info/QrCodeInfo";

interface AddBikeFormProps {
	locations: Location[];
	onCancel: () => void;
	onSuccess: (bike: Bicycle) => void;
}

export function AddBikeForm({
	locations,
	onCancel,
	onSuccess,
}: AddBikeFormProps) {
	const { mutate, isPending, error, isError } = useRegisterBike();

	const form = useZodForm<RegisterBikeForm>(registerBikeRequest, {
		locationId: "",
		type: BIKETYPE.ROAD,
		pricePerHour: 0,
	});

	function handleRegisterBike(e: React.SubmitEvent) {
		e.preventDefault();

		if (!form.validate(form.values, true)) return;

		mutate(form.values, {
			onSuccess: (bike: Bicycle) => {
				myToast(
					"success",
					`Successfully added new bike ${bike.displayId}!`,
				);
				onSuccess(bike);
			},
			onError: (err: ErrorResponse) => {
				if (err?.fieldErrors) {
					form.setErrors(err.fieldErrors);
				}
			},
		});
	}

	return (
		<form
			onSubmit={handleRegisterBike}
			className="text-primary max-w-md mx-auto"
		>
			<FormSelect
				label="Location*"
				value={form.values.locationId}
				onChange={(v) => form.setField("locationId", v)}
				errors={form.errors.locationId}
			>
				<option value="" disabled>
					Select location
				</option>

				{locations.map((location) => (
					<option key={location._id} value={location._id}>
						{location.name}
					</option>
				))}
			</FormSelect>

			<FormSelect<BikeType>
				label="Type*"
				value={form.values.type}
				onChange={(v) => form.setField("type", v)}
				errors={form.errors.type}
			>
				{Object.values(BIKETYPE).map((type, index) => (
					<option key={index} value={type}>
						{type}
					</option>
				))}
			</FormSelect>

			<FormInput
				type="number"
				label="Price per Hour*"
				value={form.values.pricePerHour}
				onChange={(v) => form.setField("pricePerHour", Number(v))}
				errors={form.errors.pricePerHour}
			/>

			<QrCodeInfo className="mb-5" />

			<div className="flex justify-between mt-2">
				<button
					type="button"
					disabled={isPending}
					className="
						font-semibold p-2 rounded 
						transition disabled:opacity-50 disabled:cursor-not-allowed
						bg-neutral text-white hover:bg-neutral/50
					"
					onClick={onCancel}
				>
					Cancel
				</button>
				<button
					type="submit"
					disabled={isPending || Object.keys(form.errors).length > 0}
					className={`font-semibold p-2 rounded transition disabled:opacity-50 disabled:cursor-not-allowed ${
						isError
							? "bg-primary-light text-danger hover:bg-primary/30 ring-2 ring-danger ring-inset"
							: "bg-primary text-white hover:bg-primary/50 "
					}`}
				>
					{isPending ? "Sending data..." : "Add"}
				</button>
			</div>
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
