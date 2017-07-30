import SDefEncoder from "synthdef-json-encoder";
import OSCMessage from "osc-msg";
import * as commands from "./index";

const encodeSDef = SDefEncoder.encode;
const encodeOSC = OSCMessage.encode;

// Master Controls
export function notify(code) {
  return commands.notify(code);
}

export function status() {
  return commands.status();
}

export function dumpOSC(code) {
  return commands.dumpOSC(code);
}

export function sync(syncId) {
  return commands.sync(syncId);
}

export function clearSched() {
  return commands.clearSched();
}

// Synth Definition Commands
export function d_recv(sdef, next) {
  sdef = encodeSDef(sdef, { version: 1 });
  next = next != null ? encodeOSC(next) : null;
  return commands.d_recv(sdef, next);
}

export function d_free(name, ...args) {
  return commands.d_free(name, ...args);
}

// Node Commands
export function n_free(nodeId, ...args) {
  return commands.n_free(nodeId, ...args);
}

export function n_run(nodeId, runFlag, ...args) {
  return commands.n_run(nodeId, runFlag, ...args);
}

export function n_set(nodeId, ...args) {
  return commands.n_set(nodeId, ...args);
}

export function n_map(nodeId, ...args) {
  return commands.n_map(nodeId, ...args);
}

export function n_mapa(nodeId, ...args) {
  return commands.n_mapa(nodeId, ...args);
}

export function n_before(nodeId, targetId, ...args) {
  return commands.n_before(nodeId, targetId, ...args);
}

export function n_after(nodeId, targetId, ...args) {
  return commands.n_after(nodeId, targetId, ...args);
}

// Synth Commands
export function s_new(name, nodeId, action, targetId, ...args) {
  return commands.s_new(name, nodeId, action, targetId, ...args);
}

export function s_get(nodeId, ...args) {
  return commands.s_get(nodeId, ...args);
}

// Group Commands
export function g_new(nodeId, action, targetId, ...args) {
  return commands.g_new(nodeId, action, targetId, ...args);
}

export function g_head(nodeId, targetId, ...args) {
  return commands.g_head(nodeId, targetId, ...args);
}

export function g_tail(nodeId, targetId, ...args) {
  return commands.g_tail(nodeId, targetId, ...args);
}

export function g_freeAll(groupId, ...args) {
  return commands.g_freeAll(groupId, ...args);
}

export function g_deepFree(groupId, ...args) {
  return commands.g_deepFree(groupId, ...args);
}

// Buffer Commands
export function b_alloc(bufId, length, numberOfChannels, next) {
  next = next != null ? encodeOSC(next) : null;
  return commands.b_alloc(bufId, length, numberOfChannels, next);
}

export function b_allocRead(bufId, path, offset, length, next) {
  next = next != null ? encodeOSC(next) : null;
  return commands.b_allocRead(bufId, path, offset, length, next);
}

export function b_free(bufId, next) {
  next = next != null ? encodeOSC(next) : null;
  return commands.b_free(bufId, next);
}

export function b_zero(bufId, next) {
  next = next != null ? encodeOSC(next) : null;
  return commands.b_zero(bufId, next);
}

export function b_query(bufId, ...args) {
  return commands.b_query(bufId, ...args);
}

// Control Bus Commands
export function c_set(index, value, ...args) {
  return commands.c_set(index, value, ...args);
}

export function c_get(index, ...args) {
  return commands.c_get(index, ...args);
}
