import { useState, useMemo, Fragment } from "react"
import { useNavigate } from "react-router-dom"
import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    VisibilityState,
    ColumnResizeMode,
    ExpandedState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    getExpandedRowModel,
    useReactTable,
} from "@tanstack/react-table"
import {
    ArrowUpDown,
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
    ChevronDown,
    ChevronUp,
    Loader2,
    AlertCircle,
    Search,
    RefreshCw,
    FileText,
    Pencil,
    GripVertical,
    Filter,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useMonitorData } from "@/hooks/useMonitorData"
import { MonitorInvestData } from "@/lib/api"
import { formatCurrency } from "@/lib/utils"

// Get current month's realisasi field based on Jakarta timezone
function getCurrentMonthRealisasiField(): keyof MonitorInvestData {
    const jakartaTime = new Date().toLocaleString("en-US", { timeZone: "Asia/Jakarta" })
    const jakartaDate = new Date(jakartaTime)
    const month = jakartaDate.getMonth() // 0-11

    const monthFields: (keyof MonitorInvestData)[] = [
        "realisasi_januari",
        "realisasi_februari",
        "realisasi_maret",
        "realisasi_april",
        "realisasi_mei",
        "realisasi_juni",
        "realisasi_juli",
        "realisasi_agustus",
        "realisasi_september",
        "realisasi_oktober",
        "realisasi_november",
        "realisasi_desember",
    ]

    return monthFields[month] ?? "realisasi_desember"
}

function getCurrentMonthName(): string {
    const jakartaTime = new Date().toLocaleString("en-US", { timeZone: "Asia/Jakarta" })
    const jakartaDate = new Date(jakartaTime)
    const month = jakartaDate.getMonth()

    const monthNames = [
        "Januari", "Februari", "Maret", "April", "Mei", "Juni",
        "Juli", "Agustus", "September", "Oktober", "November", "Desember"
    ]

    return monthNames[month] ?? "Desember"
}

