/**
 * VẬN HÀNH NHẬP
 */
const getGetQueryVhNhap = (dataset = "tmf_fwd_internal", table = "NHAP_HPH_GAO") => {
  const query = `
    CREATE OR REPLACE TABLE \`${PROJECT_ID}.${dataset}.${table}\` AS 
    SELECT * FROM \`${PROJECT_ID}.tmf_fwd_external.GS_${table}\` 
    WHERE id IS NOT NULL AND khach_hang IS NOT NULL;
  `;
  return query
}

const getGetQueryVhNhapGaoHph = () => {
  const query = `
    CREATE OR REPLACE TABLE \`${PROJECT_ID}.tmf_fwd_internal.NHAP_HPH_GAO\` AS 
    SELECT * FROM \`${PROJECT_ID}.tmf_fwd_external.GS_NHAP_HPH_GAO\` 
    WHERE x_id IS NOT NULL AND x_khach_hang IS NOT NULL;
    
    CREATE OR REPLACE TABLE \`${PROJECT_ID}.tmf_fwd_internal.DOC_HCM_HPH_GAO\` AS 
    SELECT CONCAT(IFNULL(x_ten_tau, ""), IFNULL(x_so_chuyen, ""), IFNULL(x_tuyen, ""), IFNULL(x_so_cont, "")) AS _pkId, *
    FROM \`${PROJECT_ID}.tmf_fwd_internal.NHAP_HPH_GAO\`;
  `;
  return query
}

const cotChungTongNhap = `
  gui_trucking,
  gui_doc,
  chi_nhanh,
  vhn,
  id,
  ten_tau,
  so_chuyen,
  tuyen,
  etd,
  eta,
  pod,
  vhx,
  cust_handle,
  kinh_doanh,
  nhom,
  phap_nhan,
  khach_hang,
  mat_hang,
  hub_lay_hang,
  ptvc,
  cont_20,
  cont_40,
  cont_40n,
  tai_trong,
  so_cont,
  so_seal,
  ngay_dong,
  ten_kho_dong,
  dia_chi_kho_dong,
  vat_tu_dong_hang_1,
  so_luong_vat_tu_dh_1,
  vat_tu_dong_hang_2,
  so_luong_vat_tu_dh_2,
  vat_tu_dong_hang_3,
  so_luong_vat_tu_dh_3,
  ghi_chu_cho_vhn,
  ghi_chu_cua_docs,
  kiem_dem,
  bao_hiem,
  gia_tri_hang_mua_bh,
  ma_kho_tra_1,
  ma_kho_tra_2,
  ma_kho_tra_3,
  ten_kho_tra,
  dia_chi_kho_tra,
  phuong_xa_kho_tra,
  quan_huyen_kho_tra,
  tinh_tra,
  lien_he,
  ten_salan_tra,
  voy_salan_tra,
  etd_salan_tra,
  eta_salan_tra,
  so_bill,
  ngay_tinh_luu_bai,
  ngay_tra_hang,
  ghi_chu_trucking,
  tg_yeu_cau_den_kho,
  tg_du_kien_roi_kho,
  tg_du_kien_den_kho_trucking,
  tg_thuc_te_den_kho,
  tg_bat_dau_lam_hang,
  tg_thuc_te_roi_kho,
  ket_hop_sau_tra,
  ly_do,
  bien_so_xe,
  thong_tin_xe_tra,
  vat_tu_thu_hoi_1,
  so_luong_vat_tu_th_1,
  vat_tu_thu_hoi_2,
  so_luong_vat_tu_th_2,
  vat_tu_thu_hoi_3,
  so_luong_vat_tu_th_3,
  noi_ha_rong,
  dich_vu,
  tien_mat_thu_khach,
  luu_cont_thu_khach,
  phi_local_charge,
  phai_thu_vh_chi_ho_kh,
  vsc,
  phi_do,
  lolo_pod,
  giam_lolo_pod,
  trucking_pod_khong_vat,
  neo_xe_pod_khong_vat,
  cuoc_salan_pod,
  luu_cont_pod,
  phi_boc_xep_co_vat_pod,
  phi_boi_duong_pod,
  phi_qua_tai_pod,
  chi_phi_khac_phi_can_xe_co_vat,
  kiem_dem_pod,
  phi_du_phong,
  phi_khac_vhn_chi_ho_kh,
  ghi_chu_vhn_chi_ho_kh,
  phi_khac_chi_ho_vh,
  ghi_chu_phi_khac_chi_ho_vh,
  dien_giai_su_co,
  nhom_nguyen_nhan,
  phan_dinh_trach_nhiem,
`

