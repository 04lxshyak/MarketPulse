import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Mail, Lock, Loader2, ArrowRight } from 'lucide-react'
import { useAuth } from './AuthContext'

export default function AuthModal({ isOpen, onClose }) {
  const { login, register } = useAuth()
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    try {
      const result = isLogin 
        ? await login(email, password)
        : await register(email, password)
        
      if (result.success) {
        if (!isLogin) {
          setIsLogin(true)
          setError('Registration successful! Please login.')
        } else {
          onClose()
        }
      } else {
        setError(result.error)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div 
            className="auth-modal glass-effect"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          >
            <div className="modal-header">
              <h2 className="outfit">{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
              <button className="close-btn" onClick={onClose}><X size={20} /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="auth-form">
              {error && (
                <motion.div 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="auth-error"
                >
                  {error}
                </motion.div>
              )}
              
              <div className="input-group">
                <Mail size={18} className="input-icon" />
                <input 
                  type="email" 
                  placeholder="Email Address"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                />
              </div>

              <div className="input-group">
                <Lock size={18} className="input-icon" />
                <input 
                  type="password" 
                  placeholder="Password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                />
              </div>

              <motion.button 
                className="submit-btn outfit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={loading}
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : (
                  <>
                    {isLogin ? 'Access Terminal' : 'Join Network'}
                    <ArrowRight size={18} />
                  </>
                )}
              </motion.button>
            </form>

            <div className="auth-footer">
              <p>
                {isLogin ? "Don't have access?" : "Already a member?"}
                <button 
                  onClick={() => setIsLogin(!isLogin)}
                  disabled={loading}
                >
                  {isLogin ? 'Request Invitation' : 'Sign In Now'}
                </button>
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
