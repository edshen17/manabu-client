<template>
  <div data-app>
    <v-menu
      v-model="showEditorModel"
      :offset-y="isMobile"
      :close-on-content-click="false"
      :close-on-click="true"
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
                v-model="datePickerDateModel"
                no-title
                scrollable
                :locale="locale"
              ></v-date-picker>
            </v-menu>
            <p class="mx-1 py-1 text-lg font-bold">⋅</p>
            <button
              v-show="!isActiveEditor(EDITOR_NAME.START)"
              :class="getDateEditorButtonClass(EDITOR_NAME.START)"
              @click="focusHourDropdown(EDITOR_NAME.START)"
            >
              {{ formatDate({ date: selectedEvent.start, dateFormat: DATE_FORMAT.HOUR }) }}
            </button>
            <component
              :is="selectTimeComponent"
              v-show="isActiveEditor(EDITOR_NAME.START)"
              ref="autocomplete-start"
              v-model="autoCompleteStartModel"
              :class="autoCompleteClass"
              autofocus
              auto-select-first
              dense
              auto
              :hide-no-data="true"
              append-icon=""
              :items="autoCompleteStartIntervals"
              @blur="onAutoCompleteBlur(EDITOR_NAME.START)"
            />
            <p class="mx-1 py-1 text-lg font-thin">-</p>
            <button
              v-show="!isActiveEditor(EDITOR_NAME.END)"
              :class="getDateEditorButtonClass(EDITOR_NAME.END)"
              @click="focusHourDropdown(EDITOR_NAME.END)"
            >
              {{ formatDate({ date: selectedEvent.end, dateFormat: DATE_FORMAT.HOUR }) }}
            </button>
            <component
              :is="selectTimeComponent"
              v-show="isActiveEditor(EDITOR_NAME.END)"
              ref="autocomplete-end"
              v-model="autoCompleteEndModel"
              :class="autoCompleteClass"
              autofocus
              auto-select-first
              dense
              auto
              :hide-no-data="true"
              append-icon=""
              :items="autoCompleteEndIntervals"
              @blur="onAutoCompleteBlur(EDITOR_NAME.END)"
            />
          </div>
        </v-card-text>
        <v-card-actions v-show="!isSelectedEventSaved">
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
import { StringKeyObject } from '../../../../server/types/custom';
import { makeCalendarMixin } from '../../mixins/calendar';
import { mapGetters } from 'vuex';
import dayjs from 'dayjs';
import { VAutocomplete, VSelect } from 'vuetify/lib'; // need explicit import for dynamic components

enum EDITOR_NAME {
  DATE_PICKER = 'datePicker',
  START = 'start',
  END = 'end',
  DEFAULT = '',
}

