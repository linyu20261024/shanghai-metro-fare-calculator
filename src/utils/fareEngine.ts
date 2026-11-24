import { METRO_EDGES, METRO_LINES, STATIONS, type MetroStation } from '../data/shanghaiMetro';

export interface RouteSegment {
  line: string;
  lineName: string;
  lineColor: string;
  lineTextColor: string;
  fromStation: MetroStation;
  toStation: MetroStation;
  stationNames: string[];
  distanceKm: number;
}

export interface RouteResult {
  from: MetroStation;
  to: MetroStation;
  totalDistanceKm: number;
  estimatedMinutes: number;
  transferCount: number;
  segments: RouteSegment[];
  stationPath: MetroStation[];
  oldFare: number;
  newFare: number;
  fareDiff: number;
  fareDiffPercent: number;
}

export interface PassPlan {
  id: 'payg_new' | 'pass_35' | 'pass_45' | 'pass_60' | 'pass_90' | 'payg_old';
  name: string;
  shortName: string;
  description: string;
  passPrice: number;
  includedRides: number | null; // null for pay-as-you-go
  validityDays: number;
  totalMonthlyCost: number;
  effectivePerRide: number;
  spilloverRides: number;
  spilloverCost: number;
  wastedRides: number;
  discountSaved: number;
  savingsVsNewPayg: number;
  deltaVsOldRule: number;
  isRecommended: boolean;
  note: string;
}

export interface CommuteInput {
  commuteSingleFareNew: number;
  commuteSingleFareOld: number;
  commuteDaysPerWeek: number;
  tripsPerCommuteDay: number; // 1 = 单程, 2 = 往返
  cycleDays: number; // 默认 30 个自然日 (计次票有效期)
  extraRidesPerCycle: number; // 周末/非通勤乘车次数
  extraRideAvgFareNew: number;
  extraRideAvgFareOld: number;
}

export interface CommuteAnalysis {
  commuteRidesCount: number;
  extraRidesCount: number;
  totalRidesCount: number;
  plans: PassPlan[];
  bestNewPlan: PassPlan;
  newPaygPlan: PassPlan;
  oldBaselinePlan: PassPlan;
  thresholdCrossingRideIndex: number | null; // 满90元优惠在第几程触发
  breakEvenPoints: Array<{
    rides: number;
    paygNew: number;
    pass35: number;
    pass45: number;
    pass60: number;
    pass90: number;
  }>;
}

export const PASS_TIERS = [
  { id: 'pass_35' as const, name: '35次计次票', shortName: '35次卡', rides: 35, price: 190, unitPrice: 190 / 35 },
  { id: 'pass_45' as const, name: '45次计次票', shortName: '45次卡', rides: 45, price: 210, unitPrice: 210 / 45 },
  { id: 'pass_60' as const, name: '60次计次票', shortName: '60次卡', rides: 60, price: 270, unitPrice: 270 / 60 },
  { id: 'pass_90' as const, name: '90次计次票', shortName: '90次卡', rides: 90, price: 390, unitPrice: 390 / 90 },
];

export const NEW_FARE_BRACKETS = [
  { range: '0 ~ 4 km', min: 0, max: 4, newPrice: 3, oldPrice: 3, note: '起步区间由6km缩至4km' },
  { range: '4 ~ 6 km', min: 4, max: 6, newPrice: 4, oldPrice: 3, note: '原3元区间，新规调至4元' },
  { range: '6 ~ 8 km', min: 6, max: 8, newPrice: 4, oldPrice: 4, note: '维持4元不变' },
  { range: '8 ~ 12 km', min: 8, max: 12, newPrice: 5, oldPrice: 4, note: '原4元区间，新规调至5元' },
  { range: '12 ~ 16 km', min: 12, max: 16, newPrice: 6, oldPrice: 4, note: '原4元区间，新规调至6元' },
  { range: '16 ~ 23 km', min: 16, max: 23, newPrice: 7, oldPrice: 5, note: '每7km加1元递远递减' },
  { range: '23 ~ 26 km', min: 23, max: 26, newPrice: 8, oldPrice: 5, note: '跨段较明显区域' },
  { range: '26 ~ 30 km', min: 26, max: 30, newPrice: 8, oldPrice: 6, note: '23~30km统一为8元' },
  { range: '30 ~ 36 km', min: 30, max: 36, newPrice: 9, oldPrice: 6, note: '进入每10km加1元区间' },
  { range: '36 ~ 40 km', min: 36, max: 40, newPrice: 9, oldPrice: 7, note: '30~40km统一为9元' },
  { range: '40 ~ 50 km', min: 40, max: 50, newPrice: 10, oldPrice: 7, note: '46~50km旧票价为8元' },
  { range: '50 km 以上', min: 50, max: Infinity, newPrice: 11, oldPrice: 8, note: '每15km加1元（旧规每10km）' },
];

