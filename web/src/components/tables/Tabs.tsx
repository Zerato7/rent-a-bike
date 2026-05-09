import { type ReactNode } from "react";
import { useLocalStorage } from "../../hooks/useLocalStorage";

interface TabsProps {
	label1: string;
	label2: string;
	child1: ReactNode;
	child2: ReactNode;
}

export function Tabs({
	label1,
	label2,
	child1,
	child2
}: TabsProps) {
	const [tab, setTab] = useLocalStorage<number>("rentalTab", 0);

	return (
		<>
			<div className="flex items-center gap-1 mb-2">
				<button 
					type="button"
					className={`
						px-4 py-2 bg-success text-white font-bold
						border-2 border-black rounded
						${tab !== 0 
							? "opacity-50 cursor-pointer hover:opacity-80" 
							: "cursor-default"}
					`}
					onClick={() => tab !== 0 && setTab((v) => 1 - v)}
				>
					{label1}
				</button>
				<button 
					type="button"
					className={`
						px-4 py-2 bg-success-light text-primary font-bold
						border-2 border-black rounded
						${tab !== 1 
							? "opacity-50 cursor-pointer hover:opacity-80" 
							: "cursor-default"}
					`}
					onClick={() => tab !== 1 && setTab((v) => 1 - v)}
				>
					{label2}
				</button>
			</div>
			{tab === 0 && child1}
			{tab === 1 && child2}
		</>
	);
}