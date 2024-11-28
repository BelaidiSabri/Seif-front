import React, { useState } from 'react';
import './AdminPanel.css';
import UserManagement from './UserManagment';
import AdminDashboard from './AdminDashboard';

const AdminPanel = () => {
  const [currentView, setCurrentView] = useState('dashboard');

  const menuItems = [
    { id: 'dashboard', label: 'Tableau de Bord', icon: '📊' },
    { id: 'users', label: 'Gestion des Utilisateurs', icon: '👥' },
    /* { id: 'products', label: 'Gestion des Produits', icon: '🛍️' },
    { id: 'transactions', label: 'Transactions', icon: '💰' } */
  ];

  const renderContent = () => {
    switch(currentView) {
      case 'dashboard':
        return <AdminDashboard />;
      case 'users':
        return <UserManagement />;
      case 'products':
        return <div>Gestion des Produits</div>;
      case 'transactions':
        return <div>Transactions</div>;
      default:
        return <div>Contenu du Tableau de Bord</div>;
    }
  };

  return (
    <div className="admin-container">
      <div className="admin-sidebar">
        <div className="admin-sidebar-logo">Panneau Admin</div>
        <div className="admin-sidebar-menu">
          {menuItems.map(item => (
            <div 
              key={item.id}
              className={`admin-sidebar-menu-item ${currentView === item.id ? 'active' : ''}`}
              onClick={() => setCurrentView(item.id)}
            >
              <span>{item.icon}</span>
              {item.label}
            </div>
          ))}
        </div>
      </div>
      <div className="admin-main-content">
        {renderContent()}
      </div>
    </div>
  );
};

export default AdminPanel;
