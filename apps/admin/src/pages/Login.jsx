import { useState, useEffect } from 'react'
import { Account, Client } from 'appwrite'
import { toast, ToastContainer } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext';
import 'react-toastify/dist/ReactToastify.css'

// Appwrite Config
const client = new Client()
client
    .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT)
    .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID)

const account = new Account(client)

export default function Login() {
    const navigate = useNavigate();
    const { user, loading: authLoading, setUser } = useAuth();
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [banner, setBanner] = useState('/banner-light.jpg')
    const [touched, setTouched] = useState({ email: false, password: false })
    const [errors, setErrors] = useState({ email: '', password: '' })

    useEffect(() => {
        const updateBanner = () => {
            const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
            setBanner(isDark ? '/banner-dark.jpg' : '/banner-light.jpg')
        }
        updateBanner()
        const mq = window.matchMedia('(prefers-color-scheme: dark)')
        mq.addEventListener('change', updateBanner)
        return () => mq.removeEventListener('change', updateBanner)
    }, [])

    useEffect(() => {
        // If user is already logged in (from AuthContext), redirect to dashboard
        if (user && !authLoading) {
            navigate('/dashboard', { replace: true });
        }
    }, [user, authLoading, navigate])

    const validate = () => {
        let emailError = ''
        let passwordError = ''
        if (!email) emailError = 'Email is required.'
        else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) emailError = 'Enter a valid email.'
        if (!password) passwordError = 'Password is required.'
        setErrors({ email: emailError, password: passwordError })
        return !emailError && !passwordError
    }

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await account.createEmailPasswordSession(email, password);
            const userData = await account.get();
            setUser(userData); // Update AuthContext
            navigate('/dashboard', { replace: true });
        } catch (err) {
            toast.error(err.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-[var(--bg)] px-4">
            <div className="bg-[var(--card-bg)] flex flex-col md:flex-row shadow-lg rounded-xl overflow-hidden w-full max-w-5xl">
                {/* Banner */}
                <div className="md:w-1/2 w-full h-48 md:h-auto">
                    <img src={banner} alt="Codelf Banner" className="w-full h-full object-cover" />
                </div>

                {/* Form */}
                <div className="md:w-1/2 w-full p-8 flex flex-col items-center justify-center">
                    <div className="flex flex-col items-center mb-6">
                        <img src="/logo.svg" alt="Codelf Logo" className="w-14 h-14 mb-1 filter dark:invert" />
                        <img src="/logo-text.svg" alt="Codelf Admin Console" className="w-40 mb-1 filter dark:invert" />
                        <p className="text-sm text-[var(--fg)] opacity-80">Admin Console</p>
                    </div>

                    <form onSubmit={handleLogin} className="w-full flex flex-col gap-4 max-w-md" noValidate>
                        {/* Email */}
                        <div>
                            <input
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value)
                                    if (touched.email) validate()
                                }}
                                onBlur={() => {
                                    setTouched(t => ({ ...t, email: true }))
                                    validate()
                                }}
                                autoComplete="username"
                                required
                                className={`w-full px-5 py-3 text-base rounded-lg border outline-none bg-[var(--input-bg)] text-[var(--input-fg)] ${
                                    touched.email && errors.email
                                        ? 'border-red-500 bg-red-50 text-red-700'
                                        : 'border-transparent'
                                }`}
                            />
                            {touched.email && errors.email && (
                                <p className="text-sm text-red-500 mt-1">{errors.email}</p>
                            )}
                        </div>

                        {/* Password */}
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Password"
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value)
                                    if (touched.password) validate()
                                }}
                                onBlur={() => {
                                    setTouched(t => ({ ...t, password: true }))
                                    validate()
                                }}
                                autoComplete="current-password"
                                required
                                className={`w-full px-5 py-3 text-base rounded-lg border outline-none bg-[var(--input-bg)] text-[var(--input-fg)] pr-12 ${
                                    touched.password && errors.password
                                        ? 'border-red-500 bg-red-50 text-red-700'
                                        : 'border-transparent'
                                }`}
                            />
                            <span
                                className="absolute right-4 inset-y-0 flex items-center cursor-pointer text-[var(--input-fg)] opacity-70 hover:opacity-100 z-10"
                                onClick={() => setShowPassword((v) => !v)}
                                tabIndex={0}
                                role="button"
                                aria-label={showPassword ? 'Hide password' : 'Show password'}
                            >
                {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.98 8.223A10.477 10.477 0 002.25 12c2.083 3.61 6.017 6 9.75 6 1.662 0 3.26-.356 4.684-1.01M6.228 6.228A9.956 9.956 0 0112 6c3.733 0 7.667 2.39 9.75 6a10.477 10.477 0 01-1.733 2.978M6.228 6.228L3 3m15 15l-3-3" />
                    </svg>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 12S5.25 6.75 12 6.75 21.75 12 21.75 12 18.75 17.25 12 17.25 2.25 12 2.25 12z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15.75a3.75 3.75 0 100-7.5 3.75 3.75 0 000 7.5z" />
                    </svg>
                )}
              </span>
                            {touched.password && errors.password && (
                                <p className="text-sm text-red-500 mt-1">{errors.password}</p>
                            )}
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 text-base font-semibold rounded-lg bg-[var(--button-bg)] text-[var(--button-fg)] hover:bg-[var(--button-bg-hover)] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Logging in...' : 'Log In'}
                        </button>
                    </form>
                </div>
            </div>
            <ToastContainer position="top-right" autoClose={3000} />
        </div>
    )
}
