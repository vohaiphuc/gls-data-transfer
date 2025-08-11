/**
 * THỰC HIỆN XE
 */
const getGetQueryThucHienXe = (dataset = "thuc_hien_xe", table = "TONG") => {
  const query = `
    CREATE OR REPLACE TABLE \`${PROJECT_ID}.${dataset}.${table}\` AS 
    SELECT * FROM \`thuc_hien_xe.GS_${table}\` 
    WHERE khach_hang IS NOT NULL;
  `;
  return query
}

/**
 * NOTE: lần tối ưu sau, hãy cho HISTORY về hết 1 bảng --> thuc_hien_xe.TONG_HISTORY (đã làm vào 14/06/2025)
 */
const queryThucHienXeTong = `
  CREATE OR REPLACE TABLE \`${PROJECT_ID}.thuc_hien_xe.TONG\` AS
  WITH combined_data AS (
    SELECT "CLO" AS nguon, * FROM \`${PROJECT_ID}.thuc_hien_xe.CLO\`
    UNION ALL
    SELECT "HCM" AS nguon, * FROM \`${PROJECT_ID}.thuc_hien_xe.HCM\`
    UNION ALL
    SELECT "HPH" AS nguon, * FROM \`${PROJECT_ID}.thuc_hien_xe.HPH\`
    UNION ALL
    SELECT "DAN" AS nguon, * FROM \`${PROJECT_ID}.thuc_hien_xe.DAN\`
    UNION ALL
    SELECT "HCM" AS nguon, * FROM \`${PROJECT_ID}.thuc_hien_xe.GAO\`
    UNION ALL
    SELECT "CTH" AS nguon, * FROM \`${PROJECT_ID}.thuc_hien_xe.CTH\`
    UNION ALL
    SELECT * FROM \`${PROJECT_ID}.thuc_hien_xe.TONG_HISTORY\`
  )
  SELECT
    * EXCEPT(ngay_dong_tra_hang),
    SAFE.PARSE_DATE("%d/%m/%Y", ngay_dong_tra_hang) AS ngay_dong_tra_hang,
    SAFE.PARSE_DATETIME('%d/%m/%Y %H:%M', CONCAT(ngay_dong_tra_hang, ' ', thoi_gian_thuc_te_den_kho)) AS ata,
    SAFE.PARSE_DATETIME('%d/%m/%Y %H:%M', CONCAT(ngay_dong_tra_hang, ' ', thoi_gian_bat_dau_lam_hang)) AS sol,
    SAFE.PARSE_DATETIME('%d/%m/%Y %H:%M', CONCAT(ngay_dong_tra_hang, ' ', thoi_gian_xe_roi_kho)) AS eol,
    SAFE.PARSE_DATETIME('%d/%m/%Y %H:%M', CONCAT(ngay_dong_tra_hang, ' ', thoi_gian_du_kien_den_kho_trucking)) AS t_eta
  FROM combined_data WHERE khach_hang IS NOT NULL;
`
