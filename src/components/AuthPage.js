import React, { useState } from 'react';

const AuthPage = ({ account, onAuthSuccess }) => {
  const [mode, setMode] = useState('signin'); // 'signin' or 'signup'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await account.create('unique()', email, password);
      // After sign up, auto sign in
      await handleSignIn(e, true);
    } catch (err) {
      setError(err.message || 'Sign up failed');
      setLoading(false);
    }
  };

  const handleSignIn = async (e, silent) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await account.createEmailPasswordSession(email, password);
      const user = await account.get();
      onAuthSuccess(user);
    } catch (err) {
      if (!silent) setError(err.message || 'Sign in failed');
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-container" style={{ maxWidth: 400, margin: '0 auto', padding: 32 }}>
      <h2 className="mb-4 text-center">{mode === 'signin' ? 'Sign In' : 'Sign Up'}</h2>
      <form onSubmit={mode === 'signin' ? handleSignIn : handleSignUp}>
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input type="email" className="form-control" value={email} onChange={e => setEmail(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Password</label>
          <input type="password" className="form-control" value={password} onChange={e => setPassword(e.target.value)} required />
        </div>
        {error && <div className="alert alert-danger">{error}</div>}
        <button type="submit" className="btn btn-primary w-100" disabled={loading}>
          {loading ? 'Please wait...' : (mode === 'signin' ? 'Sign In' : 'Sign Up')}
        </button>
      </form>
      <div className="text-center mt-3">
        {mode === 'signin' ? (
          <>
            Don't have an account?{' '}
            <button className="btn btn-link p-0" onClick={() => setMode('signup')}>Sign Up</button>
          </>
        ) : (
          <>
            Already have an account?{' '}
            <button className="btn btn-link p-0" onClick={() => setMode('signin')}>Sign In</button>
          </>
        )}
      </div>
    </div>
  );
};

export default AuthPage; 