/** Haversine great-circle distance in km */
export function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export interface NearestStationMatch {
  station: MetroStation;
  distanceKm: number;
}

export function findNearestStations(lat: number, lng: number, limit = 3): NearestStationMatch[] {
  return STATIONS.map((station) => ({
    station,
    distanceKm: haversineKm(lat, lng, station.lat, station.lng),
  }))
    .sort((a, b) => a.distanceKm - b.distanceKm)
    .slice(0, limit);
}

/**
 * 旧票价（2005年9月—2026年11月30日）：
 * 0-6公里 3元；6公里以上每10公里加1元
 */
export function calculateOldFare(distanceKm: number): number {
  if (distanceKm <= 0) return 3;
  if (distanceKm <= 6) return 3;
  return 3 + Math.ceil((distanceKm - 6) / 10);
}

/**
 * 新票价（2026年12月1日起实施）：
 * 0-4km: 3元
 * 后续每 4, 4, 4, 7, 7, 10, 10 公里加1元：
 *   4-8: 4元, 8-12: 5元, 12-16: 6元, 16-23: 7元, 23-30: 8元, 30-40: 9元, 40-50: 10元
 * 50公里以上每15公里加1元
 */
export function calculateNewFare(distanceKm: number): number {
  if (distanceKm <= 4) return 3;
  if (distanceKm <= 8) return 4;
  if (distanceKm <= 12) return 5;
  if (distanceKm <= 16) return 6;
  if (distanceKm <= 23) return 7;
  if (distanceKm <= 30) return 8;
  if (distanceKm <= 40) return 9;
  if (distanceKm <= 50) return 10;
  return 10 + Math.ceil((distanceKm - 50) / 15);
}

