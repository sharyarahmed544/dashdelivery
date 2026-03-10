"use client";

import { useState, useEffect } from "react";
import { getPricingRules } from "@/app/actions/pricing";
import { updatePricingRules } from "@/app/actions/admin";

export default function AdminPricing() {
  const [rules, setRules] = useState({
    baseRate: 0,
    weightMultiplier: 0,
    fuelLevyPercentage: 0,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function fetch() {
      const data = await getPricingRules();
      setRules(data);
      setLoading(false);
    }
    fetch();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setMessage("");
    const res = await updatePricingRules(rules);
    if (res.success) {
      setMessage("✓ Pricing rules updated successfully.");
    } else {
      setMessage("✗ Failed to update pricing rules.");
    }
    setSaving(false);
  };

  if (loading) return <div className="p-8 text-gray-500 animate-pulse">Loading pricing configuration...</div>;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h1 className="text-3xl font-bold font-['Syne']">Pricing Rules</h1>
      <p className="text-gray-400">Configure base rates, weight multipliers, and fuel levies.</p>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-8 max-w-2xl">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Base Rate (£)</label>
            <input 
              type="number" 
              step="0.01"
              value={rules.baseRate}
              onChange={e => setRules({...rules, baseRate: parseFloat(e.target.value)})}
              className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[var(--og)]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Weight Multiplier (£/kg)</label>
            <input 
              type="number" 
              step="0.01"
              value={rules.weightMultiplier}
              onChange={e => setRules({...rules, weightMultiplier: parseFloat(e.target.value)})}
              className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[var(--og)]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Fuel Levy (as decimal, e.g. 0.035 for 3.5%)</label>
            <input 
              type="number" 
              step="0.001"
              value={rules.fuelLevyPercentage}
              onChange={e => setRules({...rules, fuelLevyPercentage: parseFloat(e.target.value)})}
              className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[var(--og)]"
            />
          </div>

          <button 
            onClick={handleSave}
            disabled={saving}
            className="w-full bg-[var(--og)] text-white font-bold py-3.5 rounded-lg uppercase tracking-wider hover:bg-[#e66000] transition-all disabled:opacity-50"
          >
            {saving ? "Saving Changes..." : "Save Pricing Rules"}
          </button>

          {message && (
            <div className={`text-center text-sm font-medium mt-4 ${message.includes('✓') ? 'text-green-500' : 'text-red-500'}`}>
              {message}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
