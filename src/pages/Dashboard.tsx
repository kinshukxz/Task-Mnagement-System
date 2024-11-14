import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { CheckCircle2, Clock, AlertCircle, BarChart2 } from 'lucide-react';
import axios from 'axios';

function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    overdue: 0
  });

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchStats = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/tasks/stats', {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        setStats(response.data);
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
  }, [user, navigate]);

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Welcome back, {user?.name}!</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <StatCard
          title="Total Tasks"
          value={stats.total}
          icon={<BarChart2 className="h-8 w-8 text-blue-500" />}
          color="blue"
        />
        <StatCard
          title="Completed"
          value={stats.completed}
          icon={<CheckCircle2 className="h-8 w-8 text-green-500" />}
          color="green"
        />
        <StatCard
          title="In Progress"
          value={stats.pending}
          icon={<Clock className="h-8 w-8 text-yellow-500" />}
          color="yellow"
        />
        <StatCard
          title="Overdue"
          value={stats.overdue}
          icon={<AlertCircle className="h-8 w-8 text-red-500" />}
          color="red"
        />
      </div>

      {/* Add more dashboard content here */}
    </div>
  );
}

function StatCard({ title, value, icon, color }: { title: string; value: number; icon: React.ReactNode; color: string }) {
  const colorClasses = {
    blue: 'bg-blue-50 border-blue-200',
    green: 'bg-green-50 border-green-200',
    yellow: 'bg-yellow-50 border-yellow-200',
    red: 'bg-red-50 border-red-200'
  };

  return (
    <div className={`p-6 rounded-lg border ${colorClasses[color]} transition-transform hover:scale-105`}>
      <div className="flex items-center justify-between mb-4">
        {icon}
        <h3 className="text-xl font-semibold text-gray-800">{value}</h3>
      </div>
      <p className="text-gray-600">{title}</p>
    </div>
  );
}

export default Dashboard;