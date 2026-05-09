import { PlusCircle, Search } from "lucide-react";

interface TableToolbarProps {
	search: string;
	searchPlaceholder?: string;
	onSearch: (v: string) => void;
	onAdd?: () => void;
	addLabel?: string;
}

export function TableToolbar({
	search,
	searchPlaceholder = "Search ...",
	onSearch,
	onAdd,
	addLabel = "Add",
}: TableToolbarProps) {
	return (
		<div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between items-center mb-4 text-primary">
			<div className="relative w-full md:max-w-sm">
				<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-auto" />
				<input
					type="text"
					value={search}
					onChange={(e) => onSearch(e.target.value)}
					placeholder={searchPlaceholder}
					className="
						w-full pl-10 pr-4 py-2 
						placeholder:text-primary font-bold
						border-2 border-primary rounded 
						bg-success/80 outline-none 
						focus:ring-2 focus:ring-primary focus:bg-success
					"
				/>
			</div>
			{onAdd && (
				<button
					onClick={onAdd}
					className="flex items-center gap-2 px-4 py-2 border-2 border-primary rounded bg-success/80 font-bold hover:bg-success transition"
				>
					<PlusCircle className="h-5 w-auto" />
					{addLabel}
				</button>
			)}
		</div>
	);
}
