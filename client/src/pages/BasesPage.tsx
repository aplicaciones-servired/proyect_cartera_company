import { TableRoot, Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow, Input, Label, Badge, Button } from '../components/ui'
import { formatValue } from '../utils/funtions'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthProvider'
import { useEffect, useState } from 'react'
import { API_URL } from '../utils/contanst'
import { BasesI } from '../types/Bases'
import axios from 'axios'

const BasesPage = () => {
  const [data, setData] = useState<BasesI[]>([])
  const [asc, setAsc] = useState<boolean>(true)
  const { user } = useAuth()
  const navigate = useNavigate()

  const [vinculado, setVinculado] = useState<string>('')

  useEffect(() => {
    axios.get(`${API_URL}/getAllBases`)
      .then(response => setData(response.data))
      .catch(error => {
        console.error('Error al obtener los datos de bases:', error.response.data.message)
      })
  }, [])

  const handleClick = (id: string) => {
    return () => navigate(`/base/${id}`)
  }

  const handleCreateBase = () => {
    return navigate('/asignarNuevaBase')
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVinculado(e.target.value)
  }

  const filterVinculado = (data: BasesI[]) => {
    if (!vinculado) return data
    return data.filter(item => item.VINCULADO.toLowerCase().includes(vinculado.toLowerCase()))
  }

  const filteredData = filterVinculado(data)

  const handleSort = () => {
    const sortedData = [...filteredData].sort((a, b) => {
      if (asc) {
        return a.BASE - b.BASE
      } else {
        return b.BASE - a.BASE
      }
    })
    setAsc(!asc)
    setData(sortedData)
  }

  return (
    <section className=''>
      <section className='flex justify-around py-2 w-full'>
        <div className='flex items-center gap-2'>
          <Label>Vinculado: </Label>
          <Input type="text" placeholder="1118********" onChange={handleChange} value={vinculado} />
        </div>
        <div className='flex items-center gap-2 text-gray-600'>
          <p>N° Datos:</p>
          <Badge variant='warning'>
            {filteredData.length}
          </Badge>
        </div>
        {
          user?.sub_process === 'cartera'
            ? <Button onClick={handleCreateBase}>Asignar Nueva Base</Button>
            : <Button variant='ghost'></Button>
        }
      </section>
      <TableRoot className='h-[83vh]'>
        <Table>
          <TableHead className='sticky top-0 bg-gray-100 z-30'>
            <TableRow>
              <TableHeaderCell>#</TableHeaderCell>
              <TableHeaderCell>Nombres</TableHeaderCell>
              <TableHeaderCell>N° Cedula</TableHeaderCell>
              <TableHeaderCell onClick={handleSort} className='cursor-pointer hover:text-red-400'>
                Base Asignada ...
              </TableHeaderCell>
              <TableHeaderCell>Opciones</TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData.map((item, index) => (
              <TableRow key={item.VINCULADO}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{item.Seller.NOMBRES}</TableCell>
                <TableCell>
                  {item.VINCULADO}
                </TableCell>
                <TableCell>
                  {formatValue(item.BASE)}
                </TableCell>
                <TableCell>
                  {
                    user?.sub_process === 'cartera'
                      ? <Button variant='primary' onClick={handleClick(item.VINCULADO)}>Actualizar</Button>
                      : <Button variant='ghost' ></Button>
                  }
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableRoot>
    </section>
  )
}

export default BasesPage
