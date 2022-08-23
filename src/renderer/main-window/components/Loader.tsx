import React from 'react'

const Loader = () => {
	return (
		<div id='loader' data-testid='loader' className='full-screen-overlay'>
			<div className='loader is-loading'></div>
		</div>
	)
}

export default Loader
