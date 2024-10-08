<template>
  <div
    class="f-c w-full px-3 sm:px-4 md:px-6"
    data-testid="container"
  >
    <div
      ref="inputAreaRef"
      class="f-c-b relative min-h-10 w-full rounded border border-blue-500 pl-2 pr-1 sm:min-h-12 xl:min-h-14"
      :class="{
        'ring-2 ring-blue-100': showDropdownMenu,
        'border-none': showRemainingTags,
      }"
      data-testid="input-area"
    >
      <div
        ref="tagsAreaRef"
        class="f-c grow space-x-2"
      >
        <!-- 已选择的标签展示区域 -->
        <div
          v-if="selectedTags.length > 0"
          class="flex shrink-0 items-center space-x-1.5"
          data-testid="selected-tags"
          @mousedown="preventBlur"
        >
          <template
            v-for="(item, index) in displayedLabels"
            :key="item.id"
          >
            <!-- 标签 -->
            <div
              class="f-c h-7 rounded bg-gray-100 text-gray-800 sm:h-9 xl:h-10"
              data-testid="tag-element"
            >
              <div class="pl-2 xl:pl-3 xl:pr-1" @click="fieldRef?.focus()">
                <p class="text-xs leading-7 xl:text-sm">{{ item.label }}</p>
              </div>
              <div
                class="f-c-c h-full cursor-pointer px-2"
                data-testid="delete-button"
                @click="tagDelete(index)"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  class="size-4"
                >
                  <path d="M5.28 4.22a.75.75 0 0 0-1.06 1.06L6.94 8l-2.72 2.72a.75.75 0 1 0 1.06 1.06L8 9.06l2.72 2.72a.75.75 0 1 0 1.06-1.06L9.06 8l2.72-2.72a.75.75 0 0 0-1.06-1.06L8 6.94 5.28 4.22Z" />
                </svg>
              </div>
            </div>
          </template>
          <!-- 溢出标签展示 -->
          <div
            v-if="hiddenCount > 0"
            class="f-c-c h-7 min-w-10 max-w-12 shrink-0 cursor-pointer rounded bg-gray-100 px-2 text-gray-800 sm:h-9 xl:h-10"
            data-testid="overflow-button"
            @click="toggleRemainingTags"
          >
            <p class="line-1 text-xs leading-7 sm:leading-9 xl:text-sm xl:leading-10">+{{ hiddenCount }}</p>
          </div>
        </div>
        <!-- 输入框 -->
        <div class="grow">
          <input
            ref="fieldRef"
            v-model="keyword"
            type="text"
            class="w-full"
            data-testid="input-field"
            @input="field.input"
            @focus="field.focus"
            @blur="field.blur"
            @keydown="field.keydown"
          />
        </div>
      </div>
      <!-- 搜索按钮 -->
      <div class="f-c-c relative z-10 shrink-0">
        <div
          class="h-8 w-16 cursor-pointer rounded bg-blue-500 text-white sm:h-10 sm:w-24 lg:w-28 lg:hover:bg-blue-400 xl:h-12 xl:w-36"
          data-testid="search-button"
          @click="onSearchClick"
        >
          <p class="text-center text-sm leading-8 sm:text-base sm:leading-10 lg:text-lg lg:leading-10 xl:text-xl xl:leading-[3rem]">search</p>
        </div>
      </div>
      <!-- 下拉菜单 -->
      <div
        ref="externalAreaRef"
        class="absolute inset-x-0 top-10 z-50 rounded bg-white transition-all sm:top-12 xl:top-14"
        :class="showDropdownMenu ? 'scale-100 opacity-100' : 'scale-90 invisible opacity-0'"
        style="box-shadow: 0 1px 2px -2px rgba(0, 0, 0, .08), 0 3px 6px 0 rgba(0, 0, 0, .06), 0 5px 12px 4px rgba(0, 0, 0, .04)"
        data-testid="dropdown-menu"
      >
        <!-- 标签列表 -->
        <div
          v-if="tagsList.length"
          ref="dropdownMenuRef"
          class="hide-scrollbar max-h-72 overflow-y-scroll p-1 sm:max-h-80 xl:max-h-96 xl:p-1.5"
          data-testid="tags-list"
        >
          <ul>
            <li
              v-for="item in tagsList"
              :key="item.id"
              class="f-c-b h-9 w-full cursor-pointer pl-3 pr-2 leading-9 hover:bg-gray-100 sm:h-10 sm:leading-10 xl:h-11 xl:leading-[2.75rem]"
              data-testid="tag-item"
              @mousedown.prevent="tagClick(item)"
            >
              <p :class="isTagSelected(item) ? 'text-blue-600' : 'text-gray-600'">{{ item.label }}</p>
              <div v-show="isTagSelected(item)">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  class="size-4 text-blue-600 sm:size-5"
                >
                  <path
                    fill-rule="evenodd"
                    d="M12.416 3.376a.75.75 0 0 1 .208 1.04l-5 7.5a.75.75 0 0 1-1.154.114l-3-3a.75.75 0 0 1 1.06-1.06l2.353 2.353 4.493-6.74a.75.75 0 0 1 1.04-.207Z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>
            </li>
          </ul>
        </div>
        <!-- 无数据提示 -->
        <div
          v-else
          class="f-c-c h-40 flex-col space-y-2 p-1 text-gray-400"
          data-testid="no-data"
        >
          <div class="size-12">
            <svg
              viewBox="0 0 28 28"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M26 7.5C26 11.0899 23.0899 14 19.5 14C15.9101 14 13 11.0899 13 7.5C13 3.91015 15.9101 1 19.5 1C23.0899 1 26 3.91015 26 7.5ZM16.8536 4.14645C16.6583 3.95118 16.3417 3.95118 16.1464 4.14645C15.9512 4.34171 15.9512 4.65829 16.1464 4.85355L18.7929 7.5L16.1464 10.1464C15.9512 10.3417 15.9512 10.6583 16.1464 10.8536C16.3417 11.0488 16.6583 11.0488 16.8536 10.8536L19.5 8.20711L22.1464 10.8536C22.3417 11.0488 22.6583 11.0488 22.8536 10.8536C23.0488 10.6583 23.0488 10.3417 22.8536 10.1464L20.2071 7.5L22.8536 4.85355C23.0488 4.65829 23.0488 4.34171 22.8536 4.14645C22.6583 3.95118 22.3417 3.95118 22.1464 4.14645L19.5 6.79289L16.8536 4.14645Z" fill="currentColor" /><path d="M25 22.75V12.5991C24.5572 13.0765 24.053 13.4961 23.5 13.8454V16H17.5L17.3982 16.0068C17.0322 16.0565 16.75 16.3703 16.75 16.75C16.75 18.2688 15.5188 19.5 14 19.5C12.4812 19.5 11.25 18.2688 11.25 16.75L11.2432 16.6482C11.1935 16.2822 10.8797 16 10.5 16H4.5V7.25C4.5 6.2835 5.2835 5.5 6.25 5.5H12.2696C12.4146 4.97463 12.6153 4.47237 12.865 4H6.25C4.45507 4 3 5.45507 3 7.25V22.75C3 24.5449 4.45507 26 6.25 26H21.75C23.5449 26 25 24.5449 25 22.75ZM4.5 22.75V17.5H9.81597L9.85751 17.7041C10.2905 19.5919 11.9808 21 14 21L14.215 20.9947C16.2095 20.8953 17.842 19.4209 18.184 17.5H23.5V22.75C23.5 23.7165 22.7165 24.5 21.75 24.5H6.25C5.2835 24.5 4.5 23.7165 4.5 22.75Z" fill="currentColor" />
            </svg>
          </div>
          <p class="text-sm">无数据</p>
        </div>
      </div>
      <!-- 显示剩余标签(全部标签)的弹窗 -->
      <div
        class="absolute inset-x-0 top-0 z-50 min-h-16 rounded bg-white transition-all"
        :class="showRemainingTags ? 'scale-100 opacity-100' : 'scale-90 invisible opacity-0'"
        style="box-shadow: 0 1px 2px -2px rgba(0, 0, 0, .08), 0 3px 6px 0 rgba(0, 0, 0, .06), 0 5px 12px 4px rgba(0, 0, 0, .04)"
        data-testid="remaining-tags"
        @click.stop
      >
        <div class="flex flex-wrap px-2 pt-2">
          <div
            v-for="(item, index) in selectedTags"
            :key="item.id"
            class="f-c mb-2 mr-2 h-7 rounded bg-gray-100 pl-2 text-gray-800 sm:h-8 sm:pl-3 xl:mb-2.5 xl:mr-2.5 xl:h-9 xl:pl-4"
            data-testid="remaining-tag-element"
          >
            <p class="cursor-default text-xs leading-7 sm:leading-8 xl:text-sm xl:leading-9">{{ item.label }}</p>
            <div
              class="f-c-c h-full cursor-pointer px-2"
              data-testid="remaining-delete-button"
              @click="tagDelete(index)"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="currentColor"
                class="size-4"
              >
                <path d="M5.28 4.22a.75.75 0 0 0-1.06 1.06L6.94 8l-2.72 2.72a.75.75 0 1 0 1.06 1.06L8 9.06l2.72 2.72a.75.75 0 1 0 1.06-1.06L9.06 8l2.72-2.72a.75.75 0 0 0-1.06-1.06L8 6.94 5.28 4.22Z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
    <base-overlay
      v-model="showMask"
      @mask-click="showMask = false"
    />
  </div>
