import { useState, useEffect, useMemo } from "react";
import { Filter, Eye, X } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

// Types for the investment project data
interface InvestmentProject {
    id: number;
    klaster_regional: string;
    entitas_terminal: string;
    type_investasi: string;
    tahun_usulan: number;
    project_definition: string;
    status_investasi: string;
    kebutuhan_dana: number | null;
    rkap: number | null;
    nilai_kontrak: number | null;
    realisasi_sd: number | null;
    realisasi_persen: number | null;
    taksasi_2025: number | null;
    vendor: string | null;
}

// Column visibility options
const COLUMN_VISIBILITY_OPTIONS = [
    { id: "klaster_regional", label: "Klaster/Regional" },
    { id: "entitas_terminal", label: "Entitas/Terminal" },
    { id: "type_investasi", label: "Type Investasi" },
    { id: "tahun_usulan", label: "Tahun Usulan" },
    { id: "project_definition", label: "Project Definition" },
    { id: "status_investasi", label: "Status Investasi" },
    { id: "kebutuhan_dana", label: "Kebutuhan Dana" },
    { id: "rkap", label: "RKAP" },
    { id: "nilai_kontrak", label: "Nilai Kontrak" },
    { id: "realisasi_sd", label: "Realisasi S.D" },
    { id: "taksasi_2025", label: "Taksasi 2025" },
    { id: "vendor", label: "Vendor" },
];

// Mock data based on the screenshot
const MOCK_DATA: InvestmentProject[] = [
    {
        id: 1,
        klaster_regional: "HeadOffice",
        entitas_terminal: "Unit Pengelola Proyek NPEA",
        type_investasi: "Multi Year",
        tahun_usulan: 2018,
        project_definition: "Pembangunan Jalan Akses Timur Pelabuhan Kalibaru",
        status_investasi: "Pelaksanaan Fisik",
        kebutuhan_dana: null,
        rkap: 107202004.0,
        nilai_kontrak: null,
        realisasi_sd: null,
        realisasi_persen: 7,
        taksasi_2025: 1039831633,
        vendor: "Seksi 1: KSO (HK & Abipraya)",
    },
    {
        id: 2,
        klaster_regional: "Regional 2",
        entitas_terminal: "Terminal Petikemas Surabaya",
        type_investasi: "Single Year",
        tahun_usulan: 2024,
        project_definition: "Pengadaan Crane Container",
        status_investasi: "Perencanaan",
        kebutuhan_dana: 50000000000,
        rkap: 45000000000,
        nilai_kontrak: null,
        realisasi_sd: 5000000000,
        realisasi_persen: 11,
        taksasi_2025: 40000000000,
        vendor: null,
    },
    {
        id: 3,
        klaster_regional: "Regional 1",
        entitas_terminal: "Pelabuhan Tanjung Priok",
        type_investasi: "Multi Year",
        tahun_usulan: 2022,
        project_definition: "Pembangunan Dermaga 300",
        status_investasi: "Lelang",
        kebutuhan_dana: 120000000000,
        rkap: 80000000000,
        nilai_kontrak: 75000000000,
        realisasi_sd: 15000000000,
        realisasi_persen: 20,
        taksasi_2025: 65000000000,
        vendor: "PT Wijaya Karya",
    },
    {
        id: 4,
        klaster_regional: "Regional 3",
        entitas_terminal: "Pelabuhan Makassar",
        type_investasi: "Single Year",
        tahun_usulan: 2025,
        project_definition: "Renovasi Gedung Terminal Penumpang",
        status_investasi: "Persiapan",
        kebutuhan_dana: 25000000000,
        rkap: 25000000000,
        nilai_kontrak: null,
        realisasi_sd: null,
        realisasi_persen: 0,
        taksasi_2025: 20000000000,
        vendor: null,
    },
    {
        id: 5,
        klaster_regional: "HeadOffice",
        entitas_terminal: "Divisi TI",
        type_investasi: "Single Year",
        tahun_usulan: 2024,
        project_definition: "Implementasi Sistem ERP Terintegrasi",
        status_investasi: "Pelaksanaan",
        kebutuhan_dana: 15000000000,
        rkap: 15000000000,
        nilai_kontrak: 14500000000,
        realisasi_sd: 10000000000,
        realisasi_persen: 69,
        taksasi_2025: 14000000000,
        vendor: "SAP Indonesia",
    },
];

