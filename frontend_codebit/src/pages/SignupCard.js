import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function SignupCard() {
const [formData, setFormData] = useState({
userName: "",
firstName: "",
lastName: "",
email: "",
password: "",
college: "",
});
const [error, setError] = useState(null);
const [loading, setLoading] = useState(false);

// const navigate = useNavigate();

const handleChange = (e) => {
const { name, value } = e.target;

console.log("Field updated:", name, value);
setFormData({
...formData,
[name]: value,
});
};

const handleSubmit = async (e) => {

e.preventDefault();
console.log("Form Data to be submitted:", formData);
try {
setLoading(true);
const res = await fetch(`${process.env.REACT_APP_BASE_URL}/signup`, {
method: 'POST',
headers: {
'Content-Type': 'application/json',
},
body: JSON.stringify(formData),
});
const data = await res.json();
if (data.success === false) {
setError(data.message);
setLoading(false);
return;
}
setLoading(false);
setError(null);
console.log("Response from backend:", data);

} catch (error) {
setLoading(false);
setError(error.message);
}
};

return (
<div className="max-w-sm mx-auto mt-10 bg-gradient-to-b from-white to-gray-100 rounded-3xl p-8 border border-white shadow-lg">
<h1 className="text-center font-extrabold text-3xl text-blue-600 mb-6">Sign Up</h1>
<form onSubmit={handleSubmit}>
<input required type="text" id="userName" name="userName" value={formData.userName} placeholder="Username" onChange={handleChange} className="w-full bg-white py-3 px-4 rounded-xl shadow-md mb-4 focus:outline-none focus:border-blue-500" />
<input required type="text" id="firstName" name="firstName" value={formData.firstName} placeholder="First Name" onChange={handleChange} className="w-full bg-white py-3 px-4 rounded-xl shadow-md mb-4 focus:outline-none focus:border-blue-500" />
<input required type="text" id="lastName" name="lastName" value={formData.lastName} placeholder="Last Name" onChange={handleChange} className="w-full bg-white py-3 px-4 rounded-xl shadow-md mb-4 focus:outline-none focus:border-blue-500" />
<input required type="email" id="email" name="email" value={formData.email} placeholder="E-mail" onChange={handleChange} className="w-full bg-white py-3 px-4 rounded-xl shadow-md mb-4 focus:outline-none focus:border-blue-500" />
<input required type="password" id="password" name="password" value={formData.password} placeholder="Password" onChange={handleChange} className="w-full bg-white py-3 px-4 rounded-xl shadow-md mb-4 focus:outline-none focus:border-blue-500" />
<input required type="text" id="college" name="college" value={formData.college} placeholder="College" onChange={handleChange} className="w-full bg-white py-3 px-4 rounded-xl shadow-md mb-4 focus:outline-none focus:border-blue-500" />
<button type="submit" className="w-full font-bold bg-gradient-to-r from-blue-600 to-blue-400 text-white py-3 rounded-xl shadow-lg transition-transform hover:scale-105" disabled={loading} >
{loading ? "Registering..." : "Sign Up"}
</button>
{error && <p className="text-red-500 mt-2">{error}</p>}
</form>
</div>
);
}