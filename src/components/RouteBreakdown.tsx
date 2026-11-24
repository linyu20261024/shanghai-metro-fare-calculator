import React from 'react';
import { ArrowRight, Clock, RotateCcw, Route as RouteIcon } from 'lucide-react';
import { calculateNewFare, calculateOldFare, type RouteResult } from '../utils/fareEngine';

interface RouteBreakdownProps {
  route: RouteResult | null;
  customDistanceKm: number | null;
  onChangeCustomDistance: (km: number | null) => void;
}

export const RouteBreakdown: React.FC<RouteBreakdownProps> = ({
  route,
  customDistanceKm,
  onChangeCustomDistance,
}) => {
  if (!route) {
    return (
      <div className="p-6 bg-white border border-slate-200 rounded-lg text-sm text-slate-500">
        请选择有效的起点站与终点站以测算路径与票价。
      </div>
    );
  }

  const effectiveKm = customDistanceKm !== null ? customDistanceKm : route.totalDistanceKm;
  const newFare = calculateNewFare(effectiveKm);
  const oldFare = calculateOldFare(effectiveKm);
  const fareDiff = newFare - oldFare;
  const diffPercent = oldFare > 0 ? Math.round((fareDiff / oldFare) * 100) : 0;

  return (
    <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
      {/* 顶部票价对比横条 */}
      <div className="p-6 border-b border-slate-200 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        <div>
          <div className="text-xs font-medium text-slate-500 mb-1">
            2026年12月起 · 新规单程票价
          </div>
          <div className="flex items-baseline gap-2.5">
            <span className="text-4xl font-bold tracking-tight text-slate-900 font-mono-tabular">
              ¥{newFare.toFixed(0)}
            </span>
            <span className="text-xs text-slate-500 font-mono-tabular">
              {effectiveKm.toFixed(1)} km 计费里程
            </span>
          </div>
        </div>

        <div className="md:border-l md:border-slate-200 md:pl-6">
          <div className="text-xs font-medium text-slate-500 mb-1">
            调价前原票价对比
          </div>
          <div className="flex items-baseline gap-2.5">
            <span className="text-2xl font-semibold text-slate-600 line-through font-mono-tabular">
              ¥{oldFare.toFixed(0)}
            </span>
            {fareDiff > 0 ? (
              <span className="text-sm font-semibold text-rose-600 font-mono-tabular">
                +¥{fareDiff}（上调 {diffPercent}%）
              </span>
            ) : (
              <span className="text-sm font-semibold text-emerald-700 font-mono-tabular">
                价格不变（¥0 变化）
              </span>
            )}
          </div>
        </div>

        <div className="md:border-l md:border-slate-200 md:pl-6 flex flex-col justify-center gap-1 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="tabular-nums">预估乘车约 {route.estimatedMinutes} 分钟</span>
            <span aria-hidden="true">·</span>
            <span className="tabular-nums">
              {route.transferCount === 0 ? '直达无需换乘' : `换乘 ${route.transferCount} 次`}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <RouteIcon className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="tabular-nums">
              经 {route.stationPath.length} 个主节点
            </span>
            <span aria-hidden="true">·</span>
            <span>不含磁浮/金山铁路/市域机场线</span>
          </div>
        </div>
      </div>

      {/* 路网换乘分段示意图 */}
      <div className="p-6 border-b border-slate-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-slate-900">
            最短计价路径详情
          </h3>
          <span className="text-xs text-slate-500 tabular-nums">
            {route.from.name} → {route.to.name}
          </span>
        </div>

        {route.segments.length === 0 ? (
          <p className="text-sm text-slate-500">同站进出按起步价 ¥3 计费。</p>
        ) : (
          <div className="space-y-3">
            {route.segments.map((seg, idx) => (
              <div
                key={`${seg.line}-${idx}`}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-2.5 border-b last:border-b-0 border-slate-100"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span
                    style={{ backgroundColor: seg.lineColor, color: seg.lineTextColor }}
                    className="px-2 py-0.5 text-xs font-bold rounded shrink-0 whitespace-nowrap"
                  >
                    {seg.lineName}
                  </span>
                  <div className="flex items-center gap-1.5 text-sm font-medium text-slate-900 min-w-0">
                    <span className="truncate">{seg.fromStation.name}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{seg.toStation.name}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-500 shrink-0 tabular-nums">
                  <span>{seg.stationNames.join(' · ')}</span>
                  <span className="font-mono-tabular font-medium text-slate-700">
                    {seg.distanceKm.toFixed(1)} km
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 里程精确校准滑块 */}
      <div className="px-6 py-4 bg-slate-50/70 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="min-w-0">
          <div className="text-xs font-medium text-slate-700">
            轨道计费里程校准（若需与 Metro大都会 精确站距一致，可微调此里程）
          </div>
          <div className="text-xs text-slate-500 mt-0.5">
            {customDistanceKm !== null
              ? `当前使用手动校准里程 ${customDistanceKm.toFixed(1)} km（路网估算为 ${route.totalDistanceKm.toFixed(1)} km）`
              : `当前使用路网最短路径估算里程 ${route.totalDistanceKm.toFixed(1)} km`}
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <input
            type="range"
            min={1}
            max={80}
            step={0.5}
            value={effectiveKm}
            onChange={(e) => onChangeCustomDistance(Number(e.target.value))}
            className="w-36 accent-rose-600 cursor-pointer"
            aria-label="计费里程微调"
          />
          <span className="w-16 text-right text-xs font-semibold font-mono-tabular text-slate-900">
            {effectiveKm.toFixed(1)} km
          </span>
          {customDistanceKm !== null && (
            <button
              type="button"
              onClick={() => onChangeCustomDistance(null)}
              className="inline-flex items-center gap-1 text-xs text-slate-600 hover:text-slate-900 cursor-pointer whitespace-nowrap"
            >
              <RotateCcw className="w-3 h-3" />
              还原
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
