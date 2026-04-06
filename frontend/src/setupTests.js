// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

import { TextEncoder, TextDecoder } from 'node:util';

Object.defineProperties(globalThis, {
  TextDecoder: { value: TextDecoder },
  TextEncoder: { value: TextEncoder },
});

if (typeof window !== 'undefined' && !window.BroadcastChannel) {
  window.BroadcastChannel = class {
    constructor(name) { this.name = name; }
    postMessage(message) {
      if (this.onmessage) {
        this.onmessage({ data: message });
      }
    }
    onmessage = null;
    close() {}
  };
}


import { ReadableStream, WritableStream, TransformStream } from 'web-streams-polyfill';

Object.defineProperties(globalThis, {
  ReadableStream: { value: ReadableStream },
  WritableStream: { value: WritableStream },
  TransformStream: { value: TransformStream },
});