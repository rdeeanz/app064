import { ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react";
import { SortDirection, SORTABLE_COLUMNS } from "../types";

interface InvestmentTableHeaderProps {
    columnVisibility: Record<string, boolean>;
    columnWidths: Record<string, number>;
    sortColumn: string | null;
    sortDirection: SortDirection;
    handleSort: (columnId: string) => void;
    handleResizeStart: (e: React.MouseEvent, columnId: string) => void;
}

export function InvestmentTableHeader({
    columnVisibility,
    columnWidths,
    sortColumn,
    sortDirection,
    handleSort,
    handleResizeStart
}: InvestmentTableHeaderProps) {
    // Render sort icon helper
    const renderSortIcon = (columnId: string) => {
        if (!SORTABLE_COLUMNS.includes(columnId)) return null;

        if (sortColumn === columnId) {
            if (sortDirection === "asc") {
                return <ArrowUp className="w-3 h-3 ml-1 inline" />;
            } else if (sortDirection === "desc") {
                return <ArrowDown className="w-3 h-3 ml-1 inline" />;
            }
        }
        return <ArrowUpDown className="w-3 h-3 ml-1 inline opacity-50" />;
    };

    return (
        <thead>
            <tr>
                {/* Blue headers - id_investasi to rkap */}
                {columnVisibility.id_investasi && (
                    <th
                        className="bg-[#0077b6] text-white border border-gray-300 px-2 py-2 text-center font-semibold relative cursor-pointer select-none"
                        style={{ width: columnWidths.id_investasi }}
                        onClick={() => handleSort("id_investasi")}
                    >
                        <span>ID INVESTASI {renderSortIcon("id_investasi")}</span>
                        <div
                            className="absolute right-0 top-0 h-full w-1 cursor-col-resize hover:bg-blue-300"
                            onMouseDown={(e) => handleResizeStart(e, "id_investasi")}
                        />
                    </th>
                )}
                {columnVisibility.klaster_regional && (
                    <th
                        className="bg-[#0077b6] text-white border border-gray-300 px-2 py-2 text-center font-semibold relative cursor-pointer select-none"
                        style={{ width: columnWidths.klaster_regional }}
                        onClick={() => handleSort("klaster_regional")}
                    >
                        <span>KLASTER /<br />REGIONAL {renderSortIcon("klaster_regional")}</span>
                        <div
                            className="absolute right-0 top-0 h-full w-1 cursor-col-resize hover:bg-blue-300"
                            onMouseDown={(e) => handleResizeStart(e, "klaster_regional")}
                        />
                    </th>
                )}
                {columnVisibility.entitas_terminal && (
                    <th
                        className="bg-[#0077b6] text-white border border-gray-300 px-2 py-2 text-center font-semibold relative cursor-pointer select-none"
                        style={{ width: columnWidths.entitas_terminal }}
                        onClick={() => handleSort("entitas_terminal")}
                    >
                        <span>ENTITAS /<br />TERMINAL {renderSortIcon("entitas_terminal")}</span>
                        <div
                            className="absolute right-0 top-0 h-full w-1 cursor-col-resize hover:bg-blue-300"
                            onMouseDown={(e) => handleResizeStart(e, "entitas_terminal")}
                        />
                    </th>
                )}
                {columnVisibility.type_investasi && (
                    <th
                        className="bg-[#0077b6] text-white border border-gray-300 px-2 py-2 text-center font-semibold relative select-none"
                        style={{ width: columnWidths.type_investasi }}
                    >
                        <span>TYPE<br />INVEST<br />ASI</span>
                        <div
                            className="absolute right-0 top-0 h-full w-1 cursor-col-resize hover:bg-blue-300"
                            onMouseDown={(e) => handleResizeStart(e, "type_investasi")}
                        />
                    </th>
                )}
                {columnVisibility.tahun_usulan && (
                    <th
                        className="bg-[#0077b6] text-white border border-gray-300 px-2 py-2 text-center font-semibold relative cursor-pointer select-none"
                        style={{ width: columnWidths.tahun_usulan }}
                        onClick={() => handleSort("tahun_usulan")}
                    >
                        <span>TAHUN<br />USULAN {renderSortIcon("tahun_usulan")}</span>
                        <div
                            className="absolute right-0 top-0 h-full w-1 cursor-col-resize hover:bg-blue-300"
                            onMouseDown={(e) => handleResizeStart(e, "tahun_usulan")}
                        />
                    </th>
                )}
                {columnVisibility.project_definition && (
                    <th
                        className="bg-[#0077b6] text-white border border-gray-300 px-2 py-2 text-center font-semibold relative select-none"
                        style={{ width: columnWidths.project_definition }}
                    >
                        <span>PROJECT DEFINITION</span>
                        <div
                            className="absolute right-0 top-0 h-full w-1 cursor-col-resize hover:bg-blue-300"
                            onMouseDown={(e) => handleResizeStart(e, "project_definition")}
                        />
                    </th>
                )}
                {columnVisibility.status_investasi && (
                    <th
                        className="bg-[#0077b6] text-white border border-gray-300 px-2 py-2 text-center font-semibold relative cursor-pointer select-none"
                        style={{ width: columnWidths.status_investasi }}
                        onClick={() => handleSort("status_investasi")}
                    >
                        <span>STATUS<br />INVESTASI {renderSortIcon("status_investasi")}</span>
                        <div
                            className="absolute right-0 top-0 h-full w-1 cursor-col-resize hover:bg-blue-300"
                            onMouseDown={(e) => handleResizeStart(e, "status_investasi")}
                        />
                    </th>
                )}
                {columnVisibility.kebutuhan_dana && (
                    <th
                        className="bg-[#0077b6] text-white border border-gray-300 px-2 py-2 text-center font-semibold relative cursor-pointer select-none"
                        style={{ width: columnWidths.kebutuhan_dana }}
                        onClick={() => handleSort("kebutuhan_dana")}
                    >
                        <span>KEBUTUHAN<br />DANA (Rp) {renderSortIcon("kebutuhan_dana")}</span>
                        <div
                            className="absolute right-0 top-0 h-full w-1 cursor-col-resize hover:bg-blue-300"
                            onMouseDown={(e) => handleResizeStart(e, "kebutuhan_dana")}
                        />
                    </th>
                )}
                {columnVisibility.rkap && (
                    <th
                        className="bg-[#0077b6] text-white border border-gray-300 px-2 py-2 text-center font-semibold relative cursor-pointer select-none"
                        style={{ width: columnWidths.rkap }}
                        onClick={() => handleSort("rkap")}
                    >
                        <span>RKAP<br />(Rp) {renderSortIcon("rkap")}</span>
                        <div
                            className="absolute right-0 top-0 h-full w-1 cursor-col-resize hover:bg-blue-300"
                            onMouseDown={(e) => handleResizeStart(e, "rkap")}
                        />
                    </th>
                )}

                {/* Gray headers - judul_kontrak to tanggal_selesai */}
                {columnVisibility.judul_kontrak && (
                    <th
                        className="bg-[#4a5568] text-white border border-gray-300 px-2 py-2 text-center font-semibold relative select-none"
                        style={{ width: columnWidths.judul_kontrak }}
                    >
                        <span>JUDUL<br />KONTRAK</span>
                        <div
                            className="absolute right-0 top-0 h-full w-1 cursor-col-resize hover:bg-gray-400"
                            onMouseDown={(e) => handleResizeStart(e, "judul_kontrak")}
                        />
                    </th>
                )}
                {columnVisibility.nilai_kontrak && (
                    <th
                        className="bg-[#4a5568] text-white border border-gray-300 px-2 py-2 text-center font-semibold relative select-none"
                        style={{ width: columnWidths.nilai_kontrak }}
                    >
                        <span>NILAI<br />KONTRAK (Rp)</span>
                        <div
                            className="absolute right-0 top-0 h-full w-1 cursor-col-resize hover:bg-gray-400"
                            onMouseDown={(e) => handleResizeStart(e, "nilai_kontrak")}
                        />
                    </th>
                )}
                {columnVisibility.vendor && (
                    <th
                        className="bg-[#4a5568] text-white border border-gray-300 px-2 py-2 text-center font-semibold relative select-none"
                        style={{ width: columnWidths.vendor }}
                    >
                        <span>VENDOR</span>
                        <div
                            className="absolute right-0 top-0 h-full w-1 cursor-col-resize hover:bg-gray-400"
                            onMouseDown={(e) => handleResizeStart(e, "vendor")}
                        />
                    </th>
                )}
                {columnVisibility.tgl_mulai_kontrak && (
                    <th
                        className="bg-[#4a5568] text-white border border-gray-300 px-2 py-2 text-center font-semibold relative select-none"
                        style={{ width: columnWidths.tgl_mulai_kontrak }}
                    >
                        <span>TGL MULAI<br />KONTRAK</span>
                        <div
                            className="absolute right-0 top-0 h-full w-1 cursor-col-resize hover:bg-gray-400"
                            onMouseDown={(e) => handleResizeStart(e, "tgl_mulai_kontrak")}
                        />
                    </th>
                )}
                {columnVisibility.tanggal_selesai && (
                    <th
                        className="bg-[#4a5568] text-white border border-gray-300 px-2 py-2 text-center font-semibold relative select-none"
                        style={{ width: columnWidths.tanggal_selesai }}
                    >
                        <span>TANGGAL<br />SELESAI</span>
                        <div
                            className="absolute right-0 top-0 h-full w-1 cursor-col-resize hover:bg-gray-400"
                            onMouseDown={(e) => handleResizeStart(e, "tanggal_selesai")}
                        />
                    </th>
                )}
            </tr>
        </thead>
    );
}
