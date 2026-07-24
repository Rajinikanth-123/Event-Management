import { BarChart, Bar, CartesianGrid, Tooltip, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

const COLORS = ['#0f172a', '#f97316', '#38bdf8', '#22c55e', '#eab308', '#ef4444'];

export const SimpleBarChart = ({ data, xKey = '_id', yKey = 'total' }) => (
  <ResponsiveContainer width="100%" height={280}>
    <BarChart data={data}>
      <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
      <XAxis dataKey={xKey} stroke="var(--muted)" />
      <YAxis stroke="var(--muted)" />
      <Tooltip />
      <Bar dataKey={yKey} fill="var(--primary)" radius={[8, 8, 0, 0]} />
    </BarChart>
  </ResponsiveContainer>
);

export const SimplePieChart = ({ data }) => (
  <ResponsiveContainer width="100%" height={280}>
    <PieChart>
      <Pie data={data} dataKey="total" nameKey="_id" cx="50%" cy="50%" outerRadius={100} label>
        {data.map((entry, index) => (
          <Cell key={entry._id || index} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip />
    </PieChart>
  </ResponsiveContainer>
);

export const SimpleLineChart = ({ data, xKey = 'name', yKey = 'value' }) => (
  <ResponsiveContainer width="100%" height={280}>
    <LineChart data={data}>
      <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
      <XAxis dataKey={xKey} stroke="var(--muted)" />
      <YAxis stroke="var(--muted)" />
      <Tooltip />
      <Line type="monotone" dataKey={yKey} stroke="var(--primary)" strokeWidth={3} dot={{ r: 4 }} />
    </LineChart>
  </ResponsiveContainer>
);