/** Dijkstra shortest rail-distance path between two stations */
export function findShortestMetroRoute(fromId: string, toId: string): RouteResult | null {
  const stationMap = new Map(STATIONS.map((s) => [s.id, s]));
  const from = stationMap.get(fromId);
  const to = stationMap.get(toId);
  if (!from || !to) return null;

  if (fromId === toId) {
    return {
      from,
      to,
      totalDistanceKm: 0,
      estimatedMinutes: 3,
      transferCount: 0,
      segments: [],
      stationPath: [from],
      oldFare: 3,
      newFare: 3,
      fareDiff: 0,
      fareDiffPercent: 0,
    };
  }

  // Build adjacency list
  const adj = new Map<string, Array<{ to: string; line: string; distanceKm: number }>>();
  for (const s of STATIONS) adj.set(s.id, []);
  for (const edge of METRO_EDGES) {
    adj.get(edge.from)?.push({ to: edge.to, line: edge.line, distanceKm: edge.distanceKm });
    adj.get(edge.to)?.push({ to: edge.from, line: edge.line, distanceKm: edge.distanceKm });
  }

  // State: node + small tie-breaker penalty for unnecessary transfers so natural single-line paths win
  const dist = new Map<string, number>();
  const prev = new Map<string, { nodeId: string; line: string; edgeDist: number } | null>();
  const visited = new Set<string>();

  for (const s of STATIONS) {
    dist.set(s.id, Infinity);
    prev.set(s.id, null);
  }
  dist.set(fromId, 0);

  while (true) {
    let u: string | null = null;
    let best = Infinity;
    for (const [id, d] of dist.entries()) {
      if (!visited.has(id) && d < best) {
        best = d;
        u = id;
      }
    }
    if (u === null || u === toId) break;
    visited.add(u);

    const prevLine = prev.get(u)?.line;
    for (const neighbor of adj.get(u) ?? []) {
      if (visited.has(neighbor.to)) continue;
      // Add tiny 0.05km virtual penalty for changing lines so equal-distance paths avoid redundant transfers
      const transferBias = prevLine && prevLine !== neighbor.line ? 0.05 : 0;
      const alt = best + neighbor.distanceKm + transferBias;
      if (alt < (dist.get(neighbor.to) ?? Infinity)) {
        dist.set(neighbor.to, alt);
        prev.set(neighbor.to, { nodeId: u, line: neighbor.line, edgeDist: neighbor.distanceKm });
      }
    }
  }

  if (!prev.get(toId)) return null;

  // Reconstruct edges
  const rawSteps: Array<{ from: MetroStation; to: MetroStation; line: string; distanceKm: number }> = [];
  let curr: string | null = toId;
  while (curr && curr !== fromId) {
    const p = prev.get(curr);
    if (!p) break;
    rawSteps.unshift({
      from: stationMap.get(p.nodeId)!,
      to: stationMap.get(curr)!,
      line: p.line,
      distanceKm: p.edgeDist,
    });
    curr = p.nodeId;
  }

  const stationPath: MetroStation[] = [from, ...rawSteps.map((st) => st.to)];
  const totalDistanceKm = Number(
    rawSteps.reduce((sum, st) => sum + st.distanceKm, 0).toFixed(1)
  );

  // Merge consecutive steps on the same line into RouteSegments
  const segments: RouteSegment[] = [];
  for (const step of rawSteps) {
    const lineInfo = METRO_LINES[step.line] ?? {
      id: step.line,
      name: `${step.line}号线`,
      shortName: step.line,
      color: '#475569',
      textColor: '#FFFFFF',
    };
    const last = segments[segments.length - 1];
    if (last && last.line === step.line) {
      last.toStation = step.to;
      last.stationNames.push(step.to.name);
      last.distanceKm = Number((last.distanceKm + step.distanceKm).toFixed(1));
    } else {
      segments.push({
        line: step.line,
        lineName: lineInfo.name,
        lineColor: lineInfo.color,
        lineTextColor: lineInfo.textColor,
        fromStation: step.from,
        toStation: step.to,
        stationNames: [step.from.name, step.to.name],
        distanceKm: Number(step.distanceKm.toFixed(1)),
      });
    }
  }

  const transferCount = Math.max(0, segments.length - 1);
  // Rough realistic metro timing: ~38 km/h average + 4 min per transfer + 2 min boarding
  const estimatedMinutes = Math.max(4, Math.round((totalDistanceKm / 36) * 60 + transferCount * 4 + 2));

  const oldFare = calculateOldFare(totalDistanceKm);
  const newFare = calculateNewFare(totalDistanceKm);
  const fareDiff = newFare - oldFare;
  const fareDiffPercent = oldFare > 0 ? Math.round((fareDiff / oldFare) * 100) : 0;

  return {
    from,
    to,
    totalDistanceKm,
    estimatedMinutes,
    transferCount,
    segments,
    stationPath,
    oldFare,
    newFare,
    fareDiff,
    fareDiffPercent,
  };
}

/**
 * 模拟单一自然月/30天内按次累计满额9折消费：
 * 当累计实付金额 >= threshold 元时，后续乘车享9折（超出部分打9折）。
 */
