import React, { useEffect, useState, useMemo } from "react";
import {
  LineChart,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
  Line,
  ResponsiveContainer,
} from "recharts";

import axios from "axios";

function Home() {
  const [spendings, setSpendings] = useState([]);
  const [frame, setFrame] = useState("daily");
  const [range, setRange] = useState(1);

  const [selectedCurrency, setSelectedCurrency] = useState({
    currency: "CAD",
    default: true,
    symbol: "$",
  });
  const [supportedCurrencies, setSupportedCurrencies] = useState([]);

  const fetchChartData = async () => {
    try {
      const { data } = await axios.get(`/api/spendings`, {
        params: { range, frame, currency: selectedCurrency.currency },
      });
      const { spendings } = data;
      setSpendings(spendings);
    } catch (error) {
      console.error(error);
    }
  };

  const formattedTransactions = useMemo(
    () =>
      spendings &&
      spendings.map((t) => ({
        totalAmount: t.totalAmount,
        date: new Date(t.startDate).toDateString(),
      })),
    [spendings]
  );

  const fetchSupportedCurrencies = async () => {
    try {
      const { data } = await axios.get(`/api/currencies`);
      setSupportedCurrencies(data);
      setSelectedCurrency(data.find((c) => c.default === true));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    // Get supported currencies once on mount
    fetchSupportedCurrencies();
  }, []);

  useEffect(() => {
    fetchChartData();
  }, [frame, range, selectedCurrency]);

  return (
    <>
      <h1 style={{ textAlign: "center" }}>Welcome to My Spending App</h1>

      <ResponsiveContainer width="100%" height={400}>
        <LineChart
          data={formattedTransactions}
          margin={{
            top: 30,
            right: 50,
            left: 50,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis
            dataKey="totalAmount"
            tickFormatter={(amount) => `${selectedCurrency.symbol + amount}`}
          />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="totalAmount"
            stroke="#8884d8"
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
      <div>
        <h3>Change your options below</h3>
        <label for="time-frame">Frame</label>
        <select
          name="time-frame"
          value={frame}
          onChange={(e) => setFrame(e.target.value)}
        >
          <option value="daily">Daily</option>
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
        </select>

        <label for="time-range">Range</label>
        <select name="time-range" onChange={(e) => setRange(e.target.value)}>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
          <option value="6">6</option>
        </select>

        <label for="currency">Currency</label>
        <select
          name="currency"
          value={selectedCurrency.currency}
          onChange={(e) => {
            setSelectedCurrency(
              supportedCurrencies.find((c) => c.currency === e.target.value)
            );
          }}
        >
          {supportedCurrencies.map((c, index) => (
            <option key={index} value={c.currency}>
              {c.currency}
            </option>
          ))}
        </select>
      </div>
    </>
  );
}

export default Home;
