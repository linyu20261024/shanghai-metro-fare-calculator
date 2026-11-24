import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Crosshair, MapPin, Search, X } from 'lucide-react';
import { METRO_LINES, STATIONS, type MetroStation } from '../data/shanghaiMetro';
import type { NearestStationMatch } from '../utils/fareEngine';
import { bd09ToWgs84, gcj02ToWgs84 } from '../utils/coordTransform';

interface StationSelectorProps {
  label: string;
  selectedId: string;
  onSelect: (stationId: string) => void;
  showGpsButton?: boolean;
  isLocating?: boolean;
  gpsStatusText?: string | null;
  gpsAccuracyWarning?: string | null;
  gpsError?: string | null;
  nearbyMatches?: NearestStationMatch[];
  onTriggerGps?: () => void;
  onSimulateCoords?: (lat: number, lng: number, label: string) => void;
}

const DEMO_LOCATIONS = [
  { label: '人民广场', lat: 31.2328, lng: 121.4754 },
  { label: '徐家汇', lat: 31.1953, lng: 121.4368 },
  { label: '陆家嘴', lat: 31.2381, lng: 121.5023 },
  { label: '张江高科', lat: 31.2017, lng: 121.5877 },
  { label: '虹桥商务区', lat: 31.1941, lng: 121.3204 },
  { label: '五角场', lat: 31.3005, lng: 121.5142 },
];