export function simulateThresholdDiscount(
  rideFares: number[],
  threshold: number
): { totalPaid: number; discountSaved: number; crossingIndex: number | null } {
  let cumulative = 0;
  let totalOriginal = 0;
  let crossingIndex: number | null = null;

  for (let i = 0; i < rideFares.length; i++) {
    const fare = rideFares[i];
    totalOriginal += fare;
    if (cumulative >= threshold) {
      cumulative += fare * 0.9;
    } else if (cumulative + fare > threshold) {
      // 仅超出门槛的部分享9折（若单笔跨过门槛）
      const before = threshold - cumulative;
      const after = (fare - before) * 0.9;
      cumulative += before + after;
      if (crossingIndex === null) crossingIndex = i + 1;
    } else {
      cumulative += fare;
      if (cumulative >= threshold && crossingIndex === null) {
        crossingIndex = i + 1;
      }
    }
  }

  const totalPaid = Number(cumulative.toFixed(2));
  const discountSaved = Number((totalOriginal - totalPaid).toFixed(2));
  return { totalPaid, discountSaved, crossingIndex };
}

export function analyzeCommuteStrategies(input: CommuteInput): CommuteAnalysis {
  const weeksInCycle = input.cycleDays / 7;
  const commuteRidesCount = Math.max(
    0,
    Math.round(input.commuteDaysPerWeek * input.tripsPerCommuteDay * weeksInCycle)
  );
  const extraRidesCount = Math.max(0, Math.round(input.extraRidesPerCycle));
  const totalRidesCount = commuteRidesCount + extraRidesCount;

  // Build ordered list of ride fares (highest fares first for pass allocation; chronological/interleaved for PAYG)
  const newRideFaresInterleaved: number[] = [];
  const oldRideFaresInterleaved: number[] = [];

  for (let i = 0; i < commuteRidesCount; i++) {
    newRideFaresInterleaved.push(input.commuteSingleFareNew);
    oldRideFaresInterleaved.push(input.commuteSingleFareOld);
  }
  for (let i = 0; i < extraRidesCount; i++) {
    newRideFaresInterleaved.push(input.extraRideAvgFareNew);
    oldRideFaresInterleaved.push(input.extraRideAvgFareOld);
  }

  // Sort descending when allocating multi-ride pass (smart commuter uses pass for long/expensive rides, pays cash for short ones if spillover occurs)
  const newFaresSortedDesc = [...newRideFaresInterleaved].sort((a, b) => b - a);

  const newPaygSim = simulateThresholdDiscount(newRideFaresInterleaved, 90);
  const oldPaygSim = simulateThresholdDiscount(oldRideFaresInterleaved, 70);

  const newPaygPlan: PassPlan = {
    id: 'payg_new',
    name: '新规单程累计（满90元享9折）',
    shortName: '满90打9折',
    description: '同一渠道自然月累计满90元后，后续乘车享9折',
    passPrice: 0,
    includedRides: null,
    validityDays: input.cycleDays,
    totalMonthlyCost: newPaygSim.totalPaid,
    effectivePerRide: totalRidesCount > 0 ? Number((newPaygSim.totalPaid / totalRidesCount).toFixed(2)) : 0,
    spilloverRides: 0,
    spilloverCost: 0,
    wastedRides: 0,
    discountSaved: newPaygSim.discountSaved,
    savingsVsNewPayg: 0,
    deltaVsOldRule: Number((newPaygSim.totalPaid - oldPaygSim.totalPaid).toFixed(2)),
    isRecommended: false,
    note:
      newPaygSim.crossingIndex !== null
        ? `第 ${newPaygSim.crossingIndex} 程跨过90元门槛，累计省 ¥${newPaygSim.discountSaved.toFixed(1)}`
        : '未满90元门槛，按新规标准单程票价计费',
  };

  const oldBaselinePlan: PassPlan = {
    id: 'payg_old',
    name: '调价前基准（旧票价 + 满70元9折）',
    shortName: '调价前原价',
    description: '2026年11月30日前执行的旧里程票价及满70元9折规则',
    passPrice: 0,
    includedRides: null,
    validityDays: input.cycleDays,
    totalMonthlyCost: oldPaygSim.totalPaid,
    effectivePerRide: totalRidesCount > 0 ? Number((oldPaygSim.totalPaid / totalRidesCount).toFixed(2)) : 0,
    spilloverRides: 0,
    spilloverCost: 0,
    wastedRides: 0,
    discountSaved: oldPaygSim.discountSaved,
    savingsVsNewPayg: Number((newPaygSim.totalPaid - oldPaygSim.totalPaid).toFixed(2)),
    deltaVsOldRule: 0,
    isRecommended: false,
    note:
      oldPaygSim.crossingIndex !== null
        ? `旧规第 ${oldPaygSim.crossingIndex} 程跨过70元门槛`
        : '旧规未满70元门槛',
  };

  const passPlans: PassPlan[] = PASS_TIERS.map((tier) => {
    // Pass covers up to `tier.rides` highest-fare rides; remaining rides pay PAYG (with 90 RMB threshold starting from 0 since pass does not count toward 90 RMB threshold)
    const remainingFares = newFaresSortedDesc.slice(tier.rides);
    const spilloverSim = simulateThresholdDiscount(remainingFares, 90);
    const totalCost = Number((tier.price + spilloverSim.totalPaid).toFixed(2));
    const wastedRides = Math.max(0, tier.rides - totalRidesCount);
    const spilloverRides = remainingFares.length;

    let note = '';
    if (spilloverRides > 0) {
      note = `超出 ${spilloverRides} 次按单程补足 ¥${spilloverSim.totalPaid.toFixed(1)}`;
    } else if (wastedRides > 0) {
      note = `周期内预计剩余 ${wastedRides} 次未使用`;
    } else {
      note = '次数与通勤需求完全匹配';
    }

    return {
      id: tier.id,
      name: tier.name,
      shortName: tier.shortName,
      description: `${tier.rides} 次 / 30天有效（折合 ¥${tier.unitPrice.toFixed(2)}/次），不与满90元9折同享`,
      passPrice: tier.price,
      includedRides: tier.rides,
      validityDays: 30,
      totalMonthlyCost: totalCost,
      effectivePerRide: totalRidesCount > 0 ? Number((totalCost / totalRidesCount).toFixed(2)) : tier.unitPrice,
      spilloverRides,
      spilloverCost: spilloverSim.totalPaid,
      wastedRides,
      discountSaved: spilloverSim.discountSaved,
      savingsVsNewPayg: Number((newPaygSim.totalPaid - totalCost).toFixed(2)),
      deltaVsOldRule: Number((totalCost - oldPaygSim.totalPaid).toFixed(2)),
      isRecommended: false,
      note,
    };
  });

  const newOptions = [newPaygPlan, ...passPlans];
  let bestNewPlan = newPaygPlan;
  for (const plan of newOptions) {
    if (plan.totalMonthlyCost < bestNewPlan.totalMonthlyCost) {
      bestNewPlan = plan;
    }
  }
  bestNewPlan.isRecommended = true;

  // Generate break-even chart points across 10 to 95 rides using the commute single fare
  const breakEvenPoints: CommuteAnalysis['breakEvenPoints'] = [];
  for (let r = 10; r <= 95; r += 5) {
    const fares = Array(r).fill(input.commuteSingleFareNew);
    const payg = simulateThresholdDiscount(fares, 90).totalPaid;
    const calcPass = (limit: number, price: number) => {
      const extra = fares.slice(limit);
      return Number((price + simulateThresholdDiscount(extra, 90).totalPaid).toFixed(1));
    };
    breakEvenPoints.push({
      rides: r,
      paygNew: payg,
      pass35: calcPass(35, 190),
      pass45: calcPass(45, 210),
      pass60: calcPass(60, 270),
      pass90: calcPass(90, 390),
    });
  }

  return {
    commuteRidesCount,
    extraRidesCount,
    totalRidesCount,
    plans: [newPaygPlan, ...passPlans, oldBaselinePlan],
    bestNewPlan,
    newPaygPlan,
    oldBaselinePlan,
    thresholdCrossingRideIndex: newPaygSim.crossingIndex,
    breakEvenPoints,
  };
}