// Format currency
const formatCurrency = (value: number | null): string => {
    if (value === null || value === undefined) return "-";
    return value.toLocaleString("id-ID", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
};

// Format percentage
const formatPercent = (value: number | null): string => {
    if (value === null || value === undefined) return "-";
    return `${value}%`;
};

export default function InvestmentProject() {
    const [data, setData] = useState<InvestmentProject[]>([]);
    const [loading, setLoading] = useState(true);

    // Filter states
    const [filterKlaster, setFilterKlaster] = useState("all");
    const [filterEntitas, setFilterEntitas] = useState("all");
    const [filterType, setFilterType] = useState("all");
    const [filterTahun, setFilterTahun] = useState("all");
    const [filterStatus, setFilterStatus] = useState("all");

    // Column visibility state
    const [columnVisibility, setColumnVisibility] = useState<Record<string, boolean>>(() => {
        const initial: Record<string, boolean> = {};
        COLUMN_VISIBILITY_OPTIONS.forEach(opt => {
            initial[opt.id] = true;
        });
        return initial;
    });

    useEffect(() => {
        // Simulate API call
        setTimeout(() => {
            setData(MOCK_DATA);
            setLoading(false);
        }, 500);
    }, []);

    // Generate filter options from data
    const filterOptions = useMemo(() => {
        const klaster = [...new Set(data.map(d => d.klaster_regional))].filter(Boolean);
        const entitas = [...new Set(data.map(d => d.entitas_terminal))].filter(Boolean);
        const types = [...new Set(data.map(d => d.type_investasi))].filter(Boolean);
        const tahun = [...new Set(data.map(d => d.tahun_usulan))].filter(Boolean).sort((a, b) => b - a);
        const status = [...new Set(data.map(d => d.status_investasi))].filter(Boolean);
        return { klaster, entitas, types, tahun, status };
    }, [data]);

    // Filtered data
    const filteredData = useMemo(() => {
        return data.filter(row => {
            if (filterKlaster !== "all" && row.klaster_regional !== filterKlaster) return false;
            if (filterEntitas !== "all" && row.entitas_terminal !== filterEntitas) return false;
            if (filterType !== "all" && row.type_investasi !== filterType) return false;
            if (filterTahun !== "all" && row.tahun_usulan.toString() !== filterTahun) return false;
            if (filterStatus !== "all" && row.status_investasi !== filterStatus) return false;
            return true;
        });
    }, [data, filterKlaster, filterEntitas, filterType, filterTahun, filterStatus]);

    const clearFilters = () => {
        setFilterKlaster("all");
        setFilterEntitas("all");
        setFilterType("all");
        setFilterTahun("all");
        setFilterStatus("all");
    };

    const toggleColumnVisibility = (columnId: string) => {
        setColumnVisibility(prev => ({
            ...prev,
            [columnId]: !prev[columnId]
        }));
    };

    const hasActiveFilters = filterKlaster !== "all" || filterEntitas !== "all" ||
        filterType !== "all" || filterTahun !== "all" || filterStatus !== "all";

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            {/* Dark Header Area with Filters and Checkbox View */}
            <div className="bg-slate-800 dark:bg-slate-900 p-4 space-y-3 -mx-4 md:-mx-6 lg:-mx-8 -mt-4 md:-mt-6 lg:-mt-8 mb-4">
                {/* Filter Section */}
                <div className="flex flex-wrap items-center gap-2 px-3 py-2 bg-slate-700/50 rounded-lg">
                    <Filter className="h-4 w-4 text-slate-300" />
                    <span className="text-sm font-medium text-slate-300">Filter:</span>

                    <Select value={filterKlaster} onValueChange={setFilterKlaster}>
                        <SelectTrigger className="w-[140px] h-8 text-xs bg-slate-600 border-slate-500 text-white">
                            <SelectValue placeholder="Klaster/Regional" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Semua Klaster</SelectItem>
                            {filterOptions.klaster.map((k) => (
                                <SelectItem key={k} value={k}>{k}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select value={filterEntitas} onValueChange={setFilterEntitas}>
                        <SelectTrigger className="w-[160px] h-8 text-xs bg-slate-600 border-slate-500 text-white">
                            <SelectValue placeholder="Entitas/Terminal" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Semua Entitas</SelectItem>
                            {filterOptions.entitas.map((e) => (
                                <SelectItem key={e} value={e}>{e}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select value={filterType} onValueChange={setFilterType}>
                        <SelectTrigger className="w-[130px] h-8 text-xs bg-slate-600 border-slate-500 text-white">
                            <SelectValue placeholder="Type Investasi" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Semua Type</SelectItem>
                            {filterOptions.types.map((t) => (
                                <SelectItem key={t} value={t}>{t}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select value={filterTahun} onValueChange={setFilterTahun}>
                        <SelectTrigger className="w-[120px] h-8 text-xs bg-slate-600 border-slate-500 text-white">
                            <SelectValue placeholder="Tahun Usulan" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Semua Tahun</SelectItem>
                            {filterOptions.tahun.map((t) => (
                                <SelectItem key={t} value={t.toString()}>{t}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select value={filterStatus} onValueChange={setFilterStatus}>
                        <SelectTrigger className="w-[150px] h-8 text-xs bg-slate-600 border-slate-500 text-white">
                            <SelectValue placeholder="Status Investasi" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Semua Status</SelectItem>
                            {filterOptions.status.map((s) => (
                                <SelectItem key={s} value={s}>{s}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    {hasActiveFilters && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={clearFilters}
                            className="h-8 px-2 text-xs gap-1 text-slate-300 hover:text-white hover:bg-slate-600"
                        >
                            <X className="h-3 w-3" />
                            Clear
                        </Button>
                    )}

                    <span className="ml-auto text-xs text-slate-400">
                        {filteredData.length} dari {data.length} item
                    </span>
                </div>

                {/* Column Visibility Section */}
                <div className="flex flex-wrap items-center gap-3 px-3 py-2 bg-slate-700/50 rounded-lg">
                    <Eye className="h-4 w-4 text-slate-300" />
                    <span className="text-sm font-medium text-slate-300">Tampilkan Kolom:</span>

                    {COLUMN_VISIBILITY_OPTIONS.map((option) => (
                        <div key={option.id} className="flex items-center gap-1.5">
                            <Checkbox
                                id={`col-${option.id}`}
                                checked={columnVisibility[option.id] !== false}
                                onCheckedChange={() => toggleColumnVisibility(option.id)}
                                className="border-slate-400 data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
                            />
                            <Label
                                htmlFor={`col-${option.id}`}
                                className="text-xs cursor-pointer text-slate-300"
                            >
                                {option.label}
                            </Label>
                        </div>
                    ))}
                </div>
            </div>

            {/* White Content Section - Pekerjaan Investasi */}
            <div className="bg-white p-4 space-y-4 rounded-lg shadow-sm">
                {/* Title */}
                <h1 className="text-2xl font-bold text-[#0077b6] underline">
                    Pekerjaan Investasi
                </h1>

                {/* Table */}
                <div className="border border-gray-300 overflow-x-auto">
                    <table className="w-full border-collapse text-xs">
                        <thead>
                            <tr>
                                {/* Blue headers */}
                                {columnVisibility.klaster_regional && (
                                    <th className="bg-[#0077b6] text-white border border-gray-300 px-2 py-2 text-center font-semibold min-w-[80px]">
                                        KLASTER /<br />REGIONAL
                                    </th>
                                )}
                                {columnVisibility.entitas_terminal && (
                                    <th className="bg-[#0077b6] text-white border border-gray-300 px-2 py-2 text-center font-semibold min-w-[100px]">
                                        ENTITAS /<br />TERMINAL
                                    </th>
                                )}
                                {columnVisibility.type_investasi && (
                                    <th className="bg-[#0077b6] text-white border border-gray-300 px-2 py-2 text-center font-semibold min-w-[60px]">
                                        TYPE<br />INVEST<br />ASI
                                    </th>
                                )}
                                {columnVisibility.tahun_usulan && (
                                    <th className="bg-[#0077b6] text-white border border-gray-300 px-2 py-2 text-center font-semibold min-w-[50px]">
                                        TAHUN<br />USULAN
                                    </th>
                                )}
                                {columnVisibility.project_definition && (
                                    <th className="bg-[#0077b6] text-white border border-gray-300 px-2 py-2 text-center font-semibold min-w-[200px]">
                                        PROJECT DEFINITION
                                    </th>
                                )}

                                {/* Orange headers */}
                                {columnVisibility.status_investasi && (
                                    <th className="bg-[#e85d04] text-white border border-gray-300 px-2 py-2 text-center font-semibold min-w-[80px]">
                                        STATUS<br />INVESTASI
                                    </th>
                                )}
                                {columnVisibility.kebutuhan_dana && (
                                    <th className="bg-[#e85d04] text-white border border-gray-300 px-2 py-2 text-center font-semibold min-w-[100px]">
                                        KEBUTUHAN<br />DANA (Rp)
                                    </th>
                                )}
                                {columnVisibility.rkap && (
                                    <th className="bg-[#e85d04] text-white border border-gray-300 px-2 py-2 text-center font-semibold min-w-[100px]">
                                        RKAP<br />(Rp)
                                    </th>
                                )}
                                {columnVisibility.nilai_kontrak && (
                                    <th className="bg-[#e85d04] text-white border border-gray-300 px-2 py-2 text-center font-semibold min-w-[100px]">
                                        NILAI<br />KONTRAK (Rp)
                                    </th>
                                )}

                                {/* Brown header */}
                                {columnVisibility.realisasi_sd && (
                                    <th className="bg-[#9a6324] text-white border border-gray-300 px-2 py-2 text-center font-semibold min-w-[100px]">
                                        REALISASI S.D<br />November 2025
                                    </th>
                                )}

                                {/* Green headers */}
                                {columnVisibility.taksasi_2025 && (
                                    <th className="bg-[#2e8b57] text-white border border-gray-300 px-2 py-2 text-center font-semibold min-w-[100px]">
                                        TAKSASI 2025
                                    </th>
                                )}
                                {columnVisibility.vendor && (
                                    <th className="bg-[#2e8b57] text-white border border-gray-300 px-2 py-2 text-center font-semibold min-w-[120px]">
                                        VENDOR
                                    </th>
                                )}
                            </tr>
                        </thead>
                        <tbody>
                            {filteredData.map((row, index) => (
                                <tr key={row.id} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                                    {/* Blue section cells */}
                                    {columnVisibility.klaster_regional && (
                                        <td className="border border-gray-300 px-2 py-1.5 text-[#0077b6] underline decoration-dotted">
                                            {row.klaster_regional}
                                        </td>
                                    )}
                                    {columnVisibility.entitas_terminal && (
                                        <td className="border border-gray-300 px-2 py-1.5 text-[#0077b6] underline decoration-dotted">
                                            {row.entitas_terminal}
                                        </td>
                                    )}
                                    {columnVisibility.type_investasi && (
                                        <td className="border border-gray-300 px-2 py-1.5 text-center">
                                            {row.type_investasi}
                                        </td>
                                    )}
                                    {columnVisibility.tahun_usulan && (
                                        <td className="border border-gray-300 px-2 py-1.5 text-center">
                                            {row.tahun_usulan}
                                        </td>
                                    )}
                                    {columnVisibility.project_definition && (
                                        <td className="border border-gray-300 px-2 py-1.5 text-[#0077b6] underline decoration-dotted">
                                            {row.project_definition}
                                        </td>
                                    )}

                                    {/* Orange section cells */}
                                    {columnVisibility.status_investasi && (
                                        <td className="border border-gray-300 px-2 py-1.5 text-[#0077b6] underline decoration-dotted">
                                            {row.status_investasi}
                                        </td>
                                    )}
                                    {columnVisibility.kebutuhan_dana && (
                                        <td className="border border-gray-300 px-2 py-1.5 text-right">
                                            {formatCurrency(row.kebutuhan_dana)}
                                        </td>
                                    )}
                                    {columnVisibility.rkap && (
                                        <td className="border border-gray-300 px-2 py-1.5 text-right">
                                            {formatCurrency(row.rkap)}
                                        </td>
                                    )}
                                    {columnVisibility.nilai_kontrak && (
                                        <td className="border border-gray-300 px-2 py-1.5 text-right">
                                            {formatCurrency(row.nilai_kontrak)}
                                        </td>
                                    )}

                                    {/* Brown section cell */}
                                    {columnVisibility.realisasi_sd && (
                                        <td className="border border-gray-300 px-2 py-1.5 text-right">
                                            {row.realisasi_sd !== null || row.realisasi_persen !== null ? (
                                                <span>{formatPercent(row.realisasi_persen)}</span>
                                            ) : (
                                                "-"
                                            )}
                                        </td>
                                    )}

                                    {/* Green section cells */}
                                    {columnVisibility.taksasi_2025 && (
                                        <td className="border border-gray-300 px-2 py-1.5 text-right">
                                            {formatCurrency(row.taksasi_2025)}
                                        </td>
                                    )}
                                    {columnVisibility.vendor && (
                                        <td className="border border-gray-300 px-2 py-1.5 text-[#e85d04]">
                                            {row.vendor || "-"}
                                        </td>
                                    )}
                                </tr>
                            ))}

                            {/* Show message if no data */}
                            {filteredData.length === 0 && (
                                <tr>
                                    <td colSpan={12} className="border border-gray-300 px-4 py-8 text-center text-gray-500">
                                        Tidak ada data yang sesuai dengan filter
                                    </td>
                                </tr>
                            )}

                            {/* Empty rows to fill the table */}
                            {filteredData.length > 0 && Array.from({ length: Math.max(0, 8 - filteredData.length) }).map((_, i) => (
                                <tr key={`empty-${i}`} className={((filteredData.length + i) % 2 === 0) ? "bg-white" : "bg-gray-50"}>
                                    {columnVisibility.klaster_regional && <td className="border border-gray-300 px-2 py-1.5 h-8">&nbsp;</td>}
                                    {columnVisibility.entitas_terminal && <td className="border border-gray-300 px-2 py-1.5">&nbsp;</td>}
                                    {columnVisibility.type_investasi && <td className="border border-gray-300 px-2 py-1.5">&nbsp;</td>}
                                    {columnVisibility.tahun_usulan && <td className="border border-gray-300 px-2 py-1.5">&nbsp;</td>}
                                    {columnVisibility.project_definition && <td className="border border-gray-300 px-2 py-1.5">&nbsp;</td>}
                                    {columnVisibility.status_investasi && <td className="border border-gray-300 px-2 py-1.5">&nbsp;</td>}
                                    {columnVisibility.kebutuhan_dana && <td className="border border-gray-300 px-2 py-1.5">&nbsp;</td>}
                                    {columnVisibility.rkap && <td className="border border-gray-300 px-2 py-1.5">&nbsp;</td>}
                                    {columnVisibility.nilai_kontrak && <td className="border border-gray-300 px-2 py-1.5">&nbsp;</td>}
                                    {columnVisibility.realisasi_sd && <td className="border border-gray-300 px-2 py-1.5">&nbsp;</td>}
                                    {columnVisibility.taksasi_2025 && <td className="border border-gray-300 px-2 py-1.5">&nbsp;</td>}
                                    {columnVisibility.vendor && <td className="border border-gray-300 px-2 py-1.5">&nbsp;</td>}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
