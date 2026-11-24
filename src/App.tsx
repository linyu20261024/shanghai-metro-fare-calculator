import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ArrowLeftRight, Crosshair } from 'lucide-react';
import { COMMUTE_PRESETS, STATIONS } from './data/shanghaiMetro';
import {
  calculateNewFare,
  calculateOldFare,
  findNearestStations,
  findShortestMetroRoute,
  type NearestStationMatch,
} from './utils/fareEngine';
import { StationSelector } from './components/StationSelector';
import { RouteBreakdown } from './components/RouteBreakdown';
import { CommuteOptimizer, type SavedCommute } from './components/CommuteOptimizer';
import { FareRulesMatrix } from './components/FareRulesMatrix';

const STORAGE_KEY = 'shanghai_metro_saved_commutes_v1';

export default function App() {
  const [fromId, setFromId] = useState<string>('jiuting');
  const [toId, setToId] = useState<string>('lujiazui');
  const [customDistanceKm, setCustomDistanceKm] = useState<number | null>(null);

  const [isLocating, setIsLocating] = useState(false);
  const [gpsStatusText, setGpsStatusText] = useState<string | null>(null);
  const [gpsError, setGpsError] = useState<string | null>(null);
  const [nearbyMatches, setNearbyMatches] = useState<NearestStationMatch[]>([]);

  const [savedCommutes, setSavedCommutes] = useState<SavedCommute[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as SavedCommute[]) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(savedCommutes));
    } catch {
      // Ignore storage quota errors
    }
  }, [savedCommutes]);

  const route = useMemo(() => findShortestMetroRoute(fromId, toId), [fromId, toId]);

  const effectiveKm = customDistanceKm !== null ? customDistanceKm : route?.totalDistanceKm ?? 0;
  const newSingleFare = calculateNewFare(effectiveKm);
  const oldSingleFare = calculateOldFare(effectiveKm);

  const handleSelectFrom = (id: string) => {
    setFromId(id);
    setCustomDistanceKm(null);
  };

  const handleSelectTo = (id: string) => {
    setToId(id);
    setCustomDistanceKm(null);
  };

  const handleSwap = () => {
    setFromId(toId);
    setToId(fromId);
    setCustomDistanceKm(null);
  };

  const applyCoordinates = useCallback((lat: number, lng: number, sourceLabel?: string) => {
    const matches = findNearestStations(lat, lng, 3);
    setNearbyMatches(matches);
    if (matches.length > 0) {
      const nearest = matches[0];
      setFromId(nearest.station.id);
      setCustomDistanceKm(null);
      const distText =
        nearest.distanceKm < 1
          ? `${Math.round(nearest.distanceKm * 1000)}m`
          : `${nearest.distanceKm.toFixed(1)}km`;
      setGpsStatusText(
        sourceLabel
          ? `已按「${sourceLabel}」定位最近站点：${nearest.station.name}（直线距离 ${distText}）`
          : `已定位当前最近站点：${nearest.station.name}（直线距离 ${distText}）`
      );
      setGpsError(null);
    }
  }, []);

  const handleTriggerGps = useCallback(() => {
    if (!navigator.geolocation) {
      setGpsError('当前浏览器不支持地理定位，请手动选择起点或使用下方快速位置模拟：');
      return;
    }

    setIsLocating(true);
    setGpsError(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        applyCoordinates(pos.coords.latitude, pos.coords.longitude);
      },
      (err) => {
        setIsLocating(false);
        const msg =
          err.code === err.PERMISSION_DENIED
            ? '未获得浏览器定位权限（或当前预览环境限制定位），可点击下方模拟所在区域或手动搜索起点站：'
            : '暂时无法获取当前 GPS 坐标，可点击下方模拟所在区域或手动搜索起点站：';
        setGpsError(msg);
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 60000 }
    );
  }, [applyCoordinates]);

  const handleSaveCommute = (daysPerWeek: number, tripsPerDay: number) => {
    const fromSt = STATIONS.find((s) => s.id === fromId);
    const toSt = STATIONS.find((s) => s.id === toId);
    if (!fromSt || !toSt) return;

    const newItem: SavedCommute = {
      id: `${fromId}-${toId}-${Date.now()}`,
      label: `${fromSt.name} → ${toSt.name}`,
      fromId,
      toId,
      fromName: fromSt.name,
      toName: toSt.name,
      newFare: newSingleFare,
      oldFare: oldSingleFare,
      daysPerWeek,
      tripsPerDay,
    };
    setSavedCommutes((prev) => [newItem, ...prev.slice(0, 5)]);
  };

  const handleLoadCommute = (item: SavedCommute) => {
    setFromId(item.fromId);
    setToId(item.toId);
    setCustomDistanceKm(null);
  };

  const handleDeleteCommute = (id: string) => {
    setSavedCommutes((prev) => prev.filter((item) => item.id !== id));
  };

  const fromName = route?.from.name ?? '';
  const toName = route?.to.name ?? '';

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* 顶部三段式导航栏 */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-slate-200">
        <div className="max-w-[1200px] mx-auto px-6 h-16 flex items-center justify-between gap-8">
          <a
            href="#fare-calculator"
            className="text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0"
          >
            沪铁精算
          </a>

          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600">
            <a
              href="#fare-calculator"
              className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0"
            >
              票价测算
            </a>
            <a
              href="#commute-optimizer"
              className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0"
            >
              次卡建议
            </a>
            <a
              href="#fare-rules"
              className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0"
            >
              分段规则
            </a>
          </nav>

          <button
            type="button"
            onClick={handleTriggerGps}
            disabled={isLocating}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 disabled:opacity-60 rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            <Crosshair className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin' : ''}`} />
            {isLocating ? '定位中...' : '定位当前站点'}
          </button>
        </div>
      </header>

      {/* 主内容区 */}
      <main className="flex-1 max-w-[1200px] w-full mx-auto px-6 py-8 space-y-12">
        {/* 首屏：标题 + 路线选择 + 新旧票价测算 */}
        <section id="fare-calculator" className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="max-w-2xl">
              <div className="text-xs text-slate-500 mb-2">
                2026年12月1日起施行 · 起乘缩至 4km · 满 90 元享 9 折 · 新增 4 档计次票
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 text-balance">
                上海地铁新票价计算与通勤次卡精算
              </h1>
            </div>
            <div className="text-xs text-slate-500">
              输入起点目的地或一键定位当前站点
            </div>
          </div>

          {/* 起点 / 终点选择栏 */}
          <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-4 items-start">
              <StationSelector
                label="起点站（当前位置 / 出发站）"
                selectedId={fromId}
                onSelect={handleSelectFrom}
                showGpsButton
                isLocating={isLocating}
                gpsStatusText={gpsStatusText}
                gpsError={gpsError}
                nearbyMatches={nearbyMatches}
                onTriggerGps={handleTriggerGps}
                onSimulateCoords={applyCoordinates}
              />

              <div className="flex justify-center md:pt-7">
                <button
                  type="button"
                  onClick={handleSwap}
                  className="p-2.5 border border-slate-200 hover:border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-lg transition-colors cursor-pointer"
                  aria-label="互换起点与终点"
                  title="互换起点与终点"
                >
                  <ArrowLeftRight className="w-4 h-4" />
                </button>
              </div>

              <StationSelector
                label="目的地站（公司 / 到达站）"
                selectedId={toId}
                onSelect={handleSelectTo}
              />
            </div>

            {/* 典型通勤路线快捷预设 */}
            <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs">
              <span className="text-slate-500 font-medium shrink-0">常见通勤测试：</span>
              {COMMUTE_PRESETS.map((preset) => {
                const active = fromId === preset.fromId && toId === preset.toId;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => {
                      setFromId(preset.fromId);
                      setToId(preset.toId);
                      setCustomDistanceKm(null);
                    }}
                    className={`transition-colors cursor-pointer whitespace-nowrap ${
                      active
                        ? 'font-semibold text-rose-600 underline underline-offset-4'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                    title={preset.note}
                  >
                    {preset.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 路径与单程票价结果 */}
          <RouteBreakdown
            route={route}
            customDistanceKm={customDistanceKm}
            onChangeCustomDistance={setCustomDistanceKm}
          />
        </section>

        {/* 通勤频次与次卡对比精算 */}
        <CommuteOptimizer
          fromId={fromId}
          toId={toId}
          fromName={fromName}
          toName={toName}
          newSingleFare={newSingleFare}
          oldSingleFare={oldSingleFare}
          savedCommutes={savedCommutes}
          onSaveCommute={handleSaveCommute}
          onLoadCommute={handleLoadCommute}
          onDeleteCommute={handleDeleteCommute}
        />

        {/* 2026新票价与优惠分段对照 */}
        <FareRulesMatrix />
      </main>

      {/* 简洁页脚 */}
      <footer className="border-t border-slate-200 bg-white mt-12">
        <div className="max-w-[1200px] mx-auto px-6 py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500">
          <div>
            沪铁精算 · 上海市轨道交通票价与次卡测算工具（里程经由路网最短路径估算，实际计费以进出站闸机为准）
          </div>
          <a
            href="https://service.shmetro.com/yygg/5747.htm"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-600 hover:text-slate-900 underline underline-offset-4 whitespace-nowrap"
          >
            官方公告：service.shmetro.com/yygg/5747.htm
          </a>
        </div>
      </footer>
    </div>
  );
}
