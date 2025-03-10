import React, { useState, useEffect } from 'react';
import { Edit } from 'lucide-react';
import axios from 'axios';
import { API_BASE_URL } from '../../../config/api';

const INITIAL_PERMISSIONS = {
  productManagement: false,
  orderManagement: false,
  categoryManagement: false,
  couponsManagement: false,
  inventoryManagement: false,
  marketingManagement: false,
  userManagement: false
};

const INITIAL_USER_STATE = {
  username: '',
  email: '',
  password: '',
  phoneNumber: '',
  address: '',
  permissions: INITIAL_PERMISSIONS
};

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [newUser, setNewUser] = useState(INITIAL_USER_STATE);
  const [editUser, setEditUser] = useState({ ...INITIAL_USER_STATE, password: undefined });

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/admin/getallusers`);
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
      // You might want to show an error toast or message here
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreateUser = async (e) => {
    e.preventDefault(); // Always prevent the default form submission
    
    try {
      const userData = {
        username: newUser.username,
        email: newUser.email,
        password: newUser.password,
        phoneNumber: newUser.phoneNumber,
        address: newUser.address,
        permissions: newUser.permissions
      };

      const response = await axios.post(`${API_BASE_URL}/api/admin/add`, userData);

      if (response.data.message === 'Admin user created successfully') {
        fetchUsers();
        setIsCreateModalOpen(false);
        setNewUser(INITIAL_USER_STATE);
        // Add success notification here if needed
      }
    } catch (error) {
      console.error('Error creating user:', error.response?.data?.message || error.message);
      // Add error notification here if needed
    }
  };

  const handleEdit = (user) => {
    setEditingId(user._id);
    setEditUser({
      username: user.username,
      email: user.email,
      phoneNumber: user.phoneNumber,
      address: user.address,
      permissions: { ...user.permissions },
      isActive: user.isActive
    });
  };

  const handleSaveEdit = async (id, e) => {
    e.preventDefault(); // Always prevent the default form submission
    
    try {
      const response = await axios.put(`${API_BASE_URL}/api/admin/edit/${id}`, {
        username: editUser.username,
        address: editUser.address,
        permissions: editUser.permissions,
        isActive: editUser.isActive
      });

      if (response.data.message === 'Admin user updated successfully') {
        fetchUsers();
        setEditingId(null);
        // Add success notification here if needed
      }
    } catch (error) {
      console.error('Error updating user:', error.response?.data?.message || error.message);
      // Add error notification here if needed
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditUser((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNewUserChange = (e) => {
    const { name, value } = e.target;
    setNewUser(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePermissionChange = (permission) => {
    setEditUser(prev => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [permission]: !prev.permissions[permission]
      }
    }));
  };

  const handleNewUserPermissionChange = (permission) => {
    setNewUser(prev => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [permission]: !prev.permissions[permission]
      }
    }));
  };

  const PermissionCheckbox = ({ name, label, checked, onChange, disabled = false }) => (
    <div className="flex items-center gap-3">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        className="w-4 h-4 rounded border-gray-300"
      />
      <span className="text-base">{label}</span>
    </div>
  );

  const UserInfoField = ({ icon, value }) => (
    <div className="flex items-center gap-4">
      <span className="text-xl text-gray-500">{icon}</span>
      <span className="text-base">{value}</span>
    </div>
  );

  const UserCard = ({ user }) => {
    const isEditing = editingId === user._id;
    const currentUser = isEditing ? editUser : user;

    const renderInput = (field, icon) => (
      <div key={field} className="flex items-center gap-3">
        <span className="text-xl">{icon}</span>
        <input
          type={field === 'email' ? 'email' : 'text'}
          name={field}
          value={currentUser[field] || ''}
          onChange={handleInputChange}
          className="flex-1 border-2 border-blue-200 rounded-lg p-2 text-base focus:outline-none focus:border-purple-400"
        />
      </div>
    );

    return (
      <div className="bg-white rounded-lg border border-blue-200 p-8 w-full">
        <div className="border-b border-dotted border-gray-200 pb-6">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
              <div className={`w-5 h-5 rounded-full ${user.isActive ? 'bg-green-500' : 'bg-red-500'}`} />
              <span className="text-base font-medium">
                {user.isActive ? 'User Active' : 'User Inactive'}
              </span>
            </div>
            <button 
              onClick={() => handleEdit(user)}
              className="p-3 rounded-full bg-purple-100 hover:bg-purple-200"
              type="button"
            >
              <Edit className="w-5 h-5 text-purple-600" />
            </button>
          </div>

          {isEditing ? (
            <form onSubmit={(e) => handleSaveEdit(user._id, e)} className="space-y-4 mt-6">
              <div className="space-y-4">
                {renderInput('username', '👤')}
                {renderInput('phoneNumber', '📞')}
                {renderInput('email', '✉️')}
                {renderInput('address', '📍')}
              </div>
            </form>
          ) : (
            <div className="space-y-4 mt-6">
              <UserInfoField icon="👤" value={user.username} />
              <UserInfoField icon="📞" value={user.phoneNumber} />
              <UserInfoField icon="✉️" value={user.email} />
              {user.address && <UserInfoField icon="📍" value={user.address} />}
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-6 pt-6">
          {Object.entries(INITIAL_PERMISSIONS).map(([key, _]) => (
            <PermissionCheckbox
              key={key}
              name={key}
              label={key.replace('Management', ' Management')}
              checked={currentUser.permissions[key]}
              onChange={() => isEditing && handlePermissionChange(key)}
              disabled={!isEditing}
            />
          ))}
        </div>

        {isEditing && (
          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={() => setEditingId(null)}
              className="px-6 py-2 border-2 border-red-200 text-red-600 rounded-lg hover:bg-red-50 text-base"
            >
              Cancel
            </button>
            <button
              type="submit"
              onClick={(e) => handleSaveEdit(user._id, e)}
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-base"
            >
              Save
            </button>
          </div>
        )}
      </div>
    );
  };

const CreateUserModal = () => {
  const handleSubmitForm = (e) => {
    e.preventDefault();
    handleCreateUser(e);
  };

  return (
    <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center ${isCreateModalOpen ? '' : 'hidden'}`}>
      <div className="bg-white rounded-lg p-8 w-full max-w-4xl mx-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-medium">Create New User</h2>
          <button 
            type="button"
            onClick={() => {
              setIsCreateModalOpen(false);
              setNewUser(INITIAL_USER_STATE);
            }} 
            className="text-gray-500 text-2xl hover:text-gray-700"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmitForm}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <div className="text-base mb-2">Username</div>
                <div className="border-2 border-blue-200 rounded-lg p-3 flex items-center gap-3">
                  <span className="text-xl">👤</span>
                  <input
                    type="text"
                    name="username"
                    value={newUser.username}
                    onChange={handleNewUserChange}
                    className="flex-1 outline-none text-base"
                    placeholder="Username"
                  />
                </div>
              </div>

              <div>
                <div className="text-base mb-2">Email</div>
                <div className="border-2 border-blue-200 rounded-lg p-3 flex items-center gap-3">
                  <span className="text-xl">✉️</span>
                  <input 
                    type="email" 
                    name="email"
                    value={newUser.email}
                    onChange={handleNewUserChange}
                    className="flex-1 outline-none text-base"
                    placeholder="Email"
                    autoComplete="off"
                  />
                </div>
              </div>

              <div>
                <div className="text-base mb-2">Password</div>
                <div className="border-2 border-blue-200 rounded-lg p-3 flex items-center gap-3">
                  <span className="text-xl">🔒</span>
                  <input
                    type="password"
                    name="password"
                    value={newUser.password}
                    onChange={handleNewUserChange}
                    className="flex-1 outline-none text-base"
                    placeholder="Password"
                    autoComplete="new-password"
                  />
                </div>
              </div>

              <div>
                <div className="text-base mb-2">Phone Number</div>
                <div className="border-2 border-blue-200 rounded-lg p-3 flex items-center gap-3">
                  <span className="text-xl">📞</span>
                  <input
                    type="text"
                    name="phoneNumber"
                    value={newUser.phoneNumber}
                    onChange={handleNewUserChange}
                    className="flex-1 outline-none text-base"
                    placeholder="Phone Number"
                    autoComplete="off"
                  />
                </div>
              </div>

              <div>
                <div className="text-base mb-2">Address</div>
                <div className="border-2 border-blue-200 rounded-lg p-3 flex items-center gap-3">
                  <span className="text-xl">📍</span>
                  <input
                    type="text"
                    name="address"
                    value={newUser.address}
                    onChange={handleNewUserChange}
                    className="flex-1 outline-none text-base"
                    placeholder="Address"
                    autoComplete="off"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-3">
              {Object.keys(INITIAL_PERMISSIONS).map(permission => (
                <div key={permission} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id={`perm-${permission}`}
                    checked={newUser.permissions[permission]}
                    onChange={() => handleNewUserPermissionChange(permission)}
                    className="rounded border-gray-300"
                  />
                  <label htmlFor={`perm-${permission}`} className="text-sm">
                    {permission.replace('Management', ' Management')}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <button
              type="button"
              onClick={() => {
                setIsCreateModalOpen(false);
                setNewUser(INITIAL_USER_STATE);
              }}
              className="px-4 py-1.5 border border-red-200 text-red-600 rounded-md hover:bg-red-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-purple-600 text-white rounded-md hover:bg-purple-700"
            >
              Create User
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">User Management</h1>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
          type="button"
        >
          Create User
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {users.map(user => (
          <UserCard key={user._id} user={user} />
        ))}
      </div>

      <CreateUserModal />
    </div>
  );
};

export default UserManagement;