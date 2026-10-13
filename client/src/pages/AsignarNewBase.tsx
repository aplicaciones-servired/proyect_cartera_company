import { Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRoot, TableRow, Card, Label, Input, Button } from '../components/ui'
import { AginarNuevaBaseComponent } from '../components/AsignarBase'
import { PropsCrating } from '../types/interface'
import { API_URL } from '../utils/contanst'
import { logger } from '../utils/logger'
import { useEffect, useState } from 'react'
import axios from 'axios'

interface UserSinBase {
  EMPRESA: '101' | '102'
  CUENTA: string
  VINCULADO: string
  Seller: {
    NOMBRES: string
  }
  Basis: null
}

const AsignarNewBase = () => {
  const [data, setData] = useState<UserSinBase[]>([])
  const [showForm, setShowForm] = useState(false)
  const [selectedItem, setSelectedItem] = useState<PropsCrating | null>(null)
  const [vincualdo, setVinculado] = useState('')

  useEffect(() => {
    axios.get(`${API_URL}/usersSinBase`)
      .then(res => setData(res.data))
      .catch(error => logger.error(error))
  }, [])

  const handleAssignClick = (item: UserSinBase) => {
    setSelectedItem({
      nombres: item.Seller.NOMBRES,
      vinculado: item.VINCULADO
    })
    setShowForm(true)
  }

  const handleCloseForm = () => {
    setShowForm(false)
    setSelectedItem(null)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVinculado(e.target.value)
  }

  const filterVinculado = () => {
    if (!vincualdo) return data
    return data.filter(item => item.VINCULADO.toLowerCase().includes(vincualdo.toLowerCase()))
  }

  return (
    <section className='flex flex-col gap-1'>

      <Card className='flex items-center justify-around py-2'>
        <h1>Vinculados Sin Base Asignada</h1>
        <div className='flex items-center w-96 gap-2'>
          <Label>Buscar Vinculado: </Label>
          <Input type="text" placeholder="Cédula" value={vincualdo} onChange={handleChange} />
        </div>
      </Card>

      <Card>
        <TableRoot className='h-[86vh] xl:h-[82vh] overflow-y-auto'>
          <Table>
            <TableHead className='sticky top-0 bg-gray-100 z-30'>
              <TableRow>
                <TableHeaderCell>#</TableHeaderCell>
                <TableHeaderCell>Nombres</TableHeaderCell>
                <TableHeaderCell>N° Cédula</TableHeaderCell>
                <TableHeaderCell>Empresa</TableHeaderCell>
                <TableHeaderCell>Opciones</TableHeaderCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filterVinculado().map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{item.Seller.NOMBRES}</TableCell>
                  <TableCell>{item.VINCULADO}</TableCell>
                  <TableCell>{item.EMPRESA === '101' ? 'Servired' : 'Multired'}</TableCell>
                  <TableCell>
                    <Button color='red' onClick={() => handleAssignClick(item)}>Asignar</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableRoot>
      </Card>

      {showForm && selectedItem && (<AginarNuevaBaseComponent nombres={selectedItem.nombres} vinculado={selectedItem.vinculado} funClose={handleCloseForm} />)}
    </section>
  )
}

export default AsignarNewBase
