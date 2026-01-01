import { Loader2 } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { ProjectData } from "@/lib/api";

interface InvestmentDetailRowProps {
    idInvestasi: string;
    loadingDetails: Set<string>;
    detailData: Record<string, ProjectData[]>;
    filterStates: {
        tglMulai: Set<string>;
        tglSelesai: Set<string>;
        kontrakAktif: Set<string>;
    };
}

export function InvestmentDetailRow({
    idInvestasi,
    loadingDetails,
    detailData,
    filterStates
}: InvestmentDetailRowProps) {
    if (loadingDetails.has(idInvestasi)) {
        return (
            <tr>
                <td colSpan={14} className="border border-gray-300 px-4 py-2 text-center text-gray-500 bg-gray-50">
                    <Loader2 className="h-4 w-4 animate-spin inline mr-2" /> Loading details...
                </td>
            </tr>
        );
    }

    const projects = detailData[idInvestasi];

    if (!projects || projects.length === 0) {
        return null; // Or some empty state if desired, but original code just showed nothing if empty array before filtering?
        // Wait, original code checked detailData[id].length > 0
    }

    const filteredDetails = projects.filter(detail => {
        if (filterStates.tglMulai.size > 0 && (!detail.tgl_mulai_kontrak || !filterStates.tglMulai.has(detail.tgl_mulai_kontrak))) return false;
        if (filterStates.tglSelesai.size > 0 && (!detail.tanggal_selesai || !filterStates.tglSelesai.has(detail.tanggal_selesai))) return false;
        if (filterStates.kontrakAktif.size > 0 && (!detail.kontrak_aktif || !filterStates.kontrakAktif.has(detail.kontrak_aktif))) return false;
        return true;
    });

    if (filteredDetails.length === 0) {
        return (
            <tr>
                <td colSpan={14} className="border border-gray-300 px-4 py-2 text-center text-gray-500 bg-gray-50 italic">
                    No details match the selected date filters
                </td>
            </tr>
        );
    }

    return (
        <tr className="bg-sky-50 shadow-inner">
            <td colSpan={14} className="p-0 border border-gray-300">
                <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                        <thead className="bg-[#e0f1ff] text-[#0077b6]">
                            <tr>
                                <th className="px-2 py-1.5 font-semibold text-left w-8">No</th>
                                <th className="px-2 py-1.5 font-semibold text-left">Action Target</th>
                                <th className="px-2 py-1.5 font-semibold text-left">Deskripsi</th>
                                <th className="px-2 py-1.5 font-semibold text-left">PIC</th>
                                <th className="px-2 py-1.5 font-semibold text-left">Judul Kontrak</th>
                                <th className="px-2 py-1.5 font-semibold text-right">Nilai Kontrak</th>
                                <th className="px-2 py-1.5 font-semibold text-left">Vendor</th>
                                <th className="px-2 py-1.5 font-semibold text-center">Tgl Mulai</th>
                                <th className="px-2 py-1.5 font-semibold text-center">Tgl Selesai</th>
                                <th className="px-2 py-1.5 font-semibold text-center">Kontrak Aktif</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredDetails.map((detail, idx) => (
                                <tr key={idx} className="hover:bg-sky-100 transition-colors">
                                    <td className="px-2 py-1.5 text-center text-gray-500">{idx + 1}</td>
                                    <td className="px-2 py-1.5 font-medium text-gray-700">{detail.action_target || "-"}</td>
                                    <td className="px-2 py-1.5 text-gray-600">{detail.head_office_support_desc || "-"}</td>
                                    <td className="px-2 py-1.5 text-gray-600 whitespace-nowrap">{detail.pic || "-"}</td>
                                    <td className="px-2 py-1.5 text-gray-700">{detail.judul_kontrak || "-"}</td>
                                    <td className="px-2 py-1.5 text-right font-medium text-teal-600">
                                        {detail.nilai_kontrak ? formatCurrency(detail.nilai_kontrak) : "-"}
                                    </td>
                                    <td className="px-2 py-1.5 text-gray-600">{detail.penyedia_jasa || "-"}</td>
                                    <td className="px-2 py-1.5 text-center text-gray-600 whitespace-nowrap">
                                        {detail.tgl_mulai_kontrak || "-"}
                                    </td>
                                    <td className="px-2 py-1.5 text-center text-gray-600 whitespace-nowrap">
                                        {detail.tanggal_selesai || "-"}
                                    </td>
                                    <td className="px-2 py-1.5 text-center whitespace-nowrap">
                                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium border ${detail.kontrak_aktif === 'ya'
                                            ? "bg-green-100 text-green-700 border-green-200"
                                            : "bg-red-100 text-red-700 border-red-200"
                                            }`}>
                                            {detail.kontrak_aktif === 'ya' ? 'YA' : 'TIDAK'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </td>
        </tr>
    );
}
