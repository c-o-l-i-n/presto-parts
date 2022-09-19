import React, { ReactElement } from 'react'

const Loader = (): ReactElement => {
  return (
    <div id='loader' data-testid='loader' className='full-screen-overlay'>
      <div className='loader is-loading' />
    </div>
  )
}

export default Loader
