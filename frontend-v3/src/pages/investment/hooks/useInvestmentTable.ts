import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { useMonitorData } from "@/hooks/useMonitorData";
import { getFilterOptions } from "@/lib/api";
import {
    COLUMN_VISIBILITY_OPTIONS,
    INITIAL_COLUMN_WIDTHS,
    SORTABLE_COLUMNS,
    SortDirection,
    ExpandedRowData
} from "../types";

export function useInvestmentTable() {
    // Fetch data
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

    // Transform API data to table format
    const data: ExpandedRowData[] = useMemo(() => {
        return rawData.map((item, index) => ({
            id: index + 1,
            id_investasi: item.original_id_investasi,
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
            if (filterStatus !== "all" && row.status_investasi !== filterStatus) return false;
            return true;
        });

        // Apply sorting
        if (sortColumn && sortDirection) {
            result = [...result].sort((a, b) => {
                const aVal = a[sortColumn as keyof ExpandedRowData];
                const bVal = b[sortColumn as keyof ExpandedRowData];

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

    return {
        data,
        filteredData,
        isLoading,
        error,
        refetch,
        // Filters
        filterStates: {
            klaster: filterKlaster,
            entitas: filterEntitas,
            type: filterType,
            tahun: filterTahun,
            status: filterStatus,
            tglMulai: filterTglMulai,
            tglSelesai: filterTglSelesai,
            kontrakAktif: filterKontrakAktif,
        },
        setFilters: {
            setKlaster: setFilterKlaster,
            setEntitas: setFilterEntitas,
            setType: setFilterType,
            setTahun: setFilterTahun,
            setStatus: setFilterStatus,
            setTglMulai: setFilterTglMulai,
            setTglSelesai: setFilterTglSelesai,
            setKontrakAktif: setFilterKontrakAktif,
        },
        filterOptions,
        clearFilters,
        hasActiveFilters,
        // Sort
        sortColumn,
        sortDirection,
        handleSort,
        // Resize & Visibility
        columnWidths,
        columnVisibility,
        toggleColumnVisibility,
        handleResizeStart
    };
}
