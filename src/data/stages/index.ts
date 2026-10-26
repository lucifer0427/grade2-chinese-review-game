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
    title: '字典神木林',
    subtitle: '首冊工具篇：查字典真簡單',
    description: '貓頭鷹館長在神木樹洞裡等著你！學會部首分類、數外筆畫與查字典三步驟，解開智慧寶箱！',
    lessons: ['查字典真簡單'],
    icon: 'book-open',
    color: '#10B981', // 森林翠綠
    questions: stage0Questions as any,
  },
  {
    id: 1,
    slug: 'stage1-life',
    title: '晨光小廚房',
    subtitle: '第一單元：生活新鮮事',
    description: '晨光灑落小廚房！和家人一起做早餐、漫步社區小巷，排列疊字短語，搭上美味列車！',
    lessons: ['第1課 新學年新希望', '第2課 一起做早餐', '第3課 走過小巷'],
    icon: 'sun',
    color: '#F59E0B', // 陽光金黃
    questions: stage1Questions as any,
  },
  {
    id: 2,
    slug: 'stage2-joy',
    title: '秋日柿餅節',
    subtitle: '第二單元：歡樂的時刻',
    description: '秋風吹拂金黃柿子！發射標點大砲，並依照順敘時間軸，排列出香甜可口的曬柿工序！',
    lessons: ['第4課 運動會', '第5課 坐竹籃船', '第6課 小鎮的柿餅節'],
    icon: 'sparkles',
    color: '#FB923C', // 柿子暖橘
    questions: stage2Questions as any,
  },
  {
    id: 3,
    slug: 'stage3-stories',
    title: '智慧天平館',
    subtitle: '第三單元：故事萬花筒',
    description: '曹沖正在河邊稱大象！辨析多音字選出等重石頭維持天平平衡，提取故事四要素！',
    lessons: ['第7課 國王的新衣裳', '第8課 「聰明」的小熊', '第9課 大象有多重？'],
    icon: 'scale',
    color: '#6366F1', // 智慧靛藍
    questions: stage3Questions as any,
  },
  {
    id: 4,
    slug: 'stage4-winter',
    title: '冬日候鳥郵局',
    subtitle: '第四單元：冬天的悄悄話',
    description: '黑面琵鷺信差飛來了！幫忙組裝賀年卡格式，運用生動比喻修辭，抓出悄悄藏著的錯別字！',
    lessons: ['第10課 新年快樂', '第11課 遠方來的黑皮', '第12課 我愛冬天'],
    icon: 'mail',
    color: '#EC4899', // 溫暖粉紅
    questions: stage4Questions as any,
  },
  {
    id: 5,
    slug: 'stage5-reading',
    title: '冒險畢業典禮',
    subtitle: '延伸篇章：閱讀階梯',
    description: '恭喜來到最終試煉！閱讀長篇故事《我最喜歡上學了》，挑戰理解提取與推理，獲得榮譽小學士勳章！',
    lessons: ['閱讀階梯：我最喜歡上學了'],
    icon: 'award',
    color: '#8B5CF6', // 榮譽紫羅蘭
    questions: stage5Questions as any,
  },
];

export function getStageById(id: number): StageMeta | undefined {
  return ALL_STAGES.find((s) => s.id === id);
}
