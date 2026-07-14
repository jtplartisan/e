import { useForm } from "react-hook-form";
import { login } from "../redux/slices/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  
  useEffect(() => {
    if (!user) return;

    if (user.role === "admin") {
      navigate("/dashboard/admin");
    } else if (user.role === "seller") {
      navigate("/dashboard/seller");
    } else {
      navigate("/dashboard/customer");
    }
  }, [user, navigate]);

  const onSubmit = async (data) => {
    try {
      setLoading(true);

      const res = await dispatch(login(data));

      //  LOGIN FAILED
      if (res?.error) {
        alert(res?.payload?.message || "Invalid credentials ");
        return;
      }

      

    } catch (err) {
      console.log("Login error:", err);
      alert("Something went wrong ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-700 via-blue-600 to-cyan-500 flex items-center justify-center px-4">

      <div className="w-full max-w-md">

        
        <div className="bg-white/15 backdrop-blur-xl border border-white/20 shadow-2xl rounded-3xl p-8">

          
          <div className="flex justify-center mb-5">
            <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center shadow-lg">
              <span className="text-3xl">🛍️</span>
            </div>
          </div>

          
          <h2 className="text-4xl font-bold text-center text-white mb-2">
            Welcome Back
          </h2>

          <p className="text-center text-white/80 mb-8">
            Login to continue shopping
          </p>

          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

            
            <div>
              <div className="relative">
                <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />

                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-white text-gray-800 outline-none border border-gray-200 focus:ring-2 focus:ring-blue-500"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /\S+@\S+\.\S+/,
                      message: "Invalid email format",
                    },
                  })}
                />
              </div>

              {errors.email && (
                <p className="text-red-200 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            
            <div>
              <div className="relative">
                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />

                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="w-full pl-12 pr-12 py-3 rounded-xl bg-white text-gray-800 outline-none border border-gray-200 focus:ring-2 focus:ring-blue-500"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  })}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>

              {errors.password && (
                <p className="text-red-200 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            
            <div className="flex justify-end">
              <Link
                to="/forgot-password"
                className="text-sm text-white hover:underline"
              >
                Forgot Password?
              </Link>
            </div>

            
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-xl font-semibold text-white transition-all duration-300 ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-linear-to-r from-indigo-600 to-blue-600 hover:scale-[1.02] hover:shadow-xl"
              }`}
            >
              {loading ? "Logging in..." : "Login"}
            </button>

          </form>

          
          <div className="flex items-center my-6">
            <div className="flex-1 h-px bg-white/30"></div>
            <span className="px-4 text-white/70 text-sm">OR</span>
            <div className="flex-1 h-px bg-white/30"></div>
          </div>

          
          <p className="text-center text-white">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-bold hover:underline text-yellow-300"
            >
              Register
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
}

export default Login;