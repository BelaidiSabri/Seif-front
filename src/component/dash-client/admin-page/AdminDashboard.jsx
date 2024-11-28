import React, { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import axios from "axios";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    users: { total: 0, fournisseurCount: 0, clientCount: 0 },
    products: { total: 0, venteCount: 0, donCount: 0, echangeCount: 0 },
    donations: { total: 0, pendingCount: 0, acceptedCount: 0, rejectedCount: 0 },
    exchanges: { total: 0, pendingCount: 0, acceptedCount: 0, rejectedCount: 0 },
    transactions: {
      totalEarnings: 0,
      totalOnline: 0,
      totalCash: 0,
      totalPending: 0,
      totalProcessing: 0,
    },
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const statsResponse = await axios.get("http://localhost:5000/admin/stats");
      const {
        totalUsers,
        totalProducts,
        totalDonations,
        totalExchanges,
        transactionStats,
      } = statsResponse.data;

      setStats({
        users: {
          total: totalUsers.total,
          fournisseurCount: totalUsers.fournisseurCount,
          clientCount: totalUsers.clientCount,
        },
        products: {
          total: totalProducts.total,
          venteCount: totalProducts.venteCount,
          donCount: totalProducts.donCount,
          echangeCount: totalProducts.echangeCount,
        },
        donations: {
          total: totalDonations.total,
          pendingCount: totalDonations.pendingCount,
          acceptedCount: totalDonations.acceptedCount,
          rejectedCount: totalDonations.rejectedCount,
        },
        exchanges: {
          total: totalExchanges.totalExchanges,
          pendingCount: totalExchanges.pendingCount,
          acceptedCount: totalExchanges.acceptedCount,
          rejectedCount: totalExchanges.rejectedCount,
        },
        transactions: {
          totalEarnings: transactionStats.totalEarnings,
          totalOnline: transactionStats.totalOnline,
          totalCash: transactionStats.totalCash,
          totalPending: transactionStats.totalPending,
          totalProcessing: transactionStats.totalProcessing,
        },
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  };

  const userChartData = [
    { name: "Fournisseurs", count: stats.users.fournisseurCount },
    { name: "Clients", count: stats.users.clientCount },
  ];

  const productChartData = [
    { name: "Vente", count: stats.products.venteCount },
    { name: "Don", count: stats.products.donCount },
    { name: "Échange", count: stats.products.echangeCount },
  ];

  const transactionChartData = [
    { name: "En ligne", montant: stats.transactions.totalOnline },
    { name: "Espèces", montant: stats.transactions.totalCash },
  ];

  return (
    <div className="admin-dashboard">
      <header className="dashboard-header">
        <p>Tableau de Bord Admin</p>
      </header>

      <section className="dashboard-section">
        <h2>Utilisateurs</h2>
        <div className="dashboard-grid">
          <DashboardCard title="Total Utilisateurs" value={stats.users.total} />
          <DashboardCard title="Fournisseurs" value={stats.users.fournisseurCount} />
          <DashboardCard title="Clients" value={stats.users.clientCount} />
        </div>
        <ResponsiveBarChart data={userChartData} dataKey="count" barColor="#4caf50" />
      </section>

      <section className="dashboard-section">
        <h2>Produits</h2>
        <div className="dashboard-grid">
          <DashboardCard title="Total Produits" value={stats.products.total} />
          <DashboardCard title="Ventes" value={stats.products.venteCount} />
          <DashboardCard title="Dons" value={stats.products.donCount} />
          <DashboardCard title="Échanges" value={stats.products.echangeCount} />
        </div>
        <ResponsiveBarChart data={productChartData} dataKey="count" barColor="#2196f3" />
      </section>

      <section className="dashboard-section">
        <h2>Transactions</h2>
        <div className="dashboard-grid">
          <DashboardCard title="Revenus Totaux" value={`${stats.transactions.totalEarnings.toLocaleString()} TND`} />
          <DashboardCard title="En Ligne" value={`${stats.transactions.totalOnline.toLocaleString()} TND`} />
          <DashboardCard title="Espèces" value={`${stats.transactions.totalCash.toLocaleString()} TND`} />
          <DashboardCard title="En Attente" value={`${stats.transactions.totalPending.toLocaleString()} TND`} />
        </div>
        <ResponsiveBarChart data={transactionChartData} dataKey="montant" barColor="#ff5722" />
      </section>
    </div>
  );
};

const DashboardCard = ({ title, value }) => (
  <div className="dashboard-card">
    <h3>{title}</h3>
    <p>{value}</p>
  </div>
);

const ResponsiveBarChart = ({ data, dataKey, barColor }) => (
  <div className="chart-container">
    <BarChart width={400} height={250} data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Bar dataKey={dataKey} fill={barColor} />
    </BarChart>
  </div>
);

export default AdminDashboard;
