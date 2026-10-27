# AI Failure Audit — Flash-Sale E-Commerce Engine

## 1. Purpose

This audit documents implementation defects, architectural limitations, and maintainability risks identified during verification of the flash-sale simulation.

Findings are classified as:

- **Confirmed defect:** reproduced by a test or directly verified in the implementation.
- **Architectural limitation:** outside the guarantees of the current in-memory design.
- **Maintainability issue:** unnecessary complexity or unclear code that should be improved.

## 2. Findings

### A-01 — Invalid Clock Values Could Bypass Reservation Finalization Checks

**Classification:** Confirmed defect, fixed.

**Risk:** High for correctness if the clock dependency returns an invalid numeric value.

**Evidence:** Before the fix, `checkout()` compared `this.#now()` directly with `expiresAt`. When the clock returned `NaN`, the comparison evaluated to `false`, allowing checkout to proceed. `expireReservation()` had the same validation gap.

**Reproduction:** Create a reservation with a valid clock value, then make the injected clock return `Number.NaN` before calling `checkout()` or `expireReservation()`.

**Fix:** Both methods now verify `Number.isFinite(now)` and throw a `TypeError` before changing reservation state or stock.

**Verification:** The tests named `rejects checkout when the clock returns an invalid timestamp` and `rejects expiration when the clock returns an invalid timestamp` pass. The complete test suite passes 16 tests.

**Residual risk:** The clock must remain a trustworthy time source. This validation rejects non-finite timestamps but does not provide a distributed or tamper-resistant clock.

### A-02 — Inventory Is Not Shared Across Browser Tabs or Server Instances

**Classification:** Architectural limitation, not a reproduced defect in the current single-runtime model.

**Risk:** High if this simulation is treated as a production flash-sale backend.

**Evidence:** `InventoryManager` stores available stock and reservations in private in-memory `Map` instances. `INVENTORY_CONTRACT.md` explicitly limits consistency guarantees to one JavaScript runtime.

**Potential reproduction:** Open independent application instances with the same initial stock. Each instance maintains its own stock and may reserve the same nominal unit independently.

**Impact:** Separate tabs, users, processes, or server instances can observe inconsistent inventory. The current overselling test only verifies competing reservations against one shared `InventoryManager`.

**Recommended mitigation:** Move authoritative reservation and checkout operations to a backend. Use database transactions, conditional stock updates, or another atomic inventory mechanism, with appropriate idempotency and reservation-expiry handling.

**Verification status:** The architectural boundary is confirmed by code and contract review. Cross-instance overselling has not been tested in this project.

### A-03 — Reservation Expiry Is Observed by a Polling Timer

**Classification:** Design limitation; no timer failure reproduced.

**Risk:** Medium for UI responsiveness.

**Evidence:** `useFlashSaleInventory.js` checks reservations every 250 milliseconds, while `ProductCard.jsx` updates the displayed countdown on a 250-millisecond interval.

**Impact:** Browser scheduling delays or a suspended background tab can delay the UI's display of expiry. The timer callback must not be treated as the authority for whether checkout is allowed.

**Existing protection:** `InventoryManager.checkout()` validates the absolute expiry deadline independently of the polling interval. The inventory contract defines expiry using `now >= expiresAt`.

**Recommended mitigation:** Keep deadline checks inside inventory operations. Treat UI timers as presentation only, and test delayed timer execution and background-tab behavior if stronger UI guarantees are required.

**Verification status:** The polling design is confirmed by code inspection. A browser-suspension failure has not been reproduced.

### A-04 — Repeated UI Expression Adds Unnecessary Complexity

**Classification:** Maintainability issue.

**Risk:** Low.

**Evidence:** In `ProductCard.jsx`, the arrow suffix uses a conditional expression whose two branches both return the same string: `{isReserved ? ' →' : ' →'}`.

**Impact:** The conditional adds complexity without changing the rendered output.

**Recommended mitigation:** Replace the conditional with a single literal suffix or a meaningful conditional.

**Verification status:** Confirmed by source inspection; not a functional defect.

## 3. Verification Summary

- Automated tests: 16 passed, 0 failed.
- Oxlint: 0 warnings, 0 errors.
- Vite production build: successful.
- `git diff --check`: passed after whitespace cleanup.
- Invalid-clock defect reproduced with failing tests before the fix, then verified by passing tests afterward.

## 4. Scope and Limitations

This audit covers the current client-side simulation and existing tests. It does not establish production readiness, distributed consistency, payment correctness, security under hostile clients, or real-world flash-sale capacity.