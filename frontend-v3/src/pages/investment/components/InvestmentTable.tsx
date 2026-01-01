import { ExpandedRowData, SortDirection } from "../types";
import { InvestmentTableHeader } from "./InvestmentTableHeader";
import { InvestmentTableRow } from "./InvestmentTableRow";
import { ProjectData } from "@/lib/api";

interface InvestmentTableProps {
    filteredData: ExpandedRowData[];
    // Header props
    columnVisibility: Record<string, boolean>;
    columnWidths: Record<string, number>;
    sortColumn: string | null;
    sortDirection: SortDirection;
    handleSort: (columnId: string) => void;
    handleResizeStart: (e: React.MouseEvent, columnId: string) => void;
    // Row props
    expandedRows: Set<string>;
    toggleExpand: (id: string) => void;
    loadingDetails: Set<string>;
    detailData: Record<string, ProjectData[]>;
    filterStates: {
        tglMulai: Set<string>;
        tglSelesai: Set<string>;
        kontrakAktif: Set<string>;
    };
}

export function InvestmentTable({
    filteredData,
    columnVisibility,
    columnWidths,
    sortColumn,
    sortDirection,
    handleSort,
    handleResizeStart,
    expandedRows,
    toggleExpand,
    loadingDetails,
    detailData,
    filterStates
}: InvestmentTableProps) {
    return (
        <div className="bg-white p-4 space-y-4 rounded-lg shadow-sm">
            {/* Title */}
            <h1 className="text-2xl font-bold text-[#0077b6] underline">
                Pekerjaan Investasi
            </h1>

            {/* Table */}
            <div className="border border-gray-300 overflow-x-auto">
                <table className="w-full border-collapse text-xs">
                    <InvestmentTableHeader
                        columnVisibility={columnVisibility}
                        columnWidths={columnWidths}
                        sortColumn={sortColumn}
                        sortDirection={sortDirection}
                        handleSort={handleSort}
                        handleResizeStart={handleResizeStart}
                    />
                    <tbody>
                        {filteredData.map((row, index) => (
                            <InvestmentTableRow
                                key={row.id}
                                row={row}
                                index={index}
                                columnVisibility={columnVisibility}
                                expandedRows={expandedRows}
                                toggleExpand={toggleExpand}
                                loadingDetails={loadingDetails}
                                detailData={detailData}
                                filterStates={filterStates}
                            />
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
