import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
import Navbar from "../components/navbar";
import Table from "../components/Table";
import FormModal from "../components/FormModal";
import { api } from "../services/api";

function Users() {
    const [userData, setUserData] = useState(() => {
        const saved = localStorage.getItem('user');
        return saved ? JSON.parse(saved) : null;
    });

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);

    const headers = ["ID", "Username", "Role"];
    const fields = [
        { name: 'username', label: 'Username', required: true, placeholder: 'admin_user' },
        { name: 'password', label: 'Password', type: 'password', required: !currentUser, placeholder: 'Leave blank to keep current' },
        { name: 'role', label: 'Role', type: 'select', options: ['admin', 'user', 'mod'], required: true, placeholder: 'Select a role' },
        { name: 'image', label: 'Image URL', required: false, placeholder: 'profile.png' },
    ];


    const navigation = useNavigate();

    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        if (!userData) {
            navigation('/');
            return;
        }

        // Redirect if not admin
        if (userData.role !== 'admin' && userData.role !== 'Administrator') {
            Swal.fire('Access Denied', 'You do not have permission to access this page.', 'error');
            navigation('/admin-panel');
            return;
        }
        fetchUsers();
    }, [userData, navigation]);

    const fetchUsers = async () => {
        if (!userData) return;
        try {
            const response = await api.getUsers();
            if (response.success) {
                setUsers(response.data || []);
            } else {
                console.error("Failed to fetch users:", response.message);
            }
        } catch (error) {
            console.error("Error fetching users:", error);
        } finally {
            setLoading(false);
        }
    };

    const filteredUsers = users.filter(user => 
        user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.role?.toLowerCase().includes(searchTerm.toLowerCase())
    );


    const handleDelete = async (user) => {
        if (user.user_id === userData.user_id) {
            Swal.fire('Error', 'You cannot delete yourself!', 'error');
            return;
        }

        const result = await Swal.fire({
            title: 'Are you sure?',
            text: `You are about to delete user ${user.username}`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#7c3aed',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        });

        if (result.isConfirmed) {
            try {
                const response = await api.deleteUser(user.user_id);
                if (response.success) {
                    Swal.fire('Deleted!', 'User has been deleted.', 'success');
                    fetchUsers();
                } else {
                    Swal.fire('Error!', response.message || 'Could not delete.', 'error');
                }
            } catch (error) {
                Swal.fire('Error!', 'Could not connect to server.', 'error');
            }
        }
    };

    const handleEdit = (user) => {
        setCurrentUser(user);
        setIsModalOpen(true);
    };

    const handleAdd = () => {
        setCurrentUser(null);
        setIsModalOpen(true);
    };

    const handleSave = async (formData) => {
        try {
            let response;
            if (currentUser) {
                // If password is empty, don't send it to backend or handle it appropriately
                if (!formData.password) delete formData.password;
                response = await api.updateUser(currentUser.user_id, formData);
            } else {
                response = await api.createUser(formData);
            }

            if (response.success) {
                Swal.fire('Success!', `User ${currentUser ? 'updated' : 'created'} successfully.`, 'success');
                setIsModalOpen(false);
                fetchUsers();
            } else {
                Swal.fire('Error!', response.message || 'Could not save.', 'error');
            }
        } catch (error) {
            Swal.fire('Error!', 'Could not connect to server.', 'error');
        }
    };

    function logout_handler() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigation('/');
    }

    if (!userData) return null;

    const isAdmin = userData.role === 'admin' || userData.role === 'Administrator';

    return (
        <div className="flex h-screen flex-row bg-gray-50 overflow-hidden">
            <Navbar userData={userData} logout_handler={logout_handler}></Navbar>
            <div className="flex grow flex-col overflow-y-auto">
                <header className="flex items-center justify-between px-8 py-6 bg-white shadow-sm border-b">
                    <h1 className="text-3xl font-bold text-violet-900 font-mono">User Management</h1>
                    {isAdmin && (
                        <button
                            onClick={handleAdd}
                            className="px-6 py-2 bg-violet-600 text-white rounded-xl font-semibold hover:bg-violet-700 transition-all shadow-md active:scale-95"
                        >
                            + Add User
                        </button>
                    )}
                </header>

                <main className="p-8">
                    <div className="mb-6">
                        <div className="relative w-72">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                                <i className="fa-solid fa-magnifying-glass"></i>
                            </span>
                            <input 
                                type="text" 
                                placeholder="Search users..." 
                                className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-200"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex justify-center py-20">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-violet-600"></div>
                        </div>
                    ) : (
                        <Table 
                            headers={headers} 
                            data={filteredUsers.map(u => ({
                                id: u.user_id,
                                username: u.username,
                                role: u.role,
                                user_id: u.user_id // Keep ID for actions
                            }))} 
                            onEdit={isAdmin ? handleEdit : null}
                            onDelete={isAdmin ? handleDelete : null}
                        />
                    )}

                </main>
            </div>


            <FormModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={currentUser ? "Edit User" : "Add User"}
                fields={fields}
                initialData={currentUser}
                onSave={handleSave}
            />
        </div>
    );
}

export default Users;
