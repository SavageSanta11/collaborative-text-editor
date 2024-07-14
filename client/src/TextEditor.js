import React, { useCallback, useEffect, useState } from 'react'
import Quill from "quill"
import "quill/dist/quill.snow.css"
import { io } from 'socket.io-client'
import { useParams } from "react-router-dom"

const SAVE_INTERVAL_MS = 2000
const TOOLBAR_OPTIONS = [
  [{ header: [1, 2, 3, 4, 5, 6, false] }],
  [{ font: [] }],
  [{ list: "ordered" }, { list: "bullet" }],
  ["bold", "italic", "underline"],
  [{ color: [] }, { background: [] }],
  [{ script: "sub" }, { script: "super" }],
  [{ align: [] }],
  ["image", "blockquote", "code-block"],
  ["clean"],
]

export default function TextEditor() {
  const { id: documentId } = useParams()
  const [socket, setSocket] = useState()
  const [quill, setQuill] = useState()

  useEffect(() => {
    const s = io("http://localhost:3001") // server url
    setSocket(s)

    return () => {
      s.disconnect()
    }
  }, [])

  useEffect(() => {
    if (socket == null || quill == null) return

    socket.once("load-document", document => {
      quill.setContents(document)
      quill.enable() // disable text editor until the document is loaded
    })

    socket.emit("get-document", documentId) // this will attach us to the room associated with that document ID - server will send that doc back kto us
  }, [socket, quill, documentId]) // when socket or id or quill changes

  useEffect(() => {
    if (socket == null || quill == null) return

    const interval = setInterval(() => {
      socket.emit("save-document", quill.getContents())
    }, SAVE_INTERVAL_MS)

    return () => {
      clearInterval(interval)
    }
  }, [socket, quill])

  useEffect(() => {
    if (socket == null || quill == null) return

    const handler = delta => {
      quill.updateContents(delta)
    }
    socket.on("receive-changes", handler)

    return () => {
      socket.off("receive-changes", handler)
    }
  }, [socket, quill])
  useEffect(() => {
    if (socket == null || quill == null) return

    const handler = quill.on('text-change', (delta, oldDelta, source) => {
      if (source !== 'user') return //if not then changes were made by our API 
      socket.emit("send-changes", delta)
    })
    return () => {
      quill.off('text-change', handler) // turn off event handler when no longer needed
    }
  }, [socket, quill])


  const wrapperRef = useCallback((wrapper) => {
    if (wrapper == null) return
    wrapper.innerHTML = ""
    const editor = document.createElement('div')
    wrapper.current.append(editor)
    const q = new Quill('#container', { theme: "snow" })
    q.disable()
    q.setText("Loading...")
    setQuill(q)

  }, [])  // so that this component is only rendered once, at runtime
  return (
    <div className="container" ref={wrapperRef}>
    </div>
  )
}
