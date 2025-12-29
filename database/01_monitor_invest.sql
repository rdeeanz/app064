CREATE TABLE monitor_invest (
    -- PK Internal
    id BIGSERIAL PRIMARY KEY,
    
    -- Kunci Utama (Foreign Key ke project_invest)
    ref_id_root VARCHAR(100), 

    -- Kolom Data (Disalin strukturnya dari tabel utama)
    klaster_regional VARCHAR(100),
    entitas_terminal VARCHAR(255),
    original_id_investasi VARCHAR(100), -- Menyimpan id_investasi asli
    
    -- Categorization
    asset_categories VARCHAR(255),
    type_investasi type_investasi_enum, -- Menggunakan tipe ENUM yang sama
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
    status_issue status_issue_enum, -- Menggunakan tipe ENUM yang sama
    
    -- RKAP (Budget Plan)
    tahun_rkap INTEGER,
    kebutuhan_dana NUMERIC(18, 2),
    rkap NUMERIC(18, 2),
    rkap_januari NUMERIC(18, 2),
    rkap_februari NUMERIC(18, 2),
    rkap_maret NUMERIC(18, 2),
    rkap_april NUMERIC(18, 2),
    rkap_mei NUMERIC(18, 2),
    rkap_juni NUMERIC(18, 2),
    rkap_juli NUMERIC(18, 2),
    rkap_agustus NUMERIC(18, 2),
    rkap_september NUMERIC(18, 2),
    rkap_oktober NUMERIC(18, 2),
    rkap_november NUMERIC(18, 2),
    rkap_desember NUMERIC(18, 2),

    -- Contract Information
    judul_kontrak VARCHAR(500),
    nilai_kontrak NUMERIC(18, 2),
    penyerapan_sd_tahun_lalu NUMERIC(18, 2),

    -- Realization (Monthly)
    realisasi_januari NUMERIC(18, 2),
    realisasi_februari NUMERIC(18, 2),
    realisasi_maret NUMERIC(18, 2),
    realisasi_april NUMERIC(18, 2),
    realisasi_mei NUMERIC(18, 2),
    realisasi_juni NUMERIC(18, 2),
    realisasi_juli NUMERIC(18, 2),
    realisasi_agustus NUMERIC(18, 2),
    realisasi_september NUMERIC(18, 2),
    realisasi_oktober NUMERIC(18, 2),
    realisasi_november NUMERIC(18, 2),
    realisasi_desember NUMERIC(18, 2),

    -- Prognosis (Monthly cumulative)
    prognosa_januari NUMERIC(18, 2),
    prognosa_februari NUMERIC(18, 2),
    prognosa_maret NUMERIC(18, 2),
    prognosa_april NUMERIC(18, 2),
    prognosa_mei NUMERIC(18, 2),
    prognosa_juni NUMERIC(18, 2),
    prognosa_juli NUMERIC(18, 2),
    prognosa_agustus NUMERIC(18, 2),
    prognosa_september NUMERIC(18, 2),
    prognosa_oktober NUMERIC(18, 2),
    prognosa_november NUMERIC(18, 2),
    prognosa_sd_desember NUMERIC(18, 2),

    -- Contract Details
    penyedia_jasa VARCHAR(500),
    no_kontrak VARCHAR(100),
    tanggal_kontrak DATE,
    tgl_mulai_kontrak DATE,
    jangka_waktu INTEGER,
    satuan_hari VARCHAR(50),
    tanggal_selesai DATE,

    -- Location
    latitude NUMERIC(10, 7),
    longitude NUMERIC(10, 7),

    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    -- CONSTRAINT FOREIGN KEY
    -- Hanya ref_id_root yang dikunci ke tabel induk agar integritas data terjaga
    CONSTRAINT fk_project_root 
        FOREIGN KEY (ref_id_root) 
        REFERENCES project_invest(id_root) 
        ON DELETE CASCADE
);
