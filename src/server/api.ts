import axios from 'axios'

export const api = axios.create({
  baseURL: process.env.API_URL || 'http://192.168.0.2:3333',
})
