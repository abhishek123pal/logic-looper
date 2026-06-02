import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true); // Toggle between Login & Signup
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // AuthContext se functions nikaalna
  const { login, signup, loginAsGuest, resetPassword } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) {
        await login(email, password);
        alert("Logged in successfully!");
      } else {
        await signup(email, password);
        alert("Account created!");
      }
    } catch (err) {
      alert(err.message);
    }
  };

  const handleForgot = async () => {
    if (!email) return alert("Please enter your email first!");
    try {
      await resetPassword(email);
      alert("Password reset link sent to your email!");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="auth-container" style={{ padding: '20px', maxWidth: '400px', margin: 'auto', textAlign: 'center' }}>
      <h2>{isLogin ? 'Login to Logic Looper' : 'Create Account'}</h2>
      
      <form onSubmit={handleSubmit}>
        <input 
          type="email" placeholder="Email" value={email} 
          onChange={(e) => setEmail(e.target.value)} required 
          style={{ display: 'block', width: '100%', marginBottom: '10px', padding: '10px' }}
        />
        <input 
          type="password" placeholder="Password" value={password} 
          onChange={(e) => setPassword(e.target.value)} required 
          style={{ display: 'block', width: '100%', marginBottom: '10px', padding: '10px' }}
        />
        
        <button type="submit" style={{ width: '100%', padding: '10px', background: '#4CAF50', color: 'white', border: 'none' }}>
          {isLogin ? 'Login' : 'Sign Up'}
        </button>
      </form>

      <div style={{ marginTop: '15px' }}>
        <button onClick={() => setIsLogin(!isLogin)} style={{ background: 'none', border: 'none', color: 'blue', cursor: 'pointer' }}>
          {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Login"}
        </button>
        <br />
        {isLogin && (
          <button onClick={handleForgot} style={{ background: 'none', border: 'none', color: 'red', fontSize: '12px', cursor: 'pointer' }}>
            Forgot Password?
          </button>
        )}
      </div>

      <hr style={{ margin: '20px 0' }} />

      <button onClick={loginAsGuest} style={{ width: '100%', padding: '10px', background: '#555', color: 'white', border: 'none' }}>
        Play as Guest
      </button>
    </div>
  );
};

export default AuthForm;