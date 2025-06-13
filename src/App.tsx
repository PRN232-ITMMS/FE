import { Toaster } from '@/components/ui/toaster'
import { useRouteElements } from '@/useRouteElements'

const App = () => {
  const routeElement = useRouteElements()
  return (
    <>
      {routeElement}
      <Toaster />
    </>
  )
}

export default App
