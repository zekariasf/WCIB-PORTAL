import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '../../../constants/routes'
import { useAppContext } from '../../../context/AppContext'

function Login() {
  const navigate = useNavigate()
  const { login } = useAppContext()
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [error, setError] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()

    if (formData.email === 'demo@wegagen.com' && formData.password === 'demo123') {
      login({ email: formData.email, role: 'Operations Officer' })
      navigate(ROUTES.PORTAL.DASHBOARD)
      return
    }

    setError('Use demo@wegagen.com / demo123 to access the portal.')
  }

  return (
    <section className="flex min-h-[70vh] items-center justify-center bg-background-subtle px-4 py-10">
      <div className="w-full max-w-md rounded-[2rem] border border-border bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-primary">Portal access</p>
        <h1 className="mt-3 text-3xl font-semibold text-secondary">Sign in to the brokerage operations portal</h1>
        <p className="mt-3 text-sm leading-7 text-text-secondary">Use the demo credentials below to explore the dashboard and workflow screens.</p>

        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          <div className="form-field">
            <label htmlFor="email">Email</label>
            <input id="email" type="email" value={formData.email} onChange={(event) => setFormData((previous) => ({ ...previous, email: event.target.value }))} placeholder="demo@wegagen.com" />
          </div>
          <div className="form-field">
            <label htmlFor="password">Password</label>
            <input id="password" type="password" value={formData.password} onChange={(event) => setFormData((previous) => ({ ...previous, password: event.target.value }))} placeholder="demo123" />
          </div>
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          <button type="submit" className="inline-flex w-full items-center justify-center rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-text-on-primary shadow-sm hover:bg-primary-hover">
            Continue to portal
          </button>
        </form>

        <div className="mt-6 rounded-2xl border border-border bg-background-subtle p-4 text-sm text-text-secondary">
          <p className="font-semibold text-secondary">Demo credentials</p>
          <p className="mt-2">Email: demo@wegagen.com</p>
          <p>Password: demo123</p>
        </div>
      </div>
    </section>
  )
}

export default Login
