import { fetchCartera } from '../services/carteraSevices'
import { useEffect, useMemo, useState } from 'react'
import { CarteraI } from '../types/cartera'
import { useSort } from './useSort'
import { logger } from '../utils/logger'

export const useCartera = () => {
  const [abs, setAbs] = useState<boolean>(false)
  const [data, setData] = useState<CarteraI[]>([])
  const [empresa, setEmpresa] = useState<string>('0')
  const { sortConfig, setSortConfig, ordenarArray } = useSort<CarteraI>()
  const [loading, setLoading] = useState<boolean>(false)
  const [vinculado, setVinculado] = useState<string>('')

  useEffect(() => {
    setLoading(true)

    const fetchData = async () => {
      try {
        const data = await fetchCartera(empresa, abs)
        setData(data)
        setLoading(false)
      } catch (error) {
        logger.error('Failed to fetch data:', error)
        setLoading(false)
      }
    }

    fetchData()
    const interval = setInterval(fetchData, 15 * 60 * 1000)

    return () => clearInterval(interval)
  }, [empresa, abs])

  const handleClick = (e: React.MouseEvent<HTMLTableCellElement, MouseEvent>) => {
    const propiedadActual = e.currentTarget.id as keyof CarteraI
    const esLaMismaPropiedad = sortConfig.propiedad === propiedadActual
    const nuevaDireccion = esLaMismaPropiedad ? !sortConfig.ascendente : true

    setSortConfig({ propiedad: propiedadActual, ascendente: nuevaDireccion })
    setData(prevData => ordenarArray(prevData, propiedadActual, nuevaDireccion))
  }

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVinculado(e.target.value)
  }

  const dataFiltered = useMemo(() => {
    return data.filter(item => item.Vinculado.toString().includes(vinculado))
  }, [vinculado, data])

  return { vinculado, dataFiltered, abs, setAbs, empresa, setEmpresa, handleClick, handleFilterChange, loading }
}
