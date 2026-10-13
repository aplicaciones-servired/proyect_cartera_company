import { Card, Callout, Badge } from '../components/ui'
import { formatValue } from '../utils/funtions'
import { useEffect, useState } from 'react'
import { API_URL } from '../utils/contanst'
import { Recaudo } from '../types/Recaudo'
import axios from 'axios'

interface RecaudoDetailProps {
  id: string;
  estado: string;
  funCloseInfo: () => void;
}

const RecaudoDetail: React.FC<RecaudoDetailProps> = ({ id, estado, funCloseInfo }) => {
  const [data, setData] = useState<Recaudo | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id || !estado) return

    setLoading(true)
    setError(null)

    axios.get(`${API_URL}/recaudo/${id}/${estado}`)
      .then(res => {
        setData(res.data)
        setLoading(false)
      })
      .catch(err => {
        if (err.response && err.response.status === 400) {
          setError(err.response.data.message || 'Error al obtener los datos')
        }
        setError('Error al obtener los datos')
        setLoading(false)
      })
  }, [id, estado])

  if (loading) {
    return <p className="text-center">Cargando...</p>
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>
  }

  if (!data) {
    return <p className="text-center">No hay datos</p>
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className=" w-full max-w-3xl p-6 bg-white rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-4 text-center">Detalle Recaudo</h1>
        <div className="grid grid-cols-2 gap-2 pb-4 text-xs lg:text-base 2xl:text-xl">
          <p className="font-bold text-gray-800 flex gap-2">
            <span className="font-bold">Fecha:</span>
            <Badge variant='warning'>{data.FECHA}</Badge>
          </p>
          <p className="font-medium text-gray-800"><span className="font-bold">Recaudador:</span> {data.RECAUDADOR}</p>
          <p className="font-medium text-gray-800"><span className="font-bold">Caja:</span> {data.CAJADNO}</p>
          <p className="font-medium text-gray-800"><span className="font-bold">Vinculado:</span> {data.VINCULADO}</p>
          <p className="font-medium text-gray-800 flex gap-2">
            <span className="font-bold">Valor:</span>
            <Badge variant='default'>{formatValue(data.VALOR)}</Badge>
          </p>
          <p className="font-medium text-gray-800 flex gap-2">
            <span className="font-bold">Estado:</span>
            {data.ESTADO === 'p'
              ? <Badge variant='warning'>Pendiente</Badge>
              : data.ESTADO === 'u'
                ? <Badge variant='success'>Aceptado</Badge>
                : data.ESTADO === 'c'
                  ? <Badge variant='default'>Liberado</Badge>
                  : <Badge variant='error'>Rechazado</Badge>
            }
          </p>
          <p className="font-medium text-gray-800"><span className="font-bold">Respaldo:</span> {data.RESPALDO}</p>
          <p className="font-medium text-gray-800"><span className="font-bold">Hora Sync:</span> {data.HORASYNC}</p>
          <p className="font-medium text-gray-800"><span className="font-bold">Hora Mov:</span> {data.HORAMOVI}</p>
          <p className="font-medium text-gray-800"><span className="font-bold">Usuario Conteo:</span> {data.USR_CONTEO}</p>
          <p className="font-medium text-gray-800"><span className="font-bold">Hora Conteo:</span> {data.HORA_CONTEO}</p>
        </div>
        <Callout title='Nota Conteo' variant='error'>
          {data.NOTA_CONTEO || 'No proporcionado'}
        </Callout>
        <div className="flex justify-center mt-4">
          <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600" onClick={funCloseInfo}>Cerrar</button>
        </div>
      </Card>
    </div>
  )
}

export default RecaudoDetail
