import React, { createContext, ReactElement, useState } from 'react'
import { Context } from '../../../types/types'

const initialIsLoading = false

const IsLoadingContext = createContext<Context<boolean>>({
  state: initialIsLoading,
  setState: () => {}
})

interface Props {
  children: React.ReactNode
}
const IsLoadingProvider = ({ children }: Props): ReactElement => {
  const [isLoading, setIsLoading] = useState<boolean>(initialIsLoading)

  return (
    <IsLoadingContext.Provider
      value={{
        state: isLoading,
        setState: (isLoading) => setIsLoading(isLoading)
      }}
    >
      {children}
    </IsLoadingContext.Provider>
  )
}

export default IsLoadingContext
export { IsLoadingProvider }
