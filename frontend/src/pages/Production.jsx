import React, { useState } from 'react';
import { useERP } from '../context/ERPContext';
import { Layers, CheckCircle, AlertTriangle, Info, Cpu, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 200, damping: 20 } }
};

const Production = () => {
  const { recordProduction, rawCotton, bales, seeds } = useERP();
  const [formData, setFormData] = useState({ rawUsed: '', balesProduced: '', seedProduced: '', waste: '' });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    const used = Number(formData.rawUsed);
    if (used > rawCotton) {
      setError(`Cannot process ${used} Qtl. Maximum available raw stock is ${rawCotton} Qtl.`);
      return;
    }

    if (formData.rawUsed && formData.balesProduced && formData.seedProduced && formData.waste) {
      recordProduction(formData.rawUsed, formData.balesProduced, formData.seedProduced, formData.waste);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      setFormData({ rawUsed: '', balesProduced: '', seedProduced: '', waste: '' });
    }
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show">
      <h1 className="page-title">Factory Pressing</h1>
      <p className="page-subtitle">Input your daily or shift-level pressing data to convert raw stock into finished bales.</p>

      <div className="page-grid">
        <div className="form-container">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Raw Cotton Consumed (Qtl)</label>
              <div className="input-wrapper">
                <div className="input-icon"><Layers size={20} /></div>
                <input 
                  type="number" 
                  placeholder="e.g. 150 Qtl"
                  value={formData.rawUsed}
                  onChange={e => setFormData({...formData, rawUsed: e.target.value})}
                  required
                  step="0.01"
                />
              </div>
            </div>
            
            <div className="form-group" style={{ display: 'flex', gap: '1rem' }}>
              <div style={{ flex: 1 }}>
                <label>Finished Bales</label>
                <div className="input-wrapper">
                  <div className="input-icon"><Cpu size={20} /></div>
                  <input 
                    type="number" 
                    placeholder="Bales Count"
                    value={formData.balesProduced}
                    onChange={e => setFormData({...formData, balesProduced: e.target.value})}
                    required
                  />
                </div>
              </div>
              <div style={{ flex: 1 }}>
                <label>Cotton Seed (Qtl)</label>
                <div className="input-wrapper">
                  <div className="input-icon"><Layers size={20} /></div>
                  <input 
                    type="number" 
                    placeholder="0.00"
                    value={formData.seedProduced}
                    onChange={e => setFormData({...formData, seedProduced: e.target.value})}
                    required
                    step="0.01"
                  />
                </div>
              </div>
            </div>

            <div className="form-group">
              <label>Waste / Shortage (Qtl)</label>
              <div className="input-wrapper">
                <div className="input-icon"><AlertTriangle size={20} /></div>
                <input 
                  type="number" 
                  placeholder="0.00"
                  value={formData.waste}
                  onChange={e => setFormData({...formData, waste: e.target.value})}
                  required
                  step="0.01"
                />
              </div>
            </div>
            
            <button type="submit" className="btn btn-primary" style={{ background: 'linear-gradient(135deg, var(--secondary), #f97316)', boxShadow: '0 10px 20px -5px var(--secondary-glow)', borderColor: 'rgba(245, 158, 11, 0.2)' }}>
              <Activity size={20} /> Register Production Shift
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
                className="alert alert-success" style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.3)', color: 'var(--secondary)' }}
              >
                <CheckCircle size={24} /> Shift production accurately recorded. Inventory synced.
              </motion.div>
            )}
          </form>
        </div>

        <div className="info-card">
          <h3><Info size={20} color="var(--secondary)" /> Production Targets</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.5 }}>
            Automated monitoring of conversion ratios. Watch for lint percentage anomalies and machine maintenance alerts automatically.
          </p>
          
          <div className="info-metric" style={{ borderColor: 'rgba(245, 158, 11, 0.2)' }}>
            <span>Available Bales</span>
            <strong style={{ color: 'var(--secondary)' }}>{bales.toLocaleString()} Bales</strong>
          </div>
          
          <div className="info-metric" style={{ borderColor: 'rgba(16, 185, 129, 0.2)' }}>
            <span>Seed Inventory</span>
            <strong style={{ color: 'var(--success)' }}>{seeds.toLocaleString()} Qtl</strong>
          </div>
          
          <div className="info-metric" style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }}>
            <span>Inventory Reserve</span>
            <strong>{rawCotton.toLocaleString()} Qtl</strong>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--success)', fontSize: '0.85rem', marginTop: 'auto', padding: '12px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '10px' }}>
            <Activity size={16} /> Press machines operating optimally.
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Production;
