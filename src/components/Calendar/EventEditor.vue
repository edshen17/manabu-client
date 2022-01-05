<template>
  <div data-app>
    <v-menu
      v-model="showEventEditorModel"
      :offset-y="isMobile"
      :close-on-content-click="false"
      :close-on-click="false"
      :min-width="menuWidth"
      :left="showMenuOnLeft"
      offset-x
    >
      <template v-slot:activator="{ on, attrs }">
        <slot name="activator" :on="on" :attrs="attrs" />
      </template>
      <v-card color="grey lighten-4" flat>
        <v-card-text>
          <div class="flex">
            <div class="flex-grow">
              <p class="text-black text-lg tracking-wide inline">
                {{ getEventTitle(selectedEvent) }}
              </p>
            </div>
            <button v-if="isSelectedEventSaved" class="float-right" @click="$emit('event:delete')">
              <i class="fas fa-trash-alt text-lg"></i>
            </button>
          </div>
          <div
            class="flex flex-wrap content-start text-gray-500"
            :class="{ 'hover:bg-gray-100': !activeEditorName }"
          >
            <v-menu
              v-model="showDatePickerMenu"
              :close-on-content-click="false"
              offset-y
              min-width="auto"
              @input="onDatePickerMenuInput"
            >
              <template v-slot:activator="{ on, attrs }">
                <button
                  :class="getDateEditorButtonClass(EDITOR_NAME.DATE_PICKER)"
                  v-bind="attrs"
                  v-on="on"
                >
                  {{
                    formatDate({ date: selectedEvent.start, dateFormat: DATE_FORMAT.ABRIDGED_DATE })
                  }}
                </button>
              </template>
              <v-date-picker
                v-model="datePickerDate"
                no-title
                scrollable
                :locale="locale"
                @change="onDatePickerChange"
              ></v-date-picker>
            </v-menu>
            <p class="mx-1 py-1 text-lg font-bold">⋅</p>
            <button :class="getDateEditorButtonClass(EDITOR_NAME.START)">
              {{ formatDate({ date: selectedEvent.start, dateFormat: DATE_FORMAT.HOUR }) }}
            </button>
            <p class="mx-1 py-1 text-lg font-thin">-</p>
            <button :class="getDateEditorButtonClass(EDITOR_NAME.END)">
              {{ formatDate({ date: selectedEvent.end, dateFormat: DATE_FORMAT.HOUR }) }}
            </button>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-btn text color="secondary" class="m-0 animate-pulse" @click="$emit('event:save')">
            <span class="text-blue-600">{{ $t('button.common.save') }}</span>
          </v-btn>
          <v-btn text color="secondary" @click="$emit('event:cancel')">
            {{ $t('button.common.cancel') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-menu>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { TranslateResult } from 'vue-i18n';
import { StringKeyObject } from '../../../../server/types/custom';
import { makeDateFormatHandler } from '../../plugins/i18n/utils/dateFormatHandler';
import { EVENT_TYPE } from '../../types/Calendar';
import { makeCalendarMixin } from '../../mixins/calendar';
import { mapGetters } from 'vuex';

const dateFormatHandler = makeDateFormatHandler;
const calendarMixin = makeCalendarMixin;

enum EDITOR_NAME {
  DATE_PICKER = 'datePicker',
  START = 'start',
  END = 'end',
  DEFAULT = '',
}

export default Vue.extend({
  name: 'EventEditor',
  components: {},
  mixins: [calendarMixin],
  props: {
    showEventEditor: {
      type: Boolean,
      default: false,
      required: true,
    },
    eventEditorCoord: {
      type: Object,
      default: () => ({ x: 0, y: 0 }),
      required: true,
    },
    selectedEvent: {
      type: Object,
      default: () => ({}),
      required: true,
    },
    eventId: {
      type: String,
      default: '',
      required: true,
    },
    isSelectedEventSaved: {
      type: Boolean,
      default: false,
      required: true,
    },
  },
  data() {
    return {
      showDatePickerMenu: false,
      datePickerDate: new Date().toISOString().substr(0, 10),
      EDITOR_NAME,
      activeEditorName: '',
    };
  },
  computed: {
    ...mapGetters({
      locale: 'user/locale',
    }),
    menuWidth: {
      get(): string {
        const menuWidth = '350px';
        return menuWidth;
      },
    },
    showMenuOnLeft: {
      get(): boolean {
        const windowWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
        const showMenuOnLeft = this.eventEditorCoord.x > windowWidth / 2;
        return showMenuOnLeft;
      },
    },
    showEventEditorModel: {
      get(): boolean {
        const showEventEditorModel =
          this.showEventEditor && this.eventId == this.selectedEvent.attributes._id;
        return showEventEditorModel;
      },
      set(value: boolean): void {
        this.$emit('show-event-editor:change', value);
      },
    },
  },
  mounted() {
    return;
  },
  methods: {
    getEventTitle(event: StringKeyObject): TranslateResult {
      const isAvailableTime =
        event.attributes && event.attributes.type == EVENT_TYPE.AVAILABLE_TIME;
      const eventTitle = isAvailableTime
        ? this.$t('calendar.availableTime')
        : this.$t('calendar.appointment');
      return eventTitle;
    },
    formatDate(props: {
      date: Date;
      dateFormat?: string;
      formatString?: string;
      translationProps?: StringKeyObject;
    }): string {
      const { date, dateFormat, formatString, translationProps } = props;
      const dateFormatString: TranslateResult | string =
        formatString || this.$t(`dateFormat.${dateFormat}`, translationProps);
      const formattedDate = dateFormatHandler.formatDate({
        date,
        formatString: dateFormatString,
      });
      return formattedDate;
    },
    onDatePickerMenuInput(value: boolean): void {
      this.activeEditorName = value ? EDITOR_NAME.DATE_PICKER : EDITOR_NAME.DEFAULT;
    },
    onDatePickerChange(): void {
      this.$emit('date-picker:change', this.datePickerDate);
    },
    getDateEditorButtonClass(editorName: EDITOR_NAME): StringKeyObject {
      const dateEditorButtonClass = {
        'hover:bg-gray-100': this.activeEditorName,
        'inline cursor-pointer hover:underline py-2': !this.activeEditorName,
        'bg-gray-100 px-2': this.activeEditorName == editorName,
      };
      return dateEditorButtonClass;
    },
  },
});
</script>

<style lang="scss" scoped>
@import '../../assets/scss/calendar.scss';
</style>
