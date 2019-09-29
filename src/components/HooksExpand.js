import React, { useState, useEffect } from 'react'
import { ReadMore } from './ReadMore'

export function HooksExpand({ height, children }) {
  const [isWrapped, setIsWrapped] = useState(false)
  const [hasUserUnwrapped, setHasUserUnwrapped] = useState(false)

  const [contentHeight, setContentHeight] = useState()

  const contentRef = (node) => {
    if (node !== null) {
      setContentHeight(node.getBoundingClientRect().height);
    }
  }

  useEffect(() => {
    if (hasUserUnwrapped || isWrapped) return
    setIsWrapped(contentHeight > height)
  }, [contentHeight, hasUserUnwrapped, height, isWrapped])


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
