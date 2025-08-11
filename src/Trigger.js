// Function to create a trigger for 'lastModified1min' to run every minute
function createTrigger1min() {
  // Check if a trigger already exists for this function to avoid duplicate triggers
  const existingTriggers = ScriptApp.getProjectTriggers();
  const triggerExists = existingTriggers.some(trigger => trigger.getHandlerFunction() === 'lastModified1min');

  if (!triggerExists) {
    // Create a time-driven trigger to run 'lastModified1min' every minute
    ScriptApp.newTrigger('lastModified1min')
      .timeBased()
      .everyMinutes(1)
      .create();
    Logger.log('Trigger created to run "lastModified1min" every minute.');
  } else {
    Logger.log('Trigger already exists for "lastModified1min".');
  }
}

// Function to delete the trigger for 'lastModified1min'
function deleteTrigger1min() {
  // Retrieve all triggers in the project
  const existingTriggers = ScriptApp.getProjectTriggers();

  // Loop through triggers and delete any that match 'lastModified1min'
  existingTriggers.forEach(trigger => {
    if (trigger.getHandlerFunction() === 'lastModified1min') {
      ScriptApp.deleteTrigger(trigger);
      Logger.log('Trigger for "lastModified1min" deleted.');
    }
  });
}

// onOpen
function delayRefresh() {
  const ss = SpreadsheetApp.getActiveSpreadsheet()
  const sheet = ss.getSheetByName("CHINH_SUA_CUOI")
  const data = sheet.getDataRange().getValues()
  const refreshObj = convertToRefreshObj(data)

  // const disableId = data.filter(r => r[COL_ACTIVE - 1] == "Tạm Dừng").map(r => r[COL_ID - 1])
  const disableId = refreshObj.filter(r => r.status == "Tạm Dừng").map(r => r.id)
  console.log("disableId:", disableId)
  const downtime = getDowntimeProp()
  downtime.push(...disableId)
  const newDowntime = [...new Set(downtime)]
  if (newDowntime.length > 0) {
    setDowntimeProp(newDowntime)
    createTrigger5minDelay()
    ss.toast("Bắt đầu quá trình Delay Refresh")
  }
}

/**
 * @return {string[]}
 */
function getDowntimeProp() {
  const pp = PropertiesService.getScriptProperties()
  const downtime = pp.getProperty("downtime")
  if (!downtime) {
    setDowntimeProp([])
    return []
  }
  return JSON.parse(downtime)
}

function setDowntimeProp(downtime) {
  const pp = PropertiesService.getScriptProperties()
  pp.setProperty("downtime", JSON.stringify(downtime))
}

const DefaultDelayTime = 1
function getDelayTimeProp() {
  const pp = PropertiesService.getScriptProperties()
  const delayTime = pp.getProperty("delayTime")
  return delayTime || DefaultDelayTime
}

function setDelayTimeProp(minutes = DefaultDelayTime) {
  const pp = PropertiesService.getScriptProperties()
  pp.setProperty("delayTime", minutes)
}

/**
 * Reactive the downtime list of IDs (which has status "Tạm Dừng")
 */
function reactivateRefresh() {
  const ss = SpreadsheetApp.getActiveSpreadsheet()
  const sheet = ss.getSheetByName("CHINH_SUA_CUOI")
  const data = sheet.getDataRange().getValues()
  const refreshObj = convertToRefreshObj(data)

  const downtime = getDowntimeProp()
  refreshObj.forEach((r, i) => {
    if (downtime.includes(r.id)) {
      r.status = "Hoạt Động"
      let newRow = convertToArray(r)
      sheet.getRange(i + 2, 1, 1, newRow.length).setValues([newRow])
      console.log("Reactived:", r.ten, `(ID: "${r.id}")`)
    }
  })
  setDowntimeProp([])
  deleteTrigger5minDelay()
}

function createTrigger5minDelay() {
  const existingTriggers = ScriptApp.getProjectTriggers()
  const triggerExists = existingTriggers.some(trigger => trigger.getHandlerFunction() === 'reactivateRefresh')

  const minuteDelay = getDelayTimeProp()
  const milisecondDelay = +minuteDelay * 60 * 1000
  if (!triggerExists) {
    ScriptApp.newTrigger('reactivateRefresh')
      .timeBased()
      .after(milisecondDelay)
      .create()
    Logger.log(`Create trigger "reactivateRefresh" run after ${minuteDelay} minutes `)
  } else {
    deleteTrigger5minDelay()
    createTrigger5minDelay()
    Logger.log('Delete trigger "reactivateRefresh" and create a new one')
  }
}

function deleteTrigger5minDelay() {
  const existingTriggers = ScriptApp.getProjectTriggers();

  existingTriggers.forEach(trigger => {
    if (trigger.getHandlerFunction() === 'reactivateRefresh') {
      ScriptApp.deleteTrigger(trigger);
      Logger.log('Trigger for "reactivateRefresh" deleted.');
    }
  });
}

function tempoDisable(id = "1M4pM2tqv2AqsWALTJ-IHBSz1lpACtf6ezyuEoDq7Sqc") {
  const ss = SpreadsheetApp.getActiveSpreadsheet()
  const sheet = ss.getSheetByName("CHINH_SUA_CUOI")
  const data = sheet.getDataRange().getValues()
  const obj = convertToRefreshObj(data)
  obj.forEach((r, i) => {
    if (r.id === id) {
      r.status = "Tạm Dừng"
      let newRow = convertToArray(r)
      sheet.getRange(+i + 2, 1, 1, newRow.length).setValues([newRow])
    }
  })
  delayRefresh()
}
