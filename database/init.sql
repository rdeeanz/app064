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
