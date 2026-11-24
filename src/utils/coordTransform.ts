const PI = Math.PI;
const A = 6378245.0;
const EE = 0.00669342162296594323;

function outOfChina(lat: number, lng: number): boolean {
  return lng < 72.004 || lng > 137.8347 || lat < 0.8293 || lat > 55.8271;
}

function transformLat(x: number, y: number): number {
  let ret =
    -100.0 +
    2.0 * x +
    3.0 * y +
    0.2 * y * y +
    0.1 * x * y +
    0.2 * Math.sqrt(Math.abs(x));
  ret += ((20.0 * Math.sin(6.0 * x * PI) + 20.0 * Math.sin(2.0 * x * PI)) * 2.0) / 3.0;
  ret += ((20.0 * Math.sin(y * PI) + 40.0 * Math.sin((y / 3.0) * PI)) * 2.0) / 3.0;
  ret += ((160.0 * Math.sin((y / 12.0) * PI) + 320 * Math.sin((y * PI) / 30.0)) * 2.0) / 3.0;
  return ret;
}

function transformLng(x: number, y: number): number {
  let ret =
    300.0 +
    x +
    2.0 * y +
    0.1 * x * x +
    0.1 * x * y +
    0.1 * Math.sqrt(Math.abs(x));
  ret += ((20.0 * Math.sin(6.0 * x * PI) + 20.0 * Math.sin(2.0 * x * PI)) * 2.0) / 3.0;
  ret += ((20.0 * Math.sin(x * PI) + 40.0 * Math.sin((x / 3.0) * PI)) * 2.0) / 3.0;
  ret += ((150.0 * Math.sin((x / 12.0) * PI) + 300.0 * Math.sin((x / 30.0) * PI)) * 2.0) / 3.0;
  return ret;
}

/** 高德 / 腾讯 GCJ-02（火星坐标）转 WGS-84 */
export function gcj02ToWgs84(gcjLat: number, gcjLng: number): { lat: number; lng: number } {
  if (outOfChina(gcjLat, gcjLng)) {
    return { lat: gcjLat, lng: gcjLng };
  }
  let dLat = transformLat(gcjLng - 105.0, gcjLat - 35.0);
  let dLng = transformLng(gcjLng - 105.0, gcjLat - 35.0);
  const radLat = (gcjLat / 180.0) * PI;
  let magic = Math.sin(radLat);
  magic = 1 - EE * magic * magic;
  const sqrtMagic = Math.sqrt(magic);
  dLat = (dLat * 180.0) / (((A * (1 - EE)) / (magic * sqrtMagic)) * PI);
  dLng = (dLng * 180.0) / ((A / sqrtMagic) * Math.cos(radLat) * PI);
  return {
    lat: gcjLat - dLat,
    lng: gcjLng - dLng,
  };
}

/** 百度 BD-09 转 GCJ-02 */
export function bd09ToGcj02(bdLat: number, bdLng: number): { lat: number; lng: number } {
  const xPi = (PI * 3000.0) / 180.0;
  const x = bdLng - 0.0065;
  const y = bdLat - 0.006;
  const z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * xPi);
  const theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * xPi);
  return {
    lat: z * Math.sin(theta),
    lng: z * Math.cos(theta),
  };
}

/** 百度 BD-09 转 WGS-84 */
export function bd09ToWgs84(bdLat: number, bdLng: number): { lat: number; lng: number } {
  const gcj = bd09ToGcj02(bdLat, bdLng);
  return gcj02ToWgs84(gcj.lat, gcj.lng);
}
