import React, { ReactElement } from 'react'
import '@testing-library/jest-dom'
import { fireEvent, render, RenderResult, screen } from '@testing-library/react'
import { DragDropEventOptions, FileType, MessageBoxType, TestFile } from '../../types/types'
import DropZone from '../../renderer/main-window/components/DropZone'
import { mockDirectory, mockElectronApi, mockFileWithNoType, mockPdfFile, mockTxtFile, noop } from './mocks'

const createDragDropEventOptions = (files: File[]): DragDropEventOptions => ({
  dataTransfer: {
    items: files,
    files: files,
    clearData: noop
  }
})

describe('DropZone', () => {
  let text: string
  let desiredFileType: FileType
  let mockOnDrop: jest.Mock
  let component: ReactElement
  let renderResult: RenderResult

  beforeEach(() => {
    text = 'Mock Drop Zone Text'
    desiredFileType = FileType.PDF
    mockOnDrop = jest.fn()
    component = (
      <DropZone
        text={text}
        desiredFileType={desiredFileType}
        onDrop={mockOnDrop}
      />
    )
    renderResult = render(component)
    window.electron = mockElectronApi

    jest.spyOn(window.electron, 'fileIsDirectory').mockReturnValue(Promise.resolve(false))
    jest.spyOn(window.electron, 'getFileExtension').mockImplementation(async f => f.substring(f.length - 4))
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('should render', () => {
    expect(renderResult).toBeTruthy()
  })

  it('should not show initially', () => {
    const element = screen.queryByTestId('drop-zone')
    expect(element).not.toBeInTheDocument()
  })

  describe('after dragenter', () => {
    let eventOptions: {}

    beforeEach(() => {
      eventOptions = createDragDropEventOptions([mockPdfFile])
      fireEvent.dragEnter(window, eventOptions)
      fireEvent.dragOver(window, eventOptions)
    })

    it('should show', () => {
      const element = screen.queryByTestId('drop-zone')
      expect(element).toBeInTheDocument()
    })

    it('should contain proper text', () => {
      const element = screen.queryByText(text)
      expect(element).toBeInTheDocument()
    })

    it('should not show after dragleave', () => {
      fireEvent.dragLeave(window)
      const element = screen.queryByTestId('drop-zone')
      expect(element).not.toBeInTheDocument()
    })

    it('should still show after 2nd dragenter and then dragleave', () => {
      fireEvent.dragEnter(window, eventOptions)
      fireEvent.dragLeave(window)

      const element = screen.queryByTestId('drop-zone')
      expect(element).toBeInTheDocument()
    })

    it('should not show after drop file', () => {
      fireEvent.drop(window, createDragDropEventOptions([mockPdfFile]))
      const element = screen.queryByTestId('drop-zone')
      expect(element).not.toBeInTheDocument()
    })
  })

  it('should show an error message if drop undefined', () => {
    const messageBoxSpy = jest.spyOn(window.electron, 'showMessageBox')
    // @ts-expect-error
    fireEvent.drop(window, createDragDropEventOptions([undefined]))
    expect(messageBoxSpy).toHaveBeenCalledTimes(1)
    expect(messageBoxSpy.mock.calls[0][0]).toEqual(MessageBoxType.ERROR)
  })

  it('should show an error message if drop 2 files', () => {
    const messageBoxSpy = jest.spyOn(window.electron, 'showMessageBox')
    fireEvent.drop(window, createDragDropEventOptions([mockPdfFile, mockPdfFile]))
    expect(messageBoxSpy).toHaveBeenCalledTimes(1)
    expect(messageBoxSpy.mock.calls[0][0]).toEqual(MessageBoxType.ERROR)
  })

  const undesiredFiles: Record<string, TestFile> = {
    'txt file': {
      file: mockTxtFile,
      isFolder: false,
      fileExtension: '.txt'
    },
    directory: {
      file: mockDirectory,
      isFolder: true,
      fileExtension: ''
    },
    'file with no type': {
      file: mockFileWithNoType,
      isFolder: false,
      fileExtension: ''
    }
  }

  Object.entries(undesiredFiles).forEach(([testFileType, testFile]) => {
    it(`should show an error message if drop undesired file type (${testFileType})`, async () => {
      const messageBoxSpy = jest.spyOn(window.electron, 'showMessageBox')
      jest.spyOn(window.electron, 'fileIsDirectory').mockReturnValue(Promise.resolve(testFile.isFolder))
      jest.spyOn(window.electron, 'getFileExtension').mockReturnValue(Promise.resolve(testFile.fileExtension))

      fireEvent.drop(window, createDragDropEventOptions([testFile.file]))
      await new Promise(process.nextTick) // wait for all code to execute

      expect(messageBoxSpy).toHaveBeenCalledTimes(1)
      expect(messageBoxSpy.mock.calls[0][0]).toEqual(MessageBoxType.ERROR)
    })
  })
})
