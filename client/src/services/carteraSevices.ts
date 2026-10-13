import { API_URL } from '../utils/contanst'
import { logger } from '../utils/logger'
import axios from 'axios'

export const fetchCartera = async (empresa: string, abs: boolean) => {
  try {
    const response = await axios.get(`${API_URL}/cartera?empresa=${empresa}&abs=${abs}`)
    return response.data
  } catch (error) {
    logger.error('Error fetching cartera data:', error)
    throw error
  }
}