const cotChungTongNhapParsed = `
  ${cotChungTongNhap}
  SAFE_CAST(REPLACE(REPLACE(phi_phat_sinh_khong_vat, ' ', ''), ',' , '') AS FLOAT64) AS phi_phat_sinh_khong_vat,
  SAFE_CAST(REPLACE(REPLACE(phi_phat_sinh_co_vat, ' ', ''), ',' , '') AS FLOAT64) AS phi_phat_sinh_co_vat,
  SAFE_CAST(REPLACE(REPLACE(chi_phi_ton_that_hang_hoa, ' ', ''), ',' , '') AS FLOAT64) AS chi_phi_ton_that_hang_hoa,
  SAFE_CAST(REPLACE(REPLACE(phi_phat_sinh_thu_khach_hang, ' ', ''), ',' , '') AS FLOAT64) AS phi_phat_sinh_thu_khach_hang,
  SAFE_CAST(REPLACE(REPLACE(so_tien_thanh_ly_hang, ' ', ''), ',' , '') AS FLOAT64) AS so_tien_thanh_ly_hang,
  SAFE_CAST(REPLACE(REPLACE(so_tien_thu_bao_hiem, ' ', ''), ',' , '') AS FLOAT64) AS so_tien_thu_bao_hiem,
  SAFE_CAST(REPLACE(REPLACE(so_tien_phai_tra_khach_hang, ' ', ''), ',' , '') AS FLOAT64) AS so_tien_phai_tra_khach_hang,
`

const queryTongNhap = `
CREATE OR REPLACE TABLE \`${PROJECT_ID}.tmf_fwd_internal.TONG_NHAP\` AS
SELECT ${cotChungTongNhapParsed}
FROM \`${PROJECT_ID}.tmf_fwd_internal.NHAP_CLO\`
UNION ALL

SELECT ${cotChungTongNhapParsed}
FROM \`${PROJECT_ID}.tmf_fwd_internal.NHAP_DAN\`
UNION ALL

SELECT ${cotChungTongNhapParsed}
FROM \`${PROJECT_ID}.tmf_fwd_internal.NHAP_HPH\`
UNION ALL

SELECT ${cotChungTongNhapParsed}
FROM \`${PROJECT_ID}.tmf_fwd_internal.NHAP_HCM_THUY\`
UNION ALL

SELECT ${cotChungTongNhapParsed}
FROM \`${PROJECT_ID}.tmf_fwd_internal.NHAP_HCM_NGAN\`
UNION ALL

SELECT ${cotChungTongNhapParsed}
FROM \`${PROJECT_ID}.tmf_fwd_internal.NHAP_HCM_HAI\`
UNION ALL

SELECT ${cotChungTongNhapParsed}
FROM \`${PROJECT_ID}.tmf_fwd_internal.NHAP_HPH_GAO\`
UNION ALL

SELECT ${cotChungTongNhap}
  phi_phat_sinh_khong_vat,
  phi_phat_sinh_co_vat,
  chi_phi_ton_that_hang_hoa,
  phi_phat_sinh_thu_khach_hang,
  so_tien_thanh_ly_hang,
  so_tien_thu_bao_hiem,
  so_tien_phai_tra_khach_hang
FROM \`${PROJECT_ID}.tmf_fwd_internal.TONG_NHAP_HISTORY\`
`
