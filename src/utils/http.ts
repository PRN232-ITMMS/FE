import axios, { AxiosError, AxiosInstance } from 'axios'
import { toast } from '@/hooks/use-toast'
import {
  clearAllLocalStorage,
  getAccessTokenFromLocalStorage,
  setProfileFromLocalStorage,
  storeAccessTokenToLocalStorage,
} from './auth'
import { AuthResponse } from '@/types/auth.type'
import { path } from '@/constants/path'

class Http {
  instance: AxiosInstance
  private accessToken: string

  constructor() {
    this.accessToken = getAccessTokenFromLocalStorage()
    this.instance = axios.create({
      baseURL: import.meta.env.VITE_API_URL || 'https://api-ecom.duthanhduoc.com',
      timeout: 10000,
      headers: { 'Content-Type': 'application/json' },
    })

    this.instance.interceptors.request.use(
      (config) => {
        if (this.accessToken && config.headers) {
          config.headers.authorization = this.accessToken
          return config
        }
        return config
      },
      (error) => {
        return Promise.reject(error)
      }
    )

    this.instance.interceptors.response.use(
      (response) => {
        const { url } = response.config
        if (url === path.login || url === path.register) {
          const data = response.data as AuthResponse
          this.accessToken = data.data.access_token
          storeAccessTokenToLocalStorage(this.accessToken)
          setProfileFromLocalStorage(data.data.user)
          return response
        } else if (url === path.logout) {
          this.accessToken = ''
          clearAllLocalStorage()
          return response
        }
        return response
      },
      (error: AxiosError) => {
        if (error.response?.status !== 422) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const data: any = error.response?.data
          const message = data?.message || error.message
          toast({
            title: 'Error',
            description: message,
            variant: 'destructive',
          })
        }
        return Promise.reject(error)
      }
    )
  }
}

const http = new Http().instance
export default http
