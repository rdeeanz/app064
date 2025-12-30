import { useState, useEffect, useCallback } from "react"
import { useParams, Link } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import {
    Loader2,
    AlertCircle,
    RefreshCw,
    ArrowLeft,
    Save,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
    getProject,
    updateProject,
    ProjectData,
} from "@/lib/api"

const projectSchema = z.object({
    id_investasi: z.string().optional(),
    project_definition: z.string().min(1, "Definisi Project wajib diisi"),
    klaster_regional: z.string().optional(),
    entitas_terminal: z.string().optional(),
    type_investasi: z.string().optional(),
    status_investasi: z.string().optional(),
    pic: z.string().optional(),
    status_issue: z.string().optional(),
    tahun_rkap: z.coerce.number().optional(),
    kebutuhan_dana: z.coerce.number().optional(),
    rkap: z.coerce.number().optional(),
    nilai_kontrak: z.coerce.number().optional(),
    judul_kontrak: z.string().optional(),
    penyedia_jasa: z.string().optional(),
    no_kontrak: z.string().optional(),
    progres_description: z.string().optional(),
    issue_description: z.string().optional(),
    action_target: z.string().optional(),
})

type ProjectFormData = z.infer<typeof projectSchema>

export default function EditInvestasi() {
    const { refIdRoot } = useParams<{ refIdRoot: string }>()
    const decodedId = refIdRoot ? decodeURIComponent(refIdRoot) : ""

    const [project, setProject] = useState<ProjectData | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [successMessage, setSuccessMessage] = useState<string | null>(null)

    const form = useForm<ProjectFormData>({
        resolver: zodResolver(projectSchema),
        defaultValues: {
            id_investasi: "",
            project_definition: "",
            klaster_regional: "",
            entitas_terminal: "",
            type_investasi: "",
            status_investasi: "",
            pic: "",
            status_issue: "Open",
            tahun_rkap: new Date().getFullYear(),
            kebutuhan_dana: 0,
            rkap: 0,
            nilai_kontrak: 0,
            judul_kontrak: "",
            penyedia_jasa: "",
            no_kontrak: "",
            progres_description: "",
            issue_description: "",
            action_target: "",
        },
    })

    const fetchData = useCallback(async () => {
        if (!decodedId) return
        setIsLoading(true)
        setError(null)
        try {
            const data = await getProject(decodedId)
            setProject(data)
            // Populate form with existing data
            form.reset({
                id_investasi: data.id_investasi || "",
                project_definition: data.project_definition || "",
                klaster_regional: data.klaster_regional || "",
                entitas_terminal: data.entitas_terminal || "",
                type_investasi: data.type_investasi || "",
                status_investasi: data.status_investasi || "",
                pic: data.pic || "",
                status_issue: data.status_issue || "Open",
                tahun_rkap: data.tahun_rkap || new Date().getFullYear(),
                kebutuhan_dana: data.kebutuhan_dana || 0,
                rkap: data.rkap || 0,
                nilai_kontrak: data.nilai_kontrak || 0,
                judul_kontrak: data.judul_kontrak || "",
                penyedia_jasa: data.penyedia_jasa || "",
                no_kontrak: data.no_kontrak || "",
                progres_description: data.progres_description || "",
                issue_description: data.issue_description || "",
                action_target: data.action_target || "",
            })
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to fetch project data")
        } finally {
            setIsLoading(false)
        }
    }, [decodedId, form])

    useEffect(() => {
        fetchData()
    }, [fetchData])

    const handleSubmit = async (formData: ProjectFormData) => {
        setIsSubmitting(true)
        setError(null)
        setSuccessMessage(null)
        try {
            await updateProject(decodedId, formData)
            setSuccessMessage("Data investasi berhasil diperbarui!")
            // Refresh data
            await fetchData()
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to update project")
        } finally {
            setIsSubmitting(false)
        }
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        )
    }

    if (error && !project) {
        return (
            <Card className="border-destructive">
                <CardContent className="flex flex-col items-center justify-center py-10">
                    <AlertCircle className="h-12 w-12 text-destructive" />
                    <h3 className="mt-4 text-lg font-semibold">Failed to Load Data</h3>
                    <p className="text-muted-foreground">{error}</p>
                    <div className="mt-4 flex gap-2">
                        <Link to="/dashboard/invest">
                            <Button variant="outline">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Kembali
                            </Button>
                        </Link>
                        <Button onClick={fetchData}>
                            <RefreshCw className="mr-2 h-4 w-4" />
                            Retry
                        </Button>
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <div className="space-y-6 animate-in">
            {/* Page Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <Link
                            to="/dashboard/invest"
                            className="text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                        <Badge variant="outline" className="font-mono text-xs">
                            {decodedId}
                        </Badge>
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight">Edit Investasi</h1>
                    <p className="text-muted-foreground">
                        Update data investasi: <span className="font-medium">{project?.project_definition}</span>
                    </p>
                </div>
                <Button
                    onClick={form.handleSubmit(handleSubmit)}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                        <Save className="mr-2 h-4 w-4" />
                    )}
                    Simpan Perubahan
                </Button>
            </div>

            {error && (
                <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive">
                    {error}
                </div>
            )}

            {successMessage && (
                <div className="rounded-lg bg-green-500/10 border border-green-500/20 p-3 text-sm text-green-600 dark:text-green-400">
                    {successMessage}
                </div>
            )}

            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                {/* Basic Information */}
                <Card>
                    <CardHeader>
                        <CardTitle>Informasi Dasar</CardTitle>
                        <CardDescription>Data identifikasi dan klasifikasi investasi</CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="id_investasi">ID Investasi</Label>
                                <Input
                                    id="id_investasi"
                                    {...form.register("id_investasi")}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="project_definition">Definisi Project *</Label>
                                <Input
                                    id="project_definition"
                                    {...form.register("project_definition")}
                                />
                                {form.formState.errors.project_definition && (
                                    <p className="text-xs text-destructive">
                                        {form.formState.errors.project_definition.message}
                                    </p>
                                )}
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="klaster_regional">Klaster Regional</Label>
                                <Input
                                    id="klaster_regional"
                                    {...form.register("klaster_regional")}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="entitas_terminal">Entitas Terminal</Label>
                                <Input
                                    id="entitas_terminal"
                                    {...form.register("entitas_terminal")}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="type_investasi">Tipe Investasi</Label>
                                <Input
                                    id="type_investasi"
                                    placeholder="Murni / Multi Year / Carry Forward"
                                    {...form.register("type_investasi")}
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="status_investasi">Status Investasi</Label>
                                <Input
                                    id="status_investasi"
                                    {...form.register("status_investasi")}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="pic">PIC</Label>
                                <Input
                                    id="pic"
                                    {...form.register("pic")}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="status_issue">Status Issue</Label>
                                <Input
                                    id="status_issue"
                                    placeholder="Open / Closed"
                                    {...form.register("status_issue")}
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Financial Information */}
                <Card>
                    <CardHeader>
                        <CardTitle>Data Keuangan</CardTitle>
                        <CardDescription>RKAP, kebutuhan dana, dan nilai kontrak</CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-4">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="tahun_rkap">Tahun RKAP</Label>
                                <Input
                                    id="tahun_rkap"
                                    type="number"
                                    {...form.register("tahun_rkap")}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="kebutuhan_dana">Kebutuhan Dana (Rp)</Label>
                                <Input
                                    id="kebutuhan_dana"
                                    type="number"
                                    {...form.register("kebutuhan_dana")}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="rkap">RKAP (Rp)</Label>
                                <Input
                                    id="rkap"
                                    type="number"
                                    {...form.register("rkap")}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="nilai_kontrak">Nilai Kontrak (Rp)</Label>
                                <Input
                                    id="nilai_kontrak"
                                    type="number"
                                    {...form.register("nilai_kontrak")}
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Contract Information */}
                <Card>
                    <CardHeader>
                        <CardTitle>Data Kontrak</CardTitle>
                        <CardDescription>Informasi kontrak dan penyedia jasa</CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="judul_kontrak">Judul Kontrak</Label>
                            <Input
                                id="judul_kontrak"
                                {...form.register("judul_kontrak")}
                            />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="penyedia_jasa">Penyedia Jasa</Label>
                                <Input
                                    id="penyedia_jasa"
                                    {...form.register("penyedia_jasa")}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="no_kontrak">No. Kontrak</Label>
                                <Input
                                    id="no_kontrak"
                                    {...form.register("no_kontrak")}
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Progress & Issues */}
                <Card>
                    <CardHeader>
                        <CardTitle>Progress & Issues</CardTitle>
                        <CardDescription>Deskripsi progress dan issues</CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="progres_description">Deskripsi Progress</Label>
                            <textarea
                                id="progres_description"
                                className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                {...form.register("progres_description")}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="issue_description">Deskripsi Issue</Label>
                            <textarea
                                id="issue_description"
                                className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                {...form.register("issue_description")}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="action_target">Target Aksi</Label>
                            <textarea
                                id="action_target"
                                className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                {...form.register("action_target")}
                            />
                        </div>
                    </CardContent>
                </Card>

                <Separator />

                {/* Submit Button */}
                <div className="flex justify-end gap-4">
                    <Link to="/dashboard/invest">
                        <Button variant="outline" type="button">
                            Batal
                        </Button>
                    </Link>
                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                            <Save className="mr-2 h-4 w-4" />
                        )}
                        Simpan Perubahan
                    </Button>
                </div>
            </form>
        </div>
    )
}
