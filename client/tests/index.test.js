import React from 'react'
import { cleanup, render } from '@testing-library/react'
import App from '../src/components/App'

// automatically unmount and cleanup DOM after the test is finished.
afterEach(cleanup)

describe('<App /> spec', () => {
  it('renders the title', () => {
    const { getByRole } = render(<App />)
    expect(getByRole('heading').textContent).toBe('Website\ Analyzer')
  })
})
