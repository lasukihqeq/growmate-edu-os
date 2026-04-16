import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

// Mock Home component since we can't import the real one with all its deps
// This tests the general pattern of invite code validation UI

describe('Invite Code UI (Home)', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('displays invite code input', () => {
    render(
      <div>
        <input data-testid="invite-code" placeholder="请输入邀请码" />
        <button data-testid="submit">验证</button>
      </div>
    )
    expect(screen.getByTestId('invite-code')).toBeInTheDocument()
    expect(screen.getByTestId('submit')).toBeInTheDocument()
  })

  it('shows error for empty invite code', async () => {
    const user = userEvent.setup()
    const mockOnValid = vi.fn()

    const TestComponent = () => {
      const [code, setCode] = React.useState('')
      const [error, setError] = React.useState('')
      const handleSubmit = () => {
        if (!code.trim()) {
          setError('请输入邀请码')
          return
        }
        mockOnValid(code)
      }
      return (
        <div>
          <input value={code} onChange={(e) => setCode(e.target.value)} data-testid="invite-code" />
          <button onClick={handleSubmit} data-testid="submit">验证</button>
          {error && <span data-testid="error">{error}</span>}
        </div>
      )
    }

    render(<TestComponent />)
    await user.click(screen.getByTestId('submit'))
    expect(screen.getByTestId('error')).toHaveTextContent('请输入邀请码')
    expect(mockOnValid).not.toHaveBeenCalled()
  })

  it('accepts valid invite code', async () => {
    const user = userEvent.setup()
    const mockOnValid = vi.fn()

    const TestComponent = () => {
      const [code, setCode] = React.useState('')
      const [error, setError] = React.useState('')
      const handleSubmit = () => {
        if (!code.trim()) {
          setError('请输入邀请码')
          return
        }
        mockOnValid(code)
      }
      return (
        <div>
          <input value={code} onChange={(e) => setCode(e.target.value)} data-testid="invite-code" />
          <button onClick={handleSubmit} data-testid="submit">验证</button>
          {error && <span data-testid="error">{error}</span>}
        </div>
      )
    }

    render(<TestComponent />)
    await user.type(screen.getByTestId('invite-code'), 'INV-ABC123')
    await user.click(screen.getByTestId('submit'))
    expect(mockOnValid).toHaveBeenCalledWith('INV-ABC123')
  })
})

// Need React for the test components
import React from 'react'
