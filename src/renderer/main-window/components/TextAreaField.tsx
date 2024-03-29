import React, { ReactElement, useState } from 'react'
import { resolveFieldName } from '../utils'

interface Props {
  label: string
  placeholder: string
  text: string
  onType: (text: string) => unknown
  onChange: () => unknown
}

const TextAreaField = ({ label, placeholder, text, onType, onChange }: Props): ReactElement => {
  const [initialText, setInitialText] = useState('')

  const fieldName = resolveFieldName(label)

  return (
    <div className='field'>
      <label className='label' htmlFor={fieldName}>
        {label}
      </label>
      <textarea
        id={fieldName}
        className='textarea'
        cols={30}
        rows={10}
        placeholder={placeholder}
        value={text}
        onInput={(e) => { onType((e.target as HTMLTextAreaElement).value) }}
        onFocus={() => { setInitialText(text) }}
        onBlur={() => { if (text !== initialText) onChange() }}
      />
    </div>
  )
}

export default TextAreaField
