# How to use React refs with useEffect hooks

This last year at Eatwith we have been doing a great work at refactoring our frontend codebase, upgrading dependencies (specially React), removing some other unnecessary dependencies and increase design consistency to give our users a better and faster user experience.

Having a leaner codebase that runs an up to date tech stack brings many advantages, both for our team and the future of the company. Just to name a few,

- smaller effort when upgrading to new versions and most importantly, a significantly smaller risk of breaking something
- new features, documentation up to date, conferences to join
- opportunity to atract talented engineers to work with us, who will not be held back by legacy technology

# The case study

With the context set, the case I want to share today was the refactor of an old component that had not been updated in months and started to present some buggy behaviour. The component is a simple "Read more" component that should have the following behaviour.

- It takes 2 props
  - the content that should be presented
  - the maximum height the content should be presented in
- If the content's height is
  - smaller than allowed, then there is nothing to be done
  - larger than allowed, the content should be wrapped in a container with fixed height equals to the maximum limit
- If the user clicks the "Read more" button, then the content should be unwrapped

<!-- ADD SMALL GIF ABOUT THE COMPOENENT AND SET SOME CONTEXT OF WHAT IT DOES -->

Being such a simple and not very used component we did not run into problems until we started adopting strategies to use to increase the performance of our app such as lazy loading and code splitting. Simply by refactoring the component, removing unused props, duplicated code and layers of unncessary complexity that had been added over time, the component started to behave normally in all the use cases we had.

However, I told myself, this was an excellent opportunity to continue the progressive migration we have been doing in the adoption of hooks, but as well to train on a more complicated case with the combined used of `ref`s.

The code we had in the end after the legacy to modern class implementation refactor is the following:

import React, { Component } from "react"
import { ReadMore } from "./ReadMore"

```javascript
export class LifeCycleComponent extends Component {
  constructor(props) {
    super(props)
    this.contentRef = React.createRef()
    this.state = { hasUserUnwrapped: false, isWrapped: false }
  }

  componentDidMount() {
    this.shouldWrapIfTooTall()
  }

  componentDidUpdate() {
    this.shouldWrapIfTooTall()
  }

  shouldWrapIfTooTall = () => {
    const { hasUserUnwrapped, isWrapped } = this.state
    if (hasUserUnwrapped || isWrapped || !this.contentRef.current) return
    if (this.contentRef.current.clientHeight > this.props.height) this.setState({ isWrapped: true })
  }

  handleExpand = () => this.setState({ hasUserUnwrapped: true, isWrapped: false })

  render() {
    return (
      <ReadMore handleExpand={this.handleExpand} height={this.props.height} isWrapped={this.state.isWrapped}>
        {React.cloneElement(this.props.children, { ref: this.contentRef })}
      </ReadMore>
    )
  }
}
```

For the sake of the simplicity of this article, there are a few simlpification:

- I have created a `ReadMore` wrapper component to apply some style renders it children (which is what makes to possible to attach a `ref` to the children)
- I also assume that children is a simple node, which makes it possible to cloning it simply without without having to map and take one element.

One specificity of our component is that it may have content that is loaded syncronously, in which case a simple `componentDidMount` would have sufficed. However, the content might be loaded asyncronously, which makes it necessary to have also a `componentDidUpdate`.

Both lifecycle methods call a function that checks the current value of the content ref and set accordingly the value of `isWrapped` in the state. Since a React component is a function of state and props, a change in the reference's current value does not trigger a rerender.

See here below the working example of the code

<!-- Add GIF about the async load -->

# The hook refactor

In order to refactor our originally class component into a functional component, we will need

- `useState` to replace our component's state variables `isWrapped` and `hasUserUnwrapped`
- `useEffect` to replace the component's lifecycle methods `componentDidMount` and `componentDidUpdate`
- `useRef` to handle the ref creation

The refactored component would look something like this

```javascript
import React, { useRef, useState, useEffect } from 'react'
import { ReadMore } from './ReadMore'

export function BaseHooksComponent({ height, children }) {
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
```

If we check the result of the code we just made below, we can see that it works as it should when we do have our content loaded syncronously, but our content does dot get wrapped when content is load async.

Despite passing the `contentRef` as a dependency to the `useEffect` hook, the effect is not tracking correctly the change in the `current` value of the ref. One may then think that a very smart and simple solution would be to do add it to the dependency array:

```javascript
useEffect(() => {
  if (hasUserUnwrapped || isWrapped || !contentRef.current) return
  if (contentRef.current.clientHeight > height) setIsWrapped(true)
}, [contentRef.current, hasUserUnwrapped, height, isWrapped])
```

Despite having a working solution, we also get the added bonus of a warning

> React Hook useEffect has an unnecessary dependency: 'contentRef.current'. Either exclude it or remove the dependency array. Mutable values like 'contentRef.current' aren't valid dependencies because mutating them doesn't re-render the component react-hooks/exhaustive-deps

Having a working solution is a good sign, however, having a warning like this in the console always makes me worried because I imagine Dan Abramov standing behind me shaking his head in disagreement because I'm not doing it correctly. Jokes aside, I believe the React community has developed great lint tools to help prevent developpers writing code that might brake for seemingly unexplicable reasons.

So after reading some more documentation on the subject and the best use of how to combine `ref`s and `useEffect` hooks, the solution that I managed to come up with, which got my code to work both on sync and async modes were the combination of

1. The use of a callback ref instead of the `useRef` hook
2. Another state variable which stores the ref's current height and that is updated by the ref's callback

Here is the following code that acomplishes out mission

```javascript
// (...)
// Replaced this old code
// const contentRef = useRef()

// useEffect(() => {
//   if (hasUserUnwrapped || isWrapped || !contentRef.current) return
//   if (contentRef.current.clientHeight > height) setIsWrapped(true)
// }, [contentRef.current, hasUserUnwrapped, height, isWrapped])

// Added
const [contentHeight, setContentHeight] = useState()

const contentRef = node => {
  if (node) setContentHeight(node.getBoundingClientRect().height)
}

useEffect(() => {
  if (hasUserUnwrapped || isWrapped) return
  setIsWrapped(contentHeight > height)
}, [contentHeight, hasUserUnwrapped, height, isWrapped])
```
