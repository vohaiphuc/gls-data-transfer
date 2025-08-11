function releaseLock() {
  const lock = LockService.getScriptLock();
  lock.releaseLock()
}

/**
 * Convert a table to object with the 1st row is a list of keys
 */
function convertToObj(arr) {
  const rows = [...arr]
  const header = rows[0]
  rows.shift()
  const objects = rows.map(row =>
    Object.fromEntries(header.map((key, i) => [key, row[i]]))
  )
  return objects
}

class RefreshBq {
  constructor(obj) {
    this.status = obj.status;
    this.refresh_rate_minute = obj.refresh_rate_minute;
    this.ten = obj.ten;
    this.url = obj.url;
    this.id = obj.id;
    this.last_modified = obj.last_modified;
    this.edit_code = obj.edit_code;
    this.recently_refresh = obj.recently_refresh;
    this.count_refresh = obj.count_refresh;
    this.dataset_bigquery = obj.dataset_bigquery;
    this.table_bigquery = obj.table_bigquery;
    this.query_cha = obj.query_cha;
    this.query_con = obj.query_con;
    this.last_run = obj.last_run;
  }
}

/**
 * Convert a table to object, then form the object to class RefreshBq
 */
function convertToRefreshObj(arr) {
  let convert = convertToObj(arr)
  let res = convert.map(r => new RefreshBq(r))
  return res
}

/**
 * Convert an object to an array
 */
function convertToArray(obj) {
  const valuesArray = Object.values(obj)
  return valuesArray
}

function lastModified1min() {
  const lock = LockService.getScriptLock();
  const lockTimeout = 5000

  if (!lock.tryLock(lockTimeout)) { // 5 giây
    console.log(`Timeout (${lockTimeout}ms)`)
    return
    // throw new Error(`Timeout (${lockTimeout}ms)`)
  }

  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet()
    const sheet = ss.getSheetByName("CHINH_SUA_CUOI")
    let lastModifiedDataTable = sheet.getDataRange().getValues()
    let lastModifiedData = convertToRefreshObj(lastModifiedDataTable)

    let newModifiedData = [...lastModifiedData]

    let hasModified = false
    let queryCha = []
    lastModifiedData.forEach((file, i) => {
      if (file.status != "Hoạt Động") {
        return
      }
      const last = file
      const driveFile = Drive.Files.get(file.id, { fields: 'modifiedTime' })

      const lastUpdatedTime = new Date(driveFile.modifiedTime)
      const lastUpdatedTimeNumber = lastUpdatedTime.getTime()

      let newRow = newModifiedData[i]
      if (lastUpdatedTimeNumber !== last.edit_code && moment().diff(moment(last.last_run), 'minutes') > +last.refresh_rate_minute) {
        hasModified = true
        refreshBigquery(last.dataset_bigquery, last.table_bigquery, last.query_con)
        queryCha.push(last.query_cha)

        newRow.last_modified = lastUpdatedTime
        newRow.edit_code = lastUpdatedTimeNumber
        newRow.recently_refresh = true
        newRow.count_refresh = last.count_refresh + 1
        newRow.last_run = new Date()
        let newRowArr = Object.values(newRow)
        sheet.getRange(+i + 2, 1, 1, newRowArr.length).setValues([newRowArr])
      } else {
        if (newRow.recently_refresh) {
          newRow.recently_refresh = false
          hasModified = true
          sheet.getRange(+i + 2, COL_LAM_MOI_BIGQUERY).setValue(false)
        }
      }
    })

    if (hasModified) {
      const sheetQueryCha = ss.getSheetByName("QUERY_CHA")
      const queryChaRefresh = [...new Set(queryCha)]
      queryChaRefresh.forEach(query => {
        console.log(query)
        refreshBigquery("", "", query)
        sheetQueryCha.appendRow(["", new Date(), moment(new Date()).format("DD/MM/YYYY")])
      })
    } else {
      console.warn("Không có thay đổi nào")
    }
  }
  catch (e) {
    sendNoti("lastModified1min", e.message)
    console.error(e)
    throw new Error(e.message)
  }
  finally {
    lock.releaseLock();
  }
}

function refreshBigquery(dataset = "tmf_fwd_internal", table = "NHAP_HPH_GAO", query = getGetQueryVhNhap()) {
  const projectId = 'gls-lakehouse-460507';
  const request = {
    query: query,
    useLegacySql: false
  };
  try {
    console.time(`Refreshed table: ${dataset}.${table}`);
    const queryResults = BigQuery.Jobs.query(request, projectId);
    const parsedResult = JSON.parse(queryResults)
    appendLogJobId(parsedResult, `${dataset}.${table}`)
    console.timeEnd(`Refreshed table: ${dataset}.${table}`);
  } catch (error) {
    console.log(`Error executing query (table ${dataset + "." + table}): ` + error.message);
  }
}

/**
 * Gọi API đồng bộ TONG_DOC_KE_TOAN_HOA_DON nếu trong phút gần nhất TONG_DOC có cập nhật
 * Trigger time driven: 5 minutes
 * https://script.google.com/home/projects/12dPr4bcFh0NCHYUc-qPHkp-3Osj2iWpdD6cQQUHcUqCOgcMilGtXmmae/edit
 * get_refresh_ke_toan.gs ---> refreshHoaDon()
 */
function syncDocKeToan1(force = false) {
  const ss = SpreadsheetApp.getActiveSpreadsheet()
  const tongDocLastRun = ss.getRangeByName("TONG_DOC_LAST_RUN").getValue()
  const now = moment()
  const target = moment(tongDocLastRun)
  const diffInMinutes = Math.abs(now.diff(target, 'minutes'))
  console.log("tongDocLastRun:", moment(tongDocLastRun).format("DD/MM/YYYY HH:mm:ss"))

  if (diffInMinutes <= 5 || force) {
    console.log("Gọi API đồng bộ TONG_DOC_KE_TOAN_HOA_DON")
    // api
    const sheetQueryCha = ss.getSheetByName("QUERY_CHA")

    // const data = API_KE_TOAN.refreshDocKeToanHoaDon()
    // const parsedResult = data.result
    // appendLogJobId(parsedResult, "tmf_fwd_internal.TONG_DOC_KE_TOAN_HOA_DON")
    // sheetQueryCha.appendRow(["tmf_fwd_internal.TONG_DOC_KE_TOAN_HOA_DON", new Date(), moment(new Date()).format("DD/MM/YYYY")])

    try {
      const data1 = API_KE_TOAN.refreshHoaDon()
      const parsedResult1 = data1.result
      appendLogJobId(parsedResult1, "tmf_fwd_internal.KTCN_HOA_DON")
      sheetQueryCha.appendRow(["tmf_fwd_internal.KTCN_HOA_DON", new Date(), moment(new Date()).format("DD/MM/YYYY")])
    } catch (e) {
      sendNoti("syncDocKeToan1", "Lỗi đồng bộ hóa đơn")
      throw new Error(e)
    }
  }
}

function testSyncDocKeToan1() {
  syncDocKeToan1(true)
}
