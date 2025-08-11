function getLastModifiedTime() {
  const projectId = PROJECT_ID
  const datasetId = 'tmf_fwd_internal';
  const tableId = 'TONG_XUAT';

  // Call BigQuery API to get table metadata
  const table = BigQuery.Tables.get(projectId, datasetId, tableId);

  // Convert lastModifiedTime (ms since epoch) to a Date
  const lastModified = new Date(Number(table.lastModifiedTime));

  console.log(table.lastModifiedTime)
  Logger.log(`Table: ${datasetId}.${tableId}`);
  Logger.log(`Last Modified: ${lastModified}`);
}