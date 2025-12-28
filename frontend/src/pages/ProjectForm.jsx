import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Save } from 'lucide-react'
import { projectAPI } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'

const defaultFormData = {
    // Identification
    id_investasi: '',
    project_definition: '',
    entitas_terminal: '',
    klaster_regional: 'Regional 2',

    // Categorization
    asset_categories: '',
    type_investasi: '',
    tahun_usulan: new Date().getFullYear(),
    status_investasi: '',
    pic: '',

    // RKAP
    tahun_rkap: 2025,
    kebutuhan_dana: 0,
    rkap: 0,

    // Contract
    judul_kontrak: '',
    nilai_kontrak: 0,
    penyedia_jasa: '',
    no_kontrak: '',
    tanggal_kontrak: '',
    tgl_mulai_kontrak: '',
    jangka_waktu: '',
    satuan_hari: 'Hari',
    tanggal_selesai: '',

    // Location
    latitude: '',
    longitude: '',
}

export default function ProjectForm() {
    const { id } = useParams()
    const navigate = useNavigate()
    const isEdit = Boolean(id)

    const [formData, setFormData] = useState(defaultFormData)
    const [loading, setLoading] = useState(false)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState(null)

    // Fetch existing data for edit mode
    useEffect(() => {
        if (isEdit) {
            async function fetchProject() {
                try {
                    setLoading(true)
                    const data = await projectAPI.getProject(id)
                    // Map API response to form data
                    setFormData({
                        id_investasi: data.id_investasi || '',
                        project_definition: data.project_definition || '',
                        entitas_terminal: data.entitas_terminal || '',
                        klaster_regional: data.klaster_regional || 'Regional 2',
                        asset_categories: data.asset_categories || '',
                        type_investasi: data.type_investasi || '',
                        tahun_usulan: data.tahun_usulan || new Date().getFullYear(),
                        status_investasi: data.status_investasi || '',
                        pic: data.pic || '',
                        tahun_rkap: data.tahun_rkap || 2025,
                        kebutuhan_dana: data.kebutuhan_dana || 0,
                        rkap: data.rkap || 0,
                        judul_kontrak: data.judul_kontrak || '',
                        nilai_kontrak: data.nilai_kontrak || 0,
                        penyedia_jasa: data.penyedia_jasa || '',
                        no_kontrak: data.no_kontrak || '',
                        tanggal_kontrak: data.tanggal_kontrak?.split('T')[0] || '',
                        tgl_mulai_kontrak: data.tgl_mulai_kontrak?.split('T')[0] || '',
                        jangka_waktu: data.jangka_waktu || '',
                        satuan_hari: data.satuan_hari || 'Hari',
                        tanggal_selesai: data.tanggal_selesai?.split('T')[0] || '',
                        latitude: data.latitude || '',
                        longitude: data.longitude || '',
                    })
                    setError(null)
                } catch (err) {
                    setError(err.message)
                } finally {
                    setLoading(false)
                }
            }
            fetchProject()
        }
    }, [id, isEdit])

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        // Validate required fields
        if (!formData.id_investasi || !formData.project_definition) {
            setError('ID Investasi dan Project Definition wajib diisi')
            return
        }

        try {
            setSaving(true)
            setError(null)

            // Prepare data - convert empty strings to null for optional fields
            const submitData = {
                ...formData,
                kebutuhan_dana: parseFloat(formData.kebutuhan_dana) || 0,
                rkap: parseFloat(formData.rkap) || 0,
                nilai_kontrak: parseFloat(formData.nilai_kontrak) || 0,
                tahun_usulan: parseInt(formData.tahun_usulan) || null,
                tahun_rkap: parseInt(formData.tahun_rkap) || 2025,
                jangka_waktu: formData.jangka_waktu ? parseInt(formData.jangka_waktu) : null,
                latitude: formData.latitude ? parseFloat(formData.latitude) : null,
                longitude: formData.longitude ? parseFloat(formData.longitude) : null,
                tanggal_kontrak: formData.tanggal_kontrak || null,
                tgl_mulai_kontrak: formData.tgl_mulai_kontrak || null,
                tanggal_selesai: formData.tanggal_selesai || null,
                type_investasi: formData.type_investasi || null,
            }

            if (isEdit) {
                await projectAPI.updateProject(id, submitData)
            } else {
                await projectAPI.createProject(submitData)
            }

            navigate('/')
        } catch (err) {
            setError(err.message)
        } finally {
            setSaving(false)
        }
    }

    if (loading) {
        return (
            <div className="flex justify-center py-12">
                <div className="spinner" />
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <h1 className="text-2xl font-bold">
                    {isEdit ? 'Edit Project' : 'Tambah Project Baru'}
                </h1>
            </div>

            {/* Error */}
            {error && (
                <div className="bg-destructive/10 text-destructive p-4 rounded-lg">
                    {error}
                </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit}>
                <Tabs defaultValue="info">
                    <TabsList className="mb-4">
                        <TabsTrigger value="info">Informasi Dasar</TabsTrigger>
                        <TabsTrigger value="keuangan">Keuangan</TabsTrigger>
                        <TabsTrigger value="kontrak">Kontrak</TabsTrigger>
                    </TabsList>

                    {/* Info Tab */}
                    <TabsContent value="info">
                        <Card>
                            <CardHeader>
                                <CardTitle>Informasi Project</CardTitle>
                                <CardDescription>Data dasar project investasi</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="id_investasi">ID Investasi *</Label>
                                        <Input
                                            id="id_investasi"
                                            value={formData.id_investasi}
                                            onChange={(e) => handleChange('id_investasi', e.target.value)}
                                            placeholder="INV-2025-001"
                                            required
                                            disabled={isEdit}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="entitas_terminal">Entitas Terminal</Label>
                                        <Input
                                            id="entitas_terminal"
                                            value={formData.entitas_terminal}
                                            onChange={(e) => handleChange('entitas_terminal', e.target.value)}
                                            placeholder="Nama terminal"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="project_definition">Project Definition *</Label>
                                    <Textarea
                                        id="project_definition"
                                        value={formData.project_definition}
                                        onChange={(e) => handleChange('project_definition', e.target.value)}
                                        placeholder="Deskripsi project"
                                        rows={3}
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="klaster_regional">Klaster Regional</Label>
                                        <Input
                                            id="klaster_regional"
                                            value={formData.klaster_regional}
                                            onChange={(e) => handleChange('klaster_regional', e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="asset_categories">Asset Categories</Label>
                                        <Input
                                            id="asset_categories"
                                            value={formData.asset_categories}
                                            onChange={(e) => handleChange('asset_categories', e.target.value)}
                                            placeholder="Infrastruktur, Teknologi, dll"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="type_investasi">Type Investasi</Label>
                                        <Select
                                            value={formData.type_investasi}
                                            onValueChange={(value) => handleChange('type_investasi', value)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Pilih type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Murni">Murni</SelectItem>
                                                <SelectItem value="Multi Year">Multi Year</SelectItem>
                                                <SelectItem value="Carry Forward">Carry Forward</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="tahun_usulan">Tahun Usulan</Label>
                                        <Input
                                            id="tahun_usulan"
                                            type="number"
                                            value={formData.tahun_usulan}
                                            onChange={(e) => handleChange('tahun_usulan', e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="status_investasi">Status Investasi</Label>
                                        <Select
                                            value={formData.status_investasi}
                                            onValueChange={(value) => handleChange('status_investasi', value)}
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
                                        <Label htmlFor="pic">PIC</Label>
                                        <Input
                                            id="pic"
                                            value={formData.pic}
                                            onChange={(e) => handleChange('pic', e.target.value)}
                                            placeholder="Nama PIC"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="latitude">Latitude</Label>
                                        <Input
                                            id="latitude"
                                            type="number"
                                            step="0.0000001"
                                            value={formData.latitude}
                                            onChange={(e) => handleChange('latitude', e.target.value)}
                                            placeholder="-6.2088"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="longitude">Longitude</Label>
                                        <Input
                                            id="longitude"
                                            type="number"
                                            step="0.0000001"
                                            value={formData.longitude}
                                            onChange={(e) => handleChange('longitude', e.target.value)}
                                            placeholder="106.8456"
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Keuangan Tab */}
                    <TabsContent value="keuangan">
                        <Card>
                            <CardHeader>
                                <CardTitle>Data Keuangan</CardTitle>
                                <CardDescription>Informasi RKAP dan kebutuhan dana</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="tahun_rkap">Tahun RKAP</Label>
                                        <Input
                                            id="tahun_rkap"
                                            type="number"
                                            value={formData.tahun_rkap}
                                            onChange={(e) => handleChange('tahun_rkap', e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="kebutuhan_dana">Kebutuhan Dana (Rp)</Label>
                                        <Input
                                            id="kebutuhan_dana"
                                            type="number"
                                            value={formData.kebutuhan_dana}
                                            onChange={(e) => handleChange('kebutuhan_dana', e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="rkap">RKAP (Rp)</Label>
                                        <Input
                                            id="rkap"
                                            type="number"
                                            value={formData.rkap}
                                            onChange={(e) => handleChange('rkap', e.target.value)}
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Kontrak Tab */}
                    <TabsContent value="kontrak">
                        <Card>
                            <CardHeader>
                                <CardTitle>Informasi Kontrak</CardTitle>
                                <CardDescription>Data kontrak dan penyedia jasa</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="judul_kontrak">Judul Kontrak</Label>
                                    <Input
                                        id="judul_kontrak"
                                        value={formData.judul_kontrak}
                                        onChange={(e) => handleChange('judul_kontrak', e.target.value)}
                                        placeholder="Judul kontrak"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="no_kontrak">Nomor Kontrak</Label>
                                        <Input
                                            id="no_kontrak"
                                            value={formData.no_kontrak}
                                            onChange={(e) => handleChange('no_kontrak', e.target.value)}
                                            placeholder="KTR/2025/001"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="nilai_kontrak">Nilai Kontrak (Rp)</Label>
                                        <Input
                                            id="nilai_kontrak"
                                            type="number"
                                            value={formData.nilai_kontrak}
                                            onChange={(e) => handleChange('nilai_kontrak', e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="penyedia_jasa">Penyedia Jasa</Label>
                                    <Input
                                        id="penyedia_jasa"
                                        value={formData.penyedia_jasa}
                                        onChange={(e) => handleChange('penyedia_jasa', e.target.value)}
                                        placeholder="Nama perusahaan penyedia jasa"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="tanggal_kontrak">Tanggal Kontrak</Label>
                                        <Input
                                            id="tanggal_kontrak"
                                            type="date"
                                            value={formData.tanggal_kontrak}
                                            onChange={(e) => handleChange('tanggal_kontrak', e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="tgl_mulai_kontrak">Tanggal Mulai</Label>
                                        <Input
                                            id="tgl_mulai_kontrak"
                                            type="date"
                                            value={formData.tgl_mulai_kontrak}
                                            onChange={(e) => handleChange('tgl_mulai_kontrak', e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="tanggal_selesai">Tanggal Selesai</Label>
                                        <Input
                                            id="tanggal_selesai"
                                            type="date"
                                            value={formData.tanggal_selesai}
                                            onChange={(e) => handleChange('tanggal_selesai', e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="jangka_waktu">Jangka Waktu</Label>
                                        <Input
                                            id="jangka_waktu"
                                            type="number"
                                            value={formData.jangka_waktu}
                                            onChange={(e) => handleChange('jangka_waktu', e.target.value)}
                                            placeholder="365"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="satuan_hari">Satuan</Label>
                                        <Select
                                            value={formData.satuan_hari}
                                            onValueChange={(value) => handleChange('satuan_hari', value)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Hari">Hari</SelectItem>
                                                <SelectItem value="Bulan">Bulan</SelectItem>
                                                <SelectItem value="Tahun">Tahun</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>

                {/* Submit Button */}
                <div className="flex justify-end gap-4 mt-6">
                    <Button type="button" variant="outline" onClick={() => navigate(-1)}>
                        Batal
                    </Button>
                    <Button type="submit" disabled={saving}>
                        <Save className="h-4 w-4 mr-2" />
                        {saving ? 'Menyimpan...' : isEdit ? 'Update Project' : 'Simpan Project'}
                    </Button>
                </div>
            </form>
        </div>
    )
}
