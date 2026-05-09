import { useNavigate } from "react-router-dom";
import { PersonalInfoForm } from "../components/forms/PersonalInfoForm";
import { getProfileId } from "../utils/isAuth";
import { useGetUser } from "@project/shared/index";
import { Pending } from "../components/states/Pending";
import { ErrorLoading } from "../components/states/ErrorLoading";
import { PasswordChangeForm } from "../components/forms/PasswordChangeForm";

export default function ProfilePage() {
	const navigate = useNavigate();

	const userId = getProfileId();
	if (!userId) {
		navigate("/bicycles");
	}

	const {
		data: user,
		isPending: isPendingLoad,
		error: errorLoad,
		isError: isErrorLoad,
	} = useGetUser(userId!);
	
	if (isPendingLoad) {
		return <Pending label="personal info" />
	}

	if (isErrorLoad) {
		return <ErrorLoading 
			label="personal info"
			error={errorLoad}
		/>
	}

	return (
		<div className="flex flex-wrap items-start justify-evenly gap-4">
			<PersonalInfoForm user={user} />
			<PasswordChangeForm user={user} />
		</div>
	);
}
