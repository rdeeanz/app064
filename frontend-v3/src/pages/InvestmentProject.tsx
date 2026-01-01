import { useState, useMemo, useRef, useCallback, Fragment, useEffect } from "react";
import {
    Filter,
    Eye,
    X,
    Loader2,
    AlertCircle,
    RefreshCw,
    ArrowUpDown,
    ArrowUp,
    ArrowDown,
    ChevronDown,
    ChevronRight,
} from "lucide-react";
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
import { useMonitorData } from "@/hooks/useMonitorData";
import { formatCurrency } from "@/lib/utils";
import { getProjectsByInvestasi, ProjectData, getFilterOptions } from "@/lib/api";
import { MultiSelectFilter } from "@/components/MultiSelectFilter";

// Column visibility options
const COLUMN_VISIBILITY_OPTIONS = [
    { id: "id_investasi", label: "ID Investasi" },
    { id: "klaster_regional", label: "Klaster/Regional" },
    { id: "entitas_terminal", label: "Entitas/Terminal" },
    { id: "type_investasi", label: "Type Investasi" },
    { id: "tahun_usulan", label: "Tahun Usulan" },
    { id: "project_definition", label: "Project Definition" },
    { id: "status_investasi", label: "Status Investasi" },
    { id: "kebutuhan_dana", label: "Kebutuhan Dana" },
    { id: "rkap", label: "RKAP" },
    { id: "judul_kontrak", label: "Judul Kontrak" },
    { id: "nilai_kontrak", label: "Nilai Kontrak" },
    { id: "vendor", label: "Vendor" },
    { id: "tgl_mulai_kontrak", label: "Tgl Mulai Kontrak" },
    { id: "tanggal_selesai", label: "Tanggal Selesai" },
];

// Sortable columns
const SORTABLE_COLUMNS = ["id_investasi", "klaster_regional", "entitas_terminal", "tahun_usulan", "status_investasi", "kebutuhan_dana", "rkap"];

// Initial column widths
const INITIAL_COLUMN_WIDTHS: Record<string, number> = {
    id_investasi: 120,
    klaster_regional: 100,
    entitas_terminal: 120,
    type_investasi: 80,
    tahun_usulan: 70,
    project_definition: 220,
    status_investasi: 100,
    kebutuhan_dana: 120,
    rkap: 120,
    judul_kontrak: 180,
    nilai_kontrak: 120,
    vendor: 150,
    tgl_mulai_kontrak: 120,
    tanggal_selesai: 120,
};

type SortDirection = "asc" | "desc" | null;

