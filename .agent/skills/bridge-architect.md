---
name: bridge-architect
description: Use this skill when modifying Python backend logic or the Electron IPC/API bridge that connects Python to the React frontend.
user-invocable: true
---

# Instructions

When this skill is active, you must follow these synchronization rules:

1. **Schema Alignment:** If a Python function's return type or parameters change, you must immediately locate and update the corresponding TypeScript interface/type in the frontend.
2. **Error Propagation:** Ensure that Python exceptions are caught and mapped to a structured JSON error format that the Electron main process can pass to the React UI.
3. **Async Handling:** Verify that the Electron `child_process` spawn logic or the local API fetch calls include proper timeouts and "loading" states for the UI.
4. **Sidecar Verification:** Before finishing a task, verify that the Python entry point is correctly configured.
