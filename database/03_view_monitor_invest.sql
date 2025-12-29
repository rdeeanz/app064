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
