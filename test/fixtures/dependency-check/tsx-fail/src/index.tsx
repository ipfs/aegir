// @ts-expect-error - not installed
import React from 'react'

// @ts-expect-error - not installed
const Component: React.FC = () => (<div>Hello, world!</div>)
const App: React.FC = () => (<Component />)

export default App
