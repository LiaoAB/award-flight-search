# Award Flight Search

搜尋航空里程與點數兌換機票，整理航線、日期、所需點數與稅費。

## 目前功能

- 出發地、目的地、日期、來回／單程、艙等與乘客數查詢表單
- 主要 Star Alliance、oneworld、SkyTeam 與獨立航空里程計畫目錄
- 點數、稅費、飛行時間、直飛與艙等排序／篩選
- 結果收藏（使用瀏覽器 localStorage）
- 響應式介面，手機與桌面都可使用
- `AwardProvider` 的資料邊界已預留，方便接入即時庫存 API

## 本機執行

需要 Node.js 18 以上：

```bash
npm run check
npm start
```

開啟 <http://localhost:4173>。

## 即時資料整合說明

目前畫面中的航班是明確標示的 `Demo provider` 示範資料，不代表即時座位或保證可兌換。航空公司通常不提供公開的跨聯盟兌換座位 API；要做真實查詢，應在伺服器端建立 provider adapter，並依各服務的授權、速率限制與使用條款串接。

建議的 adapter 回傳格式：

```js
{
  source: "provider-name",
  fetchedAt: "2026-01-01T00:00:00Z",
  results: [{
    program: "aeroplan",
    airline: "Air Canada",
    flight: "AC 018",
    cabin: "business",
    points: 75000,
    taxes: 485,
    currency: "TWD",
    seats: 2,
    available: true
  }]
}
```

下一階段可加入：伺服器端 API、使用者帳號與點數餘額、真實機場資料、價格歷史、通知，以及由多個 provider 聚合與去重。
