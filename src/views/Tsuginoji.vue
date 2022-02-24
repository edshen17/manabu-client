<template>
  <div class="h-screen" @mouseup="onAutoSearch">
    <div class="lg:flex lg:flex-col absolute hidden lg:block space-y-2 px-1 items-start">
      <router-link to="/" tag="button" class="text-2xl px-2">🏠</router-link>
      <button class="hover:bg-gray-100 py-2 px-2 rounded-md" @click="toggleAutoSearch">
        Autosearch: {{ isAutoSearch ? 'ON' : 'OFF' }}
      </button>
    </div>
    <div class="mx-auto w-11/12 md:w-10/12 lg:w-6/12 pt-4 md:pt-10">
      <button @click="resetSearch">
        <h1 class="text-4xl">Tsuginoji 次の字</h1>
      </button>
      <div class="flex pt-4">
        <div class="w-full">
          <div class="input-group relative flex flex-wrap items-stretch w-full mb-4">
            <input
              ref="search"
              v-model="searchWord"
              v-focus="isFocused"
              type="search"
              class="
                form-control
                relative
                flex-auto
                min-w-0
                block
                w-full
                px-3
                py-1.5
                text-base
                font-normal
                text-gray-700
                bg-white bg-clip-padding
                border border-solid border-gray-300
                rounded
                transition
                ease-in-out
                m-0
                focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none
              "
              placeholder="Kanji・Kana・Romaji"
              aria-label="Search"
              @focus="onFocus"
              @blur="isFocused = false"
              @input="debounceInput"
            />
          </div>
          <div
            v-show="tokenizedSentence.length > 0"
            class="flex w-full flex-wrap pb-4 align-middle"
          >
            <p v-for="(word, i) in tokenizedSentence" :key="i" class="px-2 text-xl">
              {{ word }}
            </p>
            <div class="flex-1 flex-grow"></div>
            <button @click="tokenizedSentence = []">
              <i class="fas fa-times fa-lg my-4 float-right"></i>
            </button>
          </div>
          <transition>
            <div v-show="words.length == 0 && !searchWord">
              <ul class="list-none">
                <li
                  v-for="point in nonBulletedData"
                  :key="point"
                  class="mb-4 text-lg text-gray-600"
                >
                  {{ point }}
                </li>
              </ul>
              <ul class="list-disc pl-5">
                <li v-for="point in bulletedData" :key="point" class="mb-4 text-lg text-gray-600">
                  {{ point }}
                </li>
              </ul>
            </div>
          </transition>
          <transition-group>
            <div
              v-for="(word, i) in words"
              :key="word._id"
              class="border-b-2"
              :class="{ 'py-4': i > 0, 'pb-4': i == 0 }"
            >
              <p class="text-3xl font-extralight">{{ word.word }}</p>
              <button v-if="word.audioLinks.length > 0" @click="playAudio(word.audioLinks[0])">
                <i class="fas fa-play py-4"></i>
              </button>
              <div class="text-2xl" v-html="sanitizeHtml(word.definition)"></div>
            </div>
          </transition-group>
        </div>
      </div>
      <infinite-loading :identifier="searchWord" @infinite="onPaginate">
        <div slot="spinner"></div>
        <div slot="no-more"></div>
        <div slot="no-results"></div>
      </infinite-loading>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { TranslateResult } from 'vue-i18n';
import { debounce } from 'debounce';
import { makeWordRepository } from '@/repositories/word';
import InfiniteLoading from 'vue-infinite-loading';
import { StringKeyObject } from '@server/types/custom';
import DOMPurify from 'dompurify';
import { ls } from '@/store/plugins';
import { focus } from 'vue-focus';
import TokenizerJa from 'natural/lib/natural/tokenizers/tokenizer_ja';
const tokenizerJa = new TokenizerJa();

const wordRepository = makeWordRepository;

