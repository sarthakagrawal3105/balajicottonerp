import React, { createContext, useContext, useState, useEffect } from 'react';

const ERPContext = createContext();

export const useERP = () => useContext(ERPContext);

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

export const ERPProvider = ({ children }) => {
  // Keep the same export variables so pages don't break
  const [rawCotton, setRawCotton] = useState(0);
  const [bales, setBales] = useState(0);
  const [seeds, setSeeds] = useState(0);
  
  const [payables, setPayables] = useState(0);
  const [receivables, setReceivables] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  
  const [activities, setActivities] = useState([]);

  // Fetch all data
  const refreshData = async () => {
    try {
      const [purchasesRes, salesRes, prodRes, expRes] = await Promise.all([
        fetch(`${API_BASE}/purchases`).then(res => res.json()),
        fetch(`${API_BASE}/sales`).then(res => res.json()),
        fetch(`${API_BASE}/production`).then(res => res.json()),
        fetch(`${API_BASE}/expenses`).then(res => res.json()),
      ]);

      // Calculate state derivations here so we don't break the UI
      let _rawCotton = 0; let _bales = 0; let _seeds = 0;
      let _payables = 0; let _receivables = 0; let _expenses = 0;
      let _activities = [];

      // Purchases (Raw Cotton Qtl)
      (purchasesRes || []).forEach(p => {
        if(p.type === 'RAW_COTTON' || !p.type) _rawCotton += p.netWeight;
        if(p.type === 'SEED') _seeds += p.netWeight;
        _payables += p.amount;
        _activities.push({ id: `p-${p.id}`, type: 'purchase', description: `Bought ${p.netWeight} Qtl from Supplier ID: ${p.supplierId}`, date: p.date });
      });

      // Production 
      (prodRes || []).forEach(p => {
        _rawCotton -= p.inputWeight;
        _bales += p.lintProduced;
        _seeds += p.seedProduced;
        _activities.push({ id: `pr-${p.id}`, type: 'production', description: `Pressed ${p.lintProduced} Bales`, date: p.date });
      });

      // Sales
      (salesRes || []).forEach(s => {
        if(s.type === 'Bales' || s.type === 'BALES' || !s.type) _bales -= s.quantity;
        if(s.type === 'Seed' || s.type === 'SEED') _seeds -= s.quantity; // assuming seeds sold by quantity/weight
        _receivables += s.amount;
        _activities.push({ id: `s-${s.id}`, type: 'sale', description: `Sold ${s.quantity} ${s.type} to Buyer ID: ${s.buyerId}`, date: s.date });
      });

      // Expenses
      (expRes || []).forEach(e => {
        _expenses += e.amount;
        _payables += e.amount; // Expenses add to payables
        _activities.push({ id: `e-${e.id}`, type: 'expense', description: `Logged ₹${e.amount} for ${e.category}`, date: e.date });
      });

      _activities.sort((a,b) => new Date(b.date) - new Date(a.date));

      setRawCotton(_rawCotton);
      setBales(_bales);
      setSeeds(_seeds);
      setPayables(_payables);
      setReceivables(_receivables);
      setTotalExpenses(_expenses);
      setActivities(_activities.slice(0, 50)); // Keep only latest 50

    } catch (e) { console.error("API Error", e); }
  };

  useEffect(() => { refreshData(); }, []);

  const recordPurchase = async (weight, amount, party, rate) => {
    await fetch(`${API_BASE}/purchases`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ supplierId: 1, type: 'RAW_COTTON', netWeight: weight, rate: rate || (amount/weight), vehicleNo: "UNKNOWN" })
    });
    refreshData();
  };

  const recordProduction = async (rawCottonUsed, balesProduced, seedProduced, waste) => {
    await fetch(`${API_BASE}/production`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ inputBatches: "LATEST", inputWeight: rawCottonUsed, lintProduced: balesProduced, seedProduced: seedProduced, waste: waste })
    });
    refreshData();
  };

  const recordSale = async (type, quantity, weight, rate, amount, buyer) => {
    await fetch(`${API_BASE}/sales`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ buyerId: 1, type: type || 'Bales', quantity: quantity, totalWeight: weight||(quantity*170), rate: rate || (amount/quantity), amount })
    });
    refreshData();
  };

  const recordExpense = async (category, amount, description) => {
    await fetch(`${API_BASE}/expenses`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ category: category || 'MISC', amount: amount, description })
    });
    refreshData();
  };

  return (
    <ERPContext.Provider value={{
      rawCotton, bales, seeds, payables, receivables, activities, totalExpenses,
      recordPurchase, recordProduction, recordSale, recordExpense, refreshData
    }}>
      {children}
    </ERPContext.Provider>
  );
};
