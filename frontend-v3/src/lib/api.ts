import axios from "axios"

const API_BASE_URL = "http://localhost:8000"

export const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
})

// Add auth token to requests
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("access_token")
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

// Handle auth errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem("access_token")
            localStorage.removeItem("user")
            window.location.href = "/login"
        }
        return Promise.reject(error)
    }
)

// Auth API
export async function login(username: string, password: string) {
    const formData = new URLSearchParams()
    formData.append("username", username)
    formData.append("password", password)

    const response = await api.post("/auth/token", formData, {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
    })
    return response.data
}

// Monitor API
export interface MonitorInvestData {
    id_virtual: number
    ref_id_root: string
    original_id_investasi: string
    klaster_regional: string | null
    entitas_terminal: string | null
    asset_categories: string | null
    type_investasi: string | null
    tahun_usulan: number | null
    project_definition: string | null
    status_investasi: string | null
    progres_description: string | null
    issue_description: string | null
    action_target: string | null
    issue_categories: string | null
    head_office_support_desc: string | null
    pic: string | null
    status_issue: string | null
    tahun_rkap: number | null
    kebutuhan_dana: number
    rkap: number
    rkap_januari: number
    rkap_februari: number
    rkap_maret: number
    rkap_april: number
    rkap_mei: number
    rkap_juni: number
    rkap_juli: number
    rkap_agustus: number
    rkap_september: number
    rkap_oktober: number
    rkap_november: number
    rkap_desember: number
    realisasi_januari: number
    realisasi_februari: number
    realisasi_maret: number
    realisasi_april: number
    realisasi_mei: number
    realisasi_juni: number
    realisasi_juli: number
    realisasi_agustus: number
    realisasi_september: number
    kontrak_aktif: string | null
    realisasi_oktober: number
    realisasi_november: number
    realisasi_desember: number
    // Cumulative realization columns (S.D. = Sampai Dengan)
    realisasi_sd_januari: number
    realisasi_sd_februari: number
    realisasi_sd_maret: number
    realisasi_sd_april: number
    realisasi_sd_mei: number
    realisasi_sd_juni: number
    realisasi_sd_juli: number
    realisasi_sd_agustus: number
    realisasi_sd_september: number
    realisasi_sd_oktober: number
    realisasi_sd_november: number
    realisasi_sd_desember: number
    prognosa_januari: number
    prognosa_februari: number
    prognosa_maret: number
    prognosa_april: number
    prognosa_mei: number
    prognosa_juni: number
    prognosa_juli: number
    prognosa_agustus: number
    prognosa_september: number
    prognosa_oktober: number
    prognosa_november: number
    prognosa_sd_desember: number
    judul_kontrak: string | null
    nilai_kontrak: number | null
    penyerapan_sd_tahun_lalu: number | null
    penyedia_jasa: string | null
    no_kontrak: string | null
    tanggal_kontrak: string | null
    tgl_mulai_kontrak: string | null
    jangka_waktu: number | null
    satuan_hari: string | null
    tanggal_selesai: string | null
    latitude: number | null
    longitude: number | null
    created_at: string | null
    updated_at: string | null
}

export async function getMonitorInvestData(): Promise<MonitorInvestData[]> {
    const response = await api.get<MonitorInvestData[]>("/monitor/invest")
    return response.data
}

// Projects API
export interface ProjectData {
    id_root: string
    id_investasi: string | null
    klaster_regional: string | null
    entitas_terminal: string | null
    asset_categories: string | null
    type_investasi: string | null
    tahun_usulan: number | null
    project_definition: string | null
    status_investasi: string | null
    progres_description: string | null
    issue_categories: string | null
    issue_description: string | null
    action_target: string | null
    head_office_support_desc: string | null
    pic: string | null
    status_issue: string | null
    tahun_rkap: number | null
    kebutuhan_dana: number | null
    rkap: number | null
    judul_kontrak: string | null
    nilai_kontrak: number | null
    penyedia_jasa: string | null
    no_kontrak: string | null
    tanggal_kontrak: string | null
    tgl_mulai_kontrak: string | null
    jangka_waktu: number | null
    satuan_hari: string | null
    tanggal_selesai: string | null
    kontrak_aktif: string | null
    created_at: string | null
    updated_at: string | null
}

export interface ProjectListResponse {
    total: number
    items: ProjectData[]
    page: number
    page_size: number
}

export interface ProjectCreateData {
    id_root: string
    id_investasi: string
    project_definition: string
    klaster_regional?: string
    entitas_terminal?: string
    asset_categories?: string
    type_investasi?: string
    tahun_usulan?: number
    status_investasi?: string
    pic?: string
    status_issue?: string
    tahun_rkap?: number
    kebutuhan_dana?: number
    rkap?: number
    judul_kontrak?: string
    nilai_kontrak?: number
    penyedia_jasa?: string
    no_kontrak?: string
    tanggal_kontrak?: string
    tgl_mulai_kontrak?: string
    jangka_waktu?: number
    tanggal_selesai?: string
}

export async function getProjects(page = 1, pageSize = 20): Promise<ProjectListResponse> {
    const response = await api.get<ProjectListResponse>("/projects", {
        params: { page, page_size: pageSize }
    })
    return response.data
}

export async function getProject(idRoot: string): Promise<ProjectData> {
    const response = await api.get<ProjectData>(`/projects/${encodeURIComponent(idRoot)}`)
    return response.data
}

export async function createProject(data: ProjectCreateData): Promise<ProjectData> {
    const response = await api.post<ProjectData>("/projects", data)
    return response.data
}

export async function updateProject(idRoot: string, data: Partial<ProjectCreateData>): Promise<ProjectData> {
    const response = await api.put<ProjectData>(`/projects/${encodeURIComponent(idRoot)}`, data)
    return response.data
}

export async function deleteProject(idRoot: string): Promise<void> {
    await api.delete(`/projects/${encodeURIComponent(idRoot)}`)
}

export async function getProjectsByInvestasi(idInvestasi: string): Promise<ProjectData[]> {
    const response = await api.get<ProjectData[]>(`/projects/invest-projects/${encodeURIComponent(idInvestasi)}`)
    return response.data
}

export interface FilterOptionsResponse {
    tgl_mulai_options: string[];
    tgl_selesai_options: string[];
    kontrak_aktif_options: string[];
}

export async function getFilterOptions(): Promise<FilterOptionsResponse> {
    const response = await api.get<FilterOptionsResponse>('/projects/filter-options')
    return response.data
}
