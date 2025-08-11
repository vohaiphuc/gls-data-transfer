/**
 * Ghi lại CHINH_SUA_CUOI hàng giờ
 * Mục đích: kiểm tra số lượng bảng làm mới mỗi giờ
 */
function setLogHourly() {
  const ss = SpreadsheetApp.getActiveSpreadsheet()
  const sheetLastModify = ss.getSheetByName("CHINH_SUA_CUOI")
  const sheetLog = ss.getSheetByName("LOG")
  let lastModifiedData = sheetLastModify.getRange(2,1, sheetLastModify.getLastRow()-1, sheetLastModify.getLastColumn()).getValues()
  lastModifiedData = lastModifiedData.map(r => {
    return [new Date(), ...r]
  })
  sheetLog.getRange(sheetLog.getLastRow()+1, 1, lastModifiedData.length, lastModifiedData[0].length).setValues(lastModifiedData)
}
