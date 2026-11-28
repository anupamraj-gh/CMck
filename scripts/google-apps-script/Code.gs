const DEFAULT_SPREADSHEET_ID = '1RXCpzHV19EC34HOLoMGnCUVRfmPYZK0eUDREpaeRvtU'

function doGet(event) {
  const callback = event && event.parameter ? event.parameter.callback : ''
  if (!/^[A-Za-z_$][0-9A-Za-z_$]*$/.test(callback || '')) {
    throw new Error('A valid JSONP callback is required.')
  }

  const spreadsheetId =
    PropertiesService.getScriptProperties().getProperty('SPREADSHEET_ID') ||
    DEFAULT_SPREADSHEET_ID

  const spreadsheet = SpreadsheetApp.openById(spreadsheetId)
  const content = readConfigSheet_(spreadsheet)
  content.products = readProductsSheet_(spreadsheet)

  return ContentService
    .createTextOutput(callback + '(' + JSON.stringify(content) + ');')
    .setMimeType(ContentService.MimeType.JAVASCRIPT)
}

function readConfigSheet_(spreadsheet) {
  const sheet = spreadsheet.getSheetByName('config')
  if (!sheet) throw new Error('Missing sheet: config')

  const rows = sheet.getDataRange().getDisplayValues()
  const headers = rows.shift()
  const keyColumn = headers.indexOf('key')
  const valueColumn = headers.indexOf('json_value')
  if (keyColumn < 0 || valueColumn < 0) {
    throw new Error('The config sheet must have key and json_value columns.')
  }

  const content = {}
  rows.forEach(function (row) {
    const key = row[keyColumn].trim()
    const value = row[valueColumn].trim()
    if (key && value) content[key] = JSON.parse(value)
  })
  return content
}

function readProductsSheet_(spreadsheet) {
  const sheet = spreadsheet.getSheetByName('products')
  if (!sheet) throw new Error('Missing sheet: products')

  const rows = sheet.getDataRange().getDisplayValues()
  const headers = rows.shift()
  const valueColumn = headers.indexOf('json_value')
  if (valueColumn < 0) {
    throw new Error('The products sheet must have a json_value column.')
  }

  return rows
    .map(function (row) {
      const value = row[valueColumn].trim()
      return value ? JSON.parse(value) : null
    })
    .filter(function (product) {
      return product !== null
    })
}
