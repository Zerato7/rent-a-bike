import { ChevronDown, ChevronUp } from "lucide-react";
import type { ReactNode } from "react";
import type { SortDir } from "../../utils/sortDir";

export interface Column<T> {
	key: keyof T | string;
	header: string;
	headerRender?: () => ReactNode;
	headerClassName?: string;
	sortable?: boolean;
	sortDir?: SortDir;
	onSortToggle?: () => void;
	render?: (row: T, index: number) => ReactNode;
	onClick?: (row: T) => void;
	cellClassName?: string;
}

interface TableProps<T> {
	columns: Column<T>[];
	data: T[];
	emptyMessage?: string;
	page?: number;
	pageSize?: number;
	onPageChange?: (page: number) => void;
}

export function Table<T>({
	columns,
	data,
	emptyMessage = "No data found",
	page,
	pageSize,
	onPageChange
}: TableProps<T>) {
	const hasPagination = 
		page !== undefined && 
		pageSize !== undefined &&
		onPageChange !== undefined;

	const totalPages = pageSize ? Math.ceil(data.length / pageSize) : 0;
	const pageData = hasPagination ? data.slice((page - 1) * pageSize, page * pageSize) : data;

	return (
		<div className="overflow-x-auto">
			<table className="w-full border-collapse border-4 border-success shadow-lg">
				<thead>
					<tr className="bg-success-light">
						{columns.map((col) => (
							<th
								key={col.header}
								className={`
									px-4 py-2
									text-center font-bold text-primary
									border-2 border-success
									${col.headerClassName ?? ""}
								`}
							>
								<div className="flex items-center justify-center gap-1">
									{col.headerRender ? col.headerRender() : col.header}
									{col.sortable && (
										col.sortDir !== "desc" 
											? <ChevronUp onClick={col.onSortToggle} className="h-4 w-auto cursor-pointer text-primary hover:text-primary/80" />
											: <ChevronDown onClick={col.onSortToggle} className="h-4 w-auto cursor-pointer text-primary hover:text-primary/80" />
									)}
								</div>
							</th>
						))}
					</tr>
				</thead>
				<tbody>
					{data.length === 0 ? (
						<tr>
							<td
								colSpan={columns.length}
								className="
									py-6 
									text-center font-semibold 
									text-primary-light bg-primary/50
									border-2 border-success
								"
							>
								{emptyMessage}
							</td>
						</tr>
					) : (
						pageData.map((row, rowIndex) => (
							<tr key={rowIndex} className="bg-primary/50">
								{columns.map((col) => (
									<td
										key={col.key as string}
										onClick={() => col.onClick?.(row)}
										className={`
											px-4 py-3
											text-center font-semibold text-primary-light
											border-2 border-success
											${col.onClick ? "cursor-pointer hover:bg-primary/20" : ""}
											${col.cellClassName ?? ""}
										`}	
									>
										{col.render ? (
											col.render(row, rowIndex)
										) : (
											String(row[col.key as keyof T])
										)}
									</td>
								))}
							</tr>
						))
					)}
				</tbody>
			</table>
			{hasPagination && data.length > 0 && (
				<div className="flex jusitfy-center items-center gap-2 mt-2 text-primary">
					<button
						disabled={page === 1}
						onClick={() => onPageChange(page - 1)}
						className="font-semibold px-3 py-1 rounded bg-primary-light disabled:opacity-50"
					>
						Prev
					</button>
					<span className="font-semibold border border-primary-light px-3 py-1 rounded bg-primary/50 text-primary-light">
						Page {page} of {totalPages}
					</span>
					<button
						disabled={page === totalPages}
						onClick={() => onPageChange(page + 1)}
						className="font-semibold px-3 py-1 rounded bg-primary-light disabled:opacity-50"
					>
						Next
					</button>
				</div>
			)}
		</div>
	);
}