export default Vue.extend({
  name: 'AvailableTimeEditor',
  components: { VAutocomplete, VSelect },
  mixins: [makeCalendarMixin],
  props: {
    showEditor: {
      type: Boolean,
      default: false,
      required: true,
    },
    selectedEventCoord: {
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
    datePickerDate: {
      type: String,
      default: '',
      required: true,
    },
  },
  data() {
    return {
      showDatePickerMenu: false,
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
        const menuWidth = '340px';
        return menuWidth;
      },
    },
    autoCompleteClass: {
      get(): string {
        const autoCompleteClass = 'fit h-0 m-0 text-base';
        return autoCompleteClass;
      },
    },
    showMenuOnLeft: {
      get(): boolean {
        const windowWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
        const showMenuOnLeft = this.selectedEventCoord.x > windowWidth / 2;
        return showMenuOnLeft;
      },
    },
    showEditorModel: {
      get(): boolean {
        const showEditorModel =
          this.showEditor &&
          this.selectedEvent.attributes &&
          this.eventId == this.selectedEvent.attributes._id;
        return showEditorModel;
      },
      set(value: boolean): void {
        this.$emit('show-editor:change', value);
      },
    },
    autoCompleteStartIntervals: {
      get(): StringKeyObject[] {
        const selectedEventStart = this.selectedEvent.start;
        let startTime = dayjs(selectedEventStart).hour(0).minute(0);
        const endTime = startTime.add(1, 'day');
        const startIntervals = [];
        while (startTime.isBefore(endTime)) {
          const formattedTime = startTime.format((this as any).AUTOCOMPLETE_DATE_FORMAT.HOUR);
          const time = {
            text: formattedTime,
            value: startTime.format((this as any).AUTOCOMPLETE_DATE_FORMAT.DEFAULT),
            locale: this.locale,
          };
          startIntervals.push(time);
          startTime = startTime.add(30, 'minutes');
        }
        return startIntervals;
      },
    },
    autoCompleteEndIntervals: {
      get(): StringKeyObject[] {
        const endIntervals: StringKeyObject[] = [];
        const selectedEventStart = this.selectedEvent.start;
        const selectedEventEnd = this.selectedEvent.end;
        const hasSelectedEvent = selectedEventStart && selectedEventEnd;
        const self = this as any;
        if (hasSelectedEvent) {
          let startTime = dayjs(selectedEventStart).add(30, 'minutes');
          let endTime = startTime.add(1, 'day').hour(0).minute(30);
          while (startTime.isBefore(endTime)) {
            const diffBetweenSelectedEventStart =
              startTime.diff(selectedEventStart, 'minutes') / 60;
            const formattedTime = self.formatDate({
              date: startTime.toDate(),
              dateFormat: self.DATE_FORMAT.HOUR_WITH_DURATION,
              translationProps: { hours: diffBetweenSelectedEventStart },
            });
            const time = {
              text: formattedTime,
              value: startTime.format(self.AUTOCOMPLETE_DATE_FORMAT.DEFAULT),
              locale: this.locale,
            };
            endIntervals.push(time);
            startTime = startTime.add(30, 'minutes');
          }
        }
        return endIntervals;
      },
    },
    autoCompleteStartModel: {
      get(): string {
        const autoCompleteStartModel = this._getAutoCompleteModel(this.selectedEvent.start);
        return autoCompleteStartModel;
      },
      set(value: string): void {
        this.activeEditorName = EDITOR_NAME.DEFAULT;
        this.$emit('auto-complete-start:change', value);
      },
    },
    autoCompleteEndModel: {
      get(): string {
        const autoCompleteEndModel = this._getAutoCompleteModel(this.selectedEvent.end);
        return autoCompleteEndModel;
      },
      set(value: string): void {
        this.activeEditorName = EDITOR_NAME.DEFAULT;
        this.$emit('auto-complete-end:change', value);
      },
    },
    datePickerDateModel: {
      get(): string {
        const datePickerDate = this.datePickerDate;
        return datePickerDate;
      },
      set(value: string): void {
        this.$emit('date-picker:change', value);
      },
    },
    selectTimeComponent: {
      get(): string {
        const selectTimeComponent = (this as any).isMobile ? 'VSelect' : 'VAutocomplete';
        return selectTimeComponent;
      },
    },
  },
  mounted() {
    return;
  },
  methods: {
    onDatePickerMenuInput(value: boolean): void {
      this.activeEditorName = value ? EDITOR_NAME.DATE_PICKER : EDITOR_NAME.DEFAULT;
    },
    getDateEditorButtonClass(editorName: EDITOR_NAME): StringKeyObject {
      const dateEditorButtonClass = {
        'hover:bg-gray-100': this.activeEditorName,
        'inline cursor-pointer hover:underline py-2': !this.activeEditorName,
        'bg-gray-100 px-2': this.isActiveEditor(editorName),
      };
      return dateEditorButtonClass;
    },
    isActiveEditor(editorName: EDITOR_NAME): boolean {
      const isActiveEditor = this.activeEditorName == editorName;
      return isActiveEditor;
    },
    focusHourDropdown(dropdownName: EDITOR_NAME.START | EDITOR_NAME.END): void {
      this.activeEditorName = dropdownName;
      const inputField = (this.$refs[`autocomplete-${dropdownName}`] as any).$refs.input;
      setTimeout(() => {
        inputField.click();
      });
    },
    onAutoCompleteBlur(editorName: EDITOR_NAME.START | EDITOR_NAME.END) {
      this.activeEditorName = EDITOR_NAME.DEFAULT;
      // need to set isActive to false so v-select closes on alt-tab...
      (this.$refs[`autocomplete-${editorName}`] as any).$refs.menu.isActive = false;
    },
    _getAutoCompleteModel(date: Date | number) {
      const self = this as any;
      const autoCompleteModel = date
        ? self.formatDate({
            date,
            formatString: self.AUTOCOMPLETE_DATE_FORMAT.DEFAULT,
          })
        : '';
      return autoCompleteModel;
    },
  },
});
</script>

<style lang="scss" scoped>
@import '../../assets/scss/calendar.scss';
</style>
