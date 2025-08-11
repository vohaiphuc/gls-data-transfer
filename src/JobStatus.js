
/**
 * Thêm vào log Job ID để quan sát complete
 */
function appendLogJobId(parsedResult, table) {
  const jobId = parsedResult?.jobReference?.jobId
  if (!jobId) {
    console.error("Invalid Job ID:", jobId)
    return
  }
  console.log("jobId:", jobId)

  const ss = SpreadsheetApp.getActiveSpreadsheet()
  const sheet = ss.getSheetByName("JOB_ID")
  sheet.appendRow([new Date(), jobId, null, null, null, table, moment(new Date()).format("DD/MM/YYYY")])
}

/**
 * Check BigQuery Job xem Job đã hoàn thành?
 */
function checkJobComplete() {
  const ss = SpreadsheetApp.getActiveSpreadsheet()
  const sheet = ss.getSheetByName("JOB_ID")
  const offsetRow = 80012
  const data = sheet.getRange(`A${offsetRow-1}:H`).getValues()
  data.shift()
  data.forEach((r, i) => {
    if (r[2] === "DONE") {
      return
    } else {
      let jobId = r[1]
      const job = BigQuery.Jobs.get(PROJECT_ID, jobId, { location: 'asia-east1' });
      const jobStatus = job.status?.state
      let check = [jobStatus, "", job.statistics?.totalBytesProcessed]
      if (job.status?.errorResult) {
        check[1] = job.status.errorResult.message
        sendNoti("checkJobComplete", `${r[5]} | ${job.status.errorResult.message}`)
      }
      console.log(check)
      sheet.getRange(i + offsetRow, 3, 1, 3).setValues([check])
    }
  })
}

/**
 * Kiểm tra trạng thái hoàn thành của 1 Job
 * job_K7OkxvwBLxBdRb7Cs8NAF8nUgEGi
 * Error: job_l_hECjjsUnYTlWajU9bk-8xQr6jF
 */
function checkBigQueryJobStatus(jobId = "job_K7OkxvwBLxBdRb7Cs8NAF8nUgEGi") {
  const projectId = PROJECT_ID;

  const job = BigQuery.Jobs.get(projectId, jobId, { location: 'asia-east1' });
  console.log(job.statistics.totalBytesProcessed)
  console.log(job)
  const jobStatus = job.status.state;

  if (jobStatus === 'DONE') {
    if (job.status.errorResult) {
      console.log('❌ Job failed: ' + job.status.errorResult.message);
    } else {
      console.log('✅ Job completed successfully.');
    }
  } else {
    console.log('⏳ Job is still running. Current state: ' + jobStatus);
  }
}