export default Vue.extend({
  name: 'Tsuginoji',
  components: { InfiniteLoading },
  directives: { focus },
  props: {},
  data() {
    return {
      words: [] as any,
      searchWord: '',
      tokenizedSentence: [] as string[],
      query: {
        wordLanguage: 'ja',
        definitionLanguage: 'ja',
        page: 0,
        limit: 100,
      },
      isFocused: true,
      isAutoSearch: true,
    };
  },
  computed: {
    nonBulletedData: {
      get(): TranslateResult[] {
        const nonBulletedData = [
          'Tsuginoji is a modern Japanese-Japanese dictionary designed for immersion. You can easily find words, their pronunciation, and their pitch-accent.',
          'Enter Japanese text in the search bar or highlight a word and Tsuginoji will fetch data from 三省堂 スーパー大辞林.',
        ];
        return nonBulletedData;
      },
    },
    bulletedData: {
      get(): TranslateResult[] {
        const bulletedData = [
          'Press F to focus on the search bar',
          'Press D to toggle autosearch',
          'Press S to search a highlighted word when autosearch is disabled',
          'We will be adding new features soon, including flashcard integration, saving search data, and more!',
        ];
        return bulletedData;
      },
    },
  },
  watch: {
    searchWord(newWord): void {
      if (newWord == '') {
        this.words = [];
      }
    },
  },
  created() {
    window.addEventListener('keyup', (e: any) => {
      const path = e.path || (e.composedPath && e.composedPath());
      const element = path[0].tagName;
      if (element == 'INPUT') {
        return;
      }
      if (e.key == 'f') {
        this.isFocused = true;
      }
      if (e.key == 'd') {
        this.toggleAutoSearch();
      }
      if (e.key == 's' && !this.isAutoSearch) {
        const text = this.getHighlightedText();
        this.searchText(text);
      }
    });
    const tsuginojiSettings = ls.get('tsuginojiSettings');
    if (tsuginojiSettings) {
      const { isAutoSearch } = tsuginojiSettings;
      this.isAutoSearch = isAutoSearch;
    }
  },
  methods: {
    debounceInput(): void {
      if (this.searchWord == '') {
        this.resetSearch();
        return;
      }
      const self = this;
      (
        debounce(async function () {
          self.query.page = 0;
          const { data } = await wordRepository.get({
            path: `/${self.searchWord}`,
            query: self.query,
          });
          const { words } = data;
          self.words = self.sortWords(words);
        }, 500) as any
      )();
    },
    async onPaginate($state: StringKeyObject): Promise<void> {
      if (this.searchWord) {
        this.query.page++;
        const { data } = await wordRepository.get({
          path: `/${this.searchWord}`,
          query: this.query,
        });
        const { words } = data;
        if (words.length) {
          this.words = this.words.concat(this.sortWords(words));
          $state.loaded();
        } else {
          $state.complete();
        }
      }
    },
    sanitizeHtml(html: string): string {
      const sanitizedHtml = DOMPurify.sanitize(html);
      return sanitizedHtml;
    },
    resetSearch(): void {
      this.searchWord = '';
      this.words = [];
      this.tokenizedSentence = [];
      this.query.page = 0;
    },
    sortWords(words: StringKeyObject[]): StringKeyObject[] {
      const sortedWordArr = words.sort((a, b) => {
        return (
          b.pitch.length - a.pitch.length ||
          a.kana.length - b.kana.length ||
          b.definition.length - a.definition.length
        );
      });
      return sortedWordArr;
    },
    onFocus(e: any): void {
      e.target.select();
      this.isFocused = true;
    },
    toggleAutoSearch(): void {
      this.isAutoSearch = !this.isAutoSearch;
      ls.set('tsuginojiSettings', {
        isAutoSearch: this.isAutoSearch,
      });
    },
    onAutoSearch(): void {
      const text = this.getHighlightedText();
      if (!text || !this.isAutoSearch) {
        return;
      }
      this.searchText(text);
    },
    getHighlightedText(): string | undefined {
      let text = '';
      const documentSelection = (document as any).selection;
      const wndw = window as any;
      if (wndw.getSelection) {
        text = wndw.getSelection().toString();
      } else if (documentSelection && documentSelection.type != 'Control') {
        text = documentSelection.createRange().text;
      }
      return text;
    },
    searchText(text: any): void {
      const tokenizedText: string[] = tokenizerJa.tokenize(text);
      if (tokenizedText.length > 1) {
        this.searchWord = tokenizedText[0];
        this.tokenizedSentence = tokenizedText;
      } else {
        this.searchWord = text;
      }
      this.debounceInput();
    },
    playAudio(url: string): void {
      if (url) {
        const audio = new Audio(url);
        audio.play();
      }
    },
  },
});
</script>

<style>
.v-enter-active,
.v-leave-active {
  transition: opacity 0.1s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
