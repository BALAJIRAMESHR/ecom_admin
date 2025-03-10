import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../../../config/api';
const UserManagement = () => {
  // Sample data for demonstration
  const sampleUsers = [
    {
      id: 1,
      name: "Manikandan G",
      email: "manimani@2gmail.com",
      phone: "63687 54210",
      address: "08, Raji st, CBE",
      isActive: true,
      permissions: {
        productManagement: false,
        categoryManagement: true,
        order: false,
        customerManagement: true,
        coupons: true,
        inventory: true,
        analytics: true,
        marketing: true,
        userManagement: false
      }
    },
    {
      id: 2,
      name: "Sharmila T",
      email: "Sharmila0@2gmail.com",
      phone: "63687 54210",
      address: "08, Raji st, CBE",
      isActive: true,
      permissions: {
        productManagement: false,
        categoryManagement: true,
        order: true,
        customerManagement: true,
        coupons: true,
        inventory: true,
        analytics: true,
        marketing: true,
        userManagement: false
      }
    },
    {
      id: 3,
      name: "Boobesh G",
      email: "boobesh@example.com",
      phone: "63687 54210",
      address: "08, Raji st, CBE",
      isActive: false,
      permissions: {
        productManagement: false,
        categoryManagement: false,
        order: false,
        customerManagement: false,
        coupons: false,
        inventory: false,
        analytics: true,
        marketing: false,
        userManagement: false
      }
    }
  ];

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
  const [currentUser, setCurrentUser] = useState({
    id: null,
    name: '',
    email: '',
    password: '',
    phone: '',
    address: '',
    isActive: true,
    permissions: {
      productManagement: false,
      categoryManagement: false,
      order: false,
      customerManagement: false,
      coupons: false,
      inventory: false,
      analytics: false,
      marketing: false,
      userManagement: false
    }
  });

  // Fetch users on component mount
  useEffect(() => {
    // For demonstration, we'll use the sample data
    setUsers(sampleUsers);
    setLoading(false);
  }, []);

  const fetchUsers = async () => {
    try {
      // In a real app, this would be an API call
      setUsers(sampleUsers);
      setError(null);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to load users. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentUser({
      ...currentUser,
      [name]: value
    });
  };

  const handlePermissionChange = (permission) => {
    setCurrentUser({
      ...currentUser,
      permissions: {
        ...currentUser.permissions,
        [permission]: !currentUser.permissions[permission]
      }
    });
  };

  const openAddModal = () => {
    setCurrentUser({
      id: null,
      name: '',
      email: '',
      password: '',
      phone: '',
      address: '',
      isActive: true,
      permissions: {
        productManagement: false,
        categoryManagement: false,
        order: false,
        customerManagement: false,
        coupons: false,
        inventory: false,
        analytics: false,
        marketing: false,
        userManagement: false
      }
    });
    setModalMode('add');
    setShowModal(true);
  };

  const openEditModal = (user) => {
    setCurrentUser({
      ...user,
      password: '' // Don't include current password for security
    });
    setModalMode('edit');
    setShowModal(true);
  };

  const handleSubmit = async () => {
    try {
      if (modalMode === 'add') {
        // In a real app, this would be an API call
        // await axios.post(`${API_BASE_URL}/admin/users`, currentUser);
        
        const newUser = {
          ...currentUser,
          id: users.length + 1 // Simple ID generation for demo
        };
        setUsers([...users, newUser]);
      } else if (modalMode === 'edit') {
        // In a real app, this would be an API call
        // await axios.put(`${API_BASE_URL}/admin/users/${currentUser.id}`, currentUser);
        
        // For demo, we'll update the local state
        const updatedUsers = users.map(user => 
          user.id === currentUser.id ? currentUser : user
        );
        setUsers(updatedUsers);
      }
      console.log('User saved:', currentUser);
      
      setShowModal(false);
    } catch (err) {
      console.error('Error saving user:', err);
      alert('Failed to save user. Please try again.');
    }
  };

  const toggleUserStatus = async (userId, currentStatus) => {
    try {
      // In a real app, this would be an API call
      // await axios.patch(`${API_BASE_URL}/admin/users/${userId}/status`, {
      //   isActive: !currentStatus
      // });
      
      // For demo, we'll update the local state
      const updatedUsers = users.map(user => 
        user.id === userId ? {...user, isActive: !currentStatus} : user
      );
      setUsers(updatedUsers);
    } catch (err) {
      console.error('Error toggling user status:', err);
      alert('Failed to update user status.');
    }
  };

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">User Management <span className="text-sm ml-2 text-gray-500">{users.length} user's</span></h1>
        <button 
          onClick={openAddModal}
          className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition duration-200"
        >
          Add New User
        </button>
      </div>

      {loading ? (
        <div className="text-center py-10">
          <div className="animate-spin h-10 w-10 mx-auto text-purple-500">Loading...</div>
        </div>
      ) : error ? (
        <div className="text-center py-10 text-red-500">
          <p>{error}</p>
          <button 
            onClick={fetchUsers}
            className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
          >
            Try Again
          </button>
        </div>
      ) : (
        <div className="">
          {users.map((user) => (
            <div key={user.id} className="border-b  p-8  last:border-b-0 relative">
              <div className="p-4 bg-white  border border-blue-500">
                <button 
                  className="absolute top-4 right-4 p-2 bg-purple-100 rounded-full"
                  onClick={() => openEditModal(user)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-600" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                </button>
                
                <div className="flex items-center mb-4 ">
                  <div 
                    className={`w-3 h-3 rounded-full mr-2 ${user.isActive ? 'bg-green-500' : 'bg-red-500'}`}
                  ></div>
                  <span className="text-sm">{user.isActive ? 'User Active' : 'User Inactive'}</span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                  <div className="md:col-span-4 space-y-4">
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                      <span>{user.name}</span>
                    </div>
                    
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                      </svg>
                      <span>{user.phone || 'N/A'}</span>
                    </div>
                    
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                      </svg>
                      <span>{user.email || 'N/A'}</span>
                    </div>
                    
                    {user.address && (
                      <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                        </svg>
                        <span>{user.address}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="md:col-span-8 grid grid-cols-2 gap-y-2">
                    <div className="flex items-center">
                      <input 
                        type="checkbox" 
                        className="h-4 w-4 text-purple-600 rounded border-gray-300 focus:ring-purple-500"
                        checked={user.permissions.productManagement} 
                        readOnly
                      />
                      <span className="ml-2">Product Management</span>
                    </div>
                    
                    <div className="flex items-center">
                      <input 
                        type="checkbox" 
                        className="h-4 w-4 text-purple-600 rounded border-gray-300 focus:ring-purple-500"
                        checked={user.permissions.coupons} 
                        readOnly
                      />
                      <span className="ml-2">Coupons</span>
                    </div>
                    
                    <div className="flex items-center">
                      <input 
                        type="checkbox" 
                        className="h-4 w-4 text-purple-600 rounded border-gray-300 focus:ring-purple-500"
                        checked={user.permissions.categoryManagement} 
                        readOnly
                      />
                      <span className="ml-2">Category Management</span>
                    </div>
                    
                    <div className="flex items-center">
                      <input 
                        type="checkbox" 
                        className="h-4 w-4 text-purple-600 rounded border-gray-300 focus:ring-purple-500"
                        checked={user.permissions.inventory} 
                        readOnly
                      />
                      <span className="ml-2">Inventory</span>
                    </div>
                    
                    <div className="flex items-center">
                      <input 
                        type="checkbox" 
                        className="h-4 w-4 text-purple-600 rounded border-gray-300 focus:ring-purple-500"
                        checked={user.permissions.order} 
                        readOnly
                      />
                      <span className="ml-2">Order</span>
                    </div>
                    
                    <div className="flex items-center">
                      <input 
                        type="checkbox" 
                        className="h-4 w-4 text-purple-600 rounded border-gray-300 focus:ring-purple-500"
                        checked={user.permissions.analytics} 
                        readOnly
                      />
                      <span className="ml-2">Design Lab</span>
                    </div>
                    
                    <div className="flex items-center">
                      <input 
                        type="checkbox" 
                        className="h-4 w-4 text-purple-600 rounded border-gray-300 focus:ring-purple-500"
                        checked={user.permissions.customerManagement} 
                        readOnly
                      />
                      <span className="ml-2">Customer Management</span>
                    </div>
                    
                    <div className="flex items-center">
                      <input 
                        type="checkbox" 
                        className="h-4 w-4 text-purple-600 rounded border-gray-300 focus:ring-purple-500"
                        checked={user.permissions.marketing} 
                        readOnly
                      />
                      <span className="ml-2">Marketing</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit User Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-screen overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">
                  {modalMode === 'add' ? 'Create New User' : 'Edit User'}
                </h2>
                <button 
                  onClick={() => setShowModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Username</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <input
                        type="text"
                        name="name"
                        value={currentUser.name}
                        onChange={handleInputChange}
                        className="border border-gray-300 rounded-md pl-10 py-2 w-full focus:ring-purple-500 focus:border-purple-500"
                        placeholder="Username"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Email</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                          <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                        </svg>
                      </div>
                      <input
                        type="email"
                        name="email"
                        value={currentUser.email}
                        onChange={handleInputChange}
                        className="border border-gray-300 rounded-md pl-10 py-2 w-full focus:ring-purple-500 focus:border-purple-500"
                        placeholder="Email"
                      />
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">
                      {modalMode === 'add' ? 'Password' : 'New Password (leave blank to keep current)'}
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <input
                        type="password"
                        name="password"
                        value={currentUser.password}
                        onChange={handleInputChange}
                        className="border border-gray-300 rounded-md pl-10 py-2 w-full focus:ring-purple-500 focus:border-purple-500"
                        placeholder={modalMode === 'add' ? 'Password' : 'New Password'}
                        required={modalMode === 'add'}
                      />
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Phone Number</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                        </svg>
                      </div>
                      <input
                        type="text"
                        name="phone"
                        value={currentUser.phone}
                        onChange={handleInputChange}
                        className="border border-gray-300 rounded-md pl-10 py-2 w-full focus:ring-purple-500 focus:border-purple-500"
                        placeholder="Phone Number"
                      />
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Address</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <input
                        type="text"
                        name="address"
                        value={currentUser.address}
                        onChange={handleInputChange}
                        className="border border-gray-300 rounded-md pl-10 py-2 w-full focus:ring-purple-500 focus:border-purple-500"
                        placeholder="Address"
                      />
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={currentUser.isActive}
                        onChange={() => setCurrentUser({...currentUser, isActive: !currentUser.isActive})}
                        className="h-4 w-4 text-purple-600 rounded border-gray-300 focus:ring-purple-500"
                      />
                      <span className="ml-2">User Active</span>
                    </label>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium mb-3">Permissions</h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="productManagement"
                        checked={currentUser.permissions.productManagement}
                        onChange={() => handlePermissionChange('productManagement')}
                        className="h-4 w-4 text-purple-600 rounded border-gray-300 focus:ring-purple-500"
                      />
                      <label htmlFor="productManagement" className="ml-2">Product Management</label>
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="orderManagement"
                        checked={currentUser.permissions.order}
                        onChange={() => handlePermissionChange('order')}
                        className="h-4 w-4 text-purple-600 rounded border-gray-300 focus:ring-purple-500"
                      />
                      <label htmlFor="orderManagement" className="ml-2">Order Management</label>
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="categoryManagement"
                        checked={currentUser.permissions.categoryManagement}
                        onChange={() => handlePermissionChange('categoryManagement')}
                        className="h-4 w-4 text-purple-600 rounded border-gray-300 focus:ring-purple-500"
                      />
                      <label htmlFor="categoryManagement" className="ml-2">Category Management</label>
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="customerManagement"
                        checked={currentUser.permissions.customerManagement}
                        onChange={() => handlePermissionChange('customerManagement')}
                        className="h-4 w-4 text-purple-600 rounded border-gray-300 focus:ring-purple-500"
                      />
                      <label htmlFor="customerManagement" className="ml-2">Customer Management</label>
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="couponsManagement"
                        checked={currentUser.permissions.coupons}
                        onChange={() => handlePermissionChange('coupons')}
                        className="h-4 w-4 text-purple-600 rounded border-gray-300 focus:ring-purple-500"
                      />
                      <label htmlFor="couponsManagement" className="ml-2">Coupons Management</label>
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="inventoryManagement"
                        checked={currentUser.permissions.inventory}
                        onChange={() => handlePermissionChange('inventory')}
                        className="h-4 w-4 text-purple-600 rounded border-gray-300 focus:ring-purple-500"
                      />
                      <label htmlFor="inventoryManagement" className="ml-2">Inventory Management</label>
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="analyticsManagement"
                        checked={currentUser.permissions.analytics}
                        onChange={() => handlePermissionChange('analytics')}
                        className="h-4 w-4 text-purple-600 rounded border-gray-300 focus:ring-purple-500"
                      />
                      <label htmlFor="analyticsManagement" className="ml-2">Design Lab</label>
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="marketingManagement"
                        checked={currentUser.permissions.marketing}
                        onChange={() => handlePermissionChange('marketing')}
                        className="h-4 w-4 text-purple-600 rounded border-gray-300 focus:ring-purple-500"
                      />
                      <label htmlFor="marketingManagement" className="ml-2">Marketing Management</label>
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="userManagement"
                        checked={currentUser.permissions.userManagement}
                        onChange={() => handlePermissionChange('userManagement')}
                        className="h-4 w-4 text-purple-600 rounded border-gray-300 focus:ring-purple-500"
                      />
                      <label htmlFor="userManagement" className="ml-2">User Management</label>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                
                <button
                  onClick={handleSubmit}
                  className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                >
                  {modalMode === 'add' ? 'Create User' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;