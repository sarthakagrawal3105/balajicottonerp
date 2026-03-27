import React, { useState } from 'react';
import { useERP } from '../context/ERPContext';
import { FileText, CheckCircle, Wallet, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 200, damping: 20 } }
};

const Expenses = () => {
  const { recordExpense, totalExpenses, payables } = useERP();
  const [formData, setFormData] = useState({ category: 'Electricity Bill', amount: '', description: '' });
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.category && formData.amount) {
      recordExpense(formData.category, formData.amount, formData.description);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      setFormData({ category: 'Electricity Bill', amount: '', description: '' });
    }
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show">
      <h1 className="page-title">Factory Expenses</h1>
      <p className="page-subtitle">Track overhead costs like electricity, labor, and maintenance for the ginning plant.</p>

      <div className="page-grid">
        <div className="form-container">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Expense Category</label>
              <div className="input-wrapper">
                <select 
                  value={formData.category}
                  onChange={e => setFormData({...formData, category: e.target.value})}
                  style={{ width: '100%', padding: '10px', background: 'transparent', color: 'white', border: 'none', outline: 'none' }}
                >
                  <option style={{color: '#000'}}>Electricity Bill</option>
                  <option style={{color: '#000'}}>Labour Charge</option>
                  <option style={{color: '#000'}}>Maintenance</option>
                  <option style={{color: '#000'}}>Miscellaneous</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label>Amount (₹)</label>
              <div className="input-wrapper">
                <div className="input-icon">₹</div>
                <input 
                  type="number" 
                  placeholder="0.00"
                  value={formData.amount}
                  onChange={e => setFormData({...formData, amount: e.target.value})}
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <label>Description / Vendor Name</label>
              <div className="input-wrapper">
                <input 
                  type="text" 
                  placeholder="e.g. PGVCL Bill / Machinery Spares"
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                />
              </div>
            </div>
            
            <button type="submit" className="btn btn-primary" style={{ background: 'linear-gradient(135deg, var(--danger), #f43f5e)', boxShadow: '0 10px 20px -5px rgba(244, 63, 94, 0.4)', borderColor: 'rgba(244, 63, 94, 0.2)' }}>
              <Wallet size={20} /> Log Expense
            </button>
            
            {success && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="alert alert-success" style={{ backgroundColor: 'rgba(244, 63, 94, 0.1)', border: '1px solid rgba(244, 63, 94, 0.3)', color: 'var(--danger)' }}
              >
                <CheckCircle size={24} /> Expense logged and cash flow updated.
              </motion.div>
            )}
          </form>
        </div>

        <div className="info-card">
          <h3><Wallet size={20} color="var(--danger)" /> Expense Overview</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.5 }}>
            Monitoring operational costs helps calculate the precise Ginning Outturn (GOT) profitability margin per batch.
          </p>
          
          <div className="info-metric" style={{ borderColor: 'rgba(244, 63, 94, 0.2)' }}>
            <span>Total Operational Expenses</span>
            <strong style={{ color: 'var(--danger)' }}>₹{totalExpenses.toLocaleString()}</strong>
          </div>
          
          <div className="info-metric" style={{ borderColor: 'rgba(239, 68, 68, 0.2)' }}>
            <span>Total Factory Payables</span>
            <strong style={{ color: 'var(--danger)' }}>₹{payables.toLocaleString()}</strong>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--danger)', fontSize: '0.85rem', marginTop: 'auto', padding: '12px', background: 'rgba(244, 63, 94, 0.1)', borderRadius: '10px' }}>
            <Zap size={16} /> Track high-energy consumption
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Expenses;
