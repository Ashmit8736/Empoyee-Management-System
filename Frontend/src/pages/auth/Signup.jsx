import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../../styles/Auth.css';
import api from "../api/axios";

const Signup = () => {
    const [formData, setFormData] = useState({ name: '', email: '', mobile: '', password: '' });
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Yahan aapki API Call aayegi
        try {
            const res = await api.post('/auth/signup', formData);
            console.log("✅ Signup successful:", res.data);
            alert("Signup Successful! Redirecting to Login...");
        navigate('/login');
        } catch (error) {
            console.error("Signup Error:", error.response?.data || error);
            alert(error.response?.data?.message || "Signup failed");
            return;
        }    
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2>Employee Signup</h2>
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label>Full Name</label>
                        <input type="text" required onChange={(e) => setFormData({...formData, name: e.target.value})} />
                    </div>
                    <div className="input-group">
                        <label>Email</label>
                        <input type="email" required onChange={(e) => setFormData({...formData, email: e.target.value})} />
                    </div>
                    <div className="input-group">
                        <label>Mobile</label>
                        <input type="text" required onChange={(e) => setFormData({...formData, mobile: e.target.value})} />
                    </div>
                    <div className="input-group">
                        <label>Password</label>
                        <input type="password" required onChange={(e) => setFormData({...formData, password: e.target.value})} />
                    </div>
                    <button type="submit" className="auth-btn">Sign Up</button>
                </form>
                <p>Already have an account? <Link to="/login">Login here</Link></p>
            </div>
        </div>
    );
};

export default Signup;