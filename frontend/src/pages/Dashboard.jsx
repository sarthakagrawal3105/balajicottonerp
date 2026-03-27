import React from 'react';
import { useERP } from '../context/ERPContext';
import { TrendingUp, Truck, Package, IndianRupee, Layers, Bell, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Mock chart data for production trends
const chartData = [
  { day: 'Mon', bales: 40 },
  { day: 'Tue', bales: 55 },
  { day: 'Wed', bales: 45 },
  { day: 'Thu', bales: 80 },
  { day: 'Fri', bales: 65 },
  { day: 'Sat', bales: 90 },
  { day: 'Sun', bales: 110 },
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
};

const Dashboard = () => {
  const { rawCotton, bales, payables, receivables, activities } = useERP();

  const getIcon = (type) => {
    switch(type) {
      case 'purchase': return <Truck strokeWidth={2.5} size={22} />;
      case 'production': return <Layers strokeWidth={2.5} size={22} />;
      case 'sale': return <Package strokeWidth={2.5} size={22} />;
      default: return <TrendingUp strokeWidth={2.5} size={22} />;
    }
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
        <motion.h1 variants={itemVariants} className="page-title">Executive Dashboard</motion.h1>
        <motion.div variants={itemVariants} style={{ display: 'flex', gap: '16px' }}>
            <button className="btn" style={{ padding: '12px', background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: '14px', width: 'auto', color: 'var(--text-main)', boxShadow: 'var(--shadow-card)' }}>
               <Calendar size={20} />
            </button>
            <button className="btn" style={{ padding: '12px', background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: '14px', width: 'auto', color: 'var(--text-main)', boxShadow: 'var(--shadow-card)', position: 'relative' }}>
               <Bell size={20} />
               <span style={{ position: 'absolute', top: '10px', right: '12px', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--danger)', boxShadow: '0 0 8px var(--danger)' }}></span>
            </button>
        </motion.div>
      </div>
      <motion.p variants={itemVariants} className="page-subtitle">Welcome back, Admin. Here's a real-time overview of Balaji Cotton's inventory, production trends, and finances.</motion.p>

      <motion.div variants={itemVariants} className="stats-grid">
        <div className="stat-card glow-green">
          <span className="stat-title"><div className="stat-icon-wrapper"><Truck size={18}/></div> Raw Stock</span>
          <span className="stat-value">{rawCotton.toLocaleString()} Qtl</span>
        </div>
        <div className="stat-card glow-amber">
          <span className="stat-title"><div className="stat-icon-wrapper"><Layers size={18}/></div> Finished Bales</span>
          <span className="stat-value">{bales.toLocaleString()}</span>
        </div>
        <div className="stat-card glow-red">
          <span className="stat-title"><div className="stat-icon-wrapper"><IndianRupee size={18}/></div> Payables</span>
          <span className="stat-value">₹{payables.toLocaleString()}</span>
        </div>
        <div className="stat-card glow-blue">
          <span className="stat-title"><div className="stat-icon-wrapper"><TrendingUp size={18}/></div> Receivables</span>
          <span className="stat-value">₹{receivables.toLocaleString()}</span>
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="chart-container">
        <div className="chart-header">
           <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
               <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                   <TrendingUp size={20} strokeWidth={3} />
               </div>
               Weekly Production Output 
           </div>
           <select style={{ padding: '8px 16px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '0.9rem', outline: 'none' }}>
               <option>This Week</option>
               <option>Last Week</option>
               <option>This Month</option>
           </select>
        </div>
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorBales" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.5}/>
                <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
            <XAxis dataKey="day" stroke="var(--text-muted)" tick={{fill: 'var(--text-muted)', fontSize: 12}} axisLine={false} tickLine={false} dy={10} />
            <YAxis stroke="var(--text-muted)" tick={{fill: 'var(--text-muted)', fontSize: 12}} axisLine={false} tickLine={false} dx={-10} />
            <Tooltip 
              contentStyle={{ backgroundColor: 'rgba(30, 30, 34, 0.9)', backdropFilter: 'blur(10px)', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', boxShadow: '0 10px 20px rgba(0,0,0,0.5)' }} 
              itemStyle={{ color: 'var(--primary)', fontWeight: 'bold' }}
              labelStyle={{ color: 'var(--text-muted)', marginBottom: '4px' }}
            />
            <Area type="monotone" dataKey="bales" stroke="var(--primary)" strokeWidth={4} fillOpacity={1} fill="url(#colorBales)" activeDot={{ r: 6, fill: 'var(--bg-dark)', stroke: 'var(--primary)', strokeWidth: 3 }} />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>

      <motion.div variants={itemVariants} className="activity-card">
        <h3 className="activity-header">
          Recent Facility Activity
          <span style={{fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 600, background: 'rgba(16,185,129,0.15)', padding: '6px 14px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid rgba(16, 185, 129, 0.3)'}}>
            <div style={{width: 8, height: 8, borderRadius: '50%', backgroundColor: 'var(--primary)', boxShadow: '0 0 10px var(--primary)'}}></div> Live Sync
          </span>
        </h3>
        <div className="activity-list">
          {activities.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
               <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                  <Package size={28} opacity={0.5} />
               </div>
               <p style={{fontStyle: 'italic'}}>Virtual facility is idle. Waiting for first system action...</p>
            </div>
          ) : (
            activities.map((activity, index) => (
              <motion.div 
                key={activity.id} 
                className="activity-item"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <div className={`activity-icon icon-${activity.type}`}>
                  {getIcon(activity.type)}
                </div>
                <div className="activity-details">
                  <h4>{activity.type} Activity Logged</h4>
                  <p>{activity.description}</p>
                </div>
                <div className="activity-time">
                  {new Date(activity.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'})}
                </div>
              </motion.div>
            ))
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Dashboard;
