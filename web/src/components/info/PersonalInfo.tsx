import { useGetUser } from "@project/shared/index";
import { Pending } from "../states/Pending";
import { ErrorLoading } from "../states/ErrorLoading";

interface PersonalInfoProps {
	userId: string;
	labelColor: string;
	infoColor: string;
}

export function PersonalInfo({
	userId,
	labelColor,
	infoColor
}: PersonalInfoProps) {
	const { data: user, isPending, error, isError } = useGetUser(userId);

	if (isPending) {
		return <Pending label="user" />
	}

	if (isError) {
		return <ErrorLoading 
			label="user"
			error={error}
		/>
	}

	return (
		<div className={`grid sm:grid-cols-[1fr_1fr] grid-cols-[1fr] gap-2 ${infoColor} font-semibold`}>
			<div className="sm:col-span-2">
				<div className={`${labelColor}`}>Username</div>
				<div>{user.username}</div>
			</div>
			<div>
				<div className={`${labelColor}`}>First Name</div>
				<div>{user.firstName}</div>
			</div>
			<div>
				<div className={`${labelColor}`}>Last Name</div>
				<div>{user.lastName}</div>
			</div>
			<div>
				<div className={`${labelColor}`}>Phone Number</div>
				<div className={`${user.phone ? "" : "opacity-50"}`}>
					{user.phone ?? "No data"}
				</div>
			</div>
			<div>
				<div className={`${labelColor}`}>E-mail</div>
				<div>{user.email}</div>
			</div>
		</div>
	);
}
