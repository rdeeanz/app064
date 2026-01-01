import { useState, useEffect, useCallback } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import {
    Plus,
    Pencil,
    Trash2,
    Loader2,
    AlertCircle,
    RefreshCw,
    ArrowLeft,
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
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    getProjectsByInvestasi,
    createProject,
    updateProject,
    deleteProject,
    ProjectData,
    ProjectCreateData,
} from "@/lib/api"
import { formatCurrency, truncate } from "@/lib/utils"

const projectSchema = z.object({
    id_root: z.string().min(1, "ID Root wajib diisi"),
    id_investasi: z.string().min(1, "ID Investasi wajib diisi"),
    project_definition: z.string().min(1, "Definisi Project wajib diisi"),
    klaster_regional: z.string().optional(),
    entitas_terminal: z.string().optional(),
    type_investasi: z.string().optional(),
    pic: z.string().optional(),
    status_issue: z.string().optional(),
    tahun_rkap: z.coerce.number().optional(),
    rkap: z.coerce.number().optional(),
    nilai_kontrak: z.coerce.number().optional(),
    judul_kontrak: z.string().optional(),
    penyedia_jasa: z.string().optional(),
    no_kontrak: z.string().optional(),
})

type ProjectFormData = z.infer<typeof projectSchema>

export default function KontrakByInvestasi() {
    const { idInvestasi } = useParams<{ idInvestasi: string }>()
    const navigate = useNavigate()
    const decodedId = idInvestasi ? decodeURIComponent(idInvestasi) : ""

    const [data, setData] = useState<ProjectData[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [total, setTotal] = useState(0)

    // Dialog states
    const [isCreateOpen, setIsCreateOpen] = useState(false)
    const [isEditOpen, setIsEditOpen] = useState(false)
    const [isDeleteOpen, setIsDeleteOpen] = useState(false)
    const [selectedProject, setSelectedProject] = useState<ProjectData | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const form = useForm<ProjectFormData>({
        resolver: zodResolver(projectSchema),
        defaultValues: {
            id_root: "",
            id_investasi: decodedId,
            project_definition: "",
            klaster_regional: "Regional 2",
            entitas_terminal: "",
            type_investasi: "Murni",
            pic: "",
            status_issue: "Open",
            tahun_rkap: new Date().getFullYear(),
            rkap: 0,
            nilai_kontrak: 0,
            judul_kontrak: "",
            penyedia_jasa: "",
            no_kontrak: "",
        },
    })

    const fetchData = useCallback(async () => {
        if (!decodedId) return
        setIsLoading(true)
        setError(null)
        try {
            const result = await getProjectsByInvestasi(decodedId)
            setData(result)
            setTotal(result.length)
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to fetch data")
        } finally {
            setIsLoading(false)
        }
    }, [decodedId])

    useEffect(() => {
        fetchData()
    }, [fetchData])

    const handleCreate = async (formData: ProjectFormData) => {
        setIsSubmitting(true)
        try {
            await createProject({
                ...formData,
                id_investasi: decodedId,
            } as ProjectCreateData)
            setIsCreateOpen(false)
            form.reset({ ...form.getValues(), id_root: "", project_definition: "" })
            fetchData()
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to create project")
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleEdit = async (formData: ProjectFormData) => {
        if (!selectedProject) return
        setIsSubmitting(true)
        try {
            await updateProject(selectedProject.id_root, formData)
            setIsEditOpen(false)
            setSelectedProject(null)
            fetchData()
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to update project")
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleDelete = async () => {
        if (!selectedProject) return
        setIsSubmitting(true)
        try {
            await deleteProject(selectedProject.id_root)
            setIsDeleteOpen(false)
            setSelectedProject(null)
            fetchData()
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to delete project")
        } finally {
            setIsSubmitting(false)
        }
    }

    const openEditDialog = (project: ProjectData) => {
        setSelectedProject(project)
        form.reset({
            id_root: project.id_root,
            id_investasi: project.id_investasi || decodedId,
            project_definition: project.project_definition || "",
            klaster_regional: project.klaster_regional || "",
            entitas_terminal: project.entitas_terminal || "",
            type_investasi: project.type_investasi || "",
            pic: project.pic || "",
            status_issue: project.status_issue || "",
            tahun_rkap: project.tahun_rkap || new Date().getFullYear(),
            rkap: project.rkap || 0,
            nilai_kontrak: project.nilai_kontrak || 0,
            judul_kontrak: project.judul_kontrak || "",
            penyedia_jasa: project.penyedia_jasa || "",
            no_kontrak: project.no_kontrak || "",
        })
        setIsEditOpen(true)
    }

    const openDeleteDialog = (project: ProjectData) => {
        setSelectedProject(project)
        setIsDeleteOpen(true)
    }

    const openCreateDialog = () => {
        form.reset({
            id_root: "",
            id_investasi: decodedId,
            project_definition: "",
            klaster_regional: "Regional 2",
            entitas_terminal: "",
            type_investasi: "Murni",
            pic: "",
            status_issue: "Open",
            tahun_rkap: new Date().getFullYear(),
            rkap: 0,
            nilai_kontrak: 0,
            judul_kontrak: "",
            penyedia_jasa: "",
            no_kontrak: "",
        })
        setIsCreateOpen(true)
    }

    if (error && !data.length) {
        return (
            <Card className="border-destructive">
                <CardContent className="flex flex-col items-center justify-center py-10">
                    <AlertCircle className="h-12 w-12 text-destructive" />
                    <h3 className="mt-4 text-lg font-semibold">Failed to Load Data</h3>
                    <p className="text-muted-foreground">{error}</p>
                    <div className="mt-4 flex gap-2">
                        <Button variant="outline" onClick={() => navigate(-1)}>
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Kembali
                        </Button>
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
                        <Badge variant="outline" className="font-mono">
                            {decodedId}
                        </Badge>
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight">Data Kontrak</h1>
                    <p className="text-muted-foreground">
                        Kelola kontrak untuk investasi: <span className="font-medium">{decodedId}</span>
                    </p>
                </div>
                <Button onClick={openCreateDialog}>
                    <Plus className="mr-2 h-4 w-4" />
                    Tambah Kontrak
                </Button>
            </div>

            {error && (
                <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive">
                    {error}
                </div>
            )}

            <Card>
                <CardHeader>
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <CardTitle>Daftar Kontrak</CardTitle>
                            <CardDescription>{total} kontrak ditemukan</CardDescription>
                        </div>
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={fetchData}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <RefreshCw className="h-4 w-4" />
                            )}
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="flex items-center justify-center py-10">
                            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                        </div>
                    ) : (
                        <div className="rounded-md border overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>ID Root</TableHead>
                                        <TableHead>Project</TableHead>
                                        <TableHead>Judul Kontrak</TableHead>
                                        <TableHead>Penyedia Jasa</TableHead>
                                        <TableHead>Nilai Kontrak</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Aksi</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {data.length > 0 ? (
                                        data.map((project) => (
                                            <TableRow key={project.id_root}>
                                                <TableCell className="font-mono text-xs">
                                                    {project.id_root}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="max-w-[200px]">
                                                        <p className="font-medium truncate">
                                                            {truncate(project.project_definition || "-", 30)}
                                                        </p>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    {truncate(project.judul_kontrak || "-", 25)}
                                                </TableCell>
                                                <TableCell>
                                                    {truncate(project.penyedia_jasa || "-", 20)}
                                                </TableCell>
                                                <TableCell className="font-medium">
                                                    {formatCurrency(project.nilai_kontrak)}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge
                                                        variant={
                                                            project.status_issue === "Open"
                                                                ? "destructive"
                                                                : "success"
                                                        }
                                                    >
                                                        {project.status_issue || "N/A"}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => openEditDialog(project)}
                                                        >
                                                            <Pencil className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => openDeleteDialog(project)}
                                                            className="text-destructive hover:text-destructive"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={7} className="h-24 text-center">
                                                <div className="flex flex-col items-center gap-2">
                                                    <p className="text-muted-foreground">Tidak ada kontrak ditemukan.</p>
                                                    <Button size="sm" onClick={openCreateDialog}>
                                                        <Plus className="mr-2 h-4 w-4" />
                                                        Tambah Kontrak Pertama
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Create Dialog */}
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Tambah Kontrak Baru</DialogTitle>
                        <DialogDescription>
                            Tambah kontrak untuk investasi: {decodedId}
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={form.handleSubmit(handleCreate)}>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="id_root">ID Root *</Label>
                                    <Input
                                        id="id_root"
                                        placeholder="P/XX.XX.XXX-001"
                                        {...form.register("id_root")}
                                    />
                                    {form.formState.errors.id_root && (
                                        <p className="text-xs text-destructive">
                                            {form.formState.errors.id_root.message}
                                        </p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="id_investasi">ID Investasi</Label>
                                    <Input
                                        id="id_investasi"
                                        value={decodedId}
                                        disabled
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="project_definition">Definisi Project *</Label>
                                <Input
                                    id="project_definition"
                                    placeholder="Deskripsi project"
                                    {...form.register("project_definition")}
                                />
                                {form.formState.errors.project_definition && (
                                    <p className="text-xs text-destructive">
                                        {form.formState.errors.project_definition.message}
                                    </p>
                                )}
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="klaster_regional">Klaster Regional</Label>
                                    <Input
                                        id="klaster_regional"
                                        placeholder="Regional 2"
                                        {...form.register("klaster_regional")}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="entitas_terminal">Entitas Terminal</Label>
                                    <Input
                                        id="entitas_terminal"
                                        placeholder="Terminal XXX"
                                        {...form.register("entitas_terminal")}
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="tahun_rkap">Tahun RKAP</Label>
                                    <Input
                                        id="tahun_rkap"
                                        type="number"
                                        {...form.register("tahun_rkap")}
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
                            <div className="space-y-2">
                                <Label htmlFor="judul_kontrak">Judul Kontrak</Label>
                                <Input
                                    id="judul_kontrak"
                                    placeholder="Judul kontrak"
                                    {...form.register("judul_kontrak")}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="penyedia_jasa">Penyedia Jasa</Label>
                                    <Input
                                        id="penyedia_jasa"
                                        placeholder="Nama vendor"
                                        {...form.register("penyedia_jasa")}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="no_kontrak">No. Kontrak</Label>
                                    <Input
                                        id="no_kontrak"
                                        placeholder="Nomor kontrak"
                                        {...form.register("no_kontrak")}
                                    />
                                </div>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsCreateOpen(false)}
                            >
                                Batal
                            </Button>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Simpan
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Edit Dialog */}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Edit Kontrak</DialogTitle>
                        <DialogDescription>
                            Ubah data kontrak investasi
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={form.handleSubmit(handleEdit)}>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="edit_id_root">ID Root</Label>
                                    <Input
                                        id="edit_id_root"
                                        disabled
                                        {...form.register("id_root")}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="edit_id_investasi">ID Investasi</Label>
                                    <Input
                                        id="edit_id_investasi"
                                        disabled
                                        {...form.register("id_investasi")}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="edit_project_definition">Definisi Project *</Label>
                                <Input
                                    id="edit_project_definition"
                                    {...form.register("project_definition")}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="edit_klaster_regional">Klaster Regional</Label>
                                    <Input
                                        id="edit_klaster_regional"
                                        {...form.register("klaster_regional")}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="edit_entitas_terminal">Entitas Terminal</Label>
                                    <Input
                                        id="edit_entitas_terminal"
                                        {...form.register("entitas_terminal")}
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="edit_tahun_rkap">Tahun RKAP</Label>
                                    <Input
                                        id="edit_tahun_rkap"
                                        type="number"
                                        {...form.register("tahun_rkap")}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="edit_rkap">RKAP (Rp)</Label>
                                    <Input
                                        id="edit_rkap"
                                        type="number"
                                        {...form.register("rkap")}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="edit_nilai_kontrak">Nilai Kontrak (Rp)</Label>
                                    <Input
                                        id="edit_nilai_kontrak"
                                        type="number"
                                        {...form.register("nilai_kontrak")}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="edit_judul_kontrak">Judul Kontrak</Label>
                                <Input
                                    id="edit_judul_kontrak"
                                    {...form.register("judul_kontrak")}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="edit_penyedia_jasa">Penyedia Jasa</Label>
                                    <Input
                                        id="edit_penyedia_jasa"
                                        {...form.register("penyedia_jasa")}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="edit_no_kontrak">No. Kontrak</Label>
                                    <Input
                                        id="edit_no_kontrak"
                                        {...form.register("no_kontrak")}
                                    />
                                </div>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsEditOpen(false)}
                            >
                                Batal
                            </Button>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Update
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Hapus Kontrak</DialogTitle>
                        <DialogDescription>
                            Apakah Anda yakin ingin menghapus kontrak ini? Tindakan ini tidak
                            dapat dibatalkan.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        <p className="font-medium">{selectedProject?.project_definition}</p>
                        <p className="text-sm text-muted-foreground">
                            {selectedProject?.id_root}
                        </p>
                    </div>
                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsDeleteOpen(false)}
                        >
                            Batal
                        </Button>
                        <Button
                            type="button"
                            variant="destructive"
                            onClick={handleDelete}
                            disabled={isSubmitting}
                        >
                            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Hapus
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
