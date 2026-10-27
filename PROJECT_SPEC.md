# HW3 — High-Concurrency Flash-Sale E-Commerce Engine

## 1. Project Overview

Simulate a Vietnamese mega-sale e-commerce scenario, such as Shopee/Lazada 11.11 or a midnight flash sale.

The project focuses on a zero-drift countdown timer and an inventory reservation state machine.

## 2. Requirements from the Assignment

### R-01: Zero-Drift Countdown

- Implement a millisecond countdown.
- Calculate remaining time using the difference between `Date.now()` and a target timestamp.
- Avoid accumulating timer drift by decrementing a stored counter on each `setInterval` callback.
- Use `requestAnimationFrame` for visual updates where appropriate.
- Stop scheduling updates when the countdown ends or the component is disposed.

### R-02: Inventory Reservation State Machine

- Model inventory reservation as explicit finite states and transitions.
- Support inventory reservation, reservation lock expiry, and checkout.
- Prevent invalid state transitions.
- Release reserved inventory when a reservation expires or is cancelled.
- Ensure that checkout and expiry cannot both successfully finalize the same reservation.

### R-03: Concurrency and Consistency

- Test competing reservation attempts against limited stock.
- Prevent overselling in the implemented model.
- Make state transitions and inventory updates consistent.
- Document the limitations of an in-memory simulation versus server-side transactional inventory control.

### R-04: AI Failure Audit

- Create `AI_FAILURE_AUDIT.md`.
- Document at least three AI failure modes.
- For each failure mode, explain the incorrect behavior, potential impact, detection method, and mitigation.

### R-05: Commit History

- Produce at least eight discrete commits.
- Follow the Conventional Commits specification.
- Keep commits focused on meaningful, verifiable changes.

## 3. Proposed Application Scope

- Display flash-sale products, prices, stock availability, and countdown.
- Allow a user to attempt to reserve a product.
- Display reservation status and remaining lock time.
- Allow checkout while the reservation is valid.
- Handle reservation expiry and invalid actions.
- Provide clear loading, success, and error feedback where applicable.

## 4. Acceptance Criteria

- Countdown derives remaining time from an absolute target timestamp.
- Countdown never displays a negative remaining time.
- Countdown cleanup prevents unnecessary repeated animation callbacks.
- Reservation state transitions are explicitly defined and tested.
- Expired reservations cannot complete checkout.
- Competing reservations cannot allocate more stock than the model makes available.
- At least three AI failure modes are documented in `AI_FAILURE_AUDIT.md`.
- The final Git history contains at least eight meaningful Conventional Commits.

## 5. Technical Boundaries

- The initial implementation may simulate concurrency in a single JavaScript runtime.
- Client-side state alone does not guarantee consistency across multiple users or server instances.
- A production implementation would require authoritative server-side inventory checks and atomic transactions or an equivalent concurrency-control mechanism.

## 6. Open Decisions

- Confirm the required framework and language against the full assignment instructions.
- Confirm whether persistence or a backend API is required.
- Confirm whether the instructor expects a specific UI design or testing framework.
