
# Inventory Reservation Contract

## 1. Reservation States

- `reserved`: stock has been allocated temporarily.
- `checked_out`: checkout completed successfully.
- `expired`: reservation expired and its allocated stock was released.

## 2. Valid Transitions

- `reserved -> checked_out`: allowed only before the expiry deadline.
- `reserved -> expired`: allowed when the expiry deadline is reached.
- `checked_out -> *`: no further transitions.
- `expired -> *`: no further transitions.

## 3. Stock Invariants

- Available stock must never be negative.
- A reservation can allocate stock only when sufficient stock is available.
- Allocating a reservation reduces available stock immediately.
- Expiring a reservation releases its allocation exactly once.
- Checking out a reservation does not release its allocation.
- Invalid or repeated finalization must not change stock.

## 4. Time Semantics

- Expiry is determined using an absolute deadline.
- A reservation is expired when `now >= expiresAt`.
- Checkout is valid only when `now < expiresAt`.
- Timer callbacks are not authoritative; operations must validate the deadline.

## 5. Concurrency Scope

- The initial implementation is an in-memory simulation within one JavaScript runtime.
- Synchronous state transitions must prevent overselling within that model.
- This contract does not guarantee consistency across browser tabs, users, processes, or server instances.
- Production systems require authoritative server-side atomic inventory operations.
