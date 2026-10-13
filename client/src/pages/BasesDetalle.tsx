import { Card, Button, Switch, Label } from '../components/ui'
import { useNavigate, useParams } from 'react-router-dom'
import { BasesI, BasesIUpdates } from '../types/Bases'
import { useEffect, useRef, useState } from 'react'
import { formatValue } from '../utils/funtions'
import { useAuth } from '../auth/AuthProvider'
import { API_URL } from '../utils/contanst'
import { logger } from '../utils/logger'
import axios from 'axios'

import UpdatesBasesInfo from '../components/UpdateBasesInfo'
import { toast } from 'sonner'

const BasesDetalle = () => {
  const { id } = useParams()
  const [data, setData] = useState<BasesI>()
  const [updates, setUpdates] = useState<BasesIUpdates[]>([])
  const navigate = useNavigate()
  const { user } = useAuth()

  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const [isBaseEnabled, setIsBaseEnabled] = useState(false)
  const [isRaspeEnabled, setIsRaspeEnabled] = useState(false)

  const [pedirData, setPedirData] = useState(false)

  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    // Llamada a la API
    axios.get(`${API_URL}/baseDetalle/${id}`)
      .then(response => setData(response.data))
      .catch(error => { logger.error(error) })

    axios.get(`${API_URL}/updatesBases/${id}`)
      .then(response => setUpdates(response.data))
      .catch(error => { logger.error(error) })
  }, [id, pedirData])

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const fields = Object.fromEntries(new window.FormData(e.currentTarget))
    const newData = {
      BASE: parseInt(fields.base as string),
      RASPE: parseInt(fields.raspe as string),
      OBS: fields.obs as string
    }

    axios.post(`${API_URL}/updateBase`, { ...newData, VINCULADO: id, BASE_ACT: data?.BASE, RASPE_ACT: data?.RASPE, LOGIN: user?.username })
      .then(response => {
        logger.debug(response)
        if (response.status === 200) {
          formRef.current?.reset()
          setIsBaseEnabled(false)
          setIsRaspeEnabled(false)
          setPedirData(!pedirData)
          setMessage(response.data)
        }
      })
      .catch(error => {
        logger.error(error)
        const msg = error.response.data.msg
        setError(msg)
      })
      .finally(() => {
        setTimeout(() => {
          setError('')
          setMessage('')
        }, 5000)
      })
  }

  return (
    <>
      <section className='flex gap-2'>
        <Card className='flex flex-col gap-2'>
          <div className='flex justify-end'>
            <Button variant='primary' color='blue' onClick={() => navigate('/bases')}>Volver Bases</Button>
          </div>
          <h1 className='text-center'>Datos De Vinculado</h1>
          <p><span className='font-semibold'>Nombres: </span>{data?.Seller.NOMBRES}</p>
          <p><span className='font-semibold'>N° Documento: </span>{data?.VINCULADO}</p>
          <div className='h-full flex justify-around items-center'>
            <p className='p-2 rounded-md bg-yellow-200'>Valor Base: <span className='font-semibold'>{formatValue(data?.BASE as number)}</span></p>
            <p className='p-2 rounded-md bg-yellow-200'>Valor Raspe: <span className='font-semibold'>{formatValue(data?.RASPE as number)}</span> </p>
          </div>
          <p className='max-h-10'>Observación Actual: <span className='font-semibold'>{data?.OBSERVACION}</span></p>
        </Card>
        <Card className='flex flex-col'>
          <h1 className='text-center pb-2'>Actualizar Base</h1>
          <form ref={formRef} className='bg-slate-200 p-2 rounded-md flex flex-col gap-3' onSubmit={handleSubmit}>
            <div className='flex items-center justify-between px-4'>
              <Label>Nuevo Valor Base </Label>
              <input className='w-56 rounded-md border-none' name='base' disabled={!isBaseEnabled} />
              <div className='bg-blue-200 px-4 py-2 rounded-md'>
                <Switch color='blue' checked={isBaseEnabled} onCheckedChange={() => setIsBaseEnabled(!isBaseEnabled)} />
              </div>
            </div>
            <div className='flex items-center justify-between px-4'>
              <Label>Nuevo Valor Raspe</Label>
              <input className='w-56 rounded-md border-none' name='raspe' disabled={!isRaspeEnabled} />
              <div className='bg-blue-200 px-4 py-2 rounded-md'>
                <Switch color='blue' checked={isRaspeEnabled} onCheckedChange={() => setIsRaspeEnabled(!isRaspeEnabled)} />
              </div>
            </div>
            <Label>Observación:</Label>
            <input name='obs' placeholder='ej: Base incrementada por ventas acumuladas' type='text' className='border-none rounded-md max-h-10' />

            <div className='w-full flex justify-center py-2'>
              <Button>Actualizar Base</Button>
            </div>

          </form>
        </Card>
      </section>

      { updates && <UpdatesBasesInfo data={updates} /> }

      {error && toast.error(error, { description: 'Error al actualizar base ', id: ' ', duration: 5000, style: { background: '#ef4444', color: 'white' } })}
      {message && toast.success(message, { description: 'Base actualizada correctamente', id: ' ', duration: 5000, style: { background: '#22c55e', color: 'white' } })}
    </>
  )
}

export default BasesDetalle
