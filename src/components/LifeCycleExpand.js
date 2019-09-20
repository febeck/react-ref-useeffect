import React, { Component } from "react"
import { ReadMore } from "./ReadMore"

export class LifeCycleExpand extends Component {
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
    const { hasUserUnwrapped, isWrapped} = this.state
    if (hasUserUnwrapped || isWrapped || !this.contentRef.current) return
    if (this.contentRef.current.clientHeight > this.props.height) this.setState({ isWrapped: true })
  }

  handleExpand = () => this.setState({ hasUserUnwrapped: true, isWrapped: false })

  render() {
    return (
      <ReadMore
        handleExpand={this.handleExpand}
        height={this.props.height}
        isWrapped={this.state.isWrapped}
      >
        {React.cloneElement(this.props.children, { ref: this.contentRef })}
      </ReadMore>
    )
  }
}
