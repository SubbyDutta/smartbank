
import React from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  BarChart, Bar, Cell,
  PieChart, Pie
} from 'recharts';
import { motion } from 'framer-motion';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        backgroundColor: 'var(--color-white)',
        border: '1px solid var(--color-gray-200)',
        padding: '12px',
        borderRadius: 'var(--radius-md)',
        boxShadow: 'var(--shadow-lg)'
      }}>
        <p style={{ margin: 0, fontWeight: 600, fontSize: '0.85rem' }}>{label}</p>
        <p style={{ margin: '4px 0 0', color: 'var(--color-primary)', fontSize: '0.85rem' }}>
          {`${payload[0].name}: ${payload[0].value}`}
        </p>
      </div>
    );
  }
  return null;
};

export const TransactionChart = ({ data }) => {
  // Transform transaction data to something time-based if needed, or just map linearly
  // Assuming 'data' is array of { timestamp, amount ... }
  // We'll reverse it to show chronological order if API returns newest first
  const chartData = [...data].reverse().map((t, index) => ({
    name: t.timestamp?.split('T')[0] || `Tx-${index}`,
    amount: t.amount,
  }));

  return (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        style={{ width: '100%', height: 300, background: 'var(--color-white)', padding: '20px', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)' }}
    >
      <h6 style={{ marginBottom: '20px', fontWeight: 600 }}>Transaction Volume (Recent)</h6>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={chartData}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.1}/>
              <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} stroke="var(--color-gray-100)" />
          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'var(--text-tertiary)' }} minTickGap={30} />
          <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'var(--text-tertiary)' }} />
          <RechartsTooltip content={<CustomTooltip />} cursor={{ stroke: 'var(--color-gray-200)', strokeWidth: 1 }} />
          <Area type="monotone" dataKey="amount" stroke="var(--color-primary)" strokeWidth={2} fillOpacity={1} fill="url(#colorAmount)" />
        </AreaChart>
      </ResponsiveContainer>
    </motion.div>
  );
};

export const LoanStatusChart = ({ loans }) => {
  // Aggregate loan status
  const statusCount = loans.reduce((acc, loan) => {
    const status = loan.status || 'UNKNOWN';
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});

  const data = Object.keys(statusCount).map(key => ({
    name: key,
    value: statusCount[key]
  }));

  // Colors for statuses
  const COLORS = ['#000000', '#52525b', '#a1a1aa', '#e4e4e7'];

  return (
     <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        style={{ width: '100%', height: 300, background: 'var(--color-white)', padding: '20px', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)' }}
    >
      <h6 style={{ marginBottom: '20px', fontWeight: 600 }}>Loan Distributions</h6>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
            stroke="none"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <RechartsTooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>
       <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginTop: '-20px', fontSize: '0.8rem' }}>
          {data.map((entry, index) => (
              <div key={entry.name} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: COLORS[index % COLORS.length] }}></div>
                  <span style={{ color: 'var(--text-secondary)' }}>{entry.name}</span>
              </div>
          ))}
      </div>
    </motion.div>
  );
};