export const StationSelector: React.FC<StationSelectorProps> = ({
  label,
  selectedId,
  onSelect,
  showGpsButton = false,
  isLocating = false,
  gpsStatusText,
  gpsAccuracyWarning,
  gpsError,
  nearbyMatches = [],
  onTriggerGps,
  onSimulateCoords,
}) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [lineFilter, setLineFilter] = useState<string>('ALL');
  const [showCoordHelper, setShowCoordHelper] = useState(false);
  const [coordInput, setCoordInput] = useState('');
  const [coordType, setCoordType] = useState<'GCJ-02' | 'BD-09' | 'WGS-84'>('GCJ-02');
  const [coordParseError, setCoordParseError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const selectedStation = useMemo(
    () => STATIONS.find((s) => s.id === selectedId) ?? STATIONS[0],
    [selectedId]
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 40);
    }
  }, [open]);

  const filteredStations = useMemo(() => {
    const q = query.trim().toLowerCase();
    return STATIONS.filter((st) => {
      const matchesLine = lineFilter === 'ALL' || st.lines.includes(lineFilter);
      if (!matchesLine) return false;
      if (!q) return true;
      return (
        st.name.toLowerCase().includes(q) ||
        st.pinyin.toLowerCase().includes(q) ||
        st.district.toLowerCase().includes(q)
      );
    });
  }, [query, lineFilter]);

  const handleChoose = (station: MetroStation) => {
    onSelect(station.id);
    setOpen(false);
    setQuery('');
  };

  const handleApplyPastedCoord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!onSimulateCoords) return;
    const nums = coordInput
      .trim()
      .split(/[\s,，;；]+/)
      .map(Number)
      .filter((n) => Number.isFinite(n));

    if (nums.length !== 2) {
      setCoordParseError('请输入两个数字，例如：121.4754, 31.2328');
      return;
    }

    const [a, b] = nums;
    let rawLng: number;
    let rawLat: number;
    if (a > 100 && b < 60) {
      rawLng = a;
      rawLat = b;
    } else if (b > 100 && a < 60) {
      rawLat = a;
      rawLng = b;
    } else {
      setCoordParseError('坐标超出上海范围，请检查经度(~121)与纬度(~31)');
      return;
    }

    let wgs = { lat: rawLat, lng: rawLng };
    if (coordType === 'GCJ-02') {
      wgs = gcj02ToWgs84(rawLat, rawLng);
    } else if (coordType === 'BD-09') {
      wgs = bd09ToWgs84(rawLat, rawLng);
    }

    setCoordParseError(null);
    onSimulateCoords(wgs.lat, wgs.lng, `${coordType} 坐标`);
    setShowCoordHelper(false);
  };

  return (
    <div ref={containerRef} className="relative">
      <div className="flex items-center justify-between gap-2 mb-2">
        <label className="text-xs font-semibold text-slate-600 tracking-wide">
          {label}
        </label>
        {showGpsButton && (
          <div className="flex items-center gap-3">
            {onSimulateCoords && (
              <button
                type="button"
                onClick={() => setShowCoordHelper((v) => !v)}
                className="text-xs text-slate-500 hover:text-slate-900 underline underline-offset-2 cursor-pointer whitespace-nowrap shrink-0"
              >
                {showCoordHelper ? '收起坐标校准' : '坐标校准'}
              </button>
            )}
            {onTriggerGps && (
              <button
                type="button"
                onClick={onTriggerGps}
                disabled={isLocating}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-rose-600 hover:text-rose-700 disabled:opacity-50 transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                <Crosshair className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin' : ''}`} />
                {isLocating ? '正在获取定位...' : '定位当前最近站点'}
              </button>
            )}
          </div>
        )}
      </div>

      {/* 免 Key 坐标粘贴校准（支持高德/腾讯/百度坐标自动纠偏） */}
      {showGpsButton && showCoordHelper && onSimulateCoords && (
        <form
          onSubmit={handleApplyPastedCoord}
          className="mb-2.5 p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-2 text-xs"
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="font-medium text-slate-700">
              粘贴高德/腾讯/百度经纬度，自动纠偏匹配最近地铁站
            </span>
            <div className="flex items-center gap-1.5">
              {(['GCJ-02', 'BD-09', 'WGS-84'] as const).map((sys) => (
                <button
                  key={sys}
                  type="button"
                  onClick={() => setCoordType(sys)}
                  className={`px-2 py-0.5 rounded border cursor-pointer font-mono-tabular ${
                    coordType === sys
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-white text-slate-600 border-slate-200'
                  }`}
                >
                  {sys === 'GCJ-02' ? '高德/腾讯' : sys === 'BD-09' ? '百度' : 'GPS'}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={coordInput}
              onChange={(e) => setCoordInput(e.target.value)}
              placeholder="例如 121.4754, 31.2328"
              className="flex-1 px-3 py-1.5 bg-white border border-slate-200 rounded text-slate-900 font-mono-tabular focus:outline-none focus:border-slate-400"
            />
            <button
              type="submit"
              className="px-3 py-1.5 bg-slate-900 text-white font-medium rounded hover:bg-slate-800 cursor-pointer whitespace-nowrap shrink-0"
            >
              匹配站点
            </button>
          </div>
          {coordParseError && <p className="text-rose-600">{coordParseError}</p>}
        </form>
      )}

      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="w-full flex items-center justify-between gap-3 px-4 py-3 bg-white border border-slate-200 hover:border-slate-300 rounded-lg text-left transition-colors focus-visible:outline-2 focus-visible:outline-rose-600 cursor-pointer"
      >
        <div className="flex items-center gap-3 min-w-0">
          <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-900 text-base truncate">
                {selectedStation.name}
              </span>
              <span className="text-xs text-slate-400 shrink-0">
                {selectedStation.district}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          {selectedStation.lines.slice(0, 4).map((lineId) => {
            const info = METRO_LINES[lineId];
            return (
              <span
                key={lineId}
                style={{ backgroundColor: info?.color ?? '#64748B', color: info?.textColor ?? '#FFF' }}
                className="inline-flex items-center justify-center min-w-[22px] h-[20px] px-1 text-[11px] font-bold rounded font-mono-tabular"
              >
                {info?.shortName ?? lineId}
              </span>
            );
          })}
        </div>
      </button>

      {gpsStatusText && (
        <p className="mt-1.5 text-xs text-emerald-700 tabular-nums">{gpsStatusText}</p>
      )}

      {gpsAccuracyWarning && (
        <div className="mt-2 p-2.5 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900 space-y-1.5">
          <p>{gpsAccuracyWarning}</p>
          {onSimulateCoords && (
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-slate-700">
              <span className="font-medium text-amber-900">快速切换商圈：</span>
              {DEMO_LOCATIONS.map((loc) => (
                <button
                  key={loc.label}
                  type="button"
                  onClick={() => onSimulateCoords(loc.lat, loc.lng, loc.label)}
                  className="underline decoration-amber-400 hover:text-slate-900 cursor-pointer whitespace-nowrap"
                >
                  {loc.label}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {gpsError && (
        <div className="mt-2 p-2.5 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800">
          <p className="mb-1.5">{gpsError}</p>
          {onSimulateCoords && (
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-slate-600">
              <span className="text-amber-900 font-medium">快速定位所在商圈：</span>
              {DEMO_LOCATIONS.map((loc) => (
                <button
                  key={loc.label}
                  type="button"
                  onClick={() => onSimulateCoords(loc.lat, loc.lng, loc.label)}
                  className="underline decoration-amber-400 hover:text-slate-900 cursor-pointer whitespace-nowrap"
                >
                  {loc.label}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {nearbyMatches.length > 1 && (
        <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500">
          <span>附近备选：</span>
          {nearbyMatches.map((m, idx) => (
            <React.Fragment key={m.station.id}>
              <button
                type="button"
                onClick={() => onSelect(m.station.id)}
                className={`hover:text-slate-900 cursor-pointer tabular-nums ${
                  m.station.id === selectedId ? 'font-semibold text-rose-600' : 'underline decoration-slate-300'
                }`}
              >
                {m.station.name} ({m.distanceKm < 1 ? `${Math.round(m.distanceKm * 1000)}m` : `${m.distanceKm.toFixed(1)}km`})
              </button>
              {idx < nearbyMatches.length - 1 && <span aria-hidden="true">·</span>}
            </React.Fragment>
          ))}
        </div>
      )}

      {open && (
        <div className="absolute left-0 right-0 z-40 mt-1.5 bg-white border border-slate-200 rounded-lg shadow-lg overflow-hidden">
          <div className="p-2.5 border-b border-slate-100 flex items-center gap-2">
            <Search className="w-4 h-4 text-slate-400 shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="输入站名、拼音首字母或行政区（如 rmgc / 徐汇）"
              className="w-full text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
                aria-label="清空搜索"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="px-2.5 py-2 border-b border-slate-100 flex items-center gap-1 overflow-x-auto bg-slate-50">
            <button
              type="button"
              onClick={() => setLineFilter('ALL')}
              className={`px-2 py-1 text-xs font-medium rounded whitespace-nowrap shrink-0 cursor-pointer transition-colors ${
                lineFilter === 'ALL'
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:bg-slate-200/70'
              }`}
            >
              全部线路
            </button>
            {Object.values(METRO_LINES).map((line) => (
              <button
                key={line.id}
                type="button"
                onClick={() => setLineFilter(line.id)}
                className={`px-2 py-1 text-xs font-medium rounded whitespace-nowrap shrink-0 cursor-pointer transition-colors ${
                  lineFilter === line.id
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-600 hover:bg-slate-200/70'
                }`}
              >
                {line.name}
              </button>
            ))}
          </div>

          <div className="max-h-64 overflow-y-auto divide-y divide-slate-100">
            {filteredStations.length === 0 ? (
              <div className="py-8 text-center text-sm text-slate-500">
                未找到匹配的地铁站，请尝试其他站名或拼音
              </div>
            ) : (
              filteredStations.map((station) => {
                const isSelected = station.id === selectedId;
                return (
                  <button
                    key={station.id}
                    type="button"
                    onClick={() => handleChoose(station)}
                    className={`w-full px-3.5 py-2.5 flex items-center justify-between text-left hover:bg-slate-50 transition-colors cursor-pointer ${
                      isSelected ? 'bg-rose-50/70' : ''
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className={`text-sm font-medium truncate ${isSelected ? 'text-rose-700 font-semibold' : 'text-slate-900'}`}>
                        {station.name}
                      </span>
                      <span className="text-xs text-slate-400 shrink-0">{station.district}</span>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      {station.lines.map((lineId) => {
                        const info = METRO_LINES[lineId];
                        return (
                          <span
                            key={lineId}
                            style={{ backgroundColor: info?.color ?? '#64748B', color: info?.textColor ?? '#FFF' }}
                            className="inline-flex items-center justify-center min-w-[20px] h-[18px] px-1 text-[10px] font-bold rounded font-mono-tabular"
                          >
                            {info?.shortName ?? lineId}
                          </span>
                        );
                      })}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};
