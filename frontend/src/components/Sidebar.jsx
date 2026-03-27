import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Truck, Factory, Layers, Briefcase, TrendingUp, FileText, Settings, User } from 'lucide-react';
import { motion } from 'framer-motion';

const Sidebar = () => {
  return (
    <motion.nav 
      className="sidebar"
      initial={{ x: -300 }}
      animate={{ x: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
    >
      <div className="sidebar-header">
        <div className="sidebar-brand-icon">
          <Factory size={22} color="#fff" />
        </div>
        Balaji Cotton
      </div>
      
      <div className="sidebar-nav">
        <div className="nav-section-title">Overview</div>
        <NavLink to="/" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>
          <LayoutDashboard size={20} strokeWidth={2.5} />
          Analytics Dashboard
        </NavLink>
        
        <div className="nav-section-title">Operations</div>
        <NavLink to="/purchases" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>
          <Truck size={20} strokeWidth={2.5} />
          Procurement (Raw)
        </NavLink>
        <NavLink to="/production" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>
          <Layers size={20} strokeWidth={2.5} />
          Pressing (Bales)
        </NavLink>
        <NavLink to="/sales" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>
          <Briefcase size={20} strokeWidth={2.5} />
          Sales & Dispatch
        </NavLink>
        <NavLink to="/expenses" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>
          <FileText size={20} strokeWidth={2.5} />
          Factory Expenses
        </NavLink>
        <a href="http://localhost:8501/streamlit" className="nav-link">
          <FileText size={20} strokeWidth={2.5} />
          Bill Generator
        </a>
      </div>

      <div style={{ padding: '24px' }}>
        <div style={{ background: 'linear-gradient(135deg, rgba(255,193,7,0.1), rgba(245,158,11,0.05))', borderRadius: '16px', padding: '20px', border: '1px solid rgba(245,158,11,0.2)' }}>
          <TrendingUp size={24} color="var(--secondary)" style={{marginBottom: '12px'}} />
          <h4 style={{ color: '#fff', fontSize: '0.95rem', marginBottom: '8px' }}>Pro Features</h4>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: 1.4, marginBottom: '16px' }}>Unlock Machine Maintenance & HR tracking modules soon.</p>
          <button style={{ width: '100%', padding: '10px', background: 'rgba(255,255,255,0.1)', color: '#fff', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600, transition: 'all 0.3s' }} onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'} onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}>Upgrade Plan</button>
        </div>
      </div>
      
      <div style={{ padding: '20px 24px', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(0,0,0,0.2)' }}>
        <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <User size={20} color="#fff" />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ color: '#fff', fontSize: '0.95rem', fontWeight: 600 }}>Admin User</div>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>admin@balaji.com</div>
        </div>
        <Settings size={18} color="var(--text-muted)" style={{ cursor: 'pointer' }} />
      </div>
    </motion.nav>
  );
};

export default Sidebar;
