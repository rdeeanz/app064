import { useMemo } from "react"
import {
    TrendingUp,
    DollarSign,
    BarChart3,
    AlertCircle,
} from "lucide-react"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { useMonitorData } from "@/hooks/useMonitorData"
import { formatCurrency } from "@/lib/utils"
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
    PieChart,
    Pie,
    Cell,
} from "recharts"

const CHART_COLORS = [
    "hsl(221, 83%, 53%)",
    "hsl(160, 60%, 45%)",
    "hsl(30, 80%, 55%)",
    "hsl(280, 65%, 60%)",
    "hsl(340, 75%, 55%)",
]

export default function Dashboard() {
    const { data, isLoading, error } = useMonitorData()

    const stats = useMemo(() => {
        if (!data.length) return null

        const totalRkap = data.reduce((sum, item) => sum + (item.rkap || 0), 0)
        const totalRealisasi = data.reduce((sum, item) => {
            return (
                sum +
                (item.realisasi_januari || 0) +
                (item.realisasi_februari || 0) +
                (item.realisasi_maret || 0) +
                (item.realisasi_april || 0) +
                (item.realisasi_mei || 0) +
                (item.realisasi_juni || 0) +
                (item.realisasi_juli || 0) +
                (item.realisasi_agustus || 0) +
                (item.realisasi_september || 0) +
                (item.realisasi_oktober || 0) +
                (item.realisasi_november || 0) +
                (item.realisasi_desember || 0)
            )
        }, 0)
        const totalProjects = data.length
        const openIssues = data.filter(
            (item) => item.status_issue?.toLowerCase() === "open"
        ).length

        return { totalRkap, totalRealisasi, totalProjects, openIssues }
    }, [data])

    const monthlyData = useMemo(() => {
        if (!data.length) return []

        const months = [
            { key: "januari", label: "Jan" },
            { key: "februari", label: "Feb" },
            { key: "maret", label: "Mar" },
            { key: "april", label: "Apr" },
            { key: "mei", label: "May" },
            { key: "juni", label: "Jun" },
            { key: "juli", label: "Jul" },
            { key: "agustus", label: "Aug" },
            { key: "september", label: "Sep" },
            { key: "oktober", label: "Oct" },
            { key: "november", label: "Nov" },
            { key: "desember", label: "Dec" },
        ]

        type DataItem = typeof data[number]

        return months.map((month) => {
            const rkapKey = `rkap_${month.key}` as keyof DataItem
            const realisasiKey = `realisasi_${month.key}` as keyof DataItem

            return {
                name: month.label,
                rkap: data.reduce((sum, item) => sum + ((item[rkapKey] as number) || 0), 0) / 1_000_000_000,
                realisasi: data.reduce((sum, item) => sum + ((item[realisasiKey] as number) || 0), 0) / 1_000_000_000,
            }
        })
    }, [data])

    const statusData = useMemo(() => {
        if (!data.length) return []

        const statusCounts: Record<string, number> = {}
        data.forEach((item) => {
            const status = item.status_issue || "Unknown"
            statusCounts[status] = (statusCounts[status] || 0) + 1
        })

        return Object.entries(statusCounts).map(([name, value]) => ({ name, value }))
    }, [data])

    const typeData = useMemo(() => {
        if (!data.length) return []

        const typeCounts: Record<string, number> = {}
        data.forEach((item) => {
            const type = item.type_investasi || "Unknown"
            typeCounts[type] = (typeCounts[type] || 0) + 1
        })

        return Object.entries(typeCounts).map(([name, value]) => ({ name, value }))
    }, [data])

    if (isLoading) {
        return (
            <div className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <Card key={i}>
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-4 w-4" />
                            </CardHeader>
                            <CardContent>
                                <Skeleton className="h-8 w-32" />
                                <Skeleton className="mt-2 h-3 w-20" />
                            </CardContent>
                        </Card>
                    ))}
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                    <Card className="col-span-2">
                        <CardHeader>
                            <Skeleton className="h-5 w-48" />
                        </CardHeader>
                        <CardContent>
                            <Skeleton className="h-[300px] w-full" />
                        </CardContent>
                    </Card>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <Card className="border-destructive">
                <CardContent className="flex flex-col items-center justify-center py-10">
                    <AlertCircle className="h-12 w-12 text-destructive" />
                    <h3 className="mt-4 text-lg font-semibold">Failed to Load Data</h3>
                    <p className="text-muted-foreground">{error}</p>
                </CardContent>
            </Card>
        )
    }

    return (
        <div className="space-y-6 animate-in">
            {/* Page Header */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                <p className="text-muted-foreground">
                    Overview of investment project monitoring
                </p>
            </div>

            {/* KPI Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="border-l-4 border-l-blue-500">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total RKAP</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {formatCurrency(stats?.totalRkap)}
                        </div>
                        <p className="text-xs text-muted-foreground">Annual budget plan</p>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-green-500">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Realisasi</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {formatCurrency(stats?.totalRealisasi)}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            {stats && stats.totalRkap > 0
                                ? `${((stats.totalRealisasi / stats.totalRkap) * 100).toFixed(1)}% of RKAP`
                                : "0% of RKAP"}
                        </p>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-purple-500">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
                        <BarChart3 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats?.totalProjects || 0}</div>
                        <p className="text-xs text-muted-foreground">Active investments</p>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-orange-500">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Open Issues</CardTitle>
                        <AlertCircle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats?.openIssues || 0}</div>
                        <Badge variant={stats?.openIssues ? "destructive" : "success"}>
                            {stats?.openIssues ? "Needs attention" : "All clear"}
                        </Badge>
                    </CardContent>
                </Card>
            </div>

            {/* Charts Row */}
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {/* Monthly RKAP vs Realisasi */}
                <Card className="xl:col-span-2">
                    <CardHeader>
                        <CardTitle>RKAP vs Realisasi (Monthly)</CardTitle>
                        <CardDescription>
                            Budget plan vs actual realization in billions
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={monthlyData}>
                                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                                    <XAxis dataKey="name" className="text-xs" />
                                    <YAxis className="text-xs" tickFormatter={(v) => `${v}B`} />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: "hsl(var(--popover))",
                                            border: "1px solid hsl(var(--border))",
                                            borderRadius: "8px",
                                        }}
                                        formatter={(value: number) => [`${value.toFixed(2)}B`, ""]}
                                    />
                                    <Legend />
                                    <Bar dataKey="rkap" name="RKAP" fill="hsl(221, 83%, 53%)" radius={[4, 4, 0, 0]} />
                                    <Bar dataKey="realisasi" name="Realisasi" fill="hsl(160, 60%, 45%)" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Status Distribution */}
                <Card>
                    <CardHeader>
                        <CardTitle>Issue Status</CardTitle>
                        <CardDescription>Distribution of issue status</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={statusData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={100}
                                        paddingAngle={2}
                                        dataKey="value"
                                        label={({ name, percent }) =>
                                            `${name} ${(percent * 100).toFixed(0)}%`
                                        }
                                    >
                                        {statusData.map((_, index) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={CHART_COLORS[index % CHART_COLORS.length]}
                                            />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: "hsl(var(--popover))",
                                            border: "1px solid hsl(var(--border))",
                                            borderRadius: "8px",
                                        }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Investment Type Distribution */}
            <Card>
                <CardHeader>
                    <CardTitle>Investment Type Distribution</CardTitle>
                    <CardDescription>Breakdown by investment type</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-wrap gap-4">
                        {typeData.map((item, index) => (
                            <div
                                key={item.name}
                                className="flex items-center gap-3 rounded-lg border p-4"
                            >
                                <div
                                    className="h-3 w-3 rounded-full"
                                    style={{
                                        backgroundColor: CHART_COLORS[index % CHART_COLORS.length],
                                    }}
                                />
                                <div>
                                    <p className="font-medium">{item.name}</p>
                                    <p className="text-2xl font-bold">{item.value}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Recent Projects */}
            <Card>
                <CardHeader>
                    <CardTitle>Recent Projects</CardTitle>
                    <CardDescription>Latest investment projects</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="divide-y">
                        {data.slice(0, 5).map((project) => (
                            <div
                                key={project.ref_id_root}
                                className="flex items-center justify-between py-3"
                            >
                                <div className="min-w-0 flex-1">
                                    <p className="truncate font-medium">
                                        {project.project_definition || project.original_id_investasi}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        {project.entitas_terminal}
                                    </p>
                                </div>
                                <div className="ml-4 text-right">
                                    <p className="font-medium">{formatCurrency(project.rkap)}</p>
                                    <Badge
                                        variant={
                                            project.status_issue?.toLowerCase() === "open"
                                                ? "destructive"
                                                : "success"
                                        }
                                    >
                                        {project.status_issue || "N/A"}
                                    </Badge>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
