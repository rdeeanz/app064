import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Edit, Calendar, Building, User, MapPin } from 'lucide-react'
import { projectAPI } from '@/lib/api'
import { formatCurrency, formatDate } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'

export default function ProjectDetail() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [project, setProject] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [updating, setUpdating] = useState(false)

    // Issue update form state
    const [issueForm, setIssueForm] = useState({
        issue_description: '',
        action_target: '',
        status_issue: ''
    })

    // Progress update form state
    const [progressForm, setProgressForm] = useState({
        progres_description: '',
        status_investasi: ''
    })

    useEffect(() => {
        async function fetchProject() {
            try {
                setLoading(true)
                const data = await projectAPI.getProject(id)
                setProject(data)
                setIssueForm({
                    issue_description: data.issue_description || '',
                    action_target: data.action_target || '',
                    status_issue: data.status_issue || 'Open'
                })
                setProgressForm({
                    progres_description: data.progres_description || '',
                    status_investasi: data.status_investasi || ''
                })
                setError(null)
            } catch (err) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }
        fetchProject()
    }, [id])

    const handleUpdateIssue = async (e) => {
        e.preventDefault()
        try {
            setUpdating(true)
            const updated = await projectAPI.updateIssue(id, issueForm)
            setProject(updated)
            alert('Issue berhasil diupdate!')
        } catch (err) {
            setError(err.message)
        } finally {
            setUpdating(false)
        }
    }

    const handleUpdateProgress = async (e) => {
        e.preventDefault()
        try {
            setUpdating(true)
            const updated = await projectAPI.updateProgress(id, progressForm)
            setProject(updated)
            alert('Progress berhasil diupdate!')
        } catch (err) {
            setError(err.message)
        } finally {
            setUpdating(false)
        }
    }

    if (loading) {
        return (
            <div className="flex justify-center py-12">
                <div className="spinner" />
            </div>
        )
    }

    if (error) {
        return (
            <div className="bg-destructive/10 text-destructive p-4 rounded-lg">
                Error: {error}
            </div>
        )
    }

    if (!project) {
        return (
            <div className="text-center py-12 text-muted-foreground">
                Project tidak ditemukan
            </div>
        )
    }

    // Calculate total realization
    const totalRealisasi = [
        'realisasi_januari', 'realisasi_februari', 'realisasi_maret', 'realisasi_april',
        'realisasi_mei', 'realisasi_juni', 'realisasi_juli', 'realisasi_agustus',
        'realisasi_september', 'realisasi_oktober', 'realisasi_november', 'realisasi_desember'
    ].reduce((sum, key) => sum + (parseFloat(project[key]) || 0), 0)

    const months = [
        { key: 'januari', label: 'Jan' },
        { key: 'februari', label: 'Feb' },
        { key: 'maret', label: 'Mar' },
        { key: 'april', label: 'Apr' },
        { key: 'mei', label: 'Mei' },
        { key: 'juni', label: 'Jun' },
        { key: 'juli', label: 'Jul' },
        { key: 'agustus', label: 'Agu' },
        { key: 'september', label: 'Sep' },
        { key: 'oktober', label: 'Okt' },
        { key: 'november', label: 'Nov' },
        { key: 'desember', label: 'Des' },
    ]

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                    <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold">{project.project_definition}</h1>
                        <div className="flex gap-2 mt-2">
                            <Badge variant="secondary">{project.id_investasi}</Badge>
                            <Badge variant={project.status_issue === 'Open' ? 'warning' : 'success'}>
                                {project.status_issue}
                            </Badge>
                            {project.type_investasi && (
                                <Badge variant="outline">{project.type_investasi}</Badge>
                            )}
                        </div>
                    </div>
                </div>
                <Link to={`/projects/${id}/edit`}>
                    <Button>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                    </Button>
                </Link>
            </div>

            {/* Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-start gap-3">
                            <Building className="h-5 w-5 text-muted-foreground mt-0.5" />
                            <div>
                                <p className="text-sm text-muted-foreground">Entitas Terminal</p>
                                <p className="font-medium">{project.entitas_terminal || '-'}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-start gap-3">
                            <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                            <div>
                                <p className="text-sm text-muted-foreground">PIC</p>
                                <p className="font-medium">{project.pic || '-'}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-start gap-3">
                            <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                            <div>
                                <p className="text-sm text-muted-foreground">Tahun RKAP</p>
                                <p className="font-medium">{project.tahun_rkap || '-'}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-start gap-3">
                            <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                            <div>
                                <p className="text-sm text-muted-foreground">Klaster Regional</p>
                                <p className="font-medium">{project.klaster_regional || '-'}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="keuangan">
                <TabsList>
                    <TabsTrigger value="keuangan">Keuangan</TabsTrigger>
                    <TabsTrigger value="kontrak">Kontrak</TabsTrigger>
                    <TabsTrigger value="progress">Progress</TabsTrigger>
                    <TabsTrigger value="issue">Issue</TabsTrigger>
                </TabsList>

                {/* Keuangan Tab */}
                <TabsContent value="keuangan" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">
                                    Kebutuhan Dana
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-xl font-bold">{formatCurrency(project.kebutuhan_dana)}</div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">
                                    RKAP
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-xl font-bold">{formatCurrency(project.rkap)}</div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">
                                    Total Realisasi
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-xl font-bold text-green-600">{formatCurrency(totalRealisasi)}</div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Monthly RKAP & Realisasi */}
                    <Card>
                        <CardHeader>
                            <CardTitle>RKAP & Realisasi Bulanan</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b">
                                            <th className="text-left py-2 font-medium">Bulan</th>
                                            {months.map(m => (
                                                <th key={m.key} className="text-right py-2 font-medium">{m.label}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr className="border-b">
                                            <td className="py-2 font-medium">RKAP</td>
                                            {months.map(m => (
                                                <td key={m.key} className="text-right py-2">
                                                    {formatCurrency(project[`rkap_${m.key}`])}
                                                </td>
                                            ))}
                                        </tr>
                                        <tr>
                                            <td className="py-2 font-medium">Realisasi</td>
                                            {months.map(m => (
                                                <td key={m.key} className="text-right py-2 text-green-600">
                                                    {formatCurrency(project[`realisasi_${m.key}`])}
                                                </td>
                                            ))}
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Kontrak Tab */}
                <TabsContent value="kontrak" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>{project.judul_kontrak || 'Informasi Kontrak'}</CardTitle>
                            <CardDescription>{project.no_kontrak || 'Belum ada nomor kontrak'}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-muted-foreground">Nilai Kontrak</p>
                                    <p className="text-lg font-bold">{formatCurrency(project.nilai_kontrak)}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Penyedia Jasa</p>
                                    <p className="font-medium">{project.penyedia_jasa || '-'}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Tanggal Kontrak</p>
                                    <p className="font-medium">{formatDate(project.tanggal_kontrak)}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Tanggal Mulai</p>
                                    <p className="font-medium">{formatDate(project.tgl_mulai_kontrak)}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Jangka Waktu</p>
                                    <p className="font-medium">
                                        {project.jangka_waktu ? `${project.jangka_waktu} ${project.satuan_hari || 'Hari'}` : '-'}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Tanggal Selesai</p>
                                    <p className="font-medium">{formatDate(project.tanggal_selesai)}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Progress Tab */}
                <TabsContent value="progress" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Deskripsi Progress</CardTitle>
                            <CardDescription>Status: {project.status_investasi || 'Belum di-set'}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground whitespace-pre-wrap">
                                {project.progres_description || 'Belum ada deskripsi progress'}
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Update Progress</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleUpdateProgress} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="status_investasi">Status Investasi</Label>
                                    <Select
                                        value={progressForm.status_investasi}
                                        onValueChange={(value) => setProgressForm(prev => ({ ...prev, status_investasi: value }))}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Pilih status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Dalam Proses">Dalam Proses</SelectItem>
                                            <SelectItem value="Berjalan">Berjalan</SelectItem>
                                            <SelectItem value="Pending">Pending</SelectItem>
                                            <SelectItem value="Selesai">Selesai</SelectItem>
                                            <SelectItem value="Dibatalkan">Dibatalkan</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="progres_description">Deskripsi Progress</Label>
                                    <Textarea
                                        id="progres_description"
                                        value={progressForm.progres_description}
                                        onChange={(e) => setProgressForm(prev => ({ ...prev, progres_description: e.target.value }))}
                                        rows={4}
                                        placeholder="Jelaskan progress terkini..."
                                    />
                                </div>
                                <Button type="submit" disabled={updating}>
                                    {updating ? 'Menyimpan...' : 'Simpan Progress'}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Issue Tab */}
                <TabsContent value="issue" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Issue Saat Ini</CardTitle>
                            <CardDescription>
                                Kategori: {project.issue_categories || 'Tidak ada kategori'}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <p className="text-sm font-medium mb-1">Deskripsi Issue</p>
                                <p className="text-muted-foreground whitespace-pre-wrap">
                                    {project.issue_description || 'Tidak ada issue'}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm font-medium mb-1">Action Target</p>
                                <p className="text-muted-foreground whitespace-pre-wrap">
                                    {project.action_target || '-'}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm font-medium mb-1">Head Office Support</p>
                                <p className="text-muted-foreground whitespace-pre-wrap">
                                    {project.head_office_support_desc || '-'}
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Update Issue</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleUpdateIssue} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="status_issue">Status Issue</Label>
                                    <Select
                                        value={issueForm.status_issue}
                                        onValueChange={(value) => setIssueForm(prev => ({ ...prev, status_issue: value }))}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Pilih status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Open">Open</SelectItem>
                                            <SelectItem value="Closed">Closed</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="issue_description">Deskripsi Issue</Label>
                                    <Textarea
                                        id="issue_description"
                                        value={issueForm.issue_description}
                                        onChange={(e) => setIssueForm(prev => ({ ...prev, issue_description: e.target.value }))}
                                        rows={3}
                                        placeholder="Jelaskan issue..."
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="action_target">Action Target</Label>
                                    <Textarea
                                        id="action_target"
                                        value={issueForm.action_target}
                                        onChange={(e) => setIssueForm(prev => ({ ...prev, action_target: e.target.value }))}
                                        rows={3}
                                        placeholder="Target tindakan yang dibutuhkan..."
                                    />
                                </div>
                                <Button type="submit" disabled={updating}>
                                    {updating ? 'Menyimpan...' : 'Simpan Issue'}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
