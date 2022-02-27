import { StringKeyObject } from '@server/types/custom';
import Vue from 'vue';
const EventBus = new Vue();
type EventBusPayload = { value?: any; emittedValueName?: string; metaData?: StringKeyObject };

export { EventBus, EventBusPayload };
