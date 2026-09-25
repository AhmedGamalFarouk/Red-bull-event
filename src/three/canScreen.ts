/**
 * Live screen-space pose of the 3D can, written every frame by RedBullCan and read
 * by the preloader so its 2D can can land exactly on the real one.
 * Plain mutable object on purpose: per-frame data must never touch React state.
 */
export const canScreen = {
  cx: 0, // centre, CSS px from viewport left
  cy: 0, // centre, CSS px from viewport top
  h: 0, // on-screen length of the can's axis, CSS px
  angle: 0, // clockwise tilt of the can axis, degrees
  valid: false, // true once the model has rendered at least one frame
};

/** Fired by the preloader when the 2D can hands over; RedBullCan answers with a spin. */
export const CAN_SPIN_EVENT = 'gravity:can-spin';
