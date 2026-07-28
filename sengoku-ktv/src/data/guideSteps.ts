export interface GuideStep {
  id: string
  title: string
  body: string
  /** Matches [data-guide="..."] */
  target?: string
  /** Open this collapsible panel while the step is active */
  openPanel?: 'modes' | 'fate'
}

export const GUIDE_STEPS: GuideStep[] = [
  {
    id: 'prologue',
    title: '亂世序章',
    body:
      '傳說在遙遠的「歌國」，諸侯並非以刀劍定勝負，而是以歌聲爭奪天下。今夜，你們幾位大名齊聚包廂，名義上是歡唱，實際上——合戰，已經開始了。',
  },
  {
    id: 'rules',
    title: '合戰法則',
    body:
      '每一首預排之曲唱畢，眾人公開投票，點出本輪「戰犯」。被點中者必須轉動天命之輪，抽出軍令：可能是插播、點將、罰唱、乾杯，或偶爾的喘息。效果立刻執行，或在下一首兌現。',
    target: 'brand',
  },
  {
    id: 'modes',
    title: '戰場旗幟',
    body:
      '此處可升起四面白旗：酒精、食物、殘酷、互動。旗未升時為「標準模式」，較溫和；旗一升，對應的狠招與酒食軍令才會進入轉盤。開戰前先談好規則，免得失和。',
    target: 'modes',
    openPanel: 'modes',
  },
  {
    id: 'fate',
    title: '命運藏寶庫',
    body:
      '所有預設軍令都收在這裡，也可自訂專屬命運。不想抽到的，就先關閉；想惡作劇的，就寫一條新令。啟用數量會顯示在標題旁，方便確認今夜有多少條路可走。',
    target: 'fate',
    openPanel: 'fate',
  },
  {
    id: 'wheel',
    title: '天命之輪',
    body:
      '被投出的那位，點擊轉盤即可開戰。輪盤旋轉三秒後，命運會以方框罩住全場——看清楚標題與說明，按「知道了」再執行。最近抽過的效果會降低再出現機率，以免老是同一招。',
    target: 'wheel',
  },
  {
    id: 'history',
    title: '戰報竹簡',
    body:
      '此處記下今夜已降下的軍令。若機率被歷史壓得太歪，或想重開一局，可清除紀錄——命運權重也會一併歸零，宛如另起爐灶。',
    target: 'history',
  },
  {
    id: 'epilogue',
    title: '出征之前',
    body:
      '記住：歌單已預點，不能指定「下一首要唱哪首」，只能「插播」加塞一首。多數軍令作用在被抽中的人，或全軍一起執行。準備好了嗎？點擊問號可隨時重溫本導覽。願今夜——歌聲震天下。',
    target: 'help',
  },
]