export default function InvestmentProject() {
    // Fetch data from view_monitor_invest
    const { data: rawData, isLoading, error, refetch } = useMonitorData();

    // Filter states
    const [filterKlaster, setFilterKlaster] = useState("all");
    const [filterEntitas, setFilterEntitas] = useState("all");
    const [filterType, setFilterType] = useState("all");
    const [filterTahun, setFilterTahun] = useState("all");
    const [filterStatus, setFilterStatus] = useState("all");
    const [filterTglMulai, setFilterTglMulai] = useState<Set<string>>(new Set());
    const [filterTglSelesai, setFilterTglSelesai] = useState<Set<string>>(new Set());
    const [filterKontrakAktif, setFilterKontrakAktif] = useState<Set<string>>(new Set());
    const [backendDateOptions, setBackendDateOptions] = useState<{ tglMulai: string[], tglSelesai: string[], kontrakAktif: string[] }>({ tglMulai: [], tglSelesai: [], kontrakAktif: [] });

    // Sort state
    const [sortColumn, setSortColumn] = useState<string | null>(null);
    const [sortDirection, setSortDirection] = useState<SortDirection>(null);

    // Column widths state
    const [columnWidths, setColumnWidths] = useState<Record<string, number>>(INITIAL_COLUMN_WIDTHS);

    // Resize state
    const resizingColumn = useRef<string | null>(null);
    const startX = useRef<number>(0);
    const startWidth = useRef<number>(0);

    // Column visibility state
    const [columnVisibility, setColumnVisibility] = useState<Record<string, boolean>>(() => {
        const initial: Record<string, boolean> = {};
        COLUMN_VISIBILITY_OPTIONS.forEach(opt => {
            initial[opt.id] = true;
        });
        return initial;
    });

    // Fetch filter options
    useEffect(() => {
        const fetchOptions = async () => {
            try {
                const options = await getFilterOptions();
                setBackendDateOptions({
                    tglMulai: options.tgl_mulai_options,
                    tglSelesai: options.tgl_selesai_options,
                    kontrakAktif: options.kontrak_aktif_options
                });
            } catch (err) {
                console.error("Failed to fetch filter options", err);
            }
        };
        fetchOptions();
    }, []);

    // Expand state
    const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
    const [detailData, setDetailData] = useState<Record<string, ProjectData[]>>({});
    const [loadingDetails, setLoadingDetails] = useState<Set<string>>(new Set());

    const toggleExpand = async (idInvestasi: string) => {
        const newExpanded = new Set(expandedRows);
        if (newExpanded.has(idInvestasi)) {
            newExpanded.delete(idInvestasi);
        } else {
            newExpanded.add(idInvestasi);
            // Fetch data if not already present
            if (!detailData[idInvestasi]) {
                setLoadingDetails(prev => new Set(prev).add(idInvestasi));
                try {
                    const projects = await getProjectsByInvestasi(idInvestasi);
                    setDetailData(prev => ({
                        ...prev,
                        [idInvestasi]: projects
                    }));
                } catch (error) {
                    console.error("Failed to fetch project details:", error);
                } finally {
                    setLoadingDetails(prev => {
                        const next = new Set(prev);
                        next.delete(idInvestasi);
                        return next;
                    });
                }
            }
        }
        setExpandedRows(newExpanded);
    };

    // Handle sort click
    const handleSort = useCallback((columnId: string) => {
        if (!SORTABLE_COLUMNS.includes(columnId)) return;

        if (sortColumn === columnId) {
            if (sortDirection === "asc") {
                setSortDirection("desc");
            } else if (sortDirection === "desc") {
                setSortColumn(null);
                setSortDirection(null);
            } else {
                setSortDirection("asc");
            }
        } else {
            setSortColumn(columnId);
            setSortDirection("asc");
        }
    }, [sortColumn, sortDirection]);

    // Handle column resize start
    const handleResizeStart = useCallback((e: React.MouseEvent, columnId: string) => {
        e.preventDefault();
        e.stopPropagation();
        resizingColumn.current = columnId;
        startX.current = e.clientX;
        startWidth.current = columnWidths[columnId] || 100;

        document.addEventListener("mousemove", handleResizeMove);
        document.addEventListener("mouseup", handleResizeEnd);
    }, [columnWidths]);

    // Handle column resize move
    const handleResizeMove = useCallback((e: MouseEvent) => {
        if (!resizingColumn.current) return;

        const diff = e.clientX - startX.current;
        const newWidth = Math.max(50, startWidth.current + diff);

        setColumnWidths(prev => ({
            ...prev,
            [resizingColumn.current!]: newWidth
        }));
    }, []);

    // Handle column resize end
    const handleResizeEnd = useCallback(() => {
        resizingColumn.current = null;
        document.removeEventListener("mousemove", handleResizeMove);
        document.removeEventListener("mouseup", handleResizeEnd);
    }, [handleResizeMove]);

    // Render sort icon
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

    // Transform API data to table format
    // Data from view_monitor_invest: original_id_investasi, klaster_regional, entitas_terminal, type_investasi, 
    // tahun_usulan, project_definition, status_investasi, kebutuhan_dana, rkap
    // Also includes: judul_kontrak, nilai_kontrak, penyedia_jasa, tgl_mulai_kontrak, tanggal_selesai
    const data = useMemo(() => {
        return rawData.map((item, index) => ({
            id: index + 1,
            id_investasi: item.original_id_investasi,  // Using original_id_investasi from view_monitor_invest
            klaster_regional: item.klaster_regional || "",
            entitas_terminal: item.entitas_terminal || "",
            type_investasi: item.type_investasi || "",
            tahun_usulan: item.tahun_usulan || 0,
            project_definition: item.project_definition || "",
            status_investasi: item.status_investasi || "",
            kebutuhan_dana: item.kebutuhan_dana,
            rkap: item.rkap,
            judul_kontrak: item.judul_kontrak,
            nilai_kontrak: item.nilai_kontrak,
            penyedia_jasa: item.penyedia_jasa,
            tgl_mulai_kontrak: item.tgl_mulai_kontrak,
            tanggal_selesai: item.tanggal_selesai,
        }));
    }, [rawData]);

    // Generate filter options from data
    const filterOptions = useMemo(() => {
        const klaster = [...new Set(data.map(d => d.klaster_regional))].filter(Boolean);
        const entitas = [...new Set(data.map(d => d.entitas_terminal))].filter(Boolean);
        const types = [...new Set(data.map(d => d.type_investasi))].filter(Boolean);
        const tahun = [...new Set(data.map(d => d.tahun_usulan))].filter(Boolean).sort((a, b) => b - a);
        const status = [...new Set(data.map(d => d.status_investasi))].filter(Boolean);
        return {
            klaster,
            entitas,
            types,
            tahun,
            status,
            tglMulai: backendDateOptions.tglMulai,
            tglSelesai: backendDateOptions.tglSelesai,
            kontrakAktif: backendDateOptions.kontrakAktif
        };
    }, [data, backendDateOptions]);

    // Filtered and sorted data
    const filteredData = useMemo(() => {
        let result = data.filter(row => {
            if (filterKlaster !== "all" && row.klaster_regional !== filterKlaster) return false;
            if (filterEntitas !== "all" && row.entitas_terminal !== filterEntitas) return false;
            if (filterType !== "all" && row.type_investasi !== filterType) return false;
            if (filterTahun !== "all" && row.tahun_usulan.toString() !== filterTahun) return false;
            if (filterTahun !== "all" && row.tahun_usulan.toString() !== filterTahun) return false;
            if (filterStatus !== "all" && row.status_investasi !== filterStatus) return false;
            return true;
        });

        // Apply sorting
        if (sortColumn && sortDirection) {
            result = [...result].sort((a, b) => {
                const aVal = a[sortColumn as keyof typeof a];
                const bVal = b[sortColumn as keyof typeof b];

                if (aVal === null || aVal === undefined) return 1;
                if (bVal === null || bVal === undefined) return -1;

                if (typeof aVal === "number" && typeof bVal === "number") {
                    return sortDirection === "asc" ? aVal - bVal : bVal - aVal;
                }

                const aStr = String(aVal).toLowerCase();
                const bStr = String(bVal).toLowerCase();
                return sortDirection === "asc"
                    ? aStr.localeCompare(bStr)
                    : bStr.localeCompare(aStr);
            });
        }

        return result;
    }, [data, filterKlaster, filterEntitas, filterType, filterTahun, filterStatus, sortColumn, sortDirection]);

    const clearFilters = () => {
        setFilterKlaster("all");
        setFilterEntitas("all");
        setFilterType("all");
        setFilterTahun("all");
        setFilterStatus("all");
        setFilterTglMulai(new Set());
        setFilterTglSelesai(new Set());
        setFilterKontrakAktif(new Set());
    };

    const hasActiveFilters =
        filterKlaster !== "all" ||
        filterEntitas !== "all" ||
        filterType !== "all" ||
        filterTahun !== "all" ||
        filterStatus !== "all" ||
        filterTglMulai.size > 0 ||
        filterTglSelesai.size > 0 ||
        filterKontrakAktif.size > 0;

    const toggleColumnVisibility = (columnId: string) => {
        setColumnVisibility(prev => ({
            ...prev,
            [columnId]: !prev[columnId]
        }));
    };



    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
                <AlertCircle className="h-12 w-12 text-destructive" />
                <p className="text-destructive font-medium">Error: {error}</p>
                <Button onClick={refetch} variant="outline" size="sm">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Coba Lagi
                </Button>
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

                    <MultiSelectFilter
                        title="Tgl Mulai"
                        options={filterOptions.tglMulai}
                        selectedValues={filterTglMulai}
                        onChange={setFilterTglMulai}
                        placeholder="Cari Tanggal..."
                    />

                    <MultiSelectFilter
                        title="Tgl Selesai"
                        options={filterOptions.tglSelesai}
                        selectedValues={filterTglSelesai}
                        onChange={setFilterTglSelesai}
                        placeholder="Cari Tanggal..."
                    />

                    <MultiSelectFilter
                        title="Kontrak Aktif"
                        options={filterOptions.kontrakAktif}
                        selectedValues={filterKontrakAktif}
                        onChange={setFilterKontrakAktif}
                        placeholder="Cari Status..."
                    />

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
                        <tbody>
                            {filteredData.map((row, index) => (
                                <Fragment key={row.id}>
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
                                                            toggleExpand(row.id_investasi);
                                                        }}
                                                    >
                                                        {expandedRows.has(row.id_investasi) ? (
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
                                                {formatCurrency(row.kebutuhan_dana)}
                                            </td>
                                        )}
                                        {columnVisibility.rkap && (
                                            <td className="border border-gray-300 px-2 py-1.5 text-right text-[#0077b6]">
                                                {formatCurrency(row.rkap)}
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
                                                {formatCurrency(row.nilai_kontrak)}
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
                                        expandedRows.has(row.id_investasi) && (
                                            <>
                                                {loadingDetails.has(row.id_investasi) ? (
                                                    <tr>
                                                        <td colSpan={14} className="border border-gray-300 px-4 py-2 text-center text-gray-500 bg-gray-50">
                                                            <Loader2 className="h-4 w-4 animate-spin inline mr-2" /> Loading details...
                                                        </td>
                                                    </tr>
                                                ) : detailData[row.id_investasi]?.length > 0 ? (
                                                    (() => {
                                                        const filteredDetails = detailData[row.id_investasi].filter(detail => {
                                                            if (filterTglMulai.size > 0 && (!detail.tgl_mulai_kontrak || !filterTglMulai.has(detail.tgl_mulai_kontrak))) return false;
                                                            if (filterTglSelesai.size > 0 && (!detail.tanggal_selesai || !filterTglSelesai.has(detail.tanggal_selesai))) return false;
                                                            if (filterKontrakAktif.size > 0 && (!detail.kontrak_aktif || !filterKontrakAktif.has(detail.kontrak_aktif))) return false;
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

                                                        return filteredDetails.map((detail, detailIndex) => (
                                                            <tr key={`detail-${row.id}-${detailIndex}`} className="bg-blue-50/30">
                                                                {columnVisibility.id_investasi && <td className="border border-gray-300 px-2 py-1.5"></td>}
                                                                {columnVisibility.klaster_regional && <td className="border border-gray-300 px-2 py-1.5"></td>}
                                                                {columnVisibility.entitas_terminal && <td className="border border-gray-300 px-2 py-1.5"></td>}
                                                                {columnVisibility.type_investasi && <td className="border border-gray-300 px-2 py-1.5"></td>}
                                                                {columnVisibility.tahun_usulan && <td className="border border-gray-300 px-2 py-1.5"></td>}
                                                                {columnVisibility.project_definition && <td className="border border-gray-300 px-2 py-1.5"></td>}
                                                                {columnVisibility.status_investasi && <td className="border border-gray-300 px-2 py-1.5"></td>}
                                                                {columnVisibility.kebutuhan_dana && <td className="border border-gray-300 px-2 py-1.5"></td>}
                                                                {columnVisibility.rkap && <td className="border border-gray-300 px-2 py-1.5"></td>}

                                                                {/* Detail Columns */}
                                                                {columnVisibility.judul_kontrak && (
                                                                    <td className="border border-gray-300 px-2 py-1.5 text-gray-700 text-xs pl-6 relative">
                                                                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-400"></div>
                                                                        {detail.judul_kontrak || "-"}
                                                                    </td>
                                                                )}
                                                                {columnVisibility.nilai_kontrak && (
                                                                    <td className="border border-gray-300 px-2 py-1.5 text-right text-gray-700 text-xs">
                                                                        {formatCurrency(detail.nilai_kontrak)}
                                                                    </td>
                                                                )}
                                                                {columnVisibility.vendor && (
                                                                    <td className="border border-gray-300 px-2 py-1.5 text-gray-700 text-xs">
                                                                        {detail.penyedia_jasa || "-"}
                                                                    </td>
                                                                )}
                                                                {columnVisibility.tgl_mulai_kontrak && (
                                                                    <td className="border border-gray-300 px-2 py-1.5 text-center text-gray-700 text-xs">
                                                                        {detail.tgl_mulai_kontrak || "-"}
                                                                    </td>
                                                                )}
                                                                {columnVisibility.tanggal_selesai && (
                                                                    <td className="border border-gray-300 px-2 py-1.5 text-center text-gray-700 text-xs">
                                                                        {detail.tanggal_selesai || "-"}
                                                                    </td>
                                                                )}
                                                            </tr>
                                                        ));
                                                    })()
                                                ) : (
                                                    <tr>
                                                        <td colSpan={14} className="border border-gray-300 px-4 py-2 text-center text-gray-500 bg-gray-50 italic">
                                                            No additional details found
                                                        </td>
                                                    </tr>
                                                )}
                                            </>
                                        )
                                    }
                                </Fragment>
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
                                    {columnVisibility.id_investasi && <td className="border border-gray-300 px-2 py-1.5 h-8">&nbsp;</td>}
                                    {columnVisibility.klaster_regional && <td className="border border-gray-300 px-2 py-1.5">&nbsp;</td>}
                                    {columnVisibility.entitas_terminal && <td className="border border-gray-300 px-2 py-1.5">&nbsp;</td>}
                                    {columnVisibility.type_investasi && <td className="border border-gray-300 px-2 py-1.5">&nbsp;</td>}
                                    {columnVisibility.tahun_usulan && <td className="border border-gray-300 px-2 py-1.5">&nbsp;</td>}
                                    {columnVisibility.project_definition && <td className="border border-gray-300 px-2 py-1.5">&nbsp;</td>}
                                    {columnVisibility.status_investasi && <td className="border border-gray-300 px-2 py-1.5">&nbsp;</td>}
                                    {columnVisibility.kebutuhan_dana && <td className="border border-gray-300 px-2 py-1.5">&nbsp;</td>}
                                    {columnVisibility.rkap && <td className="border border-gray-300 px-2 py-1.5">&nbsp;</td>}
                                    {columnVisibility.judul_kontrak && <td className="border border-gray-300 px-2 py-1.5">&nbsp;</td>}
                                    {columnVisibility.nilai_kontrak && <td className="border border-gray-300 px-2 py-1.5">&nbsp;</td>}
                                    {columnVisibility.vendor && <td className="border border-gray-300 px-2 py-1.5">&nbsp;</td>}
                                    {columnVisibility.tgl_mulai_kontrak && <td className="border border-gray-300 px-2 py-1.5">&nbsp;</td>}
                                    {columnVisibility.tanggal_selesai && <td className="border border-gray-300 px-2 py-1.5">&nbsp;</td>}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div >
    );
}
