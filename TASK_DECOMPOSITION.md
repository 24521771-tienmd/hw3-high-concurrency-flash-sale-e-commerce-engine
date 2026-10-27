# HW3 — Task Decomposition

## 1. Project Goal

Build a Vietnamese mega-sale flash-sale simulation focused on a zero-drift countdown and a concurrency-aware inventory reservation state machine.

## 2. Milestones

### M0 — Specification and Decomposition
- T-01: Define project requirements and acceptance criteria.
- T-02: Define modules, task dependencies, and verification strategy.

### M1 — Project Foundation and UI
- T-03: Establish the project structure and development scripts.
- T-04: Build the responsive flash-sale interface.
- T-05: Display product price, available stock, sale status, and countdown.

### M2 — Zero-Drift Countdown
- T-06: Implement countdown calculations using an absolute target timestamp.
- T-07: Implement visual updates and timer cleanup.
- T-08: Test expiration, delayed callbacks, and boundary conditions.

### M3 — Inventory Reservation State Machine
- T-09: Define reservation states and valid transitions.
- T-10: Implement reservation and stock allocation.
- T-11: Implement reservation expiry and stock release.
- T-12: Implement checkout for valid reservations.

### M4 — Concurrency and Failure Handling
- T-13: Test competing reservation attempts against limited stock.
- T-14: Prevent duplicate finalization and invalid transitions.
- T-15: Test expiry-versus-checkout behavior and recovery paths.

### M5 — AI Failure Audit
- T-16: Identify at least three plausible AI-generated implementation failures.
- T-17: Document impact, detection, and mitigation in AI_FAILURE_AUDIT.md.
- T-18: Link audit findings to relevant tests or code evidence.

### M6 — Integration and Delivery
- T-19: Run the complete test suite and verify key user flows.
- T-20: Review accessibility, error handling, and cleanup.
- T-21: Verify documentation and at least eight meaningful Conventional Commits.
- T-22: Push the verified branch to the configured GitHub repository.

## 3. Dependencies

- T-01 and T-02 precede implementation.
- T-03 precedes UI, timer, and inventory implementation.
- T-04 and T-05 establish the interface for timer and inventory integration.
- T-06 precedes T-07 and T-08.
- T-09 precedes T-10, T-11, and T-12.
- T-10, T-11, and T-12 precede full concurrency verification.
- AI audit findings should be checked against the implementation and tests.
- Integration and delivery follow implementation and verification.

## 4. Acceptance Criteria

### Countdown
- Remaining time is calculated from an absolute target timestamp.
- Delayed callbacks do not accumulate countdown drift.
- Remaining time is clamped to zero.
- Animation or timer callbacks stop after expiry or disposal.

### Inventory
- Valid and invalid transitions are explicitly defined.
- Reservations cannot allocate more stock than is available in the implemented model.
- Expired reservations cannot complete checkout.
- Checkout and expiry cannot both finalize one reservation.
- Reserved stock is released exactly once when applicable.

### Verification
- Tests cover normal flows, boundary conditions, and competing reservation attempts.
- At least three AI failure modes are documented with impact, detection, and mitigation.
- At least eight meaningful Conventional Commits exist.
- The final project can be run and verified using documented instructions.

## 5. Risks and Constraints

- JavaScript timers are not guaranteed to execute at exact intervals.
- An in-memory simulation cannot guarantee inventory consistency across independent users, processes, or server instances.
- Production inventory consistency requires authoritative server-side atomic operations or an equivalent concurrency-control mechanism.
- The implementation framework, persistence layer, and backend requirements must be confirmed against the full assignment specification.

## 6. Verification Strategy

- Unit tests for countdown arithmetic and state transitions.
- Boundary tests for countdown expiry and reservation lock expiry.
- Concurrency-oriented tests for competing reservations.
- Integration tests for reserve, checkout, expiry, and stock release.
- Manual browser verification for UI feedback and responsive behavior.
