import { Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow, TableRoot, Card, Label, Input, Button, Badge, TableFoot } from '../components/ui'
import { BottonExporReporteConsolidado } from '../components/ExportConsolidado'
import { LoadingSvg } from '../components/icons'
import { DataOracle } from '../types/Recaudo'
import { FormEvent, useState } from 'react'
import { API_URL } from '../utils/contanst'
import axios from 'axios'
import { formatValue } from '../utils/funtions'
import { InfoPersonReport } from '../components/InfoPersonReport'

function ReportOracle () {
  const [data, setData] = useState<DataOracle[] | null>(null)
  const [documento, setDocumento] = useState<string>('')
  const [fecha, setFecha] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)

  const handleSubmit = (ev: FormEvent) => {
    ev.preventDefault()

    setLoading(true)

    axios.post(`${API_URL}/reportOracle`, { fecha: fecha.slice(0, 10), documento })
      .then(res => {
        setData(res.data)
      })
      .catch(err => {
        console.error('Error en getRecaudo', err)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const sumarTotales = (data: DataOracle[]) => {
    return data.reduce((acc, item) => {
      acc.ventabruta += item.ventabruta
      acc.vtasiniva += item.vtasiniva
      acc.iva += item.iva
      acc.comision += item.comision
      acc.ventaneta += item.ventaneta
      acc.formularios += item.formularios
      return acc
    }, {
      ventabruta: 0,
      vtasiniva: 0,
      iva: 0,
      comision: 0,
      ventaneta: 0,
      formularios: 0
    })
  }

  return (
    <>
      <Card className='flex justify-around'>

        <p className='flex gap-2 items-center'>
          Cantida Datos:
          <Badge variant='default'>{data?.length || '0'}</Badge>
        </p>

        <form onSubmit={handleSubmit} className='flex items-center gap-4'>
          <div className='flex gap-2 items-center'>
            <Label htmlFor='fecha'>Fecha</Label>
            <Input type='date' id='fecha' required value={fecha} onChange={e => setFecha(e.target.value)} />
          </div>
          <div className='flex gap-2 items-center'>
            <Label htmlFor='documento'>Documento</Label>
            <Input type='text' id='documento' required value={documento} onChange={e => setDocumento(e.target.value)} />
          </div>
          <Button type='submit'>Buscar</Button>
        </form>

        <div className='flex items-center'>
          <BottonExporReporteConsolidado datos={data || []} />
        </div>

      </Card>

      <InfoPersonReport data={data || []} fecha={fecha}/>

      <Card className='mt-1'>
        <TableRoot className='h-[75vh] overflow-y-auto'>
          <Table>
            <TableHead className='sticky top-0 bg-gray-100 z-30'>
              <TableRow>
                <TableHeaderCell>N°</TableHeaderCell>
                <TableHeaderCell>Nombre Servicio</TableHeaderCell>
                <TableHeaderCell>Razón Social</TableHeaderCell>
                <TableHeaderCell>Servicio</TableHeaderCell>
                <TableHeaderCell>Venta Bruta</TableHeaderCell>
                <TableHeaderCell>Venta Sin IVA</TableHeaderCell>
                <TableHeaderCell>IVA</TableHeaderCell>
                <TableHeaderCell>Comisión</TableHeaderCell>
                <TableHeaderCell>Venta Neta</TableHeaderCell>
                <TableHeaderCell>Formularios</TableHeaderCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {
                data?.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{item.nombreservicio}</TableCell>
                    <TableCell>{item.razonsocial}</TableCell>
                    <TableCell>{item.servicio}</TableCell>
                    <TableCell className='text-right'>{formatValue(item.ventabruta)}</TableCell>
                    <TableCell className='text-right'>{formatValue(item.vtasiniva)}</TableCell>
                    <TableCell className='text-right'>{formatValue(item.iva)}</TableCell>
                    <TableCell className='text-right'>{formatValue(item.comision)}</TableCell>
                    <TableCell className='text-right'>{formatValue(item.ventaneta)}</TableCell>
                    <TableCell className='text-right'>{item.formularios}</TableCell>
                  </TableRow>
                ))
              }
            </TableBody>
            <TableFoot className='sticky bottom-0 bg-gray-100 z-30'>
              <TableRow>
                <TableHeaderCell colSpan={4} scope="row" className="text-right">
                  Total:
                </TableHeaderCell>
                <TableHeaderCell colSpan={1} scope="row" className="text-right">
                  {formatValue(sumarTotales(data || []).ventabruta)}
                </TableHeaderCell>
                <TableHeaderCell colSpan={1} scope="row" className="text-right">
                  {formatValue(sumarTotales(data || []).vtasiniva)}
                </TableHeaderCell>
                <TableHeaderCell colSpan={1} scope="row" className="text-right">
                  {formatValue(sumarTotales(data || []).iva)}
                </TableHeaderCell>
                <TableHeaderCell colSpan={1} scope="row" className="text-right">
                  {formatValue(sumarTotales(data || []).comision)}
                </TableHeaderCell>
                <TableHeaderCell colSpan={1} scope="row" className="text-right">
                  {formatValue(sumarTotales(data || []).ventaneta)}
                </TableHeaderCell>
                <TableHeaderCell colSpan={1} scope="row" className="text-right">
                  {sumarTotales(data || []).formularios}
                </TableHeaderCell>
              </TableRow>
            </TableFoot>
          </Table>
        </TableRoot>
      </Card>

      {
        <div className="absolute inset-60 z-30 flex flex-col items-center justify-center">
          {loading && (
            <div className="w-96 rounded-md flex flex-col shadow-lg items-center justify-center gap-4 py-4 px-6 z-30 bg-yellow-300 animate-pulse">
              <span className="text-lg font-semibold text-gray-800">Solicitando Información ...</span>
              <LoadingSvg />
            </div>
          )}
          {!loading && data && data.length === 0 && (
            <p className="text-right text-gray-600">No se encontraron datos para el documento y fecha seleccionados.</p>
          )}
        </div>
      }
    </>
  )
}

export default ReportOracle