</template>

<script lang="ts" setup>
import { onClickOutside, useElementBounding, watchDebounced } from '@vueuse/core'
import type { TagsInter } from '@/types/new'

const props = defineProps<{
  options: TagsInter[]
}>()
/*
  定义事件以及组件接收的属性
*/
const emit = defineEmits(['search'])
const selectedTags = ref<TagsInter[]>([]) // 选中的标签列表

// 点击搜索按钮时触发
const onSearchClick = () => {
  emit('search', selectedTags.value.map(item => item.label))
}

/*
  根据输入关键字过滤标签列表、使用 watchDebounced 监听关键字变化并进行防抖处理
*/
const keyword = ref<string>('')

const filterTags = (query: string): TagsInter[] => {
  if (props.options.length === 0) {
    return []
  }
  return props.options.filter(tag => tag.label.toLowerCase().includes(query.toLowerCase()))
}

const tagsList = ref<TagsInter[]>(filterTags(''))
watchDebounced(
  keyword,
  (newKeyword) => {
    tagsList.value = filterTags(newKeyword)
  },
  { debounce: 300 }, // 设置防抖延迟时间为 300 毫秒
)

/*
  定义 DOM 元素的引用
*/
const inputAreaRef = ref<HTMLDivElement | null>(null)
const tagsAreaRef = ref<HTMLDivElement | null>(null)
const fieldRef = ref<HTMLInputElement | null>(null)
const dropdownMenuRef = ref<HTMLInputElement | null>(null)
const externalAreaRef = ref<HTMLElement | null>(null)

