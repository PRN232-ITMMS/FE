import { useEffect } from 'react'

interface UseDocumentTitleProps {
  title: string
  restoreOnUnmount?: boolean
}

const useDocumentTitle = ({ title, restoreOnUnmount = false }: UseDocumentTitleProps) => {
  useEffect(() => {
    const originalTitle = document.title

    document.title = title

    return () => {
      if (restoreOnUnmount) {
        document.title = originalTitle
      }
    }
  }, [title, restoreOnUnmount])
}

export default useDocumentTitle
