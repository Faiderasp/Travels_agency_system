import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
import Navbar from "../components/navbar";
import Table from "../components/Table";
import FormModal from "../components/FormModal";
import { api } from "../services/api";

function Travels(){
    const [userData, setUserData] = useState(() => {
        const saved = localStorage.getItem('user');
        return saved ? JSON.parse(saved) : null;
    });

    const [travels, setTravels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentTravel, setCurrentTravel] = useState(null);

    const headers = ["Code", "Name", "Seats", "Date", "Origin", "Destiny"];
    const fields = [
        { name: 'travel_code', label: 'Travel Code', required: true, placeholder: 'TRV-001' },
        { name: 'name', label: 'Travel Name', required: true, placeholder: 'Summer Paradise' },
        { name: 'seat_quantity', label: 'Seats', type: 'number', required: true, placeholder: '50' },
        { name: 'date', label: 'Date', type: 'datetime-local', required: true },
        { name: 'origin', label: 'Origin', required: true, placeholder: 'Madrid' },
        { name: 'destiny', label: 'Destiny', required: true, placeholder: 'Paris' },
    ];

    const navigation = useNavigate();

    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        if (!userData) {
            navigation('/');
            return;
        }
        fetchTravels();
    }, [userData, navigation]);

    const fetchTravels = async () => {
        if (!userData) return;
        try {
            const response = await api.getTravels();
            if (response.success) {
                setTravels(response.data || []);
            } else {
                console.error("Failed to fetch travels:", response.message);
            }
        } catch (error) {
            console.error("Error fetching travels:", error);
        } finally {
            setLoading(false);
        }
    };

    const filteredTravels = travels.filter(travel => 
        travel.travel_code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        travel.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        travel.origin?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        travel.destiny?.toLowerCase().includes(searchTerm.toLowerCase())
    );


    const handleDelete = async (travel) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: `You are about to delete travel ${travel.name}`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#7c3aed',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        });

        if (result.isConfirmed) {
            try {
                const response = await api.deleteTravel(travel.travel_id);
                if (response.success) {
                    Swal.fire('Deleted!', 'Travel has been deleted.', 'success');
                    fetchTravels();
                } else {
                    Swal.fire('Error!', response.message || 'Could not delete.', 'error');
                }
            } catch (error) {
                Swal.fire('Error!', 'Could not connect to server.', 'error');
            }
        }
    };

    const handleEdit = (travel) => {
        setCurrentTravel(travel);
        setIsModalOpen(true);
    };

    const handleAdd = () => {
        setCurrentTravel(null);
        setIsModalOpen(true);
    };

    const handleSave = async (formData) => {
        try {
            let response;
            if (currentTravel) {
                response = await api.updateTravel(currentTravel.travel_id, formData);
            } else {
                response = await api.createTravel(formData);
            }

            if (response.success) {
                Swal.fire('Success!', `Travel ${currentTravel ? 'updated' : 'created'} successfully.`, 'success');
                setIsModalOpen(false);
                fetchTravels();
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
                    <h1 className="text-3xl font-bold text-violet-900 font-mono">Travels Management</h1>
                    {canEdit && (
                        <button 
                            onClick={handleAdd}
                            className="px-6 py-2 bg-violet-600 text-white rounded-xl font-semibold hover:bg-violet-700 transition-all shadow-md active:scale-95"
                        >
                            + New Travel
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
                                placeholder="Search travels..." 
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
                            data={filteredTravels} 
                            onEdit={canEdit ? handleEdit : null}
                            onDelete={canEdit ? handleDelete : null}
                        />
                    )}

                </main>
            </div>


            <FormModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={currentTravel ? "Edit Travel" : "Add Travel"}
                fields={fields}
                initialData={currentTravel}
                onSave={handleSave}
            />
        </div>
    );
}

export default Travels;

