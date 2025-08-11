// function releaseLock() {
//   const lock = LockService.getScriptLock();
//   lock.releaseLock()
// }

// function lastModified1min() {
//   const lock = LockService.getScriptLock();
//   const lockTimeout = 5000

//   if (!lock.tryLock(lockTimeout)) { // 5 giây
//     console.log(`Timeout (${lockTimeout}ms)`)
//     return
//     // throw new Error(`Timeout (${lockTimeout}ms)`)
//   }

//   try {
//     const ss = SpreadsheetApp.getActiveSpreadsheet()
//     const sheet = ss.getSheetByName("CHINH_SUA_CUOI")
//     let lastModifiedData = sheet.getDataRange().getValues()
//     const title = lastModifiedData[0]
//     lastModifiedData.shift()
//     let newModifiedData = [...lastModifiedData]

//     let hasModified = false
//     let queryCha = []
//     lastModifiedData.forEach((file, i) => {
//       if (file[CI.ACTIVE] != "Hoạt Động") {
//         return
//       }
//       const last = lastModifiedData[i]
//       const driveFile = Drive.Files.get(file[CI.ID], { fields: 'modifiedTime' })

//       const lastUpdatedTime = new Date(driveFile.modifiedTime)
//       const lastUpdatedTimeNumber = lastUpdatedTime.getTime()

//       if (lastUpdatedTimeNumber !== last[CI.ID_SUA]) {
//         newModifiedData[i][CI.NGAY_GIO_SUA] = lastUpdatedTime
//         newModifiedData[i][CI.ID_SUA] = lastUpdatedTimeNumber
//         newModifiedData[i][CI.LAM_MOI_BIGQUERY] = true
//         newModifiedData[i][CI.DEM_LAM_MOI] = last[CI.DEM_LAM_MOI] + 1

//         let dataset = last[CI.DATASET_BIGQUERY]
//         let table = last[CI.TABLE_BIGQUERY]
//         let query = ""
//         switch (last[CI.QUERY_CHA_BIGQUERY]) {
//           case "gls-lakehouse-460507.tmf_fwd_internal.TONG_XUAT":
//             query = getGetQueryVhXuat(dataset, table)
//             break;
//           case "gls-lakehouse-460507.tmf_fwd_internal.TONG_NHAP":
//             query = getGetQueryVhNhap(dataset, table)
//             break;
//           case "gls-lakehouse-460507.thuc_hien_xe.TONG":
//             query = getGetQueryThucHienXe(dataset, table)
//             break
//           case "gls-lakehouse-460507.tmf_fwd_internal.TONG_DOC":
//             query = getQueryDoc(table)
//             break
//           default:
//             break
//         }
//         refreshBigqueryCon(last[CI.DATASET_BIGQUERY], last[CI.TABLE_BIGQUERY], query)
//         hasModified = true
//         queryCha.push(last[CI.QUERY_CHA_BIGQUERY])
//         newModifiedData[i][CI.LAST_RUN] = new Date()

//         sheet.getRange(+i + 2, CI.NGAY_GIO_SUA + 1).setValue(lastUpdatedTime)
//         sheet.getRange(+i + 2, CI.ID_SUA + 1).setValue(lastUpdatedTimeNumber)
//         sheet.getRange(+i + 2, CI.LAM_MOI_BIGQUERY + 1).setValue(true)
//         sheet.getRange(+i + 2, CI.DEM_LAM_MOI + 1).setValue(last[CI.DEM_LAM_MOI] + 1)
//         sheet.getRange(+i + 2, CI.LAST_RUN + 1).setValue(new Date())
//       } else {
//         if (newModifiedData[i][CI.LAM_MOI_BIGQUERY]) {
//           newModifiedData[i][CI.LAM_MOI_BIGQUERY] = false
//           hasModified = true
//           sheet.getRange(+i + 2, CI.LAM_MOI_BIGQUERY + 1).setValue(false)
//         }
//       }
//     })

