import React, { ReactElement, useCallback, useEffect, useRef, useState } from 'react'
import { FileType, MessageBoxType } from '../../../types/types'

interface Props {
  text: string
  desiredFileType: FileType
  onDrop: (filePath: string) => unknown
}

const DropZone = ({ text, desiredFileType, onDrop }: Props): ReactElement => {
  const [isDragging, setIsDragging] = useState(false)
  const dragCounter = useRef(0)

  const handleDragOver = useCallback((e: DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }, [])
  const handleDragEnter = useCallback((e: DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    dragCounter.current++
    if (e.dataTransfer?.items !== undefined && e.dataTransfer.items.length > 0) {
      setIsDragging(true)
    }
  }, [])
  const handleDragLeave = useCallback((e: DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    dragCounter.current--
    if (dragCounter.current > 0) return
    setIsDragging(false)
  }, [])
  const handleDrop = useCallback((e: DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    if (e.dataTransfer?.items !== undefined && e.dataTransfer.items.length > 0) {
      dragCounter.current = 0
      void handleFileDrop(e.dataTransfer.files, desiredFileType)
      e.dataTransfer.clearData()
    }
  }, [])

  useEffect(() => {
    window.addEventListener('dragenter', handleDragEnter)
    window.addEventListener('dragleave', handleDragLeave)
    window.addEventListener('dragover', handleDragOver)
    window.addEventListener('drop', handleDrop)
    return function cleanUp () {
      window.removeEventListener('dragenter', handleDragEnter)
      window.removeEventListener('dragleave', handleDragLeave)
      window.removeEventListener('dragover', handleDragOver)
      window.removeEventListener('drop', handleDrop)
    }
  })

  // populate file path and handles errors when user drops file
  const handleFileDrop = async (
    filesDropped: FileList,
    desiredFileType: FileType
  ): Promise<void> => {
    if (filesDropped[0] === undefined) {
      window.electron.showMessageBox(
        MessageBoxType.ERROR,
        `Error: Must be a ${desiredFileType}.`
      )
      return
    }

    if (filesDropped.length !== 1) {
      window.electron.showMessageBox(
        MessageBoxType.ERROR,
        `Error: Must be a single file.\n${filesDropped.length} files were dropped.`
      )
      return
    }

    const filePath = filesDropped[0].path
    const [isFolder, fileExtension] = await Promise.all([
      window.electron.fileIsDirectory(filePath),
      window.electron.getFileExtension(filePath)
    ])

    const fileType: string = isFolder
      ? FileType.FOLDER
      : fileExtension === ''
        ? FileType.NO_TYPE
        : fileExtension.split('.').pop()?.toUpperCase() ?? FileType.UNEXPECTED

    if (fileType !== desiredFileType) {
      const lettersPrecededByAn = 'AEFHILMNORSX'
      window.electron.showMessageBox(
        MessageBoxType.ERROR,
        `Error: Must be a ${desiredFileType}.\nA${
          lettersPrecededByAn.includes(fileType.charAt(0)) ? 'n' : ''
        } ${fileType} was dropped.`
      )
      return
    }

    onDrop(filePath)
  }

  if (!isDragging) return <></>

  return (
    <div className='drop-zone full-screen-overlay' data-testid='drop-zone'>
      <h1 className='is-size-1 has-text-light has-text-weight-semibold mb-6'>
        {text}
      </h1>
    </div>
  )
}

export default DropZone
