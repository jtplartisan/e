import { useForm } from "react-hook-form";
import { register as registerUser } from "../redux/slices/authSlice";
import { useDispatch } from "react-redux";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";

function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    mode: "onBlur",
  });

  const password = watch("password");

  const onSubmit = async (data) => {
    try {
      setLoading(true);

      const { confirmPassword, ...userData } = data;

      await dispatch(registerUser(userData));

      alert("Account created successfully ");

      navigate("/login");
    } catch (err) {
      console.log("Register error:", err);
      alert("Registration failed ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-green-600 via-emerald-500 to-teal-500 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <div className="bg-white/15 backdrop-blur-xl border border-white/20 shadow-2xl rounded-3xl p-8">
          {/* Logo */}
          <div className="flex justify-center mb-5">
            <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center shadow-lg">
              <span className="text-3xl">🛍️</span>
            </div>
          </div>

          
          <h2 className="text-4xl font-bold text-center text-white mb-2">
            Create Account
          </h2>

          <p className="text-center text-white/80 mb-8">
            Join us and start shopping today
          </p>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-5"
          >
            
            <div>
              <div className="relative">
                <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />

                <input
                  type="text"
                  placeholder="Full Name"
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-white text-gray-800 border border-gray-200 outline-none focus:ring-2 focus:ring-green-500"
                  {...register("name", {
                    required: "Full name is required",
                    minLength: {
                      value: 3,
                      message:
                        "Name must be at least 3 characters",
                    },
                  })}
                />
              </div>

              {errors.name && (
                <p className="text-red-200 text-sm mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            
            <div>
              <div className="relative">
                <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />

                <input
                  type="email"
                  placeholder="Email Address"
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-white text-gray-800 border border-gray-200 outline-none focus:ring-2 focus:ring-green-500"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value:
                        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message:
                        "Please enter a valid email address",
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

            {/* Password */}
            <div>
              <div className="relative">
                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />

                <input
                  type={
                    showPassword ? "text" : "password"
                  }
                  placeholder="Password"
                  className="w-full pl-12 pr-12 py-3 rounded-xl bg-white text-gray-800 border border-gray-200 outline-none focus:ring-2 focus:ring-green-500"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message:
                        "Password must be at least 6 characters",
                    },
                   
                  })}
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  {showPassword ? (
                    <FaEyeSlash />
                  ) : (
                    <FaEye />
                  )}
                </button>
              </div>

              {errors.password && (
                <p className="text-red-200 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            
            <div>
              <div className="relative">
                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />

                <input
                  type={
                    showConfirmPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Confirm Password"
                  className="w-full pl-12 pr-12 py-3 rounded-xl bg-white text-gray-800 border border-gray-200 outline-none focus:ring-2 focus:ring-green-500"
                  {...register("confirmPassword", {
                    required:
                      "Confirm Password is required",
                    validate: (value) =>
                      value === password ||
                      "Passwords do not match",
                  })}
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(
                      !showConfirmPassword
                    )
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  {showConfirmPassword ? (
                    <FaEyeSlash />
                  ) : (
                    <FaEye />
                  )}
                </button>
              </div>

              {errors.confirmPassword && (
                <p className="text-red-200 text-sm mt-1">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            
            <div>
              <select
                className="w-full py-3 px-4 rounded-xl bg-white text-gray-800 border border-gray-200 outline-none focus:ring-2 focus:ring-green-500"
                {...register("role", {
                  required: "Please select a role",
                })}
              >
                <option value="">
                  Select Your Role
                </option>
                <option value="customer">
                  Customer
                </option>
                <option value="seller">
                  Seller
                </option>
              </select>

              {errors.role && (
                <p className="text-red-200 text-sm mt-1">
                  {errors.role.message}
                </p>
              )}
            </div>

            
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-xl font-semibold text-white transition-all duration-300 ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-linear-to-r from-green-600 to-emerald-600 hover:scale-[1.02] hover:shadow-xl"
              }`}
            >
              {loading
                ? "Creating Account..."
                : "Create Account"}
            </button>
          </form>

          
          <div className="flex items-center my-6">
            <div className="flex-1 h-px bg-white/30"></div>
            <span className="px-4 text-white/70 text-sm">
              OR
            </span>
            <div className="flex-1 h-px bg-white/30"></div>
          </div>

          
          <p className="text-center text-white">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-bold text-yellow-300 hover:underline"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;