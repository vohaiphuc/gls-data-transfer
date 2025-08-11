function onEditTrigger() {
  const ss = SpreadsheetApp.getActiveSpreadsheet()
  const atSheet = ss.getActiveSheet()
  if (atSheet.getName() === "CHINH_SUA_CUOI") {
    const atRange = atSheet.getActiveRange()
    if (atRange.getColumn() == COL_ACTIVE && atRange.getRow() > 1) {
      delayRefresh()
    }
  }
}
