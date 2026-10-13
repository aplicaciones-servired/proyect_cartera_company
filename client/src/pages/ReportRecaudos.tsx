import { Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow, TableRoot, Card, Label, Input, Button, Badge } from '../components/ui'
import { BottonExporReporteRecaudoRealizados } from '../components/ExportRecaudo'
import { LoadingSvg } from '../components/icons'
import { DataRecaudo } from '../types/Recaudo'
import { FormEvent, useMemo, useState } from 'react'
import { API_URL } from '../utils/contanst'
import axios from 'axios'
import { toast } from 'sonner'

function ReportOracle () {
  const [data, setData] = useState<DataRecaudo[] | null>(null)
  const [fecha, setFecha] = useState<string>('')
  const [fecha2, setFecha2] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [zona, setZona] = useState<string | undefined>(undefined)
  const [filter, setFilter] = useState<string>('')

  const handleSubmit = (ev: FormEvent) => {
    ev.preventDefault()

    setLoading(true)

    axios.post(`${API_URL}/reportOracleRecaudo`, { fecha: fecha.slice(0, 10), fecha2: fecha2.slice(0, 10), zona })
      .then(res => {
        setData(res.data)
      })
      .catch(err => {
        if (err.response.status === 400) {
          toast.error('Error al intentar obtener los datos', {
            description: err.response.data.message
          })
        }
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const filteredData = useMemo(() => {
    if (!data) return null
    return data.filter(item => String(item.vendedor).includes(filter))
  }, [data, filter])

  return (
    <>
      <Card className='flex justify-around'>

        <p className='flex gap-0  items-center'>
          Cantida Datos:
          <Badge variant='default'>{filteredData?.length || '0'}</Badge>
        </p>

        <form onSubmit={handleSubmit} className='flex items-center gap-10'>
          <div className='flex gap-0 items-center'>
            <Label htmlFor='fecha'>Fecha Inicial:</Label>
            <Input type='date' id='fecha' required value={fecha} onChange={e => setFecha(e.target.value)} />
          </div>
          <div className='flex gap-0  items-center'>
            <Label htmlFor='fecha2'>Fecha Final:</Label>
            <Input type='date' id='fecha2' required value={fecha2} onChange={e => setFecha2(e.target.value)} />
          </div>

          <div className='flex gap-0  items-center'>
            <Label htmlFor='fecha2'>Elegir empresa:</Label>
            <select name='zona' required className='px-4 rounded-md w-48 borde' value={zona} onChange={e => setZona(e.target.value)} >
              <option value=' '>Empresa</option>
              <option value='39627'>Multired</option>
              <option value='39628'>Servired</option>
            </select>
          </div>

          <div className='flex gap-0 items-center'>
            <Label>Filtrar N° Doc</Label>
            <Input type="text" placeholder='1118*****' className='rounded-md' value={filter} onChange={ev => setFilter(ev.target.value)} />
          </div>

          <Button
            disabled={loading}
            type='submit'
          >
            {
              loading
                ? <div className='flex items-center justify-center gap-2'>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 1 1 16 0A8 8 0 0 1 4 12z"></path>
                </svg>
                Buscando ...</div>
                : 'Buscar'
            }
          </Button>
        </form>

        <div className='flex items-center'>
          <BottonExporReporteRecaudoRealizados datos={filteredData || []} />
        </div>

      </Card>

      <Card className='mt-1'>
        <TableRoot className='h-[75vh] overflow-y-auto'>
          <Table>
            <TableHead className='sticky top-0 bg-gray-100 z-30'>
              <TableRow>
                <TableHeaderCell>Fecha</TableHeaderCell>
                <TableHeaderCell>Municipio</TableHeaderCell>
                <TableHeaderCell>Vendedor</TableHeaderCell>
                <TableHeaderCell>Nombre del vendedor</TableHeaderCell>
                <TableHeaderCell>Hora recaudo</TableHeaderCell>
                <TableHeaderCell>Valor</TableHeaderCell>
                <TableHeaderCell>Cajero</TableHeaderCell>
                <TableHeaderCell>Nombre del cajero</TableHeaderCell>
                <TableHeaderCell>Descripcion</TableHeaderCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {
                filteredData?.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className='text-justify'>{new Date(item.fecha).toLocaleDateString()}</TableCell>
                    <TableCell className='text-justify'>{item.municipio}</TableCell>
                    <TableCell className='text-justify'>{item.vendedor} </TableCell>
                    <TableCell className='text-justify'>{item.nombre_vendedor.slice(0, 16)}</TableCell>
                    <TableCell className='text-justify'>{item.hora_recaudo?.split(' ')[1] || 'Hora no válida'}</TableCell>
                    <TableCell className='text-justify'>{item.valor}</TableCell>
                    <TableCell className='text-justify'>{item.cajero}</TableCell>
                    <TableCell className='text-justify'>{item.nombre_cajero.slice(0, 12)}</TableCell>
                    <TableCell className='text-justify'>{item.descripcion}</TableCell>
                  </TableRow>
                ))
              }
            </TableBody>
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
