import React, { useEffect, useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend 
} from 'recharts';
import orderApi from '../api/orderApi';
import { DollarSign, ShoppingBag, TrendingUp } from 'lucide-react';

const Dashboard = () => {
  const [chartData, setChartData] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await orderApi.getStats();
        
        // Kiểm tra nếu data null hoặc undefined thì dừng
        if (!data) return;

        let total = 0;
        // Chuyển đổi Object { "2024-02-04": 50000 } -> Array [{ date:..., revenue:... }]
        const formattedData = Object.keys(data).map(key => {
            const amount = data[key];
            total += amount;
            return {
                date: key, 
                revenue: amount 
            };
        });

        setChartData(formattedData);
        setTotalRevenue(total);
      } catch (error) {
        console.error("Lỗi tải thống kê:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="p-8 text-center text-gray-500">Đang tải dữ liệu thống kê...</div>;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Tổng quan kinh doanh</h2>

      {/* 1. CÁC THẺ CARD THỐNG KÊ */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card Doanh Thu */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="p-4 bg-green-100 rounded-full text-green-600">
                <DollarSign size={24} />
            </div>
            <div>
                <p className="text-gray-500 text-sm">Tổng doanh thu</p>
                <h3 className="text-2xl font-bold text-gray-800">
                    {totalRevenue.toLocaleString()}đ
                </h3>
            </div>
        </div>

        {/* Card Số ngày có đơn (Demo) */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="p-4 bg-blue-100 rounded-full text-blue-600">
                <ShoppingBag size={24} />
            </div>
            <div>
                <p className="text-gray-500 text-sm">Hoạt động gần đây</p>
                <h3 className="text-2xl font-bold text-gray-800">{chartData.length} ngày</h3>
            </div>
        </div>
        
        {/* Card Tăng trưởng (Demo tĩnh) */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="p-4 bg-purple-100 rounded-full text-purple-600">
                <TrendingUp size={24} />
            </div>
            <div>
                <p className="text-gray-500 text-sm">Tăng trưởng</p>
                <h3 className="text-2xl font-bold text-gray-800">+12.5%</h3>
            </div>
        </div>
      </div>

      {/* 2. BIỂU ĐỒ CỘT */}
      {/* Thêm style height: 400px trực tiếp để sửa lỗi Recharts không nhận diện chiều cao */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100" style={{ height: 450 }}>
        <h3 className="text-lg font-bold mb-4">Biểu đồ doanh thu theo ngày</h3>
        
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
                dataKey="date" 
                tickFormatter={(str) => {
                    const date = new Date(str);
                    return `${date.getDate()}/${date.getMonth() + 1}`;
                }}
            />
            <YAxis />
            <Tooltip 
                formatter={(value) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value)}
                labelFormatter={(label) => `Ngày: ${label}`}
                contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb' }}
            />
            <Legend />
            <Bar 
                dataKey="revenue" 
                name="Doanh thu" 
                fill="#3b82f6" 
                barSize={50} 
                radius={[4, 4, 0, 0]} 
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Dashboard;