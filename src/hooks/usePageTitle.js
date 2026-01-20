// src/hooks/usePageTitle.js

import { useEffect } from 'react'

export default function usePageTitle(title) {
  useEffect(() => {
    if (!title) {
      document.title = 'Juxin'
    } else {
      document.title = `${title}`
    }
  }, [title])
}