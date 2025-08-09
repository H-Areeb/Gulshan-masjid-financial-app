import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import { useAuthStore } from '../contexts/useAuthStore';
import { FaFacebook, FaGoogle } from 'react-icons/fa6';
import toast from 'react-hot-toast';

const Login = () => {
  const navigate = useNavigate();
  const { setToken, setUser } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const res = await axios.post('/login', data); 
      if (res.data.user) {
        setToken(res.data.token);
        setUser(res.data.user);
        toast.success(`Welcome back, ${res.data.user.name || 'User'}!`);
        navigate('/dashboard');
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Left side */}
      <div className="flex flex-col justify-center w-full md:w-1/2 px-6 md:px-20">
        <div className="w-full max-w-md mx-auto">
          {/* Mobile Branding Header */}
          <div className="md:hidden fixed top-0 left-0 w-full bg-white text-center py-4 shadow z-10">
            <img
              src={require("../assets/masjid-logo.png")}
              alt="Gulshan Masjid Logo"
              className="w-20 h-20 mx-auto mb-2 rounded-full shadow"
            />
            <h1 className="text-xl font-bold text-gray-800">Gulshan Masjid</h1>
            <p className="text-sm text-gray-500">
              Mosque Financial Management System
            </p>
          </div>

          <h2 className="text-3xl font-bold text-gray-900">Sign In</h2>
          <p className="text-gray-500 mt-2 mb-6">
            Enter your email and password to sign in!
          </p>

          <div className="space-y-3 mb-4">
            <button className="w-full flex items-center justify-center gap-2 bg-green-50 border border-green-200 px-4 py-2 rounded-md text-sm hover:bg-green-100 transition">
              <FaGoogle className="text-[#10B981] text-lg" /> Sign in with Google
            </button>
            <button className="w-full flex items-center justify-center gap-2 bg-green-50 border border-green-200 px-4 py-2 rounded-md text-sm hover:bg-green-100 transition">
              <FaFacebook className="text-[#6366F1] text-lg" /> Sign in with Facebook
            </button>
          </div>

          <div className="flex items-center mb-4">
            <div className="flex-grow border-t border-gray-300" />
            <span className="mx-2 text-gray-500 text-sm">Or</span>
            <div className="flex-grow border-t border-gray-300" />
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-base font-medium mb-1 text-gray-700">
                Email *
              </label>
              <input
                type="email"
                {...register("email", { required: "Email is required" })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-200 transition"
                placeholder="info@gmail.com"
                inputMode="email" autoComplete="email" 
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-base font-medium mb-1 text-gray-700">
                Password *
              </label>
              <input
                type="password"
                {...register("password", { required: "Password is required" })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-200 transition"
                placeholder="Enter your password"
                autoComplete="current-password"
              />
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <label className="text-sm flex items-center gap-2">
                <input type="checkbox" className="form-checkbox accent-green-500" />
                Keep me logged in
              </label>
              <a href="#" className="text-sm text-green-600 hover:underline">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition font-semibold"
            >
              {isSubmitting ? "Signing in..." : "Sign in"}
            </button>
          </form>
        </div>
      </div>

      {/* Right side */}
      <div className="hidden md:flex items-center justify-center w-1/2 bg-gradient-to-br from-green-100 to-green-300">
        <div className="text-center px-15">
          <img
            src={require("../assets/masjid-logo2.png")}
            alt="Gulshan Masjid Logo"
            className="w-24 h-24 mx-auto mb-4 rounded-full shadow-lg"
          />
          <h1 className="text-3xl font-bold text-green-700 mb-2">Gulshan Masjid</h1>
          <p className="text-green-600 text-sm">
            Mosque Financial Management System
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;