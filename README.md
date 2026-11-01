# Award Flight Search

搜尋航空里程與點數兌換機票，整理航線、日期、所需點數與稅費。

## 目前功能

- 出發地、目的地、日期、來回／單程、艙等與乘客數查詢表單
- 主要 Star Alliance、oneworld、SkyTeam 與獨立航空里程計畫目錄
- 點數、稅費、飛行時間、直飛與艙等排序／篩選
- 結果收藏（使用瀏覽器 localStorage）
- 響應式介面，手機與桌面都可使用
- `AwardProvider` 的資料邊界已預留，方便接入即時庫存 API
- Seats.aero Partner API adapter：支援 `cached` 與需商業授權的 `live` 模式

## 本機執行

需要 Node.js 18 以上：

```bash
npm run check
npm start
```

開啟 <http://localhost:4173>。

## 接入 Seats.aero

1. 複製環境變數範例：`cp .env.example .env`
2. 將 `SEATS_AERO_API_KEY` 設為你的 Partner API key。
3. 啟動伺服器（Node 不會自動載入 `.env`，可先用 shell 匯入）：

```bash
set -a; source .env; set +a
npm start
```

預設 `SEATS_AERO_MODE=cached`，會查詢近期已抓取的兌換庫存；設定 `SEATS_AERO_MODE=live` 會逐一查詢支援的里程計畫，但 Seats.aero 官方目前要求 live search 具備商業協議。API key 一律由 Node server 保存，瀏覽器只呼叫本專案的 `/api/search`，不會暴露密鑰。

## 即時資料整合說明

沒有設定 `SEATS_AERO_API_KEY` 時，畫面會回退到明確標示的 `Demo provider` 示範資料，不代表即時座位或保證可兌換。即使 API 回傳可兌換，座位也可能在前往航空公司官網時被其他旅客訂走，仍應在付款前再次確認。

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
