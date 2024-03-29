import React, { ReactElement } from 'react'
import '@testing-library/jest-dom'
import { fireEvent, render, RenderResult, screen } from '@testing-library/react'
import { DragDropEventOptions, FileType, MessageBoxType, TestFile } from '../../types/types'
import DropZone from '../../renderer/main-window/components/DropZone'
import { mockDirectory, mockElectronApi, mockFileWithNoType, mockPdfFile, mockTxtFile } from './mocks'
import { noop } from '../../renderer/main-window/utils'

const createDragDropEventOptions = (files: File[]): DragDropEventOptions => ({
  dataTransfer: {
    items: files,
    files,
    clearData: noop
  }
})

describe('DropZone', () => {
  let text: string
  let desiredFileType: FileType
  let mockOnDrop: jest.Mock
  let messageBoxSpy: jest.SpyInstance
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

    messageBoxSpy = jest.spyOn(window.electron, 'showMessageBox')
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
    let eventOptions: DragDropEventOptions

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

  describe('after dragenter undefined', () => {
    let eventOptions: DragDropEventOptions

    beforeEach(() => {
      // @ts-expect-error
      eventOptions = {}
      fireEvent.dragEnter(window, eventOptions)
      fireEvent.dragOver(window, eventOptions)
    })

    it('should not show', () => {
      const element = screen.queryByTestId('drop-zone')
      expect(element).not.toBeInTheDocument()
    })

    it('should not show after drop undefined', () => {
      fireEvent.drop(window, eventOptions)
      const element = screen.queryByTestId('drop-zone')
      expect(element).not.toBeInTheDocument()
    })
  })

  const shouldShowErrorMessageBox = (): void => {
    expect(messageBoxSpy).toHaveBeenCalledTimes(1)
    expect(messageBoxSpy.mock.calls[0][0]).toEqual(MessageBoxType.ERROR)
  }

  it('should show an error message if drop undefined', () => {
    // @ts-expect-error
    fireEvent.drop(window, createDragDropEventOptions([undefined]))
    shouldShowErrorMessageBox()
  })

  it('should show an error message if drop 2 files', () => {
    fireEvent.drop(window, createDragDropEventOptions([mockPdfFile, mockPdfFile]))
    shouldShowErrorMessageBox()
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
      jest.spyOn(window.electron, 'fileIsDirectory').mockReturnValue(Promise.resolve(testFile.isFolder))
      jest.spyOn(window.electron, 'getFileExtension').mockReturnValue(Promise.resolve(testFile.fileExtension))

      fireEvent.drop(window, createDragDropEventOptions([testFile.file]))
      await new Promise(process.nextTick) // wait for all code to execute

      shouldShowErrorMessageBox()
    })
  })

  // this impossible case is required for 100% branch coverage
  it("should show an error message if drop a file and String.prototype.split() doesn't work", async () => {
    jest.spyOn(String.prototype, 'split').mockReturnValueOnce([])
    fireEvent.drop(window, createDragDropEventOptions([mockPdfFile]))
    await new Promise(process.nextTick) // wait for all code to execute
    shouldShowErrorMessageBox()
  })
})
