import React, { useRef, useState, useEffect } from 'react'
import { ReadMore } from './ReadMore'

export function HooksExpand({ height, children }) {
  const contentRef = useRef()
  const [isWrapped, setIsWrapped] = useState(false)
  const [hasUserUnwrapped, setHasUserUnwrapped] = useState(false)

  useEffect(() => {
    if (hasUserUnwrapped || isWrapped || !contentRef.current) return
    if (contentRef.current.clientHeight > height) setIsWrapped(true)
  }, [contentRef, hasUserUnwrapped, height, isWrapped])

  function handleExpand() {
    setIsWrapped(false)
    setHasUserUnwrapped(true)
  }

  return (
    <ReadMore isWrapped={isWrapped} height={height} handleExpand={handleExpand}>
      {React.cloneElement(children, { ref: contentRef })}
    </ReadMore>
  )
}
