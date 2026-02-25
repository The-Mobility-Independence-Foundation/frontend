import EventEmitter from "events";

export const userEmitterBus = new EventEmitter();
userEmitterBus.setMaxListeners(999999);