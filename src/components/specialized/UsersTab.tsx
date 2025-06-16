import React, { useState } from 'react';
import { Users, Search, Filter, UserPlus, Mail, Phone, Shield, Crown, Edit, Trash2, MoreVertical, X, Save, Download, Send, Settings } from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'city_officer' | 'logistics_user' | 'business' | 'driver';
  status: 'active' | 'inactive' | 'pending';
  lastLogin: Date;
  joinDate: Date;
  organization?: string;
  phone?: string;
  bookings: number;
  subscription?: string;
}

const UsersTab: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'admin' | 'city_officer' | 'logistics_user' | 'business' | 'driver'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive' | 'pending'>('all');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showAddUser, setShowAddUser] = useState(false);
  const [showInviteUsers, setShowInviteUsers] = useState(false);
  const [showBulkEmail, setShowBulkEmail] = useState(false);
  const [showManageRoles, setShowManageRoles] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const [mockUsers, setMockUsers] = useState<User[]>([
    {
      id: '1',
      name: 'John Smith',
      email: 'john.smith@city.gov',
      role: 'admin',
      status: 'active',
      lastLogin: new Date(Date.now() - 2 * 60 * 60 * 1000),
      joinDate: new Date('2023-01-15'),
      organization: 'City Administration',
      phone: '+1 (555) 123-4567',
      bookings: 0,
      subscription: 'Business'
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      email: 'sarah.j@logistics.com',
      role: 'logistics_user',
      status: 'active',
      lastLogin: new Date(Date.now() - 30 * 60 * 1000),
      joinDate: new Date('2023-03-22'),
      organization: 'Metro Logistics',
      phone: '+1 (555) 234-5678',
      bookings: 45,
      subscription: 'Pro'
    },
    {
      id: '3',
      name: 'Mike Chen',
      email: 'mike.chen@email.com',
      role: 'driver',
      status: 'active',
      lastLogin: new Date(Date.now() - 15 * 60 * 1000),
      joinDate: new Date('2023-06-10'),
      phone: '+1 (555) 345-6789',
      bookings: 128,
      subscription: 'Lite'
    },
    {
      id: '4',
      name: 'Emily Davis',
      email: 'emily.davis@business.com',
      role: 'business',
      status: 'active',
      lastLogin: new Date(Date.now() - 4 * 60 * 60 * 1000),
      joinDate: new Date('2023-02-08'),
      organization: 'Davis Enterprises',
      phone: '+1 (555) 456-7890',
      bookings: 67,
      subscription: 'Small Business'
    },
    {
      id: '5',
      name: 'Robert Wilson',
      email: 'r.wilson@city.gov',
      role: 'city_officer',
      status: 'active',
      lastLogin: new Date(Date.now() - 1 * 60 * 60 * 1000),
      joinDate: new Date('2023-04-12'),
      organization: 'Traffic Management',
      phone: '+1 (555) 567-8901',
      bookings: 12,
      subscription: 'Pro'
    },
    {
      id: '6',
      name: 'Lisa Brown',
      email: 'lisa.brown@email.com',
      role: 'driver',
      status: 'inactive',
      lastLogin: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      joinDate: new Date('2023-05-20'),
      phone: '+1 (555) 678-9012',
      bookings: 23,
      subscription: 'Free'
    },
  ]);

  const filteredUsers = mockUsers.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (user.organization && user.organization.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const userStats = {
    total: mockUsers.length,
    active: mockUsers.filter(u => u.status === 'active').length,
    admins: mockUsers.filter(u => u.role === 'admin').length,
    newThisMonth: mockUsers.filter(u => {
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      return u.joinDate > monthAgo;
    }).length,
  };

  const handleAddUser = (userData: Partial<User>) => {
    const newUser: User = {
      id: Date.now().toString(),
      name: userData.name || '',
      email: userData.email || '',
      role: userData.role || 'driver',
      status: 'active',
      lastLogin: new Date(),
      joinDate: new Date(),
      organization: userData.organization,
      phone: userData.phone,
      bookings: 0,
      subscription: 'Free'
    };
    setMockUsers([...mockUsers, newUser]);
    setShowAddUser(false);
    alert('User added successfully!');
  };

  const handleUpdateUser = (updatedUser: User) => {
    setMockUsers(mockUsers.map(user => 
      user.id === updatedUser.id ? updatedUser : user
    ));
    setEditingUser(null);
    alert('User updated successfully!');
  };

  const handleDeleteUser = (userId: string) => {
    if (confirm('Are you sure you want to delete this user?')) {
      setMockUsers(mockUsers.filter(user => user.id !== userId));
      alert('User deleted successfully!');
    }
  };

  const handleInviteUsers = (emails: string[], role: string) => {
    alert(`Invitations sent to ${emails.length} users with role: ${role}`);
    setShowInviteUsers(false);
  };

  const handleBulkEmail = (subject: string, message: string, recipients: string[]) => {
    alert(`Bulk email sent to ${recipients.length} users`);
    setShowBulkEmail(false);
  };

  const handleExportData = () => {
    const csvContent = [
      ['Name', 'Email', 'Role', 'Status', 'Organization', 'Phone', 'Bookings', 'Join Date'],
      ...filteredUsers.map(user => [
        user.name,
        user.email,
        user.role,
        user.status,
        user.organization || '',
        user.phone || '',
        user.bookings.toString(),
        user.joinDate.toLocaleDateString()
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'users_export.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'text-red-600 bg-red-100';
      case 'city_officer': return 'text-blue-600 bg-blue-100';
      case 'business': return 'text-purple-600 bg-purple-100';
      case 'logistics_user': return 'text-green-600 bg-green-100';
      case 'driver': return 'text-orange-600 bg-orange-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'inactive': return 'text-red-600 bg-red-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return <Shield className="h-4 w-4" />;
      case 'city_officer': return <Shield className="h-4 w-4" />;
      case 'business': return <Crown className="h-4 w-4" />;
      default: return <Users className="h-4 w-4" />;
    }
  };

  const formatRole = (role: string) => {
    switch (role) {
      case 'city_officer': return 'City Officer';
      case 'logistics_user': return 'Logistics User';
      default: return role.charAt(0).toUpperCase() + role.slice(1);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Users className="h-8 w-8 text-blue-600" />
          <div>
            <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
            <p className="text-gray-600">Manage platform users and permissions</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Roles</option>
            <option value="admin">Admin</option>
            <option value="city_officer">City Officer</option>
            <option value="business">Business</option>
            <option value="logistics_user">Logistics User</option>
            <option value="driver">Driver</option>
          </select>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="pending">Pending</option>
          </select>
          
          <button 
            onClick={() => setShowAddUser(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <UserPlus className="h-4 w-4" />
            <span>Add User</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-3xl font-bold text-blue-600 mt-2">{userStats.total}</p>
            </div>
            <Users className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Users</p>
              <p className="text-3xl font-bold text-green-600 mt-2">{userStats.active}</p>
            </div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Administrators</p>
              <p className="text-3xl font-bold text-red-600 mt-2">{userStats.admins}</p>
            </div>
            <Shield className="h-8 w-8 text-red-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">New This Month</p>
              <p className="text-3xl font-bold text-purple-600 mt-2">{userStats.newThisMonth}</p>
            </div>
            <UserPlus className="h-8 w-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Users ({filteredUsers.length})</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Organization</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bookings</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Login</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <span className="text-sm font-medium text-blue-600">
                            {user.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500 flex items-center space-x-1">
                          <Mail className="h-3 w-3" />
                          <span>{user.email}</span>
                        </div>
                        {user.phone && (
                          <div className="text-sm text-gray-500 flex items-center space-x-1">
                            <Phone className="h-3 w-3" />
                            <span>{user.phone}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                      {getRoleIcon(user.role)}
                      <span>{formatRole(user.role)}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                      {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user.organization || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user.bookings}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.lastLogin.toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => setEditingUser(user)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleDeleteUser(user.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                      <button className="text-gray-400 hover:text-gray-600">
                        <MoreVertical className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <button 
            onClick={() => setShowInviteUsers(true)}
            className="flex items-center space-x-3 p-4 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <UserPlus className="h-6 w-6 text-blue-600" />
            <div className="text-left">
              <p className="font-medium text-blue-900">Invite Users</p>
              <p className="text-sm text-blue-700">Send invitations</p>
            </div>
          </button>
          
          <button 
            onClick={() => setShowBulkEmail(true)}
            className="flex items-center space-x-3 p-4 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors"
          >
            <Mail className="h-6 w-6 text-green-600" />
            <div className="text-left">
              <p className="font-medium text-green-900">Bulk Email</p>
              <p className="text-sm text-green-700">Send announcements</p>
            </div>
          </button>
          
          <button 
            onClick={() => setShowManageRoles(true)}
            className="flex items-center space-x-3 p-4 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors"
          >
            <Shield className="h-6 w-6 text-purple-600" />
            <div className="text-left">
              <p className="font-medium text-purple-900">Manage Roles</p>
              <p className="text-sm text-purple-700">Update permissions</p>
            </div>
          </button>
          
          <button 
            onClick={handleExportData}
            className="flex items-center space-x-3 p-4 bg-orange-50 border border-orange-200 rounded-lg hover:bg-orange-100 transition-colors"
          >
            <Download className="h-6 w-6 text-orange-600" />
            <div className="text-left">
              <p className="font-medium text-orange-900">Export Data</p>
              <p className="text-sm text-orange-700">Download user list</p>
            </div>
          </button>
        </div>
      </div>

      {/* Add User Modal */}
      {showAddUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Add New User</h3>
                <button onClick={() => setShowAddUser(false)} className="text-gray-400 hover:text-gray-600">
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target as HTMLFormElement);
                handleAddUser({
                  name: formData.get('name') as string,
                  email: formData.get('email') as string,
                  role: formData.get('role') as any,
                  organization: formData.get('organization') as string,
                  phone: formData.get('phone') as string,
                });
              }} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input name="name" type="text" required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input name="email" type="email" required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                  <select name="role" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value="driver">Driver</option>
                    <option value="business">Business</option>
                    <option value="logistics_user">Logistics User</option>
                    <option value="city_officer">City Officer</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Organization</label>
                  <input name="organization" type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input name="phone" type="tel" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                </div>
                <div className="flex space-x-3 pt-4">
                  <button type="button" onClick={() => setShowAddUser(false)} className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">Cancel</button>
                  <button type="submit" className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">Add User</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {editingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Edit User</h3>
                <button onClick={() => setEditingUser(null)} className="text-gray-400 hover:text-gray-600">
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target as HTMLFormElement);
                handleUpdateUser({
                  ...editingUser,
                  name: formData.get('name') as string,
                  email: formData.get('email') as string,
                  role: formData.get('role') as any,
                  organization: formData.get('organization') as string,
                  phone: formData.get('phone') as string,
                });
              }} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input name="name" type="text" defaultValue={editingUser.name} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input name="email" type="email" defaultValue={editingUser.email} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                  <select name="role" defaultValue={editingUser.role} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value="driver">Driver</option>
                    <option value="business">Business</option>
                    <option value="logistics_user">Logistics User</option>
                    <option value="city_officer">City Officer</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Organization</label>
                  <input name="organization" type="text" defaultValue={editingUser.organization} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input name="phone" type="tel" defaultValue={editingUser.phone} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                </div>
                <div className="flex space-x-3 pt-4">
                  <button type="button" onClick={() => setEditingUser(null)} className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">Cancel</button>
                  <button type="submit" className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">Update User</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Invite Users Modal */}
      {showInviteUsers && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Invite Users</h3>
                <button onClick={() => setShowInviteUsers(false)} className="text-gray-400 hover:text-gray-600">
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target as HTMLFormElement);
                const emails = (formData.get('emails') as string).split('\n').filter(email => email.trim());
                const role = formData.get('role') as string;
                handleInviteUsers(emails, role);
              }} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Addresses (one per line)</label>
                  <textarea name="emails" rows={4} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="user1@example.com&#10;user2@example.com"></textarea>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Default Role</label>
                  <select name="role" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value="driver">Driver</option>
                    <option value="business">Business</option>
                    <option value="logistics_user">Logistics User</option>
                    <option value="city_officer">City Officer</option>
                  </select>
                </div>
                <div className="flex space-x-3 pt-4">
                  <button type="button" onClick={() => setShowInviteUsers(false)} className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">Cancel</button>
                  <button type="submit" className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">Send Invites</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Email Modal */}
      {showBulkEmail && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Send Bulk Email</h3>
                <button onClick={() => setShowBulkEmail(false)} className="text-gray-400 hover:text-gray-600">
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target as HTMLFormElement);
                const subject = formData.get('subject') as string;
                const message = formData.get('message') as string;
                const recipients = formData.get('recipients') as string;
                handleBulkEmail(subject, message, recipients === 'all' ? filteredUsers.map(u => u.email) : []);
              }} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Recipients</label>
                  <select name="recipients" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value="all">All Users ({filteredUsers.length})</option>
                    <option value="active">Active Users Only</option>
                    <option value="admins">Administrators Only</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                  <input name="subject" type="text" required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                  <textarea name="message" rows={4} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"></textarea>
                </div>
                <div className="flex space-x-3 pt-4">
                  <button type="button" onClick={() => setShowBulkEmail(false)} className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">Cancel</button>
                  <button type="submit" className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">Send Email</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Manage Roles Modal */}
      {showManageRoles && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full mx-4">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Manage Roles & Permissions</h3>
                <button onClick={() => setShowManageRoles(false)} className="text-gray-400 hover:text-gray-600">
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <div className="space-y-4">
                {['admin', 'city_officer', 'business', 'logistics_user', 'driver'].map(role => (
                  <div key={role} className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">{formatRole(role)}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(role)}`}>
                        {mockUsers.filter(u => u.role === role).length} users
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      {role === 'admin' && 'Full system access and user management'}
                      {role === 'city_officer' && 'Municipal operations and oversight'}
                      {role === 'business' && 'Business account management'}
                      {role === 'logistics_user' && 'Logistics and delivery operations'}
                      {role === 'driver' && 'Basic parking and booking access'}
                    </p>
                    <div className="flex space-x-2">
                      <button className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm hover:bg-blue-200 transition-colors">
                        Edit Permissions
                      </button>
                      <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-sm hover:bg-gray-200 transition-colors">
                        View Users
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="flex justify-end pt-4 mt-4 border-t border-gray-200">
                <button onClick={() => setShowManageRoles(false)} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersTab;