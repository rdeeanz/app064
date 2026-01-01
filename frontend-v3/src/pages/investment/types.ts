

// Column visibility options
export const COLUMN_VISIBILITY_OPTIONS = [
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
export const SORTABLE_COLUMNS = ["id_investasi", "klaster_regional", "entitas_terminal", "tahun_usulan", "status_investasi", "kebutuhan_dana", "rkap"];

// Initial column widths
export const INITIAL_COLUMN_WIDTHS: Record<string, number> = {
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

export type SortDirection = "asc" | "desc" | null;

export interface ExpandedRowData {
    id: number;
    id_investasi: string | null;
    klaster_regional: string;
    entitas_terminal: string;
    type_investasi: string;
    tahun_usulan: number;
    project_definition: string;
    status_investasi: string;
    kebutuhan_dana: number | null;
    rkap: number | null;
    judul_kontrak: string | null;
    nilai_kontrak: number | null;
    penyedia_jasa: string | null;
    tgl_mulai_kontrak: string | null;
    tanggal_selesai: string | null;
}
