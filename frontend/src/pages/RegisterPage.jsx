import { useState } from "react";
import { useForm } from "react-hook-form";
import { Toaster, toast } from "react-hot-toast";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Key, Eye, EyeOff, User } from "lucide-react";

const RegisterPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setIsLoading(true);
    const toastId = toast.loading("Creating account...");

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success("Registration successful! Redirecting to login...", { id: toastId });
        setTimeout(() => navigate("/login"), 2000);
      } else {
        toast.error(result.message || "Registration failed", { id: toastId });
      }
    } catch (error) {
      toast.error("Something went wrong!", { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex font-sans min-h-screen items-center justify-center">
      <Toaster position="top-right" reverseOrder={false} />
      <div className="w-full m-3 md:max-w-sm p-4 sm:p-8 bg-white rounded-2xl">
        <div className="flex items-center gap-x-2 mb-6">
          <p className="w-6 h-6 bg-blue-700 rounded-full"></p>
          <h2 className="text-2xl font-bold text-gray-800">Create an Account</h2>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* First Name */}
          <div className="border rounded-xl flex gap-x-2 items-center p-3 bg-gray-50">
            <User size={18} className="text-gray-500" />
            <input
              type="text"
              placeholder="First Name"
              {...register("firstName", { required: "First Name is required" })}
              className="outline-none text-sm bg-transparent w-full"
            />
          </div>
          {errors.firstName && <p className="text-red-500 text-xs">{errors.firstName.message}</p>}

          {/* Last Name */}
          <div className="border rounded-xl flex gap-x-2 items-center p-3 bg-gray-50">
            <User size={18} className="text-gray-500" />
            <input
              type="text"
              placeholder="Last Name"
              {...register("lastName", { required: "Last Name is required" })}
              className="outline-none text-sm bg-transparent w-full"
            />
          </div>
          {errors.lastName && <p className="text-red-500 text-xs">{errors.lastName.message}</p>}

          {/* Email */}
          <div className="border rounded-xl flex gap-x-2 items-center p-3 bg-gray-50">
            <Mail size={18} className="text-gray-500" />
            <input
              type="email"
              placeholder="Email Address"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address",
                },
              })}
              className="outline-none text-sm bg-transparent w-full"
            />
          </div>
          {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}

          {/* Password */}
          <div className="border rounded-xl flex gap-x-2 items-center p-3 bg-gray-50 relative">
            <Key size={18} className="text-gray-500" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              {...register("password", {
                required: "Password is required",
                minLength: { value: 6, message: "Password must be at least 6 characters" },
              })}
              className="outline-none text-sm bg-transparent w-full"
            />
            <button
              type="button"
              className="absolute right-3 cursor-pointer"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? <EyeOff size={18} className="text-gray-500" /> : <Eye size={18} className="text-gray-500" />}
            </button>
          </div>
          {errors.password && <p className="text-red-500 text-xs">{errors.password.message}</p>}

          {/* Already have an account? */}
          <div className="flex justify-end text-xs text-gray-600">
            <Link to="/login" className="text-blue-600 hover:underline">Already have an account? Log in</Link>
          </div>

          {/* Register Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full cursor-pointer rounded-xl bg-blue-700 hover:bg-blue-800 text-white py-2 text-center text-sm transition disabled:bg-blue-300"
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-x-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Registering...</span>
              </div>
            ) : (
              "Register"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;