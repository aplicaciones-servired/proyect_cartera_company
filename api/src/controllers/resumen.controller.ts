import { getDetalleRecaudoMultired, getDetalleRecaudoServired, getResumenCartera, getCarteraXhoras } from '../services/resumen.services'
import { calculateCartera, sumarCarteraPorEmpresaYCargo } from '../utils/funtions'
import { ObjectCartera } from '../types/interface'
import { Request, Response } from 'express'
import { logger } from '../utils/logger'

export const getCarteraResumen = async (req: Request, res: Response) => {
  try {

    const Queryresults = await getResumenCartera()

    const MapCartera = Queryresults.map((item) => ({
      Cartera: calculateCartera(item),
      Empresa: item.EMPRESA === '101' ? 'Servired' : 'Multired',
      Cargo: item.Seller?.NOMBRECARGO || 'NO DEFINIDO'
    }))

    const FilterMayor0 = MapCartera.filter((item) => item.Cartera > 0) as ObjectCartera[]

    const ReduceCartera = sumarCarteraPorEmpresaYCargo(FilterMayor0)

    const Array = Object.entries(ReduceCartera).map(([Empresa, Cargo]) => ({
      Empresa,
      ...Cargo
    }))  

    return res.status(200).json(Array)
  } catch (error) {
    logger.error(error)
    return res.status(500).json({ message: 'Internal server error', error })
  }
}

export const getRecaudoResumen = async (req: Request, res: Response) => {
  const fecha = req.query.fecha as string
  try {
    const carteraXhoras = await getCarteraXhoras(fecha)
    const servired = await getDetalleRecaudoServired()
    const multired = await getDetalleRecaudoMultired()
    return res.status(200).json({ multired, servired, carteraXhoras })
  } catch (error) {
    logger.error(error)
    return res.status(500).json({ message: 'Internal server error', error })
  }
}