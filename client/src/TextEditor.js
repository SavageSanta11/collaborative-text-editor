import React, { useCallback } from 'react'
import Quill from "quill"
import "quill/dist/quill.snow.css"


export default function TextEditor() {
  const wrapperRef = useCallback((wrapper) => {
    if (wrapper == null) return 
    wrapper.innerHTML = ""
    const editor = document.createElement('div')
    wrapper.current.append(editor)
    new Quill('#container', {theme: "snow"})

  }, [])  // so that this component is only rendered once, at runtime
  return (
    <div className="container" ref={wrapperRef}>
    </div>
  )
}
