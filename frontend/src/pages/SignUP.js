import React, { useState } from 'react';
import loginIcons from '../assets/signin.gif';
import { FaEye, FaEyeSlash, FaTrash } from "react-icons/fa";
import { Link, useNavigate } from 'react-router-dom';
import imageTobase64 from '../helpers/imageTobase64';
import SummaryApi from '../common';
import { toast } from 'react-toastify';

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [data, setData] = useState({
    email: "",
    password: "",
    name: "",
    confirmPassword: "",
    profilePic: "",
    phoneNo: "",
    address: {
      street: "",
      city: "",
      state: "",
      postalCode: "",
      country: ""
    }
  });

  const navigate = useNavigate();

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      address: {
        ...prev.address,
        [name]: value
      }
    }));
  };

  const handleUploadPic = async (e) => {
    const file = e.target.files[0];
    const imagePic = await imageTobase64(file);
    setData((prev) => ({
      ...prev,
      profilePic: imagePic
    }));
  };

  const handleDeletePic = () => {
    setData((prev) => ({
      ...prev,
      profilePic: ""
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if all required fields are filled
    const {
      email, password, confirmPassword, name, phoneNo,
      address: { street, city, state, postalCode, country }
    } = data;

    if (!email || !password || !confirmPassword || !name || !phoneNo || !street || !city || !state || !postalCode || !country) {
      toast.error("All fields are required.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Please check password and confirm password");
      return;
    }

    try {
      const dataResponse = await fetch(SummaryApi.signUP.url, {
        method: SummaryApi.signUP.method,
        headers: {
          "content-type": "application/json"
        },
        body: JSON.stringify(data)
      });

      const dataApi = await dataResponse.json();

      if (dataApi.success) {
        toast.success(dataApi.message);
        navigate("/login");
      } else {
        toast.error(dataApi.message);
      }
    } catch (error) {
      toast.error("Error occurred during signup.");
      console.error("Signup error:", error);
    }
  };

  return (
    <section id='signup'>
      <div className='mx-auto container p-4'>
        <div className='bg-white p-5 w-full max-w-sm mx-auto'>
          <div className='w-20 h-20 mx-auto relative overflow-hidden rounded-full'>
            <div>
              <img src={data.profilePic || loginIcons} alt='login icons' />
            </div>
            {data.profilePic && (
              <button
                className='absolute top-0 right-0 bg-red-500 text-white p-2 rounded-full'
                onClick={handleDeletePic}
              >
                <FaTrash />
              </button>
            )}
            <form>
              <label>
                <div className='text-xs bg-opacity-80 bg-slate-200 pb-4 pt-2 cursor-pointer text-center absolute bottom-0 w-full'>
                  Upload Photo
                </div>
                <input type='file' className='hidden' onChange={handleUploadPic} />
              </label>
            </form>
          </div>

          <form className='pt-6 flex flex-col gap-2' onSubmit={handleSubmit}>
            {/* Name Input */}
            <div className='grid'>
              <label>Name:</label>
              <div className='bg-slate-100 p-2'>
                <input
                  type='text'
                  placeholder='Enter your name'
                  name='name'
                  value={data.name}
                  onChange={handleOnChange}
                  required
                  className='w-full h-full outline-none bg-transparent'
                />
              </div>
            </div>

            {/* Email Input */}
            <div className='grid'>
              <label>Email:</label>
              <div className='bg-slate-100 p-2'>
                <input
                  type='email'
                  placeholder='Enter email'
                  name='email'
                  value={data.email}
                  onChange={handleOnChange}
                  required
                  className='w-full h-full outline-none bg-transparent'
                />
              </div>
            </div>

            {/* Phone Number Input */}
            <div className='grid'>
              <label>Phone Number:</label>
              <div className='bg-slate-100 p-2'>
                <input
                  type='text'
                  placeholder='Enter phone number'
                  name='phoneNo'
                  value={data.phoneNo}
                  onChange={handleOnChange}
                  required
                  className='w-full h-full outline-none bg-transparent'
                />
              </div>
            </div>

            {/* Address Inputs */}
            <div className='grid'>
              <label>Street:</label>
              <div className='bg-slate-100 p-2'>
                <input
                  type='text'
                  placeholder='Enter street'
                  name='street'
                  value={data.address.street}
                  onChange={handleAddressChange}
                  required
                  className='w-full h-full outline-none bg-transparent'
                />
              </div>
            </div>
            <div className='grid'>
              <label>City:</label>
              <div className='bg-slate-100 p-2'>
                <input
                  type='text'
                  placeholder='Enter city'
                  name='city'
                  value={data.address.city}
                  onChange={handleAddressChange}
                  required
                  className='w-full h-full outline-none bg-transparent'
                />
              </div>
            </div>
            <div className='grid'>
              <label>State:</label>
              <div className='bg-slate-100 p-2'>
                <input
                  type='text'
                  placeholder='Enter state'
                  name='state'
                  value={data.address.state}
                  onChange={handleAddressChange}
                  required
                  className='w-full h-full outline-none bg-transparent'
                />
              </div>
            </div>
            <div className='grid'>
              <label>Postal Code:</label>
              <div className='bg-slate-100 p-2'>
                <input
                  type='text'
                  placeholder='Enter postal code'
                  name='postalCode'
                  value={data.address.postalCode}
                  onChange={handleAddressChange}
                  required
                  className='w-full h-full outline-none bg-transparent'
                />
              </div>
            </div>
            <div className='grid'>
              <label>Country:</label>
              <div className='bg-slate-100 p-2'>
                <input
                  type='text'
                  placeholder='Enter country'
                  name='country'
                  value={data.address.country}
                  onChange={handleAddressChange}
                  required
                  className='w-full h-full outline-none bg-transparent'
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label>Password:</label>
              <div className='bg-slate-100 p-2 flex'>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder='Enter password'
                  value={data.password}
                  name='password'
                  onChange={handleOnChange}
                  required
                  className='w-full h-full outline-none bg-transparent'
                />
                <div className='cursor-pointer text-xl' onClick={() => setShowPassword((prev) => !prev)}>
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </div>
              </div>
            </div>

            {/* Confirm Password Input */}
            <div>
              <label>Confirm Password:</label>
              <div className='bg-slate-100 p-2 flex'>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder='Confirm password'
                  value={data.confirmPassword}
                  name='confirmPassword'
                  onChange={handleOnChange}
                  required
                  className='w-full h-full outline-none bg-transparent'
                />
                <div className='cursor-pointer text-xl' onClick={() => setShowConfirmPassword((prev) => !prev)}>
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </div>
              </div>
            </div>

            <button className='bg-green-600 hover:bg-green-700 text-white px-6 py-2 w-full max-w-[150px] rounded-full hover:scale-110 transition-all mx-auto block mt-6'>Sign Up</button>
          </form>

          <p className='my-5'>
            Already have an account? <Link to={"/login"} className='text-green-600 hover:text-green-800 hover:underline'>Login</Link>
          </p>
        </div>
      </div>
    </section>
  );
};

export default SignUp;
