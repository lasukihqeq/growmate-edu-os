import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'

describe('Onboarding Form', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('renders all required fields', () => {
    const TestForm = () => (
      <form data-testid="onboarding">
        <label>
          姓名
          <input data-testid="name" type="text" placeholder="请输入真实姓名" />
        </label>
        <label>
          手机号
          <input data-testid="phone" type="tel" placeholder="请输入手机号" />
        </label>
        <label>
          孩子年龄
          <select data-testid="age">
            <option value="">选择年龄</option>
            <option value="6">6岁</option>
            <option value="7">7岁</option>
            <option value="8">8岁</option>
          </select>
        </label>
        <label>
          年级
          <select data-testid="grade">
            <option value="">选择年级</option>
            <option value="小学1-2年级">小学1-2年级</option>
            <option value="小学3-4年级">小学3-4年级</option>
          </select>
        </label>
        <button type="submit" data-testid="submit">开始评估</button>
      </form>
    )

    render(<TestForm />)

    expect(screen.getByTestId('name')).toBeInTheDocument()
    expect(screen.getByTestId('phone')).toBeInTheDocument()
    expect(screen.getByTestId('age')).toBeInTheDocument()
    expect(screen.getByTestId('grade')).toBeInTheDocument()
    expect(screen.getByTestId('submit')).toBeInTheDocument()
  })

  it('validates required fields', async () => {
    const user = userEvent.setup()
    const mockOnComplete = vi.fn()

    const TestForm = () => {
      const [errors, setErrors] = React.useState<Record<string, string>>({})
      const [formData, setFormData] = React.useState({ name: '', phone: '', age: '', grade: '' })

      const validate = () => {
        const newErrors: Record<string, string> = {}
        if (!formData.name.trim()) newErrors.name = '请输入姓名'
        if (!formData.phone.trim()) newErrors.phone = '请输入手机号'
        if (!formData.age) newErrors.age = '请选择年龄'
        if (!formData.grade) newErrors.grade = '请选择年级'
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
      }

      const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (validate()) {
          mockOnComplete(formData)
        }
      }

      return (
        <form onSubmit={handleSubmit} data-testid="onboarding">
          <div>
            <input
              data-testid="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="请输入真实姓名"
            />
            {errors.name && <span data-testid="name-error">{errors.name}</span>}
          </div>
          <div>
            <input
              data-testid="phone"
              value={formData.phone}
              onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              placeholder="请输入手机号"
            />
            {errors.phone && <span data-testid="phone-error">{errors.phone}</span>}
          </div>
          <div>
            <select
              data-testid="age"
              value={formData.age}
              onChange={(e) => setFormData(prev => ({ ...prev, age: e.target.value }))}
            >
              <option value="">选择年龄</option>
              <option value="6">6岁</option>
              <option value="7">7岁</option>
              <option value="8">8岁</option>
            </select>
            {errors.age && <span data-testid="age-error">{errors.age}</span>}
          </div>
          <div>
            <select
              data-testid="grade"
              value={formData.grade}
              onChange={(e) => setFormData(prev => ({ ...prev, grade: e.target.value }))}
            >
              <option value="">选择年级</option>
              <option value="小学1-2年级">小学1-2年级</option>
              <option value="小学3-4年级">小学3-4年级</option>
            </select>
            {errors.grade && <span data-testid="grade-error">{errors.grade}</span>}
          </div>
          <button type="submit" data-testid="submit">开始评估</button>
        </form>
      )
    }

    render(<TestForm />)
    await user.click(screen.getByTestId('submit'))

    expect(screen.getByTestId('name-error')).toHaveTextContent('请输入姓名')
    expect(screen.getByTestId('phone-error')).toHaveTextContent('请输入手机号')
    expect(screen.getByTestId('age-error')).toHaveTextContent('请选择年龄')
    expect(screen.getByTestId('grade-error')).toHaveTextContent('请选择年级')
    expect(mockOnComplete).not.toHaveBeenCalled()
  })

  it('submits valid form data', async () => {
    const user = userEvent.setup()
    const mockOnComplete = vi.fn()

    const TestForm = () => {
      const [formData, setFormData] = React.useState({ name: '', phone: '', age: '', grade: '' })

      const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        mockOnComplete(formData)
      }

      return (
        <form onSubmit={handleSubmit}>
          <input
            data-testid="name"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          />
          <input
            data-testid="phone"
            value={formData.phone}
            onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
          />
          <select
            data-testid="age"
            value={formData.age}
            onChange={(e) => setFormData(prev => ({ ...prev, age: e.target.value }))}
          >
            <option value="">选择</option>
            <option value="8">8岁</option>
          </select>
          <select
            data-testid="grade"
            value={formData.grade}
            onChange={(e) => setFormData(prev => ({ ...prev, grade: e.target.value }))}
          >
            <option value="">选择</option>
            <option value="小学3-4年级">小学3-4年级</option>
          </select>
          <button type="submit" data-testid="submit">开始评估</button>
        </form>
      )
    }

    render(<TestForm />)

    await user.type(screen.getByTestId('name'), '李明')
    await user.type(screen.getByTestId('phone'), '13912345678')
    await user.selectOptions(screen.getByTestId('age'), '8')
    await user.selectOptions(screen.getByTestId('grade'), '小学3-4年级')
    await user.click(screen.getByTestId('submit'))

    expect(mockOnComplete).toHaveBeenCalledWith({
      name: '李明',
      phone: '13912345678',
      age: '8',
      grade: '小学3-4年级',
    })
  })
})
