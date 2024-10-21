import DataGrid from 'react-data-grid'
import 'react-data-grid/lib/styles.css'

export default function DataGridIndex() {
  const columns = [
    { key: 'id', name: 'ID' },
    { key: 'title', name: 'Title' },
    { key: 'title_0', name: 'Title' },
    { key: 'title_1', name: 'Title' },
    { key: 'title_2', name: 'Title' },
    { key: 'title_3', name: 'Title' },
    { key: 'title_4', name: 'Title' },
    { key: 'title_5', name: 'Title' },
    { key: 'title_6', name: 'Title' },
    { key: 'title_7', name: 'Title' },
    { key: 'title_8', name: 'Title' },
    { key: 'title_9', name: 'Title' },
    { key: 'title_10', name: 'Title' },
    { key: 'title_11', name: 'Title' },
    { key: 'title_12', name: 'Title' },
    { key: 'title_13', name: 'Title' },
    { key: 'title_14', name: 'Title' },
    { key: 'title_15', name: 'Title' },
    { key: 'title_16', name: 'Title' },
    { key: 'title_17', name: 'Title' },
    { key: 'title_18', name: 'Title' },
  ]

  const rows = [
    { id: 0, title: 'Example' },
    { id: 1, title: 'Demo' },
    { id: 1, title: 'Demo' },
    { id: 1, title: 'Demo' },
    { id: 1, title: 'Demo' },
    { id: 1, title: 'Demo' },
    { id: 1, title: 'Demo' },
    { id: 1, title: 'Demo' },
    { id: 1, title: 'Demo' },
    { id: 1, title: 'Demo' },
    { id: 1, title: 'Demo' },
    { id: 1, title: 'Demo' },
    { id: 1, title: 'Demo' },
    { id: 1, title: 'Demo' },
    { id: 1, title: 'Demo' },
    { id: 1, title: 'Demo' },
    { id: 1, title: 'Demo' },
    { id: 1, title: 'Demo' },
    { id: 1, title: 'Demo' },
    { id: 1, title: 'Demo' },
    { id: 1, title: 'Demo' },
    { id: 1, title: 'Demo' },
    { id: 1, title: 'Demo' },
    { id: 1, title: 'Demo' },
  ]
  return (
    <>
      <h1>DataGridIndex</h1>
      <DataGrid columns={columns} rows={rows} />
    </>
  )
}
