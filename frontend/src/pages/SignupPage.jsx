import React, { useState } from 'react'
import { useAuthStore } from '../store/useAuthStore'
import { Eye, EyeOff } from 'lucide-react'
import { Loader } from 'lucide-react'
import { Link } from 'react-router-dom'
import { toast } from 'react-hot-toast'

const SignupPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })

 
  const { signup, isSignedUp } = useAuthStore();

  const validateForm = () => {
    if(!formData.name) {
      toast.error("Name is required");
      return false;
    }
    if(!formData.email) {
      toast.error("Email is required");
      return false;
    }
    if(!formData.password) {
      toast.error("Password is required");
      return false;
    }
    if(!formData.confirmPassword) {
      toast.error("Confirm Password is required");
      return false;
    }
    if(formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return false;
    }
    if(formData.password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return false;
    }
    if(!formData.email.includes("@")) {
      toast.error("Invalid email");
      return false;
    }
    return true;
  } 
  const handleSubmit = async (e) => {
    e.preventDefault();

    const isValid = validateForm();

    if (isValid) {
      await signup(formData);
      // After successful signup, navigate to homepage
    }
  }

  return (
    <div className="register-container">
      <div className="register-card">
        <div className="logo-section">
          <img src="/logo-counsel.png" alt="TSU Guidance and Counseling Unit Logo" />
          <p>TSU Guidance and Counseling Unit</p>
        </div>
        
        <h2 className="register-title">Create Account</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="form-input"
            />
          </div>
          
          <div className="form-group">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="form-input"
            />
          </div>
          
          <div className="form-group relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              className="form-input pr-12"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          
          <div className="form-group relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
              className="form-input pr-12"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          
          <button 
            type="submit" 
            className="register-button"
            disabled={isSignedUp}
          >
            {isSignedUp ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  <span>Creating Account...</span>
                </>
            ) : (
                <>
                  <span>Sign up</span>
                </>
            )
            }   
          </button>
        </form>
        
        <div className="login-link">
          Already have an account? <Link to="/login">Log in</Link>
        </div>
      </div>
    </div>
  )
}

export default SignupPage
