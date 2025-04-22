// src/setupTests.js
import "@testing-library/jest-dom";
import { vi } from "vitest";
import { cleanup } from "@testing-library/react";
import * as matchers from "@testing-library/jest-dom/matchers";
import { expect } from "vitest";

// Add Testing Library matchers
expect.extend(matchers);

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock fetch API
global.fetch = vi.fn();

// Mock window.matchMedia - ensure all needed methods are present
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // Deprecated but needed for some libraries
    removeListener: vi.fn(), // Deprecated but needed for some libraries
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Suppress React warnings during testing
const originalConsoleError = console.error;
console.error = (...args) => {
  if (
    /Warning: ReactDOM.render is no longer supported in React 18/.test(
      args[0]
    ) ||
    /Warning: The current testing environment is not configured to support act/.test(
      args[0]
    ) ||
    /Warning: An update to Component inside a test was not wrapped in act/.test(
      args[0]
    ) ||
    /Warning: React has detected a change in the order of Hooks/.test(args[0])
  ) {
    return;
  }
  originalConsoleError(...args);
};