/*
  组件核心部分：
  通过 measureTextWidth() 模拟一个标签的宽度
  通过 updateDisplayedLabels() 计算隐藏的标签数量和显示的标签来更新 displayedLabels
*/
// 隐藏的标签数量
const hiddenCount = ref(0)
// 用于存储当前显示的标签
const displayedLabels = ref<TagsInter[]>([])
// 测量标签文本宽度
const measureTextWidth = (text: string): number => {
  const tagHTML = document.createElement('span')
  tagHTML.style.visibility = 'hidden'
  tagHTML.style.whiteSpace = 'nowrap'
  tagHTML.className = 'h-7 rounded bg-gray-100 text-gray-800 sm:h-9 xl:h-10 pl-2 pr-8 xl:pl-3 xl:pr-9'
  tagHTML.textContent = text
  document.body.appendChild(tagHTML)
  const width = tagHTML.offsetWidth
  document.body.removeChild(tagHTML)
  return width + 6
}
// 计算隐藏标签数量和显示标签
const updateDisplayedLabels = () => {
  if (!tagsAreaRef.value || tagsAreaRef.value.clientWidth === 0) { return }
  const containerWidth = tagsAreaRef.value.clientWidth
  let currentWidth = 0
  hiddenCount.value = 0
  displayedLabels.value = []
  for (let i = 0; i < selectedTags.value.length; i++) {
    const label = selectedTags.value[i].label
    const labelWidth = measureTextWidth(label)
    if (currentWidth + labelWidth + 6 > containerWidth) {
      hiddenCount.value = selectedTags.value.length - i
      break
    }
    displayedLabels.value.push(selectedTags.value[i])
    currentWidth += labelWidth
  }
}

