import { useEffect } from 'react'

interface UseDocumentTitleProps {
  title: string
}

const useDocumentTitle = ({ title }: UseDocumentTitleProps) => {
  useEffect(() => {
    const previousTitle = document.title
    document.title = title

    return () => {
      document.title = previousTitle
    }
  }, [title])
}

export default useDocumentTitle
