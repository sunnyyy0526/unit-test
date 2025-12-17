import { useMemo, useState } from "react";
import "./AdminAnalytics.css";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
} from "recharts";

const REQUESTS_KEY = "myRequests";
const COLORS = ["#6366f1", "#f59e0b", "#ef4444", "#10b981", "#06b6d4", "#a855f7"];

export default function AdminAnalytics() {
  // ✅ Load from localStorage safely (no useEffect)
  const [requests] = useState(() => {
    return JSON.parse(localStorage.getItem(REQUESTS_KEY) || "[]");
  });

  // ----------------------------
  // Analytics Calculations
  // ----------------------------
  const analytics = useMemo(() => {
    if (requests.length === 0) return null;

    const groupCount = (key) =>
      Object.values(
        requests.reduce((acc, r) => {
          const k = r[key] || "Unknown";
          acc[k] = acc[k] || { _id: k, count: 0 };
          acc[k].count++;
          return acc;
        }, {})
      );

    const requestsPerWard = groupCount("ward");
    const requestsPerStatus = groupCount("status");
    const requestsPerWasteType = groupCount("wasteType");

    const operatorMap = {};
    requests.forEach((r) => {
      if (r.assignedOperator?.name) {
        operatorMap[r.assignedOperator.name] =
          (operatorMap[r.assignedOperator.name] || 0) + 1;
      }
    });

    const activeOperators = Object.entries(operatorMap).map(
      ([name, count]) => ({ name, count })
    );

    const completed = requests.filter(
      (r) => r.status === "Completed" && r.createdAt && r.updatedAt
    );

    const avgCompletionTime =
      completed.reduce((sum, r) => {
        const hrs =
          (new Date(r.updatedAt) - new Date(r.createdAt)) /
          (1000 * 60 * 60);
        return sum + hrs;
      }, 0) / (completed.length || 1);

    const slaBreachCount = requests.filter(
      (r) =>
        r.status === "Open" ||
        r.status === "Assigned" ||
        r.status === "In Progress"
    ).length;

    return {
      requestsPerWard,
      requestsPerStatus,
      requestsPerWasteType,
      activeOperators,
      avgCompletionTime,
      slaBreachCount,
      totalRequests: requests.length,
    };
  }, [requests]);

  if (!analytics) return <div className="loading">No data available</div>;

  return (
    <div className="admin-analytics">
      <h2>Analytics</h2>

      {/* Requests per Ward */}
      <section className="panel">
        <h4>Requests per Ward</h4>
        <div style={{ width: "100%", height: 300 }}>
          <ResponsiveContainer>
            <BarChart data={analytics.requestsPerWard}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="_id" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#3b82f6" name="Requests" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Requests per Status */}
      <section className="panel">
        <h4>Requests per Status</h4>
        <div style={{ width: "100%", height: 300 }}>
          <ResponsiveContainer>
            <BarChart data={analytics.requestsPerStatus}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="_id" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#10b981" name="Requests" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Requests per Waste Type */}
      <section className="panel">
        <h4>Requests per Waste Type</h4>
        <div style={{ width: "100%", height: 300 }}>
          <ResponsiveContainer>
            <PieChart>
              <Tooltip />
              <Legend />
              <Pie
                data={analytics.requestsPerWasteType.map((r) => ({
                  name: r._id,
                  value: r.count,
                }))}
                dataKey="value"
                nameKey="name"
                outerRadius={110}
                label
              >
                {analytics.requestsPerWasteType.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Top Operators */}
      <section className="panel">
        <h4>Top Operators</h4>
        <div style={{ width: "100%", height: 300 }}>
          <ResponsiveContainer>
            <BarChart data={analytics.activeOperators}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="name"
                interval={0}
                angle={-20}
                textAnchor="end"
                height={60}
              />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#f97316" name="Handled Requests" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Key Stats */}
      <section className="grid-3">
        <div className="card stat">
          <span className="label">Avg Completion (hrs)</span>
          <span className="value">
            {analytics.avgCompletionTime.toFixed(2)}
          </span>
        </div>
        <div className="card stat danger">
          <span className="label">SLA Breaches</span>
          <span className="value">{analytics.slaBreachCount}</span>
        </div>
        <div className="card stat">
          <span className="label">Total Requests</span>
          <span className="value">{analytics.totalRequests}</span>
        </div>
      </section>
    </div>
  );
}
