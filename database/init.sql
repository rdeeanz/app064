-- PostgreSQL initialization script for Project Management Investment System
-- This script creates the main project_invest table with all required fields

-- Enable UUID extension for generating unique IDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum types for constrained fields
CREATE TYPE type_investasi_enum AS ENUM ('Murni', 'Multi Year', 'Carry Forward');
CREATE TYPE status_issue_enum AS ENUM ('Open', 'Closed');

-- Main project investment table
CREATE TABLE project_invest (
    -- Primary identification (custom project ID format)
    id_root VARCHAR(100) PRIMARY KEY,
    
    -- Regional & Entity info
    klaster_regional VARCHAR(100) DEFAULT 'Regional 2',
    entitas_terminal VARCHAR(255),
    id_investasi VARCHAR(100),
    
    -- Categorization
    asset_categories VARCHAR(255),
    type_investasi type_investasi_enum,
    tahun_usulan INTEGER,
    project_definition TEXT,
    status_investasi VARCHAR(100),
    
    -- Progress & Issues
    progres_description TEXT,
    issue_categories VARCHAR(255),
    issue_description TEXT,
    action_target TEXT,
    head_office_support_desc TEXT,
    pic VARCHAR(255),
    status_issue status_issue_enum DEFAULT 'Open',
    
    -- RKAP (Budget Plan)
    tahun_rkap INTEGER DEFAULT 2025,
    kebutuhan_dana NUMERIC(18,2) DEFAULT 0,
    rkap NUMERIC(18,2) DEFAULT 0,
    rkap_januari NUMERIC(18,2) DEFAULT 0,
    rkap_februari NUMERIC(18,2) DEFAULT 0,
    rkap_maret NUMERIC(18,2) DEFAULT 0,
    rkap_april NUMERIC(18,2) DEFAULT 0,
    rkap_mei NUMERIC(18,2) DEFAULT 0,
    rkap_juni NUMERIC(18,2) DEFAULT 0,
    rkap_juli NUMERIC(18,2) DEFAULT 0,
    rkap_agustus NUMERIC(18,2) DEFAULT 0,
    rkap_september NUMERIC(18,2) DEFAULT 0,
    rkap_oktober NUMERIC(18,2) DEFAULT 0,
    rkap_november NUMERIC(18,2) DEFAULT 0,
    rkap_desember NUMERIC(18,2) DEFAULT 0,
    
    -- Contract Information
    judul_kontrak VARCHAR(500),
    nilai_kontrak NUMERIC(18,2) DEFAULT 0,
    penyerapan_sd_tahun_lalu NUMERIC(18,2) DEFAULT 0,
    
    -- Realization (Monthly)
    realisasi_januari NUMERIC(18,2) DEFAULT 0,
    realisasi_februari NUMERIC(18,2) DEFAULT 0,
    realisasi_maret NUMERIC(18,2) DEFAULT 0,
    realisasi_april NUMERIC(18,2) DEFAULT 0,
    realisasi_mei NUMERIC(18,2) DEFAULT 0,
    realisasi_juni NUMERIC(18,2) DEFAULT 0,
    realisasi_juli NUMERIC(18,2) DEFAULT 0,
    realisasi_agustus NUMERIC(18,2) DEFAULT 0,
    realisasi_september NUMERIC(18,2) DEFAULT 0,
    realisasi_oktober NUMERIC(18,2) DEFAULT 0,
    realisasi_november NUMERIC(18,2) DEFAULT 0,
    realisasi_desember NUMERIC(18,2) DEFAULT 0,
    
    -- Prognosis (Monthly累计)
    prognosa_januari NUMERIC(18,2) DEFAULT 0,
    prognosa_februari NUMERIC(18,2) DEFAULT 0,
    prognosa_maret NUMERIC(18,2) DEFAULT 0,
    prognosa_april NUMERIC(18,2) DEFAULT 0,
    prognosa_mei NUMERIC(18,2) DEFAULT 0,
    prognosa_juni NUMERIC(18,2) DEFAULT 0,
    prognosa_juli NUMERIC(18,2) DEFAULT 0,
    prognosa_agustus NUMERIC(18,2) DEFAULT 0,
    prognosa_september NUMERIC(18,2) DEFAULT 0,
    prognosa_oktober NUMERIC(18,2) DEFAULT 0,
    prognosa_november NUMERIC(18,2) DEFAULT 0,
    prognosa_sd_desember NUMERIC(18,2) DEFAULT 0,
    
    -- Contract Details
    penyedia_jasa VARCHAR(500),
    no_kontrak VARCHAR(100),
    tanggal_kontrak DATE,
    tgl_mulai_kontrak DATE,
    jangka_waktu INTEGER,
    satuan_hari VARCHAR(50) DEFAULT 'Hari',
    tanggal_selesai DATE,
    
    -- Location
    latitude NUMERIC(10,7),
    longitude NUMERIC(10,7),
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for common queries
CREATE INDEX idx_project_invest_klaster ON project_invest(klaster_regional);
CREATE INDEX idx_project_invest_tahun_rkap ON project_invest(tahun_rkap);
CREATE INDEX idx_project_invest_status_issue ON project_invest(status_issue);
CREATE INDEX idx_project_invest_type ON project_invest(type_investasi);
CREATE INDEX idx_project_invest_status ON project_invest(status_investasi);

-- Create trigger for updating updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_project_invest_updated_at
    BEFORE UPDATE ON project_invest
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data for testing
INSERT INTO project_invest (
    id_root,
    id_investasi,
    entitas_terminal,
    project_definition,
    asset_categories,
    type_investasi,
    tahun_usulan,
    status_investasi,
    pic,
    kebutuhan_dana,
    rkap,
    nilai_kontrak
) VALUES 
(
    'P/25.01.001-001',
    'INV-2025-001',
    'Terminal Pelabuhan Jakarta',
    'Pengembangan Dermaga Baru untuk Kapal Kontainer',
    'Infrastruktur',
    'Murni',
    2025,
    'Dalam Proses',
    'Ahmad Hidayat',
    50000000000.00,
    45000000000.00,
    48000000000.00
),
(
    'P/25.01.002-001',
    'INV-2025-002',
    'Terminal Pelabuhan Surabaya',
    'Modernisasi Sistem IT Terminal',
    'Teknologi',
    'Multi Year',
    2024,
    'Berjalan',
    'Budi Santoso',
    15000000000.00,
    12000000000.00,
    14500000000.00
),
(
    'P/25.01.003-001',
    'INV-2025-003',
    'Terminal Pelabuhan Makassar',
    'Pengadaan Alat Bongkar Muat',
    'Peralatan',
    'Carry Forward',
    2023,
    'Pending',
    'Citra Dewi',
    25000000000.00,
    20000000000.00,
    22000000000.00
);

-- Grant permissions for grafana read-only access (will be used later)
-- CREATE ROLE grafana_reader WITH LOGIN PASSWORD 'grafana_readonly';
-- GRANT SELECT ON ALL TABLES IN SCHEMA public TO grafana_reader;

DROP VIEW IF EXISTS view_monitor_invest;
CREATE OR REPLACE VIEW view_monitor_invest AS
SELECT
    -- === 1. IDENTITAS ===
    ROW_NUMBER() OVER (ORDER BY main.id_root) AS id_virtual,
    main.id_root AS ref_id_root,
    main.id_investasi AS original_id_investasi,

    -- === 2. DATA ATRIBUT UTAMA ===
    main.klaster_regional,
    main.entitas_terminal,
    main.asset_categories,
    main.type_investasi,
    main.tahun_usulan,
    main.project_definition,
    main.status_investasi,
    
    -- === 3. KOLOM DESCRIPTION & ATTRIBUTE (LOGIKA AGGREGATION) ===
    -- Jika di tabel induk (-001) kosong, ambil dari hasil gabungan anak-anaknya

    -- Progres Description (Pemisah: Baris Baru + Garis)
    COALESCE(main.progres_description, agg.gabungan_progres) AS progres_description,
    
    -- Issue Description (Pemisah: Baris Baru)
    COALESCE(main.issue_description, agg.gabungan_issue) AS issue_description,
    
    -- Action Target (Pemisah: Baris Baru)
    COALESCE(main.action_target, agg.gabungan_action) AS action_target,

    -- Issue Categories (Ambil Main)
    main.issue_categories,

    -- Head Office Support Desc (Pemisah: Baris Baru)
    COALESCE(main.head_office_support_desc, agg.gabungan_ho_support) AS head_office_support_desc,

    -- PIC (Pemisah: Koma)
    COALESCE(main.pic, agg.gabungan_pic) AS pic,

    -- Status Issue (Pemisah: Koma)
    -- Perhatikan: status_issue is ENUM, might need casting to text for string_agg
    COALESCE(main.status_issue::text, agg.gabungan_status_issue) AS status_issue,

    main.tahun_rkap,

    -- === 4. DATA KEUANGAN (SUMIF DARI AGG) ===
    COALESCE(agg.total_kebutuhan_dana, 0) AS kebutuhan_dana,
    COALESCE(agg.total_rkap, 0) AS rkap,

    -- RKAP Bulanan
    COALESCE(agg.sum_rkap_jan, 0) AS rkap_januari,
    COALESCE(agg.sum_rkap_feb, 0) AS rkap_februari,
    COALESCE(agg.sum_rkap_mar, 0) AS rkap_maret,
    COALESCE(agg.sum_rkap_apr, 0) AS rkap_april,
    COALESCE(agg.sum_rkap_mei, 0) AS rkap_mei,
    COALESCE(agg.sum_rkap_jun, 0) AS rkap_juni,
    COALESCE(agg.sum_rkap_jul, 0) AS rkap_juli,
    COALESCE(agg.sum_rkap_agu, 0) AS rkap_agustus,
    COALESCE(agg.sum_rkap_sep, 0) AS rkap_september,
    COALESCE(agg.sum_rkap_okt, 0) AS rkap_oktober,
    COALESCE(agg.sum_rkap_nov, 0) AS rkap_november,
    COALESCE(agg.sum_rkap_des, 0) AS rkap_desember,

    -- Realisasi Bulanan
    COALESCE(agg.sum_real_jan, 0) AS realisasi_januari,
    COALESCE(agg.sum_real_feb, 0) AS realisasi_februari,
    COALESCE(agg.sum_real_mar, 0) AS realisasi_maret,
    COALESCE(agg.sum_real_apr, 0) AS realisasi_april,
    COALESCE(agg.sum_real_mei, 0) AS realisasi_mei,
    COALESCE(agg.sum_real_jun, 0) AS realisasi_juni,
    COALESCE(agg.sum_real_jul, 0) AS realisasi_juli,
    COALESCE(agg.sum_real_agu, 0) AS realisasi_agustus,
    COALESCE(agg.sum_real_sep, 0) AS realisasi_september,
    COALESCE(agg.sum_real_okt, 0) AS realisasi_oktober,
    COALESCE(agg.sum_real_nov, 0) AS realisasi_november,
    COALESCE(agg.sum_real_des, 0) AS realisasi_desember,

    -- Prognosa Bulanan
    COALESCE(agg.sum_prog_jan, 0) AS prognosa_januari,
    COALESCE(agg.sum_prog_feb, 0) AS prognosa_februari,
    COALESCE(agg.sum_prog_mar, 0) AS prognosa_maret,
    COALESCE(agg.sum_prog_apr, 0) AS prognosa_april,
    COALESCE(agg.sum_prog_mei, 0) AS prognosa_mei,
    COALESCE(agg.sum_prog_jun, 0) AS prognosa_juni,
    COALESCE(agg.sum_prog_jul, 0) AS prognosa_juli,
    COALESCE(agg.sum_prog_agu, 0) AS prognosa_agustus,
    COALESCE(agg.sum_prog_sep, 0) AS prognosa_september,
    COALESCE(agg.sum_prog_okt, 0) AS prognosa_oktober,
    COALESCE(agg.sum_prog_nov, 0) AS prognosa_november,
    COALESCE(agg.sum_prog_des, 0) AS prognosa_sd_desember,

    -- === 5. SISA DATA ===
    main.judul_kontrak,
    main.nilai_kontrak,
    main.penyerapan_sd_tahun_lalu,
    main.penyedia_jasa,
    main.no_kontrak,
    main.tanggal_kontrak,
    main.tgl_mulai_kontrak,
    main.jangka_waktu,
    main.satuan_hari,
    main.tanggal_selesai,
    main.latitude,
    main.longitude,
    main.created_at,
    main.updated_at

FROM
    project_invest main
LEFT JOIN (
    SELECT 
        id_investasi,
        
        -- >>> TEKNIK PENGAMBILAN TEKS (STRING AGGREGATION) <<<
        -- Menggabungkan teks, mengabaikan NULL
        
        -- Progres: Newline + separator
        STRING_AGG(DISTINCT progres_description, E'\n---\n') AS gabungan_progres,
        
        -- Issue & Action & HO Support: Newline separator
        STRING_AGG(DISTINCT issue_description, E'\n') AS gabungan_issue,
        STRING_AGG(DISTINCT action_target, E'\n') AS gabungan_action,
        STRING_AGG(DISTINCT head_office_support_desc, E'\n') AS gabungan_ho_support,
        
        -- PIC & Status: Comma separator
        STRING_AGG(DISTINCT pic, ', ') AS gabungan_pic,
        STRING_AGG(DISTINCT status_issue::text, ', ') AS gabungan_status_issue,

        -- Aggregasi Keuangan (Sama seperti sebelumnya)
        SUM(kebutuhan_dana) AS total_kebutuhan_dana,
        SUM(rkap) AS total_rkap,
        
        -- RKAP
        SUM(rkap_januari) AS sum_rkap_jan, SUM(rkap_februari) AS sum_rkap_feb, 
        SUM(rkap_maret) AS sum_rkap_mar, SUM(rkap_april) AS sum_rkap_apr,
        SUM(rkap_mei) AS sum_rkap_mei, SUM(rkap_juni) AS sum_rkap_jun,
        SUM(rkap_juli) AS sum_rkap_jul, SUM(rkap_agustus) AS sum_rkap_agu,
        SUM(rkap_september) AS sum_rkap_sep, SUM(rkap_oktober) AS sum_rkap_okt,
        SUM(rkap_november) AS sum_rkap_nov, SUM(rkap_desember) AS sum_rkap_des,
        
        -- Realisasi
        SUM(realisasi_januari) AS sum_real_jan, SUM(realisasi_februari) AS sum_real_feb,
        SUM(realisasi_maret) AS sum_real_mar, SUM(realisasi_april) AS sum_real_apr,
        SUM(realisasi_mei) AS sum_real_mei, SUM(realisasi_juni) AS sum_real_jun,
        SUM(realisasi_juli) AS sum_real_jul, SUM(realisasi_agustus) AS sum_real_agu,
        SUM(realisasi_september) AS sum_real_sep, SUM(realisasi_oktober) AS sum_real_okt,
        SUM(realisasi_november) AS sum_real_nov, SUM(realisasi_desember) AS sum_real_des,

        -- Prognosa
        SUM(prognosa_januari) AS sum_prog_jan, SUM(prognosa_februari) AS sum_prog_feb,
        SUM(prognosa_maret) AS sum_prog_mar, SUM(prognosa_april) AS sum_prog_apr,
        SUM(prognosa_mei) AS sum_prog_mei, SUM(prognosa_juni) AS sum_prog_jun,
        SUM(prognosa_juli) AS sum_prog_jul, SUM(prognosa_agustus) AS sum_prog_agu,
        SUM(prognosa_september) AS sum_prog_sep, SUM(prognosa_oktober) AS sum_prog_okt,
        SUM(prognosa_november) AS sum_prog_nov, SUM(prognosa_sd_desember) AS sum_prog_des

    FROM project_invest
    GROUP BY id_investasi
) agg ON main.id_investasi = agg.id_investasi

WHERE
    main.id_root LIKE '%-001';
-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'user',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Seed Super Admin (password: password123)
-- Hash generated using bcrypt
INSERT INTO users (username, password_hash, role)
VALUES ('superadmin', '$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', 'admin')
ON CONFLICT (username) DO NOTHING;
