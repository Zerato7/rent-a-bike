import {
	BIKESTATUS,
	BIKETYPE,
	type Bicycle,
	type BikeStatus,
	type BikeType,
	type Location,
	updateBikeRequest,
	type UpdateBikeForm,
	useUpdateBike,
	type ErrorResponse,
} from "@project/shared/index";
import { useZodForm } from "../../hooks/useZodForm";
import { FormInput } from "./FormInput";
import { FormSelect } from "./FormSelect";
import { myToast } from "../../utils/toasts";

interface EditBikeFormProps {
	bicycle: Bicycle;
	locations: Location[];
	onCancel: () => void;
	onSuccess: (bike: Bicycle) => void;
}

export function EditBikeForm({
	bicycle,
	locations,
	onCancel,
	onSuccess,
}: EditBikeFormProps) {
	const { mutate, isPending, error, isError } = useUpdateBike();

	const form = useZodForm<UpdateBikeForm>(updateBikeRequest, {
		locationId: bicycle.location._id,
		type: bicycle.type,
		pricePerHour: bicycle.pricePerHour,
		status: bicycle.status,
	});

	function handleRegisterBike(e: React.SubmitEvent) {
		e.preventDefault();

		if (!form.validate(form.values, true)) return;

		mutate(
			{
				id: bicycle._id,
				...form.values,
			},
			{
				onSuccess: (bike: Bicycle) => {
					myToast("warning", `Successfully edited bike ${bike.displayId}!`);
					onSuccess(bike);
				},
				onError: (err: ErrorResponse) => {
					if (err?.fieldErrors) {
						form.setErrors(err.fieldErrors);
					}
				},
			},
		);
	}

	return (
		<form
			onSubmit={handleRegisterBike}
			className="text-primary max-w-md mx-auto"
		>
			<FormSelect
				label="Location"
				value={form.values.locationId!}
				onChange={(v) => form.setField("locationId", v)}
				errors={form.errors.locationId}
			>
				{locations.map((location) => (
					<option key={location._id} value={location._id}>
						{location.name}
					</option>
				))}
			</FormSelect>

			<FormSelect<BikeType>
				label="Type"
				value={form.values.type!}
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
				label="Price per Hour"
				value={form.values.pricePerHour!}
				onChange={(v) => form.setField("pricePerHour", Number(v))}
				errors={form.errors.pricePerHour}
			/>

			<FormSelect<BikeStatus>
				label="Status"
				value={form.values.status!}
				onChange={(v) => form.setField("status", v)}
				errors={form.errors.status}
			>
				{Object.values(BIKESTATUS).map((status, index) => (
					<option key={index} value={status}>
						{status}
					</option>
				))}
			</FormSelect>

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
					{isPending ? "Sending data..." : "Edit"}
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
