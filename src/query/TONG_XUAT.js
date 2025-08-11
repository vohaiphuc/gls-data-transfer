/**
 * VẬN HÀNH XUẤT
 */
const getGetQueryVhXuat = (dataset = "tmf_fwd_internal", table = "XUAT_HCM_THUY_GAO") => {
  const query = `
    CREATE OR REPLACE TABLE \`${PROJECT_ID}.${dataset}.${table}\` AS 
    SELECT * FROM \`${PROJECT_ID}.tmf_fwd_external.GS_${table}\` 
    WHERE id IS NOT NULL AND khach_hang IS NOT NULL;
  `;
  return query
}

const cotChungTongXuat = `
  trang_thai,
  gui_trucking,
  len_tau,
  gui_doc,
  chi_nhanh,
  id,
  ten_tau,
  so_chuyen,
  tuyen,
  pol,
  etd,
  vhx,
  cust_handle,
  kinh_doanh,
  nhom,
  phap_nhan,
  khach_hang,
  mat_hang,
  hub_lay_hang_du_kien,
  ptvc,
  cont_20,
  cont_40,
  cont_40n,
  tai_trong,
  so_cont,
  so_seal,
  ty_le_ket_hop,
  bien_so_xe,
  thong_tin_tai_xe,
  ngay_dong,
  phuong_an_dong,
  ma_kho_dong_1,
  ma_kho_dong_2,
  ma_kho_dong_3,
  ten_kho_dong,
  dia_chi_kho_dong,
  phuong_xa_kho_dong,
  quan_huyen_kho_dong,
  tinh_dong,
  lien_he_kho_dong,
  nguoi_book_hang,
  ghi_chu_gui_vhn,
  tg_yeu_cau_den_kho,
  tg_du_kien_roi_kho,
  tg_du_kien_den_kho_trucking,
  tg_thuc_te_den_kho,
  tg_bat_dau_lam_hang,
  tg_thuc_te_roi_kho,
  vat_tu_dong_hang_1,
  so_luong_vat_tu_1,
  vat_tu_dong_hang_2,
  so_luong_vat_tu_2,
  vat_tu_dong_hang_3,
  so_luong_vat_tu_3,
  loai_cont_cap,
  kiem_dem,
  bao_hiem,
  so_lenh,
  noi_lay_rong,
  hub_ha_hang,
  ten_salan_dong,
  voy_salan_dong,
  etd_salan_dong,
  eta_salan_dong,
  dich_vu,
  ghi_chu_cho_trucking,
  gia_tri_hang_mua_bh,
  phai_thu_vhx_chi_ho_kh,
  cuoc_tau_barem,
  giam_nhe,
  cuoc_db_theo_khach,
  giam_of_ha_lsip,
  cuoc_tau_thuc_tinh,
  seal,
  baf,
  lss,
  thc,
  lolo_pol,
  giam_lolo_pol,
  trucking_pol_khong_vat,
  trucking_pol_khong_vat_theo_pa_dong,
  neo_xe_khong_vat,
  cuoc_salan_pol,
  phi_boc_xep_co_vat,
  phi_boi_duong,
  phi_qua_tai_mooc,
  phi_mua_vat_tu_ngoai_job,
  phi_vat_tu_trong_job_co_vat,
  chi_phi_khac_phi_can_xe_co_vat,
  hoa_hong,
  kiem_dem_pol,
  du_phong,
  phi_quan_ly,
  phi_khac_vhx_chi_ho_kh,
  ghi_chu_vhx_chi_ho_kh,
  phi_khac_chi_ho_van_hanh,
  ghi_chu_phi_khac_chi_ho_van_hanh,
  dien_giai_su_co,
  nhom_nguyen_nhan,
  phan_dinh_trach_nhiem,
`

const cotChungTongXuatParsed = `
  ${cotChungTongXuat}
  SAFE_CAST(REPLACE(REPLACE(phi_phat_sinh_khong_vat, ' ', ''), ',' , '') AS FLOAT64) AS phi_phat_sinh_khong_vat,
  SAFE_CAST(REPLACE(REPLACE(phi_phat_sinh_co_vat, ' ', ''), ',' , '') AS FLOAT64) AS phi_phat_sinh_co_vat,
  SAFE_CAST(REPLACE(REPLACE(chi_phi_ton_that_hang_hoa, ' ', ''), ',' , '') AS FLOAT64) AS chi_phi_ton_that_hang_hoa,
  SAFE_CAST(REPLACE(REPLACE(phi_phat_sinh_thu_khach_hang, ' ', ''), ',' , '') AS FLOAT64) AS phi_phat_sinh_thu_khach_hang,
  SAFE_CAST(REPLACE(REPLACE(so_tien_thanh_ly_hang, ' ', ''), ',' , '') AS FLOAT64) AS so_tien_thanh_ly_hang,
  SAFE_CAST(REPLACE(REPLACE(so_tien_thu_bao_hiem, ' ', ''), ',' , '') AS FLOAT64) AS so_tien_thu_bao_hiem,
  SAFE_CAST(REPLACE(REPLACE(so_tien_phai_tra_khach_hang, ' ', ''), ',' , '') AS FLOAT64) AS so_tien_phai_tra_khach_hang,
`

const queryTongXuat = `
  CREATE OR REPLACE TABLE \`${PROJECT_ID}.tmf_fwd_internal.TONG_XUAT\` AS
  SELECT ${cotChungTongXuatParsed}
  FROM \`${PROJECT_ID}.tmf_fwd_internal.XUAT_HCM_THUY_GAO\`
  UNION ALL

  SELECT ${cotChungTongXuatParsed}
  FROM \`${PROJECT_ID}.tmf_fwd_internal.XUAT_HCM_SUONG_SANG\`

  UNION ALL
  SELECT ${cotChungTongXuatParsed}
  FROM \`${PROJECT_ID}.tmf_fwd_internal.XUAT_HCM_NGUYET_KIM\`

  UNION ALL
  SELECT ${cotChungTongXuatParsed}
  FROM \`${PROJECT_ID}.tmf_fwd_internal.XUAT_HCM_THIEN\`

  UNION ALL
  SELECT ${cotChungTongXuatParsed}
  FROM \`${PROJECT_ID}.tmf_fwd_internal.XUAT_CLO\`

  UNION ALL
  SELECT ${cotChungTongXuatParsed}
  FROM \`${PROJECT_ID}.tmf_fwd_internal.XUAT_DAN\`

  UNION ALL
  SELECT ${cotChungTongXuatParsed}
  FROM \`${PROJECT_ID}.tmf_fwd_internal.XUAT_HPH\`

  UNION ALL
  SELECT 
    ${cotChungTongXuat}
    phi_phat_sinh_khong_vat,
    phi_phat_sinh_co_vat,
    chi_phi_ton_that_hang_hoa,
    phi_phat_sinh_thu_khach_hang,
    so_tien_thanh_ly_hang,
    so_tien_thu_bao_hiem,
    so_tien_phai_tra_khach_hang
  FROM \`${PROJECT_ID}.tmf_fwd_internal.TONG_XUAT_HISTORY\`
`
