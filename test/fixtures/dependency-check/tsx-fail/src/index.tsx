// @ts-expect-error - not installed
import React from 'react'

// use some ts-only syntax
export interface MyInterface {
  hello: 'world'
}

// @ts-expect-error - not installed
const Component: React.FC = () => (<div>Hello, world!</div>)
const App: React.FC = () => (<Component />)

export default App
