import { defineStore } from 'pinia'
import type { NewsInter } from '@/types/new'

export const useNewsStore = defineStore('newsData', () => {
  const initialData = {
    content: 'ut voluptate reprehenderit Duis reprehenderit quis pariatur adipiscing in labore officia aliquip esse dolor sint magna sint aute elit magna aliqua Lorem sunt sint dolor in deserunt laboris enim ad pariatur irure ipsum ut esse in nostrud do ea Duis in laborum mollit in officia in veniam sit minim nulla voluptate incididunt dolore labore dolor aliquip ullamco Duis commodo ut aliqua officia non minim laborum laboris nisi labore ipsum tempor ut consectetur ipsum occaecat et Ut dolore Sed sint nostrud laborum Duis sint non Sed tempor cupidatat sit Sed culpa laboris Excepteur Excepteur id esse nisi nostrud aute elit officia eiusmod esse Ut adipiscing proident ipsum sint in aliqua voluptate cillum commodo in laboris esse ad qui amet ad nulla et anim proident esse ea veniam quis aute sit eiusmod eiusmod reprehenderit ullamco irure dolor ad esse non amet nisi ad dolore minim sunt ut fugiat offici',
    date: new Date().toISOString().split('T')[0],
    id: 1,
    imageUrl: 'https://cdn.pixabay.com/photo/2024/02/23/21/25/landscape-8592826_640.jpg',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    videoUrl: 'https://cdn.pixabay.com/video/2020/05/07/38388-418005845_large.mp4',
    tags: ['Tagqhkajh', 'Tagkt0e8s'],
    title: 'consectetur consectetur Lorem Lorem labore Sed et elit eiusm',
  }

  const newsData = ref<NewsInter>({ ...initialData })

  // 初始化数据
  const initializeData = () => {
    newsData.value = { ...initialData }
  }

  // 更新数据
  const updateData = (newData: NewsInter) => {
    newsData.value = { ...newData }
  }

  return {
    newsData,
    initializeData,
    updateData,
  }
}, {
  persist: true, // 支持持久化
})
