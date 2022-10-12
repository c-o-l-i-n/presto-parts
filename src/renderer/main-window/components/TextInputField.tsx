import React, { ReactElement, useState } from 'react'
import { resolveFieldName } from '../utils'

interface Props {
  label: string
  placeholder: string
  text: string
  onType: (text: string) => unknown
  onChange: () => unknown
}

const TextInputField = ({ label, placeholder, text, onType, onChange }: Props): ReactElement => {
  const [initialText, setInitialText] = useState('')

  const fieldName = resolveFieldName(label)

  return (
    <div className='field'>
      <label className='label' htmlFor={fieldName}>
        {label}
      </label>
      <input
        id={fieldName}
        className='input'
        type='text'
        placeholder={placeholder}
        value={text}
        onInput={(e) => { onType((e.target as HTMLInputElement).value) }}
        onFocus={() => { setInitialText(text) }}
        onBlur={() => { if (text !== initialText) onChange() }}
      />
    </div>
  )
}

export default TextInputField
