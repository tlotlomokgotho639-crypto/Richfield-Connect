import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ProfilePreview } from '../components'
import { useApp } from '../AppContext'

const interestsList = ['Programming', 'Design', 'Data Science', 'Networking', 'Cybersecurity', 'Business']
const campuses = ['Cape Town', 'Durban', 'Johannesburg', 'Pretoria']
const blankForm = { fullName: '', studentNumber: '', campus: '', email: '', password: '', confirmPassword: '', interests: [], bio: '', terms: false }

function validate(form, isLogin) {
  const errors = {}
  if (!isLogin) {
    if (!form.fullName.trim()) errors.fullName = 'Your full name is required.'
    if (!/^\d{6,}$/.test(form.studentNumber)) errors.studentNumber = 'Use at least 6 digits.'
    if (!form.campus) errors.campus = 'Select your campus.'
    if (!/^\S+@\S+\.\S+$/.test(form.email)) errors.email = 'Enter a valid email address.'
    if (form.password.length < 8) errors.password = 'Use at least 8 characters.'
    if (form.confirmPassword !== form.password) errors.confirmPassword = 'Passwords do not match.'
    if (!form.interests.length) errors.interests = 'Choose at least one interest.'
    if (form.bio.trim().length < 20) errors.bio = 'Tell the community a little more (20 characters minimum).'
    if (!form.terms) errors.terms = 'Please accept the community terms.'
  } else {
    if (!/^\S+@\S+\.\S+$/.test(form.email)) errors.email = 'Enter a valid email address.'
    if (!form.password) errors.password = 'Enter your password.'
  }
  return errors
}

export default function Auth({ mode = 'signup' }) {
  const isLogin = mode === 'login'
  const navigate = useNavigate()
  const { state, dispatch } = useApp()
  const [form, setForm] = useState(isLogin ? { ...blankForm, email: '' } : blankForm)
  const [errors, setErrors] = useState({})
  const [notice, setNotice] = useState('')

  function updateField(name, value) {
    setForm((current) => ({ ...current, [name]: value }))
    if (errors[name]) setErrors((current) => ({ ...current, [name]: '' }))
  }

  function submit(event) {
    event.preventDefault()
    const nextErrors = validate(form, isLogin)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) return
    if (isLogin) {
      if (!state.user || state.user.email.toLowerCase() !== form.email.toLowerCase()) {
        setNotice('No profile found for that email. Create a profile first.')
        return
      }
      dispatch({ type: 'LOGIN_USER' })
      navigate('/feed')
    } else {
      const profile = { ...form }
      dispatch({ type: 'REGISTER_USER', payload: profile })
      navigate('/profile')
    }
  }

  const title = isLogin ? 'Welcome back.' : 'Bring your ideas\nwith you.'
  return <main className="page auth-page"><section className="auth-copy"><div className="eyebrow">{isLogin ? 'Return to the community' : 'Your academic profile starts here'}</div><h1>{title.split('\n').map((line) => <span key={line}>{line}<br /></span>)}<em>{isLogin ? 'Keep the conversation going.' : 'Find the right room.'}</em></h1><p>{isLogin ? 'Log in to pick up where you left off with your people and projects.' : 'Tell us a little about yourself. Your profile helps the right conversations find you.'}</p><div className="auth-trust"><span>✦</span><p>Made for Richfield students<br /><small>Private by design · Useful by default</small></p></div></section><section className={`auth-card ${isLogin ? 'login-card' : ''}`}><div className="auth-card-top"><div><span className="eyebrow">{isLogin ? 'Log in' : 'Create account'}</span><h2>{isLogin ? 'Good to see you.' : 'Start with the basics.'}</h2></div><span className="step-count">{isLogin ? '01' : '01 — 02'}</span></div><form onSubmit={submit} noValidate>{isLogin ? <><Field label="Email address" name="email" type="email" value={form.email} error={errors.email} onChange={updateField} placeholder="you@example.com" /><Field label="Password" name="password" type="password" value={form.password} error={errors.password} onChange={updateField} placeholder="At least 8 characters" /></> : <><div className="form-row"><Field label="Full name" name="fullName" value={form.fullName} error={errors.fullName} onChange={updateField} placeholder="e.g. Lindiwe Ndlovu" /><Field label="Student number" name="studentNumber" value={form.studentNumber} error={errors.studentNumber} onChange={updateField} placeholder="2024••••" inputMode="numeric" /></div><div className="form-row"><Field label="Email address" name="email" type="email" value={form.email} error={errors.email} onChange={updateField} placeholder="you@example.com" /><label className="field"><span>Campus</span><select value={form.campus} onChange={(event) => updateField('campus', event.target.value)}><option value="">Select campus</option>{campuses.map((campus) => <option key={campus}>{campus}</option>)}</select>{errors.campus && <small className="field-error">{errors.campus}</small>}</label></div><div className="form-row"><Field label="Password" name="password" type="password" value={form.password} error={errors.password} onChange={updateField} placeholder="At least 8 characters" /><Field label="Confirm password" name="confirmPassword" type="password" value={form.confirmPassword} error={errors.confirmPassword} onChange={updateField} placeholder="Repeat password" /></div><label className="field"><span>Short bio</span><textarea value={form.bio} onChange={(event) => updateField('bio', event.target.value)} onBlur={() => setErrors((current) => ({ ...current, ...validate(form, false) }))} placeholder="What are you curious about right now?" rows="3" />{errors.bio && <small className="field-error">{errors.bio}</small>}</label><fieldset className="interest-field"><legend>What interests you?</legend><div className="interest-options">{interestsList.map((interest) => <label className={`interest-option ${form.interests.includes(interest) ? 'selected' : ''}`} key={interest}><input type="checkbox" checked={form.interests.includes(interest)} onChange={() => updateField('interests', form.interests.includes(interest) ? form.interests.filter((item) => item !== interest) : [...form.interests, interest])} /><span>{interest}</span></label>)}</div>{errors.interests && <small className="field-error">{errors.interests}</small>}</fieldset><label className="terms"><input type="checkbox" checked={form.terms} onChange={(event) => updateField('terms', event.target.checked)} /><span>I agree to the Richfield Connect community terms.</span></label>{errors.terms && <small className="field-error terms-error">{errors.terms}</small>}</>}{notice && <div className="form-notice">{notice}</div>}<button className="button primary full" type="submit">{isLogin ? 'Log in to Connect' : 'Create my profile'} <span>↗</span></button></form><p className="auth-switch">{isLogin ? 'New to the community?' : 'Already have a profile?'} <Link to={isLogin ? '/signup' : '/login'}>{isLogin ? 'Create one' : 'Log in'}</Link></p></section>{!isLogin && <ProfilePreview form={form} />}</main>
}

function Field({ label, name, type = 'text', value, error, onChange, placeholder, inputMode }) { return <label className="field"><span>{label}</span><input name={name} type={type} value={value} onChange={(event) => onChange(name, event.target.value)} onBlur={(event) => onChange(name, event.target.value)} placeholder={placeholder} inputMode={inputMode} />{error && <small className="field-error">{error}</small>}</label> }
