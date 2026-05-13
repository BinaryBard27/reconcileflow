import Papa from 'papaparse'
import * as XLSX from 'xlsx'

export function parseCSVFile(file: File): Promise<any[]> {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      complete: (results) => {
        resolve(results.data)
      },
      error: (error) => {
        reject(error)
      },
      header: false,
      skipEmptyLines: true,
    })
  })
}

export function convertToExcel(data: any[], filename: string): void {
  const worksheet = XLSX.utils.aoa_to_sheet(data)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1')
  XLSX.writeFile(workbook, filename)
}

export function convertCSVToExcelText(csvText: string): string {
  const data = Papa.parse(csvText, { header: false }).data as any[][]
  const worksheet = XLSX.utils.aoa_to_sheet(data)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1')
  return XLSX.write(workbook, { type: 'buffer' })
}

export function deduplicateCSV(data: any[], keyColumns?: number[]): any[] {
  if (keyColumns && keyColumns.length > 0) {
    const seen = new Set()
    return data.filter(row => {
      const key = keyColumns.map(col => row[col]).join('|')
      if (seen.has(key)) return false
      seen.add(key)
      return true
    })
  }
  const seen = new Set()
  return data.filter(row => {
    const key = JSON.stringify(row)
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}

export function sortCSV(data: any[], columnIndex: number, ascending: boolean = true): any[] {
  return [...data].sort((a, b) => {
    const aVal = a[columnIndex]
    const bVal = b[columnIndex]
    const comparison = aVal < bVal ? -1 : aVal > bVal ? 1 : 0
    return ascending ? comparison : -comparison
  })
}

export function filterCSV(data: any[], columnIndex: number, condition: string, value: string): any[] {
  return data.filter(row => {
    const cellValue = String(row[columnIndex] || '').toLowerCase()
    const filterValue = value.toLowerCase()
    
    switch (condition) {
      case 'contains':
        return cellValue.includes(filterValue)
      case 'equals':
        return cellValue === filterValue
      case 'starts_with':
        return cellValue.startsWith(filterValue)
      case 'ends_with':
        return cellValue.endsWith(filterValue)
      case 'greater_than':
        return parseFloat(cellValue) > parseFloat(filterValue)
      case 'less_than':
        return parseFloat(cellValue) < parseFloat(filterValue)
      default:
        return true
    }
  })
}

export function transposeCSV(data: any[][]): any[][] {
  if (data.length === 0) return []
  const rows = data.length
  const cols = data[0].length
  const transposed: any[][] = []
  
  for (let col = 0; col < cols; col++) {
    transposed[col] = []
    for (let row = 0; row < rows; row++) {
      transposed[col][row] = data[row][col]
    }
  }
  
  return transposed
}

export function csvToJSON(data: any[], headers?: string[]): any[] {
  const headerRow = headers || data[0]
  const rows = headers ? data : data.slice(1)
  
  return rows.map(row => {
    const obj: any = {}
    headerRow.forEach((header: any, index: number) => {
      obj[header] = row[index]
    })
    return obj
  })
}

export function jsonToCSV(json: any[]): any[][] {
  if (json.length === 0) return []
  const headers = Object.keys(json[0])
  const rows = json.map(obj => headers.map(header => obj[header]))
  return [headers, ...rows]
}

export function mergeCSVs(dataArrays: any[][]): any[][] {
  if (dataArrays.length === 0) return []
  const headers = dataArrays[0][0]
  const mergedRows = [headers]
  
  dataArrays.forEach(data => {
    const rows = data.slice(1)
    mergedRows.push(...rows)
  })
  
  return mergedRows
}

export function splitCSV(data: any[][], chunkSize: number): any[][][] {
  if (data.length === 0) return []
  const headers = [data[0]]
  const rows = data.slice(1)
  const chunks: any[][][] = []
  
  for (let i = 0; i < rows.length; i += chunkSize) {
    const chunk = rows.slice(i, i + chunkSize)
    chunks.push([...headers, ...chunk])
  }
  
  return chunks
}

export function calculateStats(data: any[][], columnIndex: number): any {
  const rows = data.slice(1)
  const values = rows.map(row => parseFloat(row[columnIndex])).filter(v => !isNaN(v))
  
  if (values.length === 0) {
    return { count: 0, sum: 0, avg: 0, min: 0, max: 0 }
  }
  
  const sum = values.reduce((a, b) => a + b, 0)
  const avg = sum / values.length
  const min = Math.min(...values)
  const max = Math.max(...values)
  
  return {
    count: values.length,
    sum: sum.toFixed(2),
    avg: avg.toFixed(2),
    min: min.toFixed(2),
    max: max.toFixed(2),
  }
}

export function compareCSVs(data1: any[][], data2: any[][]): { added: any[][], removed: any[][], changed: any[][] } {
  const set1 = new Set(data1.map(row => JSON.stringify(row)))
  const set2 = new Set(data2.map(row => JSON.stringify(row)))
  
  const added = data2.filter(row => !set1.has(JSON.stringify(row)))
  const removed = data1.filter(row => !set2.has(JSON.stringify(row)))
  const changed = data2.filter(row => {
    const str = JSON.stringify(row)
    return set1.has(str) && set2.has(str)
  })
  
  return { added, removed, changed }
}

export function cleanCSV(data: any[][], options: { trim?: boolean; lowercase?: boolean; removeEmpty?: boolean }): any[][] {
  return data.map(row => {
    return row.map(cell => {
      let value = String(cell || '')
      if (options.trim) value = value.trim()
      if (options.lowercase) value = value.toLowerCase()
      if (options.removeEmpty && value === '') return null
      return value
    }).filter(cell => cell !== null)
  }).filter(row => row.length > 0)
}

export function aggregateCSV(data: any[][], groupColumn: number, aggColumn: number, aggType: 'sum' | 'avg' | 'count' = 'sum'): any[][] {
  const groups: { [key: string]: number[] } = {}
  const headers = data[0]
  const rows = data.slice(1)
  
  rows.forEach(row => {
    const key = row[groupColumn]
    const value = parseFloat(row[aggColumn]) || 0
    if (!groups[key]) groups[key] = []
    groups[key].push(value)
  })
  
  const result: any[][] = [[headers[groupColumn], `${aggType}_${headers[aggColumn]}`]]
  
  Object.entries(groups).forEach(([key, values]) => {
    let aggValue: number
    switch (aggType) {
      case 'sum':
        aggValue = values.reduce((a, b) => a + b, 0)
        break
      case 'avg':
        aggValue = values.reduce((a, b) => a + b, 0) / values.length
        break
      case 'count':
        aggValue = values.length
        break
    }
    result.push([key, aggValue.toFixed(2)])
  })
  
  return result
}
