// 서버에 "2026/10/19/" 형태로 저장된 날짜를 "2026-10-19"로 보여준다.
export const formatDate = (s) =>
    (s ?? "").replace(/\/+$/, "").split("/").map((v, i) => (i === 0 ? v : v.padStart(2, "0"))).join("-");
