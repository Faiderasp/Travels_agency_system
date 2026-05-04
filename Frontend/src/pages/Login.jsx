import React, {useState} from "react";
import Swal from 'sweetalert2';
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";



function Login(){
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigation = useNavigate();
    async function check_data() {
        if(email !== '' && password !== ''){
            try {
                const response = await api.login(email, password);
                if (response.success) {
                    localStorage.setItem('token', response.data.token);
                    localStorage.setItem('user', JSON.stringify({
                        user_id: response.data.id,
                        username: response.data.username,
                        image: response.data.image || 'perfil.png',
                        name: response.data.username, // Fallback for components using .name
                        img: response.data.image || 'perfil.png', // Fallback for components using .img
                        role: response.data.role // Use the actual role from backend
                    }));

                    
                    Swal.fire({
                        title: "Logged in!",
                        text: `Welcome ${response.data.username}`,

                        icon: "success",
                        timer: 1500,
                        showConfirmButton: false
                    });
                    navigation('/admin-panel');
                } else {
                    Swal.fire({
                        icon: "error",
                        title: "Login Failed",
                        text: response.message || "Invalid credentials"
                    });
                }
            } catch (error) {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "Could not connect to server"
                });
                console.error("Somethings went wrong!", error)
            }
        } else {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "It looks like something is missing!"
            });
        }
    };


    return(
        <div className="flex h-screen items-center justify-center">
            <div className="flex flex-col justify-center items-center
                            rounded-lg w-90 h-90 border border-black
                            transition-all ease-in-out duration-300
                            shadow-[5px_5px_10px_0px_rgba(0,0,0,0.3)]
                            bg-gray-50 hover:scale-110">
                <h1 className="text-center text-3xl font-bold text-gray-900">LOGIN</h1>
                <h2 className="text-center text-md font-semibold text-gray-600 mb-8">Manage your travel information</h2>
                <div className="mb-14">
                    <input type="text" className="block bg-white text-black border-b border-gray-400
                                            px-8 py-1 mb-3 outline-none focus:border-violet-800 focus:border-b-3 placeholder:text-start" id="email" 
                    placeholder="Input your email or username" value={email} onChange={(e) => {setEmail(e.target.value)}}/>
                    <input type="password" className="block bg-white text-black border-b border-gray-400 
                                            px-8 py-1 focus:border-violet-800 focus:border-b-3 outline-none placeholder:text-start" id="password" 
                    placeholder="Password" value={password} onChange={(e) => {setPassword(e.target.value)}}/>
                </div>
                <button onClick={check_data} className="bg-violet-600 text-white px-20 py-1 rounded-xl font-bold
                                    hover:bg-violet-800 hover:scale-115 border border-black
                                    transition-all ease-in-out duration-300 cursor-pointer">
                    Login
                </button>
            </div>
        </div>
    )
}

export default Login;