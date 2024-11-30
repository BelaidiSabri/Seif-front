import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./UserManagment.css"

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    pageSize: 10,
  });

  useEffect(() => {
    fetchUsers(pagination.currentPage);
  }, []);

  const fetchUsers = async (page) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('http://localhost:5000/user/all', {
        params: {
          page,
          limit: pagination.pageSize,
          role: roleFilter,
          search: searchTerm,
        },
      });
      setUsers(response.data.allUsers);
      setFilteredUsers(response.data.allUsers);
      setPagination((prev) => ({
        ...prev,
        currentPage: response.data.currentPage,
        totalPages: response.data.totalPages,
      }));
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Échec de la récupération des utilisateurs. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) return;

    try {
      await axios.delete(`http://localhost:5000/user/deleteusers/${userId}`);
      const updatedUsers = users.filter((user) => user._id !== userId);
      setUsers(updatedUsers);
      setFilteredUsers(updatedUsers);
    } catch (error) {
      console.error('Error deleting user:', error);
      setError('Échec de la suppression de l’utilisateur. Veuillez réessayer.');
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= pagination.totalPages) {
      fetchUsers(newPage);
    }
  };

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    filterUsers(term, roleFilter);
  };

  const handleRoleFilter = (e) => {
    const role = e.target.value;
    setRoleFilter(role);
    filterUsers(searchTerm, role);
  };

  const filterUsers = (term, role) => {
    let result = users;

    if (term) {
      result = result.filter(
        (user) =>
          (user.name || '').toLowerCase().includes(term) ||
          (user.email || '').toLowerCase().includes(term)
      );
    }

    if (role) {
      result = result.filter((user) => user.role === role);
    }

    setFilteredUsers(result);
  };

  return (
    <div className="admin-users-management">
      <h2>Gestion des utilisateurs</h2>

      <div className="admin-users-filters">
        <input
          type="text"
          placeholder="Rechercher des utilisateurs..."
          value={searchTerm}
          onChange={handleSearch}
          className="admin-users-search-input"
        />
        <select
          value={roleFilter}
          onChange={handleRoleFilter}
          className="admin-users-role-filter"
        >
          <option value="">Tous les rôles</option>
          <option value="client">Client</option>
          <option value="fournisseur">Fournisseur</option>
          {/* <option value="admin">Admin</option> */}
        </select>
      </div>

      {error && (
        <div className="error-message" style={{ color: 'red', margin: '10px 0' }}>
          {error}
        </div>
      )}

      {loading ? (
        <div>Chargement...</div>
      ) : (
        <>
          <table className="admin-users-table">
            <thead>
              <tr>
                <th>Nom d'utilisateur</th>
                <th>Email</th>
                <th>Rôle</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="4">Aucun utilisateur trouvé</td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user._id}>
                    <td>{user.name || 'N/A'}</td>
                    <td>{user.email || 'N/A'}</td>
                    <td>{user.role || 'N/A'}</td>
                    <td>
                      <button
                        onClick={() => handleDeleteUser(user._id)}
                        className="admin-users-delete-btn"
                      >
                        Supprimer
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* Pagination Controls */}
          <div className="pagination-controls">
            <button
              onClick={() => handlePageChange(pagination.currentPage - 1)}
              disabled={pagination.currentPage === 1}
            >
              Précédent
            </button>
            <span>
              Page {pagination.currentPage} sur {pagination.totalPages}
            </span>
            <button
              onClick={() => handlePageChange(pagination.currentPage + 1)}
              disabled={pagination.currentPage === pagination.totalPages}
            >
              Suivant
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default UserManagement;
