INSERT INTO monitor_invest (
    ref_id_root, klaster_regional, entitas_terminal, original_id_investasi,
    asset_categories, type_investasi, tahun_usulan, project_definition, status_investasi,
    progres_description, issue_categories, issue_description, action_target, 
    head_office_support_desc, pic, status_issue,
    tahun_rkap, kebutuhan_dana, rkap, 
    rkap_januari, rkap_februari, rkap_maret, rkap_april, rkap_mei, rkap_juni,
    rkap_juli, rkap_agustus, rkap_september, rkap_oktober, rkap_november, rkap_desember,
    judul_kontrak, nilai_kontrak, penyerapan_sd_tahun_lalu,
    realisasi_januari, realisasi_februari, realisasi_maret, realisasi_april, realisasi_mei, realisasi_juni,
    realisasi_juli, realisasi_agustus, realisasi_september, realisasi_oktober, realisasi_november, realisasi_desember,
    prognosa_januari, prognosa_februari, prognosa_maret, prognosa_april, prognosa_mei, prognosa_juni,
    prognosa_juli, prognosa_agustus, prognosa_september, prognosa_oktober, prognosa_november, prognosa_sd_desember,
    penyedia_jasa, no_kontrak, tanggal_kontrak, tgl_mulai_kontrak, jangka_waktu, satuan_hari, tanggal_selesai,
    latitude, longitude
)
SELECT 
    id_root, klaster_regional, entitas_terminal, id_investasi,
    asset_categories, type_investasi, tahun_usulan, project_definition, status_investasi,
    progres_description, issue_categories, issue_description, action_target, 
    head_office_support_desc, pic, status_issue,
    tahun_rkap, kebutuhan_dana, rkap, 
    rkap_januari, rkap_februari, rkap_maret, rkap_april, rkap_mei, rkap_juni,
    rkap_juli, rkap_agustus, rkap_september, rkap_oktober, rkap_november, rkap_desember,
    judul_kontrak, nilai_kontrak, penyerapan_sd_tahun_lalu,
    realisasi_januari, realisasi_februari, realisasi_maret, realisasi_april, realisasi_mei, realisasi_juni,
    realisasi_juli, realisasi_agustus, realisasi_september, realisasi_oktober, realisasi_november, realisasi_desember,
    prognosa_januari, prognosa_februari, prognosa_maret, prognosa_april, prognosa_mei, prognosa_juni,
    prognosa_juli, prognosa_agustus, prognosa_september, prognosa_oktober, prognosa_november, prognosa_sd_desember,
    penyedia_jasa, no_kontrak, tanggal_kontrak, tgl_mulai_kontrak, jangka_waktu, satuan_hari, tanggal_selesai,
    latitude, longitude
FROM 
    project_invest
WHERE 
    id_root LIKE '%-001';
