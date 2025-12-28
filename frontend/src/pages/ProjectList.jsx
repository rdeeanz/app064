import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Plus, Search, Filter, Eye, Edit, Trash2, ChevronLeft, ChevronRight } from 'lucide-react'
import { projectAPI } from '@/lib/api'
import { formatCurrency } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'

export default function ProjectList() {
    const [searchParams, setSearchParams] = useSearchParams()
    const [projects, setProjects] = useState([])
    const [stats, setStats] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [totalProjects, setTotalProjects] = useState(0)
    const [deleteDialog, setDeleteDialog] = useState({ open: false, project: null })

    // Pagination & filtering state
    const page = parseInt(searchParams.get('page') || '1')
    const pageSize = 10
    const statusIssue = searchParams.get('status_issue') || ''
    const searchQuery = searchParams.get('q') || ''

    // Fetch projects
    useEffect(() => {
        async function fetchData() {
            try {
                setLoading(true)
                const [projectsData, statsData] = await Promise.all([
                    projectAPI.getProjects({
                        page,
                        pageSize,
                        statusIssue: statusIssue || undefined,
                    }),
                    projectAPI.getStats()
                ])
                setProjects(projectsData.items)
                setTotalProjects(projectsData.total)
                setStats(statsData)
                setError(null)
            } catch (err) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [page, statusIssue])

    // Handle delete
    const handleDelete = async () => {
        if (!deleteDialog.project) return
        try {
            await projectAPI.deleteProject(deleteDialog.project.id_root)
            setProjects(projects.filter(p => p.id_root !== deleteDialog.project.id_root))
            setDeleteDialog({ open: false, project: null })
        } catch (err) {
            setError(err.message)
        }
    }

    // Pagination
    const totalPages = Math.ceil(totalProjects / pageSize)

    const goToPage = (newPage) => {
        const params = new URLSearchParams(searchParams)
        params.set('page', newPage.toString())
        setSearchParams(params)
    }

    const handleFilterChange = (key, value) => {
        const params = new URLSearchParams(searchParams)
        if (value) {
            params.set(key, value)
        } else {
            params.delete(key)
        }
        params.set('page', '1')
        setSearchParams(params)
    }

    // Filter projects by search query (client-side for simplicity)
    const filteredProjects = projects.filter(project => {
        if (!searchQuery) return true
        const query = searchQuery.toLowerCase()
        return (
            project.project_definition?.toLowerCase().includes(query) ||
            project.id_investasi?.toLowerCase().includes(query) ||
            project.entitas_terminal?.toLowerCase().includes(query)
        )
    })

    return (
        <div className="space-y-6">
            {/* Stats Cards */}
            {stats && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Total Projects
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total_projects}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Total RKAP
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{formatCurrency(stats.total_rkap)}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Total Nilai Kontrak
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{formatCurrency(stats.total_nilai_kontrak)}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Open Issues
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-destructive">{stats.open_issues}</div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Actions Bar */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                <div className="flex gap-2 flex-1 w-full sm:w-auto">
                    <div className="relative flex-1 sm:max-w-xs">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Cari project..."
                            value={searchQuery}
                            onChange={(e) => handleFilterChange('q', e.target.value)}
                            className="pl-9"
                        />
                    </div>
                    <Select
                        value={statusIssue}
                        onValueChange={(value) => handleFilterChange('status_issue', value === 'all' ? '' : value)}
                    >
                        <SelectTrigger className="w-[150px]">
                            <Filter className="h-4 w-4 mr-2" />
                            <SelectValue placeholder="Status Issue" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Semua</SelectItem>
                            <SelectItem value="Open">Open</SelectItem>
                            <SelectItem value="Closed">Closed</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <Link to="/projects/new">
                    <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Tambah Project
                    </Button>
                </Link>
            </div>

            {/* Error State */}
            {error && (
                <div className="bg-destructive/10 text-destructive p-4 rounded-lg">
                    Error: {error}
                </div>
            )}

            {/* Loading State */}
            {loading ? (
                <div className="flex justify-center py-12">
                    <div className="spinner" />
                </div>
            ) : (
                <>
                    {/* Projects Table */}
                    <Card>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>ID Investasi</TableHead>
                                    <TableHead>Project Definition</TableHead>
                                    <TableHead>Entitas Terminal</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead>RKAP</TableHead>
                                    <TableHead>Status Issue</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredProjects.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                                            Tidak ada project ditemukan
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredProjects.map((project) => (
                                        <TableRow key={project.id_root}>
                                            <TableCell className="font-medium">{project.id_investasi}</TableCell>
                                            <TableCell className="max-w-[250px] truncate">
                                                {project.project_definition}
                                            </TableCell>
                                            <TableCell>{project.entitas_terminal}</TableCell>
                                            <TableCell>
                                                <Badge variant="secondary">{project.type_investasi || '-'}</Badge>
                                            </TableCell>
                                            <TableCell>{formatCurrency(project.rkap)}</TableCell>
                                            <TableCell>
                                                <Badge variant={project.status_issue === 'Open' ? 'warning' : 'success'}>
                                                    {project.status_issue || '-'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-1">
                                                    <Link to={`/projects/${project.id_root}`}>
                                                        <Button variant="ghost" size="icon">
                                                            <Eye className="h-4 w-4" />
                                                        </Button>
                                                    </Link>
                                                    <Link to={`/projects/${project.id_root}/edit`}>
                                                        <Button variant="ghost" size="icon">
                                                            <Edit className="h-4 w-4" />
                                                        </Button>
                                                    </Link>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => setDeleteDialog({ open: true, project })}
                                                    >
                                                        <Trash2 className="h-4 w-4 text-destructive" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </Card>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex justify-center items-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => goToPage(page - 1)}
                                disabled={page === 1}
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <span className="text-sm text-muted-foreground">
                                Halaman {page} dari {totalPages}
                            </span>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => goToPage(page + 1)}
                                disabled={page === totalPages}
                            >
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                    )}
                </>
            )}

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ open, project: null })}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Hapus Project</DialogTitle>
                        <DialogDescription>
                            Apakah Anda yakin ingin menghapus project "{deleteDialog.project?.project_definition}"?
                            Tindakan ini tidak dapat dibatalkan.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteDialog({ open: false, project: null })}>
                            Batal
                        </Button>
                        <Button variant="destructive" onClick={handleDelete}>
                            Hapus
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