//     if (hasModified) {
//       const sheetQueryCha = ss.getSheetByName("QUERY_CHA")
//       const queryChaRefresh = [...new Set(queryCha)]
//       queryChaRefresh.forEach(q => {
//         let project = q.split(".")[0]
//         let dataset = q.split(".")[1]
//         let table = q.split(".")[2]
//         switch (`${project}.${dataset}.${table}`) {
//           case "gls-lakehouse-460507.tmf_fwd_internal.TONG_XUAT":
//             refreshQueryCha(queryTongXuat, "gls-lakehouse-460507.tmf_fwd_internal.TONG_XUAT")
//             console.log(queryTongXuat)
//             break;
//           case "gls-lakehouse-460507.tmf_fwd_internal.TONG_NHAP":
//             refreshQueryCha(queryTongNhap, "gls-lakehouse-460507.tmf_fwd_internal.TONG_NHAP")
//             break;
//           case "gls-lakehouse-460507.thuc_hien_xe.TONG":
//             refreshQueryCha(queryThucHienXeTong, "gls-lakehouse-460507.thuc_hien_xe.TONG")
//             break
//           case "gls-lakehouse-460507.tmf_fwd_internal.TONG_DOC":
//             refreshQueryCha(queryTongDoc, "gls-lakehouse-460507.tmf_fwd_internal.TONG_DOC")
//             break
//           default:
//             break
//         }
//         sheetQueryCha.appendRow([`${dataset}.${table}`, new Date(), moment(new Date()).format("DD/MM/YYYY")])
//       })
//       // sheet.getRange(2, 1, newModifiedData.length, title.length).setValues(newModifiedData)
//     } else {
//       console.warn("Không có thay đổi nào")
//     }
//   }
//   catch (e) {
//     sendNoti("lastModified1min", e.message)
//     console.error(e)
//     throw new Error(e.message)
//   }
//   finally {
//     lock.releaseLock();
//   }
// }

// function refreshBigqueryCon(dataset = "tmf_fwd_internal", table = "NHAP_HPH_GAO", query = getGetQueryVhNhap()) {
//   const projectId = 'gls-lakehouse-460507';
//   // const query = getGetQueryVhXuat(dataset, table)

//   // Set up the request
//   const request = {
//     query: query,
//     useLegacySql: false // Use Standard SQL
//   };

//   try {
//     console.time(`Refreshed table: ${dataset}.${table}`);
//     const queryResults = BigQuery.Jobs.query(request, projectId);
//     const parsedResult = JSON.parse(queryResults)
//     appendLogJobId(parsedResult, `${dataset}.${table}`)
//     console.timeEnd(`Refreshed table: ${dataset}.${table}`);
//   } catch (error) {
//     console.log(`Error executing query (table ${dataset + "." + table}): ` + error.message);
//   }
// }

// function refreshQueryCha(query, tableName) {
//   const projectId = 'gls-lakehouse-460507';

//   // Set up the request
//   const request = {
//     query,
//     useLegacySql: false // Use Standard SQL
//   };

//   try {
//     console.time(`Refreshed table: ${tableName}`);
//     const queryResults = BigQuery.Jobs.query(request, projectId);
//     const parsedResult = JSON.parse(queryResults)
//     appendLogJobId(parsedResult, tableName)
//     console.timeEnd(`Refreshed table: ${tableName}`);
//   } catch (error) {
//     console.log(`Error executing query (table ${tableName}): ` + error.message);
//   }
// }

// /**
//  * Gọi API đồng bộ TONG_DOC_KE_TOAN_HOA_DON nếu trong phút gần nhất TONG_DOC có cập nhật
//  * Trigger time driven: 5 minutes
//  * https://script.google.com/home/projects/12dPr4bcFh0NCHYUc-qPHkp-3Osj2iWpdD6cQQUHcUqCOgcMilGtXmmae/edit
//  * get_refresh_ke_toan.gs ---> refreshHoaDon()
//  */
// function syncDocKeToan1(force = false) {
//   const ss = SpreadsheetApp.getActiveSpreadsheet()
//   const tongDocLastRun = ss.getRangeByName("TONG_DOC_LAST_RUN").getValue()
//   const now = moment()
//   const target = moment(tongDocLastRun)
//   const diffInMinutes = Math.abs(now.diff(target, 'minutes'))
//   console.log("tongDocLastRun:", moment(tongDocLastRun).format("DD/MM/YYYY HH:mm:ss"))

//   if (diffInMinutes <= 5 || force) {
//     console.log("Gọi API đồng bộ TONG_DOC_KE_TOAN_HOA_DON")
//     // api
//     const sheetQueryCha = ss.getSheetByName("QUERY_CHA")

//     // const data = API_KE_TOAN.refreshDocKeToanHoaDon()
//     // const parsedResult = data.result
//     // appendLogJobId(parsedResult, "tmf_fwd_internal.TONG_DOC_KE_TOAN_HOA_DON")
//     // sheetQueryCha.appendRow(["tmf_fwd_internal.TONG_DOC_KE_TOAN_HOA_DON", new Date(), moment(new Date()).format("DD/MM/YYYY")])

//     try {
//       const data1 = API_KE_TOAN.refreshHoaDon()
//       const parsedResult1 = data1.result
//       appendLogJobId(parsedResult1, "tmf_fwd_internal.KTCN_HOA_DON")
//       sheetQueryCha.appendRow(["tmf_fwd_internal.KTCN_HOA_DON", new Date(), moment(new Date()).format("DD/MM/YYYY")])
//     } catch (e) {
//       sendNoti("syncDocKeToan1", "Lỗi đồng bộ hóa đơn")
//       throw new Error(e)
//     }
//   }
// }

// function testSyncDocKeToan1() {
//   syncDocKeToan1(true)
// }