// 监听组件宽度、selectedTags 变化并防抖
const tagsBounding = useElementBounding(tagsAreaRef)
watchDebounced([tagsBounding.width, () => selectedTags.value.length], updateDisplayedLabels, { debounce: 100 })

/*
  控制下拉菜单、剩余标签弹窗的显示
  showMask 生成透明遮罩层，防止用户误触
*/
const showMask = ref(false)
const showDropdownMenu = ref<boolean>(false) // 是否显示下拉菜单
const showRemainingTags = ref<boolean>(false) // 是否显示剩余标签的弹窗
watchEffect(() => {
  if (showDropdownMenu.value || showRemainingTags.value) {
    showMask.value = true
  }
})

// 输入框事件
const field = reactive({
  focus: () => {
    showDropdownMenu.value = true
  },
  blur: () => {
    if (externalAreaRef.value && externalAreaRef.value.contains(document.activeElement)) {
      fieldRef.value?.focus()
    }
    else {
      showDropdownMenu.value = showMask.value = false
      keyword.value = ''
    }
  },
  input: () => {
    if (dropdownMenuRef.value) {
      dropdownMenuRef.value.scrollTop = 0
    }
  },
  keydown: (event: KeyboardEvent) => {
    if (event.key === 'Backspace' && keyword.value === '' && selectedTags.value.length > 0) {
      selectedTags.value.pop()
    }
  },
})

// 切换显示剩余标签
const toggleRemainingTags = () => {
  if (showDropdownMenu.value) {
    showDropdownMenu.value = false
    fieldRef.value?.blur()
    return
  }
  showRemainingTags.value = !showRemainingTags.value
}

// 点击外部关闭下拉菜单
onClickOutside(inputAreaRef, (event: MouseEvent) => {
  if (externalAreaRef.value && externalAreaRef.value.contains(event.target as Node)) {
    return
  }
  showDropdownMenu.value = showRemainingTags.value = showMask.value = false
})

// 阻止输入框失焦
const preventBlur = (event: MouseEvent) => {
  event.preventDefault()
}

// 判断标签是否已选择
const isTagSelected = (tagItem: TagsInter) => selectedTags.value.some(tag => tag.id === tagItem.id)

// 点击标签添加或删除
const tagClick = (tagItem: TagsInter) => {
  const index = selectedTags.value.findIndex(tag => tag.id === tagItem.id)
  if (index !== -1) {
    selectedTags.value.splice(index, 1)
  }
  else {
    selectedTags.value.push(tagItem)
    keyword.value = ''
  }
}

// 删除标签
const tagDelete = (index: number) => {
  selectedTags.value.splice(index, 1)
  if (selectedTags.value.length === 0) {
    showRemainingTags.value = false
  }
}

// 处理鼠标按下事件，防止失焦
const handleMouseDown = (event: MouseEvent) => {
  if (externalAreaRef.value && externalAreaRef.value.contains(event.target as Node)) {
    event.preventDefault()
  }
}

// 组件挂载时添加事件监听器
onMounted(() => {
  document.addEventListener('mousedown', handleMouseDown)
})

// 组件卸载时移除事件监听器
onBeforeUnmount(() => {
  document.removeEventListener('mousedown', handleMouseDown)
})

defineExpose({
  measureTextWidth,
  updateDisplayedLabels,
})
</script>
