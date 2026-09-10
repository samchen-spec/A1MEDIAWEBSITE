# Team headshots

Photos for the "We staff setters and closers" card (`src/components/TeamStack.tsx`).

To add one:

1. Drop a square crop here, 200x200 or larger, e.g. `setter-1.jpg`.
2. Set that seat's `src` in the `SEATS` array to `/team/setter-1.jpg`.

A seat with `src: null` renders a monogram instead, so the card always looks
finished even with no photos in place.

Only use photos of people who actually work with us and have agreed to appear.
The card presents them as our placed staff, so stock portraits would make that
claim false.
