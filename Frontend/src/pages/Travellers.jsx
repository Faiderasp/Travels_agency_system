import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
import Navbar from "../components/navbar";
import Table from "../components/Table";
import FormModal from "../components/FormModal";
import { api } from "../services/api";

function Travellers(){
    const [userData, setUserData] = useState(() => {
        const saved = localStorage.getItem('user');
        return saved ? JSON.parse(saved) : null;
    });

    const [travellers, setTravellers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentTraveller, setCurrentTraveller] = useState(null);

    const headers = ["DNI", "Name", "Address", "Phone"];
    const fields = [
        { name: 'dni', label: 'DNI', required: true, placeholder: '12345678A' },
        { name: 'name', label: 'Full Name', required: true, placeholder: 'John Doe' },
        { name: 'address', label: 'Address', required: true, placeholder: '123 Main St' },
        { name: 'phone', label: 'Phone Number', required: true, placeholder: '+1 234 567 890' },
    ];

    const navigation = useNavigate();

    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        if (!userData) {
            navigation('/');
            return;
        }
        fetchTravellers();
    }, [userData, navigation]);

    const fetchTravellers = async () => {
        if (!userData) return;
        try {
            const response = await api.getTravellers();
            if (response.success) {
                setTravellers(response.data || []);
            } else {
                console.error("Failed to fetch travellers:", response.message);
            }
        } catch (error) {
            console.error("Error fetching travellers:", error);
        } finally {
            setLoading(false);
        }
    };

    const filteredTravellers = travellers.filter(traveller => 
        traveller.dni?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        traveller.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        traveller.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        traveller.phone?.toLowerCase().includes(searchTerm.toLowerCase())
    );


    const handleDelete = async (traveller) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: `You are about to delete traveller ${traveller.name}`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#7c3aed',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        });

        if (result.isConfirmed) {
            try {
                const response = await api.deleteTraveller(traveller.traveller_id);
                if (response.success) {
                    Swal.fire('Deleted!', 'Traveller has been deleted.', 'success');
                    fetchTravellers();
                } else {
                    Swal.fire('Error!', response.message || 'Could not delete.', 'error');
                }
            } catch (error) {
                Swal.fire('Error!', 'Could not connect to server.', 'error');
            }
        }
    };

    const handleEdit = (traveller) => {
        setCurrentTraveller(traveller);
        setIsModalOpen(true);
    };

    const handleAdd = () => {
        setCurrentTraveller(null);
        setIsModalOpen(true);
    };

    const handleSave = async (formData) => {
        try {
            let response;
            if (currentTraveller) {
                response = await api.updateTraveller(currentTraveller.traveller_id, formData);
            } else {
                response = await api.createTraveller(formData);
            }

            if (response.success) {
                Swal.fire('Success!', `Traveller ${currentTraveller ? 'updated' : 'created'} successfully.`, 'success');
                setIsModalOpen(false);
                fetchTravellers();
            } else {
                Swal.fire('Error!', response.message || 'Could not save.', 'error');
            }
        } catch (error) {
            Swal.fire('Error!', 'Could not connect to server.', 'error');
        }
    };

    function logout_handler(){
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigation('/');
    }

    if (!userData) return null;

    const canEdit = userData.role === 'admin' || userData.role === 'Administrator' || userData.role === 'user';

    return (
        <div className="flex h-screen flex-row bg-gray-50 overflow-hidden">
            <Navbar userData={userData} logout_handler={logout_handler}></Navbar>
            <div className="flex grow flex-col overflow-y-auto">
                <header className="flex items-center justify-between px-8 py-6 bg-white shadow-sm border-b">
                    <h1 className="text-3xl font-bold text-violet-900 font-mono">Travellers Management</h1>
                    {canEdit && (
                        <button 
                            onClick={handleAdd}
                            className="px-6 py-2 bg-violet-600 text-white rounded-xl font-semibold hover:bg-violet-700 transition-all shadow-md active:scale-95"
                        >
                            + Add Traveller
                        </button>
                    )}
                </header>
                
                <main className="p-8">
                    <div className="mb-6 flex items-center justify-between">
                        <div className="relative w-72">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                                <i className="fa-solid fa-magnifying-glass"></i>
                            </span>
                            <input 
                                type="text" 
                                placeholder="Search travellers..." 
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
                            data={filteredTravellers} 
                            onEdit={canEdit ? handleEdit : null}
                            onDelete={canEdit ? handleDelete : null}
                        />
                    )}

                </main>
            </div>


            <FormModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={currentTraveller ? "Edit Traveller" : "Add Traveller"}
                fields={fields}
                initialData={currentTraveller}
                onSave={handleSave}
            />
        </div>
    );
}

export default Travellers;

