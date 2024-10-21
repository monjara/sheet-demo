import { useState } from 'react'
import Spreadsheet, { type CellBase, type Matrix } from 'react-spreadsheet'
import './App.css'

function App() {
  const [data, setData] = useState<Matrix<CellBase<string | number>>>([
    [
      { value: 'Vanilla' },
      { value: 'Chocolate' },
      { value: 'Strawberry' },
      { value: 'Cookies' },
      { value: '' },
      { value: '' },
      { value: '' },
      { value: '' },
      { value: '' },
      { value: '' },
      { value: '' },
      { value: '' },
      { value: '' },
      { value: '' },
      { value: '' },
      { value: '' },
      { value: '' },
      { value: '' },
      { value: '' },
      { value: '' },
      { value: '' },
      { value: '' },
      { value: '' },
      { value: '' },
      { value: '' },
      { value: '' },
      { value: '' },
      { value: '' },
      { value: '' },
      { value: '' },
      { value: '' },
      { value: '' },
      { value: '' },
      { value: '' },
      { value: '' },
      { value: '' },
      { value: '' },
      { value: '' },
      { value: '' },
      { value: '' },
      { value: '' },
      { value: '' },
      { value: '' },
      { value: '' },
      { value: '' },
      { value: '' },
    ],
    [{ value: 'Strawberry' }, { value: 'Cookies' }],
    [{ value: 'Strawberry' }, { value: 'Cookies' }],
    [{ value: 'Strawberry' }, { value: 'Cookies' }],
    [{ value: 'Strawberry' }, { value: 'Cookies' }],
    [{ value: 'Strawberry' }, { value: 'Cookies' }],
    [{ value: 'Strawberry' }, { value: 'Cookies' }],
    [{ value: 'Strawberry' }, { value: 'Cookies' }],
    [{ value: 'Strawberry' }, { value: 'Cookies' }],
    [{ value: 'Strawberry' }, { value: 'Cookies' }],
    [{ value: 'Strawberry' }, { value: 'Cookies' }],
    [{ value: 'Strawberry' }, { value: 'Cookies' }],
    [{ value: 'Strawberry' }, { value: 'Cookies' }],
    [{ value: 'Strawberry' }, { value: 'Cookies' }],
    [{ value: 'Strawberry' }, { value: 'Cookies' }],
    [{ value: 'Strawberry' }, { value: 'Cookies' }],
    [],
  ])
  return (
    <>
      <h1>React SpreadSheet</h1>
      <Spreadsheet data={data} onChange={setData} />
    </>
  )
}

export default App
