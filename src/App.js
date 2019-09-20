import React, { useState, useEffect } from 'react'
import './App.css'

import { LifeCycleExpand } from "./components/LifeCycleExpand"
import { HooksExpandBroken } from "./components/HooksExpandBroken"
import { HooksExpandWarning } from "./components/HooksExpandWarning"
import { HooksExpand } from "./components/HooksExpand"

const LONG_TEXT = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'

const style = {
  grid: {
    display: 'grid',
    gridTemplateColumns: '250px 250px 250px 250px',
    gridGap: 16,
    margin: 20,
  }
}

function App() {
  const [asyncText, setAsyncText] = useState()

  useEffect(() => {
    const timeout = setTimeout(() => { setAsyncText(LONG_TEXT) }, 1000)
    return () => clearTimeout(timeout)
  }, [])

  const components = [LifeCycleExpand, HooksExpandBroken, HooksExpandWarning, HooksExpand]
  
  return (
    <div>
      <p>Sync loaded text</p>
      <div style={style.grid}>
        {components.map((Component, i) => (
          <Component key={i} height={100}>
            <div>{LONG_TEXT}</div>
          </Component>
        ))}
      </div>

      <p>ASync loaded text</p>
      <div style={style.grid}>
        {components.map((Component, i) => (
          <Component key={i} height={100}>
            <div>{asyncText}</div>
          </Component>
        ))}
      </div>
    </div>
  )
}

export default App
