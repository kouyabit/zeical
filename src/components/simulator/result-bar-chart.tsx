"use client";

import {
  Bar,
  BarChart,
  Cell,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export interface ChartDatum {
  name: string;
  value: number;
  color: string;
}

interface ResultBarChartProps {
  data: ChartDatum[];
}

// ツールチップなどで使う円表記フォーマッタ
function yen(value: number): string {
  return `${Math.round(value).toLocaleString("ja-JP")}円`;
}

/**
 * 計算結果を棒グラフで可視化する。
 * 例: ふるさと納税の「控除額」と「自己負担額」の比較など。
 */
export function ResultBarChart({ data }: ResultBarChartProps) {
  return (
    <div className="h-64 w-full" aria-hidden="true">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 24, right: 16, left: 0, bottom: 0 }}>
          <XAxis dataKey="name" tick={{ fontSize: 12 }} />
          <YAxis
            tickFormatter={(v: number) => `${(v / 10000).toLocaleString()}万`}
            tick={{ fontSize: 12 }}
            width={48}
          />
          <Tooltip
            formatter={(value) => [yen(Number(value)), "金額"]}
            cursor={{ fill: "rgba(15,76,129,0.06)" }}
          />
          <Bar dataKey="value" radius={[6, 6, 0, 0]}>
            <LabelList
              dataKey="value"
              position="top"
              formatter={(value) => yen(Number(value))}
              style={{ fontSize: 12, fontWeight: 700 }}
            />
            {data.map((entry) => (
              <Cell key={entry.name} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
