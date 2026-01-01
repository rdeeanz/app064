import { Fragment } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronRight } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { ExpandedRowData } from "../types";
import { InvestmentDetailRow } from "./InvestmentDetailRow";
import { ProjectData } from "@/lib/api";

interface InvestmentTableRowProps {
    row: ExpandedRowData;
    index: number;
    columnVisibility: Record<string, boolean>;
    expandedRows: Set<string>;
    toggleExpand: (id: string) => void;
    // Detail props
    loadingDetails: Set<string>;
    detailData: Record<string, ProjectData[]>;
    filterStates: {
        tglMulai: Set<string>;
        tglSelesai: Set<string>;
        kontrakAktif: Set<string>;
    };
}

export function InvestmentTableRow({
    row,
    index,
    columnVisibility,
    expandedRows,
    toggleExpand,
    loadingDetails,
    detailData,
    filterStates
}: InvestmentTableRowProps) {
    return (
        <Fragment>
            <tr className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                {/* Blue section cells - id_investasi to rkap */}
                {columnVisibility.id_investasi && (
                    <td className="border border-gray-300 px-2 py-1.5 text-[#0077b6]">
                        {row.id_investasi}
                    </td>
                )}
                {columnVisibility.klaster_regional && (
                    <td className="border border-gray-300 px-2 py-1.5 text-[#0077b6]">
                        {row.klaster_regional}
                    </td>
                )}
                {columnVisibility.entitas_terminal && (
                    <td className="border border-gray-300 px-2 py-1.5 text-[#0077b6]">
                        {row.entitas_terminal}
                    </td>
                )}
                {columnVisibility.type_investasi && (
                    <td className="border border-gray-300 px-2 py-1.5 text-center text-[#0077b6]">
                        {row.type_investasi}
                    </td>
                )}
                {columnVisibility.tahun_usulan && (
                    <td className="border border-gray-300 px-2 py-1.5 text-center text-[#0077b6]">
                        {row.tahun_usulan}
                    </td>
                )}
                {columnVisibility.project_definition && (
                    <td className="border border-gray-300 px-2 py-1.5 text-[#0077b6]">
                        <div className="flex items-start gap-2">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-5 w-5 mt-0.5 p-0 hover:bg-blue-100"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if (row.id_investasi) toggleExpand(row.id_investasi);
                                }}
                            >
                                {row.id_investasi && expandedRows.has(row.id_investasi) ? (
                                    <ChevronDown className="h-4 w-4 text-blue-600" />
                                ) : (
                                    <ChevronRight className="h-4 w-4 text-blue-600" />
                                )}
                            </Button>
                            <span>{row.project_definition}</span>
                        </div>
                    </td>
                )}
                {columnVisibility.status_investasi && (
                    <td className="border border-gray-300 px-2 py-1.5 text-[#0077b6]">
                        {row.status_investasi}
                    </td>
                )}
                {columnVisibility.kebutuhan_dana && (
                    <td className="border border-gray-300 px-2 py-1.5 text-right text-[#0077b6]">
                        {row.kebutuhan_dana !== null ? formatCurrency(row.kebutuhan_dana) : "-"}
                    </td>
                )}
                {columnVisibility.rkap && (
                    <td className="border border-gray-300 px-2 py-1.5 text-right text-[#0077b6]">
                        {row.rkap !== null ? formatCurrency(row.rkap) : "-"}
                    </td>
                )}

                {/* Gray section cells - judul_kontrak to tanggal_selesai */}
                {columnVisibility.judul_kontrak && (
                    <td className="border border-gray-300 px-2 py-1.5 text-gray-700">
                        {row.judul_kontrak || "-"}
                    </td>
                )}
                {columnVisibility.nilai_kontrak && (
                    <td className="border border-gray-300 px-2 py-1.5 text-right text-gray-700">
                        {row.nilai_kontrak !== null ? formatCurrency(row.nilai_kontrak) : "-"}
                    </td>
                )}
                {columnVisibility.vendor && (
                    <td className="border border-gray-300 px-2 py-1.5 text-gray-700">
                        {row.penyedia_jasa || "-"}
                    </td>
                )}
                {columnVisibility.tgl_mulai_kontrak && (
                    <td className="border border-gray-300 px-2 py-1.5 text-center text-gray-700">
                        {row.tgl_mulai_kontrak || "-"}
                    </td>
                )}
                {columnVisibility.tanggal_selesai && (
                    <td className="border border-gray-300 px-2 py-1.5 text-center text-gray-700">
                        {row.tanggal_selesai || "-"}
                    </td>
                )}
            </tr>
            {
                row.id_investasi && expandedRows.has(row.id_investasi) && (
                    <InvestmentDetailRow
                        idInvestasi={row.id_investasi}
                        loadingDetails={loadingDetails}
                        detailData={detailData}
                        filterStates={filterStates}
                    />
                )
            }
        </Fragment>
    );
}
