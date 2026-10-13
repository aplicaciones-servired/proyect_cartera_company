import { ResumenRecaudo } from '../components/ResumenRecaudo'
import { TableInfo2Comp } from '../components/TableInfo2Comp'
import { LineChart4 } from '../components/ComponentChart'
import { DataIU, RecaudoI } from '../types/interface'
import { TableInfo } from '../components/TableInfo'
import { useEffect, useState } from 'react'
import { API_URL } from '../utils/contanst'
import { Input } from '../components/ui'
import { Label } from 'recharts'
import axios from 'axios'

function Dashboard () {
  const [data, setData] = useState<DataIU[]>([])
  const [recaudo, setRecaudo] = useState<RecaudoI | undefined>(undefined)
  const [fecha, setFecha] = useState<string>()
  // Obtener la fecha actual en formato YYYY-MM-DD
  const today = new Date().toISOString().split('T')[0]

  const handleFechaChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFecha(event.target.value)
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${API_URL}/resumenCartera`)
        setData(res.data)
      } catch (err) {
        if (err) {
          if (err) {
            console.error('Error al obtener los datos de cartera:', err)
          }
        }
      }
    }

    const fetchRecaudo = async () => {
      try {
        const res = await axios.get<RecaudoI>(`${API_URL}/resumenRecaudo?fecha=${fecha || ''}`)
        setRecaudo(res.data)
      } catch (err) {
        if (err) {
          console.error('Error al obtener los datos de recaudo:', err)
        }
      }
    }

    fetchData()
    fetchRecaudo()

    const interval = setInterval(() => {
      fetchData()
      fetchRecaudo()
    }, 900000) // 15 minutes in milliseconds

    return () => clearInterval(interval)
  }, [fecha])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Header con título y stats rápidas */}
      <header className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-b border-slate-200 dark:border-slate-700 z-10">
        <div className="max-w-7xl mx-auto px-4 py-6">
          {/* Primera fila: Título principal y estado */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-800 dark:text-white">
                Dashboard
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300 px-3 py-1 rounded-full text-sm font-medium">
                🟢 En línea
              </div>
              <div className="text-sm text-slate-500 dark:text-slate-400">
                Actualizado por última vez: {new Date().toLocaleTimeString()}
              </div>
            </div>
          </div>

        </div>
      </header>

      <div className="mx-auto p-6 space-y-8">

        <article className='bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-2xl shadow-md border border-slate-200/50 dark:border-slate-700/50 p-6 hover:shadow-xl transition-all duration-300 space-y-6'>

          <div className="flex justify-around items-center">
            <section className='flex'>
              <div className="w-1 h-8 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-full mr-4"></div>
              <h2 className="text-xl font-semibold text-slate-800 dark:text-white">
                Análisis de Tendencias
              </h2>
            </section>
            <section>
              <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">

                Seleccione fecha:
              </Label>
              <Input
                type="date"
                className="w-44 text-sm"
                max={today}
                defaultValue={today}
                onChange={handleFechaChange}
              />
            </section>
          </div>

          <section className='flex pt-4'>

            {
              recaudo?.carteraXhoras && (recaudo.carteraXhoras.map(emp => (
                <LineChart4 key={emp.empresa} dataCartera={emp.datos} empresa={emp.empresa} total={emp.totalRegistros} />
              )))
            }
          </section>
        </article>

        {/* Grid de información principal */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Tabla de información principal */}
          <section className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-200/50 dark:border-slate-700/50 p-6 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center mb-6">
              <div className="w-1 h-8 bg-gradient-to-b from-emerald-500 to-green-600 rounded-full mr-4"></div>
              <h2 className="text-xl font-semibold text-slate-800 dark:text-white">
                Información de Cartera
              </h2>
            </div>
            <TableInfo data={data} />
          </section>

          {/* Tabla de información secundaria */}
          <section className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-200/50 dark:border-slate-700/50 p-6 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center mb-6">
              <div className="w-1 h-8 bg-gradient-to-b from-purple-500 to-violet-600 rounded-full mr-4"></div>
              <h2 className="text-xl font-semibold text-slate-800 dark:text-white">
                Resumen Detallado
              </h2>
            </div>
            <TableInfo2Comp data={data} />
          </section>
        </div>

        {/* Sección de recaudos */}
        <section className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-200/50 dark:border-slate-700/50 p-6 hover:shadow-2xl transition-all duration-300">
          <div className="flex items-center mb-6">
            <div className="w-1 h-8 bg-gradient-to-b from-orange-500 to-red-600 rounded-full mr-4"></div>
            <h2 className="text-xl font-semibold text-slate-800 dark:text-white">
              Resumen de Recaudos
            </h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl p-6 border border-blue-200/50 dark:border-blue-700/50">
              {
                recaudo && recaudo.multired && recaudo.multired.length > 0
                  ? <ResumenRecaudo datos={recaudo.multired} name='Multired' />
                  : <p className="text-gray-500 dark:text-gray-400">No hay datos de recaudo para Multired</p>
              }
            </div>
            <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-800/20 rounded-xl p-6 border border-indigo-200/50 dark:border-indigo-700/50">
              {
                recaudo && recaudo.servired && recaudo.servired.length > 0
                  ? <ResumenRecaudo datos={recaudo.servired} name='Servired' />
                  : <p className="text-gray-500 dark:text-gray-400">No hay datos de recaudo para Servired</p>
              }
            </div>
          </div>
        </section>
      </div>

    </div>
  )
}

export default Dashboard
