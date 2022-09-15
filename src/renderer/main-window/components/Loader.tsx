import React from 'react'

const Loader = (): JSX.Element => {
  return (
    <div id='loader' data-testid='loader' className='full-screen-overlay'>
      <div className='loader is-loading' />
    </div>
  )
}

export default Loader
