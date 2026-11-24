import React, { useMemo, useState } from 'react';
import { Bookmark, Check, Info, Trash2, TrendingDown } from 'lucide-react';
import { analyzeCommuteStrategies, type CommuteInput } from '../utils/fareEngine';

export interface SavedCommute {
  id: string;
  label: string;
  fromId: string;
  toId: string;
  fromName: string;
  toName: string;
  newFare: number;
  oldFare: number;
  daysPerWeek: number;
  tripsPerDay: number;
}

interface CommuteOptimizerProps {
  fromId: string;
  toId: string;
  fromName: string;
  toName: string;
  newSingleFare: number;
  oldSingleFare: number;
  savedCommutes: SavedCommute[];
  onSaveCommute: (daysPerWeek: number, tripsPerDay: number) => void;
  onLoadCommute: (item: SavedCommute) => void;
  onDeleteCommute: (id: string) => void;
}

export const CommuteOptimizer: React.FC<CommuteOptimizerProps> = ({
  fromId,
  toId,
  fromName,
  toName,
  newSingleFare,
  oldSingleFare,
  savedCommutes,
  onSaveCommute,
  onLoadCommute,
  onDeleteCommute,
}) => {
  const [isCommute, setIsCommute] = useState(true);
  const [commuteDaysPerWeek, setCommuteDaysPerWeek] = useState(5);
  const [tripsPerCommuteDay, setTripsPerCommuteDay] = useState(2);
  const [extraRidesPerCycle, setExtraRidesPerCycle] = useState(4);
  const [extraRideAvgFareNew, setExtraRideAvgFareNew] = useState(4);
  const [hoverRides, setHoverRides] = useState<number | null>(null);

  const input: CommuteInput = useMemo(
    () => ({
      commuteSingleFareNew: newSingleFare,
      commuteSingleFareOld: oldSingleFare,
      commuteDaysPerWeek: isCommute ? commuteDaysPerWeek : 0,
      tripsPerCommuteDay,
      cycleDays: 30,
      extraRidesPerCycle: isCommute ? extraRidesPerCycle : 1,
      extraRideAvgFareNew,
      extraRideAvgFareOld: Math.max(3, extraRideAvgFareNew - 1),
    }),
    [
      isCommute,
      newSingleFare,
      oldSingleFare,
      commuteDaysPerWeek,
      tripsPerCommuteDay,
      extraRidesPerCycle,
      extraRideAvgFareNew,
    ]
  );

  const analysis = useMemo(() => analyzeCommuteStrategies(input), [input]);
  const { bestNewPlan, newPaygPlan, oldBaselinePlan, breakEvenPoints } = analysis;

  // SVG Chart dimensions
  const chartW = 760;
  const chartH = 260;
  const padL = 52;
  const padR = 24;
  const padT = 20;
  const padB = 34;
  const innerW = chartW - padL - padR;
  const innerH = chartH - padT - padB;

  const maxCost = useMemo(() => {
    let maxVal = 450;
    for (const pt of breakEvenPoints) {
      maxVal = Math.max(maxVal, pt.paygNew, pt.pass35, pt.pass45, pt.pass60, pt.pass90);
    }
    return Math.ceil(maxVal / 50) * 50;
  }, [breakEvenPoints]);

  const xScale = (rides: number) => padL + ((rides - 10) / (95 - 10)) * innerW;
  const yScale = (cost: number) => padT + innerH - (cost / maxCost) * innerH;

  const buildPath = (key: 'paygNew' | 'pass35' | 'pass45' | 'pass60' | 'pass90') =>
    breakEvenPoints
      .map((pt, idx) => `${idx === 0 ? 'M' : 'L'} ${xScale(pt.rides).toFixed(1)} ${yScale(pt[key]).toFixed(1)}`)
      .join(' ');

  const activePoint = useMemo(() => {
    const target = hoverRides ?? Math.min(95, Math.max(10, Math.round(analysis.totalRidesCount / 5) * 5));
    return (
      breakEvenPoints.find((p) => p.rides === target) ??
      breakEvenPoints[Math.floor(breakEvenPoints.length / 2)]
    );
  }, [hoverRides, analysis.totalRidesCount, breakEvenPoints]);

  const alreadySaved = savedCommutes.some(
    (s) =>
      s.fromId === fromId &&
      s.toId === toId &&
      s.daysPerWeek === commuteDaysPerWeek &&
      s.tripsPerDay === tripsPerCommuteDay
  );

  return (
    <section id="commute-optimizer" className="space-y-6">
      {/* 头部标题与通勤开关 */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">
            通勤频次精算与次卡方案建议
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            基于 30 个自然日周期（计次票有效期），实时对比“满90元享9折”与四档官方计次票总成本。
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="inline-flex items-center p-1 bg-slate-100 rounded-lg border border-slate-200">
            <button
              type="button"
              onClick={() => setIsCommute(true)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                isCommute ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              固定通勤线路
            </button>
            <button
              type="button"
              onClick={() => setIsCommute(false)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                !isCommute ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              仅偶发单次乘坐
            </button>
          </div>

          {isCommute && (
            <button
              type="button"
              onClick={() => onSaveCommute(commuteDaysPerWeek, tripsPerCommuteDay)}
              disabled={alreadySaved}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 rounded-lg transition-colors disabled:opacity-50 cursor-pointer whitespace-nowrap shrink-0"
            >
              {alreadySaved ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Bookmark className="w-3.5 h-3.5" />}
              {alreadySaved ? '已保存常驻通勤' : '保存为通勤路线'}
            </button>
          )}
        </div>
      </div>

      {/* 已保存常驻通勤快速切换栏 */}
      {savedCommutes.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="text-slate-500 font-medium">已保存通勤：</span>
          {savedCommutes.map((item) => (
            <div
              key={item.id}
              className="inline-flex items-center bg-white border border-slate-200 rounded-md overflow-hidden"
            >
              <button
                type="button"
                onClick={() => {
                  setCommuteDaysPerWeek(item.daysPerWeek);
                  setTripsPerCommuteDay(item.tripsPerDay);
                  onLoadCommute(item);
                }}
                className="px-2.5 py-1.5 hover:bg-slate-50 text-slate-700 font-medium cursor-pointer tabular-nums whitespace-nowrap"
              >
                {item.fromName} → {item.toName}（每周{item.daysPerWeek}天 · ¥{item.newFare}）
              </button>
              <button
                type="button"
                onClick={() => onDeleteCommute(item.id)}
                className="px-2 py-1.5 text-slate-400 hover:text-rose-600 border-l border-slate-100 cursor-pointer"
                aria-label={`删除 ${item.label}`}
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {!isCommute ? (
        <div className="p-6 bg-white border border-slate-200 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-semibold text-slate-900">
              偶发单次出行：建议直接使用常规刷卡/乘车码
            </h3>
            <p className="text-sm text-slate-600 mt-1">
              本次行程新票价为 <span className="font-semibold font-mono-tabular">¥{newSingleFare}</span>（原票价 ¥{oldSingleFare}）。若每月乘坐地铁总计不足 18–25 次，通常无需购买计次票，使用同一支付渠道累计满 90 元即可享 9 折优惠。
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsCommute(true)}
            className="px-4 py-2 text-xs font-semibold bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            切换到通勤测算
          </button>
        </div>
      ) : (
        <>
          {/* 参数调节区 + 最优方案建议 */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* 左侧参数控制台 (5 cols) */}
            <div className="lg:col-span-5 bg-white border border-slate-200 rounded-lg p-6 flex flex-col justify-between gap-5">
              <div className="space-y-5">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-slate-700">每周通勤天数</span>
                    <span className="text-xs font-mono-tabular font-semibold text-slate-900">
                      {commuteDaysPerWeek} 天 / 周
                    </span>
                  </div>
                  <div className="grid grid-cols-7 gap-1.5">
                    {[1, 2, 3, 4, 5, 6, 7].map((d) => (
                      <button
                        key={d}
                        type="button"
                        onClick={() => setCommuteDaysPerWeek(d)}
                        className={`py-2 text-xs font-medium rounded-md border transition-colors cursor-pointer font-mono-tabular ${
                          commuteDaysPerWeek === d
                            ? 'bg-slate-900 text-white border-slate-900'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        {d}天
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-slate-700">每个通勤日乘坐次数</span>
                    <span className="text-xs text-slate-500">
                      {tripsPerCommuteDay === 2 ? '早晚往返（2次/天）' : '仅单程（1次/天）'}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setTripsPerCommuteDay(2)}
                      className={`py-2 px-3 text-xs font-medium rounded-md border transition-colors cursor-pointer ${
                        tripsPerCommuteDay === 2
                          ? 'bg-slate-900 text-white border-slate-900'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      早晚往返 · 2次/天
                    </button>
                    <button
                      type="button"
                      onClick={() => setTripsPerCommuteDay(1)}
                      className={`py-2 px-3 text-xs font-medium rounded-md border transition-colors cursor-pointer ${
                        tripsPerCommuteDay === 1
                          ? 'bg-slate-900 text-white border-slate-900'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      单程地铁 · 1次/天
                    </button>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 grid grid-cols-2 gap-4">
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-medium text-slate-600">30天额外出行</span>
                      <span className="text-xs font-mono-tabular font-semibold text-slate-900">
                        {extraRidesPerCycle} 次
                      </span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={24}
                      step={1}
                      value={extraRidesPerCycle}
                      onChange={(e) => setExtraRidesPerCycle(Number(e.target.value))}
                      className="w-full accent-slate-900 cursor-pointer"
                      aria-label="30天额外非通勤出行次数"
                    />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-medium text-slate-600">额外出行均价</span>
                      <span className="text-xs font-mono-tabular font-semibold text-slate-900">
                        ¥{extraRideAvgFareNew}
                      </span>
                    </div>
                    <input
                      type="range"
                      min={3}
                      max={10}
                      step={1}
                      value={extraRideAvgFareNew}
                      onChange={(e) => setExtraRideAvgFareNew(Number(e.target.value))}
                      className="w-full accent-slate-900 cursor-pointer"
                      aria-label="额外出行平均单程票价"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600 tabular-nums">
                <span>30天周期总乘车次数</span>
                <span className="font-semibold text-slate-900 font-mono-tabular">
                  通勤 {analysis.commuteRidesCount} 次 + 额外 {analysis.extraRidesCount} 次 = 共 {analysis.totalRidesCount} 次
                </span>
              </div>
            </div>

            {/* 右侧最优建议卡片 (7 cols) */}
            <div className="lg:col-span-7 bg-white border border-slate-200 rounded-lg p-6 flex flex-col justify-between gap-6">
              <div>
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2 text-xs font-semibold text-rose-600">
                    <TrendingDown className="w-4 h-4" />
                    <span>最优省钱建议（30个自然日）</span>
                  </div>
                  <div className="text-xs text-slate-500 tabular-nums">
                    {fromName} ↔ {toName} · 单程新票价 ¥{newSingleFare}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 pb-5 border-b border-slate-100">
                  <div>
                    <h3 className="text-2xl font-bold tracking-tight text-slate-900">
                      {bestNewPlan.name}
                    </h3>
                    <p className="text-sm text-slate-600 mt-1">{bestNewPlan.description}</p>
                  </div>
                  <div className="sm:text-right shrink-0">
                    <div className="text-xs text-slate-500">30天预计总支出</div>
                    <div className="text-3xl font-bold text-slate-900 font-mono-tabular">
                      ¥{bestNewPlan.totalMonthlyCost.toFixed(2)}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 py-5 border-b border-slate-100">
                  <div>
                    <div className="text-xs text-slate-500 mb-1">折合单程均价</div>
                    <div className="text-lg font-bold text-slate-900 font-mono-tabular">
                      ¥{bestNewPlan.effectivePerRide.toFixed(2)}
                      <span className="text-xs font-normal text-slate-500"> / 次</span>
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 mb-1">比满90元9折省</div>
                    <div className="text-lg font-bold text-emerald-700 font-mono-tabular">
                      {bestNewPlan.id === 'payg_new'
                        ? '已是最优'
                        : `省 ¥${bestNewPlan.savingsVsNewPayg.toFixed(2)}`}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 mb-1">较调价前旧规变化</div>
                    <div
                      className={`text-lg font-bold font-mono-tabular ${
                        bestNewPlan.deltaVsOldRule <= 0 ? 'text-emerald-700' : 'text-amber-700'
                      }`}
                    >
                      {bestNewPlan.deltaVsOldRule > 0 ? '+' : ''}
                      ¥{bestNewPlan.deltaVsOldRule.toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-2.5 text-xs text-slate-600 bg-slate-50 p-3.5 rounded-md">
                <Info className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                <div className="leading-relaxed">
                  {bestNewPlan.id === 'payg_new' ? (
                    <span>
                      当前单程票价为 <strong>¥{newSingleFare}</strong>，或月乘车 <strong>{analysis.totalRidesCount} 次</strong> 未达次卡盈亏平衡点。使用同一支付渠道刷卡/扫码（满90元后9折）共需{' '}
                      <strong className="font-mono-tabular">¥{newPaygPlan.totalMonthlyCost.toFixed(2)}</strong>，比任意计次票更省钱。
                    </span>
                  ) : (
                    <span>
                      推荐购买 <strong>{bestNewPlan.name}</strong>（{bestNewPlan.note}）。若全部按新规单程累计“满90打9折”需{' '}
                      <strong className="font-mono-tabular">¥{newPaygPlan.totalMonthlyCost.toFixed(2)}</strong>，购卡可净省{' '}
                      <strong className="text-emerald-700 font-mono-tabular">¥{bestNewPlan.savingsVsNewPayg.toFixed(2)}</strong>（{bestNewPlan.spilloverRides > 0 ? '系统已将次卡优先分配给高票价通勤行程，超出次数按单程补足' : '完全覆盖您的通勤与日常乘车'}）。
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* 6方案精算对比矩阵表 */}
          <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <h3 className="text-sm font-semibold text-slate-900">
                全方案成本对比明细（按 30 天 {analysis.totalRidesCount} 次测算）
              </h3>
              <span className="text-xs text-slate-500">
                注：计次票不与“满90元9折”同享；超出计次票的乘次按新规单程累计计算
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-xs font-semibold text-slate-600">
                    <th className="py-3 px-4 whitespace-nowrap">计费方案</th>
                    <th className="py-3 px-4 text-right whitespace-nowrap">卡面/门槛</th>
                    <th className="py-3 px-4 text-right whitespace-nowrap">补足单程</th>
                    <th className="py-3 px-4 text-right whitespace-nowrap">30天总花费</th>
                    <th className="py-3 px-4 text-right whitespace-nowrap">折合单次</th>
                    <th className="py-3 px-4 text-right whitespace-nowrap">较满90打9折</th>
                    <th className="py-3 px-4 text-right whitespace-nowrap">较调价前旧规</th>
                    <th className="py-3 px-4 whitespace-nowrap">匹配说明</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {analysis.plans.map((plan) => {
                    const isOld = plan.id === 'payg_old';
                    return (
                      <tr
                        key={plan.id}
                        className={`transition-colors ${
                          plan.isRecommended
                            ? 'bg-rose-50/50'
                            : isOld
                            ? 'bg-slate-50/60 text-slate-500'
                            : 'hover:bg-slate-50/70'
                        }`}
                      >
                        <td className="py-3 px-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <span
                              className={`font-medium ${
                                plan.isRecommended
                                  ? 'text-rose-700 font-semibold'
                                  : isOld
                                  ? 'text-slate-500'
                                  : 'text-slate-900'
                              }`}
                            >
                              {plan.shortName}
                            </span>
                            {plan.isRecommended && (
                              <span className="text-[11px] font-semibold text-rose-600">
                                推荐最优
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-right font-mono-tabular text-xs text-slate-600 whitespace-nowrap">
                          {plan.includedRides !== null
                            ? `¥${plan.passPrice} / ${plan.includedRides}次`
                            : plan.id === 'payg_new'
                            ? '满¥90打9折'
                            : '满¥70打9折'}
                        </td>
                        <td className="py-3 px-4 text-right font-mono-tabular text-xs text-slate-600 whitespace-nowrap">
                          {plan.spilloverRides > 0
                            ? `${plan.spilloverRides}次 (¥${plan.spilloverCost.toFixed(1)})`
                            : '—'}
                        </td>
                        <td className="py-3 px-4 text-right font-mono-tabular font-semibold text-slate-900 whitespace-nowrap">
                          ¥{plan.totalMonthlyCost.toFixed(2)}
                        </td>
                        <td className="py-3 px-4 text-right font-mono-tabular text-slate-700 whitespace-nowrap">
                          ¥{plan.effectivePerRide.toFixed(2)}
                        </td>
                        <td className="py-3 px-4 text-right font-mono-tabular whitespace-nowrap">
                          {plan.id === 'payg_new' ? (
                            <span className="text-slate-400">基准</span>
                          ) : isOld ? (
                            <span className="text-slate-400">—</span>
                          ) : plan.savingsVsNewPayg > 0 ? (
                            <span className="text-emerald-700 font-semibold">
                              -¥{plan.savingsVsNewPayg.toFixed(2)}
                            </span>
                          ) : plan.savingsVsNewPayg < 0 ? (
                            <span className="text-rose-600">
                              +¥{Math.abs(plan.savingsVsNewPayg).toFixed(2)}
                            </span>
                          ) : (
                            <span className="text-slate-500">¥0.00</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-right font-mono-tabular whitespace-nowrap">
                          {isOld ? (
                            <span className="text-slate-400">旧基准 ¥{oldBaselinePlan.totalMonthlyCost.toFixed(2)}</span>
                          ) : plan.deltaVsOldRule > 0 ? (
                            <span className="text-amber-700">+¥{plan.deltaVsOldRule.toFixed(2)}</span>
                          ) : (
                            <span className="text-emerald-700 font-semibold">
                              -¥{Math.abs(plan.deltaVsOldRule).toFixed(2)}
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-xs text-slate-500 whitespace-nowrap">
                          {plan.note}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* 盈亏平衡曲线图 (SVG) */}
          <div className="bg-white border border-slate-200 rounded-lg p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
              <div>
                <h3 className="text-sm font-semibold text-slate-900">
                  不同乘车频次下的月度总花费曲线（按当前通勤单程 ¥{newSingleFare}）
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  鼠标悬停在图表任意位置，可查看不同月乘车次数下“满90打9折”与四档次卡的成本交叉点
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
                <span className="inline-flex items-center gap-1.5 text-slate-700">
                  <span className="w-3 h-0.5 bg-slate-800 inline-block" /> 满90打9折
                </span>
                <span className="inline-flex items-center gap-1.5 text-amber-700">
                  <span className="w-3 h-0.5 bg-amber-500 inline-block" /> 35次卡
                </span>
                <span className="inline-flex items-center gap-1.5 text-emerald-700">
                  <span className="w-3 h-0.5 bg-emerald-600 inline-block" /> 45次卡
                </span>
                <span className="inline-flex items-center gap-1.5 text-sky-700">
                  <span className="w-3 h-0.5 bg-sky-600 inline-block" /> 60次卡
                </span>
                <span className="inline-flex items-center gap-1.5 text-rose-700">
                  <span className="w-3 h-0.5 bg-rose-600 inline-block" /> 90次卡
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              <div className="lg:col-span-9 overflow-x-auto">
                <svg
                  viewBox={`0 0 ${chartW} ${chartH}`}
                  className="w-full h-auto min-w-[560px] select-none"
                  onMouseLeave={() => setHoverRides(null)}
                >
                  {/* Y 轴网格 */}
                  {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
                    const y = padT + innerH * (1 - ratio);
                    const val = Math.round(maxCost * ratio);
                    return (
                      <g key={ratio}>
                        <line
                          x1={padL}
                          y1={y}
                          x2={chartW - padR}
                          y2={y}
                          stroke="#E2E8F0"
                          strokeWidth="1"
                        />
                        <text
                          x={padL - 8}
                          y={y + 4}
                          textAnchor="end"
                          className="fill-slate-400 text-[11px] font-mono-tabular"
                        >
                          ¥{val}
                        </text>
                      </g>
                    );
                  })}

                  {/* X 轴标签 */}
                  {breakEvenPoints
                    .filter((_, i) => i % 2 === 0)
                    .map((pt) => (
                      <text
                        key={pt.rides}
                        x={xScale(pt.rides)}
                        y={chartH - 10}
                        textAnchor="middle"
                        className="fill-slate-400 text-[11px] font-mono-tabular"
                      >
                        {pt.rides}次
                      </text>
                    ))}

                  {/* 当前用户月乘车次数标记线 */}
                  {analysis.totalRidesCount >= 10 && analysis.totalRidesCount <= 95 && (
                    <line
                      x1={xScale(analysis.totalRidesCount)}
                      y1={padT}
                      x2={xScale(analysis.totalRidesCount)}
                      y2={padT + innerH}
                      stroke="#94A3B8"
                      strokeDasharray="4 4"
                      strokeWidth="1.5"
                    />
                  )}

                  {/* 5条成本曲线 */}
                  <path
                    d={buildPath('paygNew')}
                    fill="none"
                    stroke="#1E293B"
                    strokeWidth="2.2"
                    strokeDasharray="6 3"
                  />
                  <path d={buildPath('pass35')} fill="none" stroke="#D97706" strokeWidth="2" />
                  <path d={buildPath('pass45')} fill="none" stroke="#16A34A" strokeWidth="2.2" />
                  <path d={buildPath('pass60')} fill="none" stroke="#0284C7" strokeWidth="2" />
                  <path d={buildPath('pass90')} fill="none" stroke="#E3002B" strokeWidth="2.2" />

                  {/* 交互探测热区 */}
                  {breakEvenPoints.map((pt) => {
                    const x = xScale(pt.rides);
                    const isFocused = activePoint.rides === pt.rides;
                    return (
                      <g key={pt.rides}>
                        {isFocused && (
                          <line
                            x1={x}
                            y1={padT}
                            x2={x}
                            y2={padT + innerH}
                            stroke="#E3002B"
                            strokeWidth="1"
                            opacity="0.4"
                          />
                        )}
                        <rect
                          x={x - innerW / breakEvenPoints.length / 2}
                          y={padT}
                          width={innerW / breakEvenPoints.length}
                          height={innerH}
                          fill="transparent"
                          onMouseEnter={() => setHoverRides(pt.rides)}
                          className="cursor-crosshair"
                        />
                      </g>
                    );
                  })}
                </svg>
              </div>

              {/* 右侧数据读数面板 */}
              <div className="lg:col-span-3 border-t lg:border-t-0 lg:border-l border-slate-100 pt-4 lg:pt-0 lg:pl-5 space-y-2.5 text-xs">
                <div className="font-semibold text-slate-900 font-mono-tabular">
                  {activePoint.rides} 次 / 30天 费用读数
                </div>
                <div className="space-y-1.5 tabular-nums">
                  <div className="flex justify-between">
                    <span className="text-slate-600">满90打9折</span>
                    <span className="font-mono-tabular font-semibold text-slate-900">
                      ¥{activePoint.paygNew.toFixed(1)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-amber-700">35次卡 (¥190)</span>
                    <span className="font-mono-tabular font-semibold text-slate-900">
                      ¥{activePoint.pass35.toFixed(1)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-emerald-700">45次卡 (¥210)</span>
                    <span className="font-mono-tabular font-semibold text-slate-900">
                      ¥{activePoint.pass45.toFixed(1)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sky-700">60次卡 (¥270)</span>
                    <span className="font-mono-tabular font-semibold text-slate-900">
                      ¥{activePoint.pass60.toFixed(1)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-rose-700">90次卡 (¥390)</span>
                    <span className="font-mono-tabular font-semibold text-slate-900">
                      ¥{activePoint.pass90.toFixed(1)}
                    </span>
                  </div>
                </div>
                <p className="text-[11px] text-slate-400 pt-1">
                  虚线为当前估算的月乘车次数（{analysis.totalRidesCount}次）
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </section>
  );
};
