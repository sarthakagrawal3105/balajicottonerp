import React, { useState } from 'react';
import { useERP } from '../context/ERPContext';
import { Truck, CheckCircle, Navigation, Info, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 200, damping: 20 } }
};

const Purchases = () => {
  const { recordPurchase, rawCotton, payables } = useERP();
  const [formData, setFormData] = useState({ farmer: '', weight: '', amount: '' });
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.weight && formData.amount && formData.farmer) {
      recordPurchase(formData.weight, formData.amount, formData.farmer, formData.rate);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      setFormData({ farmer: '', weight: '', rate: '', amount: '' });
    }
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show">
      <h1 className="page-title">Procurement</h1>
      <p className="page-subtitle">Log incoming raw cotton deliveries from farmers and update your payable records instantly.</p>

      <div className="page-grid">
        <div className="form-container">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Farmer / Party Name</label>
              <div className="input-wrapper">
                <div className="input-icon"><Navigation size={20} /></div>
                <input 
                  type="text" 
                  placeholder="e.g. Ramesh Kumar"
                  value={formData.farmer}
                  onChange={e => setFormData({...formData, farmer: e.target.value})}
                  required
                />
              </div>
            </div>
            <div className="form-group" style={{ display: 'flex', gap: '1rem' }}>
              <div style={{ flex: 1 }}>
                <label>Weight (Qtl)</label>
                <div className="input-wrapper">
                  <div className="input-icon"><Truck size={20} /></div>
                  <input 
                    type="number" 
                    placeholder="0.00"
                    value={formData.weight}
                    onChange={e => {
                      const w = parseFloat(e.target.value) || 0;
                      const r = parseFloat(formData.rate) || 0;
                      setFormData({...formData, weight: e.target.value, amount: (w * r).toFixed(2)})
                    }}
                    required
                    step="0.01"
                  />
                </div>
              </div>
              <div style={{ flex: 1 }}>
                <label>Rate (₹/Qtl)</label>
                <div className="input-wrapper">
                  <div className="input-icon">₹</div>
                  <input 
                    type="number" 
                    placeholder="0.00"
                    value={formData.rate || ''}
                    onChange={e => {
                      const r = parseFloat(e.target.value) || 0;
                      const w = parseFloat(formData.weight) || 0;
                      setFormData({...formData, rate: e.target.value, amount: (w * r).toFixed(2)})
                    }}
                    required
                    step="0.01"
                  />
                </div>
              </div>
            </div>
            <div className="form-group">
              <label>Total Invoice Value (₹)</label>
              <div className="input-wrapper">
                <div className="input-icon">₹</div>
                <input 
                  type="number" 
                  placeholder="0.00"
                  value={formData.amount}
                  readOnly
                  style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}
                />
              </div>
            </div>
            
            <button type="submit" className="btn btn-primary">
              <Truck size={20} /> Log Raw Material
            </button>
            
            {success && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="alert alert-success"
              >
                <CheckCircle size={24} /> 
                <span>Delivery from <strong>{formData.farmer || 'Farmer'}</strong> logged successfully. Stock & Ledgers updated.</span>
              </motion.div>
            )}
          </form>
        </div>

        <div className="info-card">
          <h3><Info size={20} color="var(--success)" /> Procurement Status</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.5 }}>
            Automate data entry and track payload limits. Incoming trucks are cross-checked against registered farmers in the APMC database.
          </p>
          
          <div className="info-metric" style={{ borderColor: 'rgba(16,185,129,0.2)' }}>
            <span>Total Raw Stock</span>
            <strong style={{ color: 'var(--success)' }}>{rawCotton.toLocaleString()} Qtl</strong>
          </div>
          
          <div className="info-metric" style={{ borderColor: 'rgba(239, 68, 68, 0.2)' }}>
            <span>Outstanding Payables</span>
            <strong style={{ color: 'var(--danger)' }}>₹{payables.toLocaleString()}</strong>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--blue)', fontSize: '0.85rem', marginTop: 'auto', padding: '12px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '10px' }}>
            <Clock size={16} /> Market Rates synced 5 mins ago.
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Purchases;
