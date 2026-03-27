import React, { useState } from 'react';
import { useERP } from '../context/ERPContext';
import { Briefcase, CheckCircle, AlertTriangle, Package, Info, ShieldCheck, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 200, damping: 20 } }
};

const Sales = () => {
  const { recordSale, bales, receivables } = useERP();
  const [formData, setFormData] = useState({ buyer: '', type: 'Bales', quantity: '', weight: '', rate: '', amount: '' });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    if (formData.type === 'Bales') {
      const count = Number(formData.quantity);
      if (count > bales) {
        setError(`Cannot load ${count} Bales onto trucks. You only have ${bales} physical bales available.`);
        return;
      }
    }

    if (formData.buyer && formData.quantity && formData.amount) {
      recordSale(formData.type, formData.quantity, formData.weight, formData.rate, formData.amount, formData.buyer);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      setFormData({ buyer: '', type: 'Bales', quantity: '', weight: '', rate: '', amount: '' });
    }
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show">
      <h1 className="page-title">Dispatch Logistics</h1>
      <p className="page-subtitle">Schedule truck loadings and instantly register receivables against your buyers' ledgers.</p>

      <div className="page-grid">
        <div className="form-container">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Buyer / Textiles Company</label>
              <div className="input-wrapper">
                <div className="input-icon"><Briefcase size={20} /></div>
                <input 
                  type="text" 
                  placeholder="e.g. Surat Textiles Corp"
                  value={formData.buyer}
                  onChange={e => setFormData({...formData, buyer: e.target.value})}
                  required
                />
              </div>
            </div>
            <div className="form-group" style={{ display: 'flex', gap: '1rem' }}>
              <div style={{ flex: 1 }}>
                <label>Product Type</label>
                <div className="input-wrapper">
                  <select 
                    value={formData.type}
                    onChange={e => setFormData({...formData, type: e.target.value})}
                    style={{ width: '100%', padding: '10px', background: 'transparent', color: 'white', border: 'none', outline: 'none' }}
                  >
                    <option value="Bales" style={{color: '#000'}}>Cotton Bales</option>
                    <option value="Seed" style={{color: '#000'}}>Cotton Seeds</option>
                  </select>
                </div>
              </div>
              <div style={{ flex: 1 }}>
                <label>Quantity (Bales/Bags)</label>
                <div className="input-wrapper">
                  <div className="input-icon"><Package size={20} /></div>
                  <input 
                    type="number" 
                    placeholder="0"
                    value={formData.quantity}
                    onChange={e => setFormData({...formData, quantity: e.target.value})}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="form-group" style={{ display: 'flex', gap: '1rem' }}>
              <div style={{ flex: 1 }}>
                <label>Total Weight ({formData.type === 'Bales' ? 'KG' : 'Qtl'})</label>
                <div className="input-wrapper">
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
                <label>Rate (₹)</label>
                <div className="input-wrapper">
                  <div className="input-icon">₹</div>
                  <input 
                    type="number" 
                    placeholder="0.00"
                    value={formData.rate}
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
            
            <button type="submit" className="btn btn-primary" style={{ background: 'linear-gradient(135deg, var(--blue), #2563eb)', boxShadow: '0 10px 20px -5px rgba(59, 130, 246, 0.4)', borderColor: 'rgba(59, 130, 246, 0.2)' }}>
              <ShieldCheck size={20} /> Authorize Dispatch Route
            </button>
            
            {error && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="alert alert-error"
              >
                <AlertTriangle size={24} /> {error}
              </motion.div>
            )}

            {success && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="alert alert-success" style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.3)', color: 'var(--blue)' }}
              >
                <CheckCircle size={24} /> Dispatch completed and invoiced to High-Value Client.
              </motion.div>
            )}
          </form>
        </div>

        <div className="info-card">
          <h3><Info size={20} color="var(--blue)" /> Logistics Overview</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.5 }}>
            Automate weighbridge integration and dispatch routing. Connect to FASTag and E-Way Bill portals for seamless compliance.
          </p>
          
          <div className="info-metric" style={{ borderColor: 'rgba(59, 130, 246, 0.2)' }}>
            <span>Bales Ready For Loading</span>
            <strong style={{ color: 'var(--blue)' }}>{bales.toLocaleString()}</strong>
          </div>
          
          <div className="info-metric" style={{ borderColor: 'rgba(16, 185, 129, 0.2)' }}>
            <span>Total Receivables</span>
            <strong style={{ color: 'var(--success)' }}>₹{receivables.toLocaleString()}</strong>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--blue)', fontSize: '0.85rem', marginTop: 'auto', padding: '12px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '10px' }}>
            <MapPin size={16} /> GPS Dispatch Network Online
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Sales;