export default function InvestmentTable() {
    const navigate = useNavigate()
    const { data, isLoading, error, refetch } = useMonitorData()
    const [sorting, setSorting] = useState<SortingState>([])
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
    const [globalFilter, setGlobalFilter] = useState("")
    const [columnResizeMode] = useState<ColumnResizeMode>("onChange")
    const [columnSizing, setColumnSizing] = useState({})
    const [expanded, setExpanded] = useState<ExpandedState>({})
    const [pageSize, setPageSize] = useState<number>(10)

    // Filter states
    const [filterKlaster, setFilterKlaster] = useState<string>("all")
    const [filterEntitas, setFilterEntitas] = useState<string>("all")
    const [filterStatus, setFilterStatus] = useState<string>("all")
    const [filterIssue, setFilterIssue] = useState<string>("all")

    const currentMonthField = useMemo(() => getCurrentMonthRealisasiField(), [])
    const currentMonthName = useMemo(() => getCurrentMonthName(), [])

    // Get unique filter options from data
    const filterOptions = useMemo(() => {
        const klasterSet = new Set<string>()
        const entitasSet = new Set<string>()
        const statusSet = new Set<string>()
        const issueSet = new Set<string>()

        data.forEach((item) => {
            if (item.klaster_regional) klasterSet.add(item.klaster_regional)
            if (item.entitas_terminal) entitasSet.add(item.entitas_terminal)
            if (item.status_investasi) statusSet.add(item.status_investasi)
            if (item.issue_categories) issueSet.add(item.issue_categories)
        })

        return {
            klaster: Array.from(klasterSet).sort(),
            entitas: Array.from(entitasSet).sort(),
            status: Array.from(statusSet).sort(),
            issue: Array.from(issueSet).sort(),
        }
    }, [data])

    // Filter data based on selected filters
    const filteredData = useMemo(() => {
        return data.filter((item) => {
            if (filterKlaster !== "all" && item.klaster_regional !== filterKlaster) return false
            if (filterEntitas !== "all" && item.entitas_terminal !== filterEntitas) return false
            if (filterStatus !== "all" && item.status_investasi !== filterStatus) return false
            if (filterIssue !== "all" && item.issue_categories !== filterIssue) return false
            return true
        })
    }, [data, filterKlaster, filterEntitas, filterStatus, filterIssue])

    const columns: ColumnDef<MonitorInvestData>[] = useMemo(
        () => [
            {
                id: "rowNumber",
                accessorFn: (_, index) => index,
                header: ({ column }) => (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        className="-ml-3 h-8 whitespace-nowrap"
                    >
                        #
                        <ArrowUpDown className="ml-1 h-3 w-3" />
                    </Button>
                ),
                cell: ({ row, table }) => {
                    const pageIndex = table.getState().pagination.pageIndex
                    const pageSize = table.getState().pagination.pageSize
                    return (
                        <span className="font-medium text-muted-foreground">
                            {pageIndex * pageSize + row.index + 1}
                        </span>
                    )
                },
                size: 60,
                minSize: 40,
                maxSize: 80,
            },
            {
                accessorKey: "klaster_regional",
                header: "Klaster Regional",
                cell: ({ row }) => (
                    <div className="min-w-[80px]">
                        <span className="text-sm whitespace-normal break-words">
                            {row.getValue("klaster_regional") || "-"}
                        </span>
                    </div>
                ),
                size: 120,
                minSize: 80,
                maxSize: 200,
                enableSorting: false,
            },
            {
                accessorKey: "entitas_terminal",
                header: ({ column }) => (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        className="-ml-3 h-8 whitespace-nowrap"
                    >
                        Entitas Terminal
                        <ArrowUpDown className="ml-1 h-3 w-3" />
                    </Button>
                ),
                cell: ({ row }) => (
                    <div className="min-w-[100px]">
                        <span className="text-sm whitespace-normal break-words">
                            {row.getValue("entitas_terminal") || "-"}
                        </span>
                    </div>
                ),
                size: 150,
                minSize: 100,
                maxSize: 300,
            },
            {
                accessorKey: "tahun_usulan",
                header: ({ column }) => (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        className="-ml-3 h-8 whitespace-nowrap"
                    >
                        Tahun
                        <ArrowUpDown className="ml-1 h-3 w-3" />
                    </Button>
                ),
                cell: ({ row }) => (
                    <span className="text-sm font-mono">{row.getValue("tahun_usulan") || "-"}</span>
                ),
                size: 80,
                minSize: 60,
                maxSize: 120,
            },
            {
                accessorKey: "project_definition",
                header: "Project Definition",
                cell: ({ row }) => {
                    const isExpanded = row.getIsExpanded()
                    return (
                        <div className="min-w-[200px]">
                            <button
                                onClick={() => row.toggleExpanded()}
                                className="flex items-start gap-2 w-full text-left group cursor-pointer hover:bg-muted/50 rounded p-1 -m-1 transition-colors"
                            >
                                <span className="mt-0.5 shrink-0">
                                    {isExpanded ? (
                                        <ChevronUp className="h-4 w-4 text-primary" />
                                    ) : (
                                        <ChevronDown className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
                                    )}
                                </span>
                                <p className="text-sm whitespace-normal break-words flex-1">
                                    {row.getValue("project_definition") || "-"}
                                </p>
                            </button>
                        </div>
                    )
                },
                size: 300,
                minSize: 150,
                maxSize: 600,
                enableSorting: false,
            },
            {
                accessorKey: "status_investasi",
                header: ({ column }) => (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        className="-ml-3 h-8 whitespace-nowrap"
                    >
                        Status Investasi
                        <ArrowUpDown className="ml-1 h-3 w-3" />
                    </Button>
                ),
                cell: ({ row }) => {
                    const status = row.getValue("status_investasi") as string
                    return (
                        <div className="min-w-[80px]">
                            <Badge variant="outline" className="whitespace-normal">
                                {status || "-"}
                            </Badge>
                        </div>
                    )
                },
                size: 140,
                minSize: 100,
                maxSize: 200,
            },
            {
                accessorKey: "issue_categories",
                header: ({ column }) => (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        className="-ml-3 h-8 whitespace-nowrap"
                    >
                        Issue Categories
                        <ArrowUpDown className="ml-1 h-3 w-3" />
                    </Button>
                ),
                cell: ({ row }) => (
                    <div className="min-w-[80px]">
                        <span className="text-sm whitespace-normal break-words">
                            {row.getValue("issue_categories") || "-"}
                        </span>
                    </div>
                ),
                size: 140,
                minSize: 100,
                maxSize: 250,
            },
            {
                accessorKey: "kebutuhan_dana",
                header: ({ column }) => (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        className="-ml-3 h-8 whitespace-nowrap"
                    >
                        Kebutuhan Dana
                        <ArrowUpDown className="ml-1 h-3 w-3" />
                    </Button>
                ),
                cell: ({ row }) => (
                    <div className="min-w-[100px]">
                        <span className="text-sm font-medium whitespace-normal text-right block">
                            {formatCurrency(row.getValue("kebutuhan_dana"))}
                        </span>
                    </div>
                ),
                size: 140,
                minSize: 100,
                maxSize: 200,
            },
            {
                accessorKey: "rkap",
                header: ({ column }) => (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        className="-ml-3 h-8 whitespace-nowrap"
                    >
                        RKAP
                        <ArrowUpDown className="ml-1 h-3 w-3" />
                    </Button>
                ),
                cell: ({ row }) => (
                    <div className="min-w-[100px]">
                        <span className="text-sm font-medium whitespace-normal text-right block">
                            {formatCurrency(row.getValue("rkap"))}
                        </span>
                    </div>
                ),
                size: 130,
                minSize: 100,
                maxSize: 180,
            },
            {
                id: "realisasi_bulan_ini",
                accessorFn: (row) => row[currentMonthField],
                header: ({ column }) => (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        className="-ml-3 h-8 whitespace-nowrap"
                    >
                        Realisasi {currentMonthName}
                        <ArrowUpDown className="ml-1 h-3 w-3" />
                    </Button>
                ),
                cell: ({ row }) => (
                    <div className="min-w-[100px]">
                        <span className="text-sm font-medium whitespace-normal text-right block">
                            {formatCurrency(row.original[currentMonthField] as number)}
                        </span>
                    </div>
                ),
                size: 150,
                minSize: 120,
                maxSize: 200,
            },
            {
                accessorKey: "prognosa_sd_desember",
                header: ({ column }) => (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        className="-ml-3 h-8 whitespace-nowrap"
                    >
                        Prognosa sd Des
                        <ArrowUpDown className="ml-1 h-3 w-3" />
                    </Button>
                ),
                cell: ({ row }) => (
                    <div className="min-w-[100px]">
                        <span className="text-sm font-medium whitespace-normal text-right block">
                            {formatCurrency(row.getValue("prognosa_sd_desember"))}
                        </span>
                    </div>
                ),
                size: 150,
                minSize: 120,
                maxSize: 200,
            },
        ],
        [currentMonthField, currentMonthName]
    )

    const table = useReactTable({
        data: filteredData,
        columns,
        columnResizeMode,
        onColumnSizingChange: setColumnSizing,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onExpandedChange: setExpanded,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getExpandedRowModel: getExpandedRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        globalFilterFn: "includesString",
        onGlobalFilterChange: setGlobalFilter,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            globalFilter,
            columnSizing,
            expanded,
            pagination: {
                pageIndex: 0,
                pageSize: pageSize === -1 ? filteredData.length : pageSize,
            },
        },
    })

    // Reset to first page when filters change
    const handlePageSizeChange = (value: string) => {
        if (value === "all") {
            setPageSize(-1)
        } else {
            setPageSize(parseInt(value))
        }
        table.setPageIndex(0)
    }

    const clearFilters = () => {
        setFilterKlaster("all")
        setFilterEntitas("all")
        setFilterStatus("all")
        setFilterIssue("all")
        setGlobalFilter("")
    }

    const hasActiveFilters = filterKlaster !== "all" || filterEntitas !== "all" ||
        filterStatus !== "all" || filterIssue !== "all" || globalFilter !== ""

    if (error) {
        return (
            <Card className="border-destructive">
                <CardContent className="flex flex-col items-center justify-center py-10">
                    <AlertCircle className="h-12 w-12 text-destructive" />
                    <h3 className="mt-4 text-lg font-semibold">Failed to Load Data</h3>
                    <p className="text-muted-foreground">{error}</p>
                    <Button onClick={refetch} className="mt-4">
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Retry
                    </Button>
                </CardContent>
            </Card>
        )
    }

    return (
        <div className="space-y-6 animate-in">
            {/* Page Header */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Investment Data</h1>
                <p className="text-muted-foreground">
                    Detailed view of all investment monitoring data
                </p>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <CardTitle>Monitor Invest</CardTitle>
                                <CardDescription>
                                    {table.getFilteredRowModel().rows.length} of {data.length} records
                                </CardDescription>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="relative">
                                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Search..."
                                        value={globalFilter ?? ""}
                                        onChange={(e) => setGlobalFilter(e.target.value)}
                                        className="w-48 pl-8"
                                    />
                                </div>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={refetch}
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                        <RefreshCw className="h-4 w-4" />
                                    )}
                                </Button>
                            </div>
                        </div>

                        {/* Filters */}
                        <div className="flex flex-wrap items-center gap-2 pt-2 border-t">
                            <Filter className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm font-medium text-muted-foreground">Filter:</span>

                            <Select value={filterKlaster} onValueChange={setFilterKlaster}>
                                <SelectTrigger className="w-[150px] h-8 text-xs">
                                    <SelectValue placeholder="Klaster Regional" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Semua Klaster</SelectItem>
                                    {filterOptions.klaster.map((k) => (
                                        <SelectItem key={k} value={k}>{k}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Select value={filterEntitas} onValueChange={setFilterEntitas}>
                                <SelectTrigger className="w-[150px] h-8 text-xs">
                                    <SelectValue placeholder="Entitas Terminal" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Semua Entitas</SelectItem>
                                    {filterOptions.entitas.map((e) => (
                                        <SelectItem key={e} value={e}>{e}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Select value={filterStatus} onValueChange={setFilterStatus}>
                                <SelectTrigger className="w-[150px] h-8 text-xs">
                                    <SelectValue placeholder="Status Investasi" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Semua Status</SelectItem>
                                    {filterOptions.status.map((s) => (
                                        <SelectItem key={s} value={s}>{s}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Select value={filterIssue} onValueChange={setFilterIssue}>
                                <SelectTrigger className="w-[150px] h-8 text-xs">
                                    <SelectValue placeholder="Issue Categories" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Semua Issue</SelectItem>
                                    {filterOptions.issue.map((i) => (
                                        <SelectItem key={i} value={i}>{i}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            {hasActiveFilters && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={clearFilters}
                                    className="h-8 px-2 text-xs"
                                >
                                    Clear All
                                </Button>
                            )}
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="flex items-center justify-center py-10">
                            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                        </div>
                    ) : (
                        <>
                            <div className="rounded-md border overflow-x-auto">
                                <Table style={{ width: table.getCenterTotalSize() }}>
                                    <TableHeader>
                                        {table.getHeaderGroups().map((headerGroup) => (
                                            <TableRow key={headerGroup.id}>
                                                {headerGroup.headers.map((header) => (
                                                    <TableHead
                                                        key={header.id}
                                                        style={{ width: header.getSize() }}
                                                        className="relative group"
                                                    >
                                                        {header.isPlaceholder
                                                            ? null
                                                            : flexRender(
                                                                header.column.columnDef.header,
                                                                header.getContext()
                                                            )}
                                                        {/* Resize Handle */}
                                                        <div
                                                            onMouseDown={header.getResizeHandler()}
                                                            onTouchStart={header.getResizeHandler()}
                                                            className={`absolute right-0 top-0 h-full w-1 cursor-col-resize select-none touch-none bg-transparent hover:bg-primary/50 transition-colors ${header.column.getIsResizing() ? "bg-primary" : ""
                                                                }`}
                                                        >
                                                            <GripVertical className="h-4 w-4 text-muted-foreground/50 hidden group-hover:block absolute top-1/2 -translate-y-1/2 right-0" />
                                                        </div>
                                                    </TableHead>
                                                ))}
                                            </TableRow>
                                        ))}
                                    </TableHeader>
                                    <TableBody>
                                        {table.getRowModel().rows?.length ? (
                                            table.getRowModel().rows.map((row) => (
                                                <Fragment key={row.id}>
                                                    <TableRow
                                                        data-state={row.getIsSelected() && "selected"}
                                                    >
                                                        {row.getVisibleCells().map((cell) => (
                                                            <TableCell
                                                                key={cell.id}
                                                                style={{ width: cell.column.getSize() }}
                                                            >
                                                                {flexRender(
                                                                    cell.column.columnDef.cell,
                                                                    cell.getContext()
                                                                )}
                                                            </TableCell>
                                                        ))}
                                                    </TableRow>
                                                    {/* Expanded Row Content - positioned under project_definition */}
                                                    {row.getIsExpanded() && (
                                                        <TableRow className="bg-muted/30 hover:bg-muted/50">
                                                            <TableCell colSpan={columns.length} className="p-0">
                                                                <div
                                                                    className="flex flex-col gap-2 py-3"
                                                                    style={{ paddingLeft: "calc(60px + 120px + 150px + 80px + 24px)" }}
                                                                >
                                                                    <Button
                                                                        variant="default"
                                                                        size="sm"
                                                                        onClick={() => navigate(`/dashboard/invest/${encodeURIComponent(row.original.ref_id_root)}/edit`)}
                                                                        className="gap-2 w-fit"
                                                                    >
                                                                        <Pencil className="h-4 w-4" />
                                                                        Edit Investasi
                                                                    </Button>
                                                                    <Button
                                                                        variant="outline"
                                                                        size="sm"
                                                                        onClick={() => navigate(`/dashboard/invest/${encodeURIComponent(row.original.original_id_investasi)}/kontrak`)}
                                                                        className="gap-2 w-fit"
                                                                    >
                                                                        <FileText className="h-4 w-4" />
                                                                        View Kontrak
                                                                    </Button>
                                                                </div>
                                                            </TableCell>
                                                        </TableRow>
                                                    )}
                                                </Fragment>
                                            ))
                                        ) : (
                                            <TableRow>
                                                <TableCell
                                                    colSpan={columns.length}
                                                    className="h-24 text-center"
                                                >
                                                    No results.
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </div>

                            {/* Pagination */}
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-muted-foreground">View:</span>
                                    <Select
                                        value={pageSize === -1 ? "all" : pageSize.toString()}
                                        onValueChange={handlePageSizeChange}
                                    >
                                        <SelectTrigger className="w-[80px] h-8">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="10">10</SelectItem>
                                            <SelectItem value="20">20</SelectItem>
                                            <SelectItem value="50">50</SelectItem>
                                            <SelectItem value="100">100</SelectItem>
                                            <SelectItem value="all">ALL</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <span className="text-sm text-muted-foreground">
                                        Menampilkan {table.getRowModel().rows.length} dari {filteredData.length} item
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-muted-foreground">
                                        Page {table.getState().pagination.pageIndex + 1} of{" "}
                                        {table.getPageCount() || 1}
                                    </span>
                                    <div className="flex items-center space-x-1">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => table.setPageIndex(0)}
                                            disabled={!table.getCanPreviousPage()}
                                        >
                                            <ChevronsLeft className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => table.previousPage()}
                                            disabled={!table.getCanPreviousPage()}
                                        >
                                            <ChevronLeft className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => table.nextPage()}
                                            disabled={!table.getCanNextPage()}
                                        >
                                            <ChevronRight className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                                            disabled={!table.getCanNextPage()}
                                        >
                                            <ChevronsRight className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
