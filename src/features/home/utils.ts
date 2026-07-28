/** Linear rather than the default easing, which looks like a standard web app
 *  rather than something mechanical. Shared so the hero and About land with the
 *  same rhythm. */
export const ENTER = { duration: 0.18, ease: "linear" } as const;

/** Background layers settle in more slowly than the text above them, so they
 *  read as the scene arriving rather than as another element landing. */
export const SETTLE = { duration: 0.5, ease: "linear" } as const;
