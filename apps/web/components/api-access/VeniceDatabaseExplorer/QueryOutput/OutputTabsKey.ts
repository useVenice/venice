export enum OutputTabsKey {
  csv = 'csv',
  dataTable = 'dataTable',
  json = 'json',
}

export function isOutputTabsKey(value: string): value is OutputTabsKey {
  return value in OutputTabsKey
}
