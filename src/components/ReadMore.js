import React, { Fragment } from "react";

const style = {
  container: {
    position: "relative",
    overflow: "hidden",
  },
  opacifier: {
    background:
      "linear-gradient(rgba(255, 255, 255, 0), rgba(255, 255, 255, 1))",
    position: "absolute",
    bottom: 0,
    height: "50%",
    width: "100%",
    zIndex: 10
  },
  button: {
    bottom: 0,
    display: "block",
    position: "absolute",
    textAlign: "center",
    width: "100%",
    zIndex: 20,
  }
};

export function ReadMore({ children, handleExpand, height, isWrapped }) {
  if (!isWrapped) return children
  return (
    <div style={{...style.container, height}}>
      {children}
      {isWrapped && (
        <Fragment>
          <div style={style.opacifier} />
          <button style={style.button} onClick={handleExpand}>Read more</button>
        </Fragment>
      )}
    </div>
  )
}
