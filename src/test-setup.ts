import { GlobalRegistrator } from "@happy-dom/global-registrator";
import "@testing-library/jest-dom";
import { cleanup } from "@testing-library/react";
import { afterEach, beforeEach } from "bun:test";

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
