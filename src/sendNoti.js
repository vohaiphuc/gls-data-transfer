function sendNoti(funcName = "sendNoti", message = "Thông báo từ appscript") {
  const url = "https://hooks.slack.com/services/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" // #gls-error-noti
  // const url = "https://hooks.slack.com/services/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" // GLS Noti
  const now = Utilities.formatDate(new Date(), "GMT+7", "dd/MM/yyyy HH:mm:ss")
  const options = {
    method: "POST",
    payload: JSON.stringify({
      text: `[${now}] BigQuery 1 Minute | ${funcName}(): ${summarizeMessage(message)}`
    })
  }
  UrlFetchApp.fetch(url, options)
}

function summarizeMessage(message) {
  let newMessage = message.replace("Resources exceeded during query execution: Google Sheets service overloaded for spreadsheet id", "Google Sheets is overloaded")
  return newMessage
}