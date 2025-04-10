// 基本的な予測関数（Node.js）
function estimateOccupancy(zone, hour, weekday) {
    const zones = {
      "Zone A": { busyHours: [8, 9, 10, 16, 17, 18], base: 0.85 },
      "Zone B": { busyHours: [9, 10, 11, 17], base: 0.7 },
      "Zone C": { busyHours: [10, 11, 12, 13], base: 0.5 },
      "Zone D": { busyHours: [11, 12, 13], base: 0.4 }
    };
  
    const zoneInfo = zones[zone] || zones["Zone D"];
    const busyBoost = zoneInfo.busyHours.includes(hour) ? 0.1 : 0;
    const weekendBoost = (weekday === 0 || weekday === 6) ? -0.1 : 0;
  
    const estimated = Math.min(1, Math.max(0, zoneInfo.base + busyBoost + weekendBoost));
    return estimated;
  }

const result = estimateOccupancy("Zone A", 9, 1); // 月曜9時
console.log(result); // → 0.95 → 非常に混雑
