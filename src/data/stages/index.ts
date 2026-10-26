/**
 * 國小二年級國語教育遊戲 - 全冊關卡資料匯總與元資料
 */

import { StageMeta } from '../../core/Types';
import stage0Questions from './stage0-dictionary.json';
import stage1Questions from './stage1-life.json';
import stage2Questions from './stage2-joy.json';
import stage3Questions from './stage3-stories.json';
import stage4Questions from './stage4-winter.json';
import stage5Questions from './stage5-reading.json';

export const ALL_STAGES: StageMeta[] = [
  {
    id: 0,
    slug: 'stage0-dictionary',
    title: '新秀春訓基地',
    subtitle: '首冊工具篇：查字典真簡單',
    description: '貓頭鷹總教練在春訓打擊籠等著你！學會部首分類、數外筆畫與查字典三步驟，打出第一支安打！',
    lessons: ['查字典真簡單'],
    icon: 'book-open',
    color: '#10B981', // 球場草皮綠
    questions: stage0Questions as any,
  },
  {
    id: 1,
    slug: 'stage1-life',
    title: '晨光熱身球場',
    subtitle: '第一單元：生活新鮮事',
    description: '晨光灑落少棒球場！補充元氣早餐、跑過社區紅土小巷，排列疊字短語，推進二壘得分圈！',
    lessons: ['第1課 新學年新希望', '第2課 一起做早餐', '第3課 走過小巷'],
    icon: 'sun',
    color: '#F59E0B', // 陽光金黃
    questions: stage1Questions as any,
  },
  {
    id: 2,
    slug: 'stage2-joy',
    title: '柿餅盃經典賽',
    subtitle: '第二單元：歡樂的時刻',
    description: '秋風吹拂金黃球場！擊出標點符號強勁平飛球，並照順敘棒次排列出香甜可口的曬柿工序！',
    lessons: ['第4課 運動會', '第5課 坐竹籃船', '第6課 小鎮的柿餅節'],
    icon: 'sparkles',
    color: '#EA580C', // 內野紅土橘
    questions: stage2Questions as any,
  },
  {
    id: 3,
    slug: 'stage3-stories',
    title: '曹沖全明星賽',
    subtitle: '第三單元：故事萬花筒',
    description: '全明星投手曹沖登板！看準多音字變化球選出等重好球，提取故事四要素擊出深遠長打！',
    lessons: ['第7課 國王的新衣裳', '第8課 「聰明」的小熊', '第9課 大象有多重？'],
    icon: 'scale',
    color: '#2563EB', // 明星賽皇家藍
    questions: stage3Questions as any,
  },
  {
    id: 4,
    slug: 'stage4-winter',
    title: '黑皮冬季聯盟',
    subtitle: '第四單元：冬天的悄悄話',
    description: '黑面琵鷺王牌外野手登場！幫忙組裝賀年卡應援信、運用比喻修辭，在守備中抓出錯別字！',
    lessons: ['第10課 新年快樂', '第11課 遠方來的黑皮', '第12課 我愛冬天'],
    icon: 'mail',
    color: '#E11D48', // 棒球縫線紅
    questions: stage4Questions as any,
  },
  {
    id: 5,
    slug: 'stage5-reading',
    title: '台灣大賽總冠軍戰',
    subtitle: '延伸篇章：閱讀階梯',
    description: '最終九局下半滿壘對決！閱讀長篇故事《我最喜歡上學了》，揮出再見滿貫全壘打，捧起總冠軍金盃！',
    lessons: ['閱讀階梯：我最喜歡上學了'],
    icon: 'award',
    color: '#7C3AED', // 榮譽紫金
    questions: stage5Questions as any,
  },
];

export function getStageById(id: number): StageMeta | undefined {
  return ALL_STAGES.find((s) => s.id === id);
}
