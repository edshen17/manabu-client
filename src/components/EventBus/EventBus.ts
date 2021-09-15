import Vue from 'vue';
const EventBus = new Vue();
type EventBusPayload = { value: any; emittedValueName: string };

export { EventBus, EventBusPayload };
