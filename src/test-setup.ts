import { GlobalRegistrator } from "@happy-dom/global-registrator";
import "@testing-library/jest-dom";
import { afterEach, beforeEach } from "bun:test";
import { cleanup } from "@testing-library/react";

// Register happy-dom globals (window, document, etc.)
GlobalRegistrator.register();

// Ensure document is available before each test
beforeEach(() => {
	if (!global.document) {
		GlobalRegistrator.register();
	}
});

// Cleanup after each test to prevent test pollution
afterEach(() => {
	try {
		cleanup();
	} catch (_e) {
		// Ignore cleanup errors
	}
});
