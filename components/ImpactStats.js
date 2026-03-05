'use client';

import { useState, useEffect } from 'react';
import { getTotalBatteriesRecycled, subscribeToMockData } from '@/lib/mock-data';

// Rough estimate: 1 car battery = ~15kg CO2 not emitted if recycled
// This is a placeholder and should be replaced with actual data if available
const CO2_SAVED_PER_BATTERY_KG = 15; 

export default function ImpactStats() {
  const [batteriesRecycled, setBatteriesRecycled] = useState(0);
  const [co2SavedKg, setCo2SavedKg] = useState(0);

  useEffect(() => {
    const updateStats = () => {
      const total = getTotalBatteriesRecycled();
      setBatteriesRecycled(total);
      setCo2SavedKg(total * CO2_SAVED_PER_BATTERY_KG);
    };

    updateStats(); // Initial load
    const unsubscribe = subscribeToMockData(updateStats);
    return () => unsubscribe();
  }, []);

  return (
    <div className="impact-stats-container">
      <div className="impact-stat-card">
        <h3>Batteries Recycled</h3>
        <p>{batteriesRecycled}</p>
      </div>
      <div className="impact-stat-card">
        <h3>CO2 Saved (kg)</h3>
        <p>{co2SavedKg}</p>
      </div>
    </div>
  );
}
