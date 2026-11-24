import React from 'react';
import { NEW_FARE_BRACKETS, PASS_TIERS } from '../utils/fareEngine';

export const FareRulesMatrix: React.FC = () => {
  return (
    <section id="fare-rules" className="space-y-6">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-slate-900">
          2026年12月上海地铁票价与优惠调整对照
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          依据上海地铁官方公告（service.shmetro.com/yygg/5747.htm）：2026年12月1日起执行新票价，计次票11月26日开售。
        </p>
      </div>

      {/* 三大核心政策变化 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-slate-200 rounded-lg p-5">
          <div className="text-xs font-semibold text-slate-500 mb-1.5">01. 起乘与分段调整</div>
          <div className="text-base font-bold text-slate-900 mb-2">
            起乘价 3 元不变 · 距缩至 4 公里
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            0~4公里维持3元起步；随后按每 4、4、4、7、7、10、10 公里加1元，50公里以上每15公里加1元。磁浮线、金山铁路、市域机场线票价不变。
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-5">
          <div className="text-xs font-semibold text-slate-500 mb-1.5">02. 月度满额优惠门槛</div>
          <div className="text-base font-bold text-slate-900 mb-2">
            满 70 元打 9 折 → 满 90 元打 9 折
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            同一支付渠道（交通卡、银联卡、数字人民币、Metro大都会、随申码等）自然月累计消费满90元后，超出部分享9折，且覆盖扩大至全支付方式与市域线。
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-5">
          <div className="text-xs font-semibold text-slate-500 mb-1.5">03. 新增官方计次票</div>
          <div className="text-base font-bold text-slate-900 mb-2">
            四档次卡 · 30天内不限乘距
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            推出 35次/190元、45次/210元、60次/270元、90次/390元 四档套餐，自激活日起30个自然日有效。按次扣费、不分乘距，不与满90元9折同享。
          </p>
        </div>
      </div>

      {/* 两表并排：里程票价对照 + 计次票折算 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-lg overflow-hidden">
          <div className="px-5 py-3.5 border-b border-slate-200 bg-slate-50/70">
            <h3 className="text-sm font-semibold text-slate-900">新旧里程计价分段对比</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500">
                  <th className="py-2.5 px-4 font-semibold">乘车里程</th>
                  <th className="py-2.5 px-4 text-right font-semibold">旧票价</th>
                  <th className="py-2.5 px-4 text-right font-semibold">新票价</th>
                  <th className="py-2.5 px-4 text-right font-semibold">单程变化</th>
                  <th className="py-2.5 px-4 font-semibold">区间说明</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {NEW_FARE_BRACKETS.map((row) => {
                  const diff = row.newPrice - row.oldPrice;
                  return (
                    <tr key={row.range} className="hover:bg-slate-50/60">
                      <td className="py-2.5 px-4 font-medium text-slate-900 font-mono-tabular whitespace-nowrap">
                        {row.range}
                      </td>
                      <td className="py-2.5 px-4 text-right font-mono-tabular text-slate-500">
                        ¥{row.oldPrice}
                      </td>
                      <td className="py-2.5 px-4 text-right font-mono-tabular font-semibold text-slate-900">
                        ¥{row.newPrice}
                      </td>
                      <td className="py-2.5 px-4 text-right font-mono-tabular">
                        {diff > 0 ? (
                          <span className="text-rose-600 font-medium">+¥{diff}</span>
                        ) : (
                          <span className="text-emerald-700">持平</span>
                        )}
                      </td>
                      <td className="py-2.5 px-4 text-slate-500">{row.note}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-lg overflow-hidden flex flex-col">
          <div className="px-5 py-3.5 border-b border-slate-200 bg-slate-50/70">
            <h3 className="text-sm font-semibold text-slate-900">官方计次票套餐速查</h3>
          </div>
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500">
                  <th className="py-2.5 px-4 font-semibold">套餐档位</th>
                  <th className="py-2.5 px-4 text-right font-semibold">售价</th>
                  <th className="py-2.5 px-4 text-right font-semibold">折合单次</th>
                  <th className="py-2.5 px-4 font-semibold">适用人群</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {PASS_TIERS.map((tier) => {
                  const fitNote =
                    tier.rides === 35
                      ? '含节假日/出差弹性通勤'
                      : tier.rides === 45
                      ? '标准5天双休工作日往返'
                      : tier.rides === 60
                      ? '高频通勤 + 周末跨区出行'
                      : '单双休/超高频每日3次以上';
                  return (
                    <tr key={tier.id} className="hover:bg-slate-50/60">
                      <td className="py-3 px-4 font-semibold text-slate-900 whitespace-nowrap">
                        {tier.name}
                      </td>
                      <td className="py-3 px-4 text-right font-mono-tabular font-semibold text-slate-900">
                        ¥{tier.price}
                      </td>
                      <td className="py-3 px-4 text-right font-mono-tabular text-rose-600 font-semibold">
                        ¥{tier.unitPrice.toFixed(2)}
                      </td>
                      <td className="py-3 px-4 text-slate-600">{fitNote}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="p-4 bg-slate-50 border-t border-slate-100 text-xs text-slate-600 leading-relaxed">
            <strong>快速判断口诀：</strong>若单程新票价为 <strong>¥3~¥4</strong>，即使满勤也建议优先使用“满90元9折”；若单程新票价 <strong>≥¥5</strong> 且每周通勤 ≥4 天，购买对应档位计次票通常可立省 10%–35%。
          </div>
        </div>
      </div>
    </section>
  );
};
