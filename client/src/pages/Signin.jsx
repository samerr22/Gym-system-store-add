import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from "../redux/user/userSilce";

export default function SignIn() {
  const [formData, setFormData] = useState({});
  const { loading, error: errorMessage } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handlchange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      return dispatch(signInFailure("please fill all the fields"));
    }

    try {
      dispatch(signInStart());

      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(signInFailure(data.message));
      }

      if (res.ok) {
        dispatch(signInSuccess(data));
        navigate('"/dashboard?tab=profile"');
      }
    } catch (error) {
      dispatch(signInFailure(data.message));
    }
  };

  return (
    <div className="  min-h-screen mt-20">
      <div className="flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5">
        <div className="flex-1">
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div>
              <h3 className="font-semibold text-slate-400 ml-1">Email</h3>
              <input
                className=" bg-slate-100 p-3 rounded-lg w-[460px] h-11"
                type="email"
                placeholder="name@company.com"
                id="email"
                onChange={handlchange}
              />
            </div>
            <div>
              <h3 className="font-semibold text-slate-400 ml-1">Password</h3>
              <input
                className=" bg-slate-100 p-3 rounded-lg w-[460px] h-11"
                type="password"
                placeholder="Password"
                id="password"
                onChange={handlchange}
              />
            </div>
            <button
              className=" bg-blue-700 text-white p-3 rounded-lg w-[460px] h-11 hover:opacity-90"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <sapn className="pl-3">Loading...</sapn>
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>
          <div className="flex gap-2 text-sm mt-5">
            <span>Dont Have an account?</span>
            <Link to="/sign-up" className="text-blue-500">
              Sign Up
            </Link>
          </div>
          {errorMessage && (
            <p className="mt-5 text-red-600 bg-red-300 w-300 h-7 rounded-lg text-center ">
              {errorMessage}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
