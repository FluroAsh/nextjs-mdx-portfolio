/** Fades the lines out before any edge, or the effect ends on a hard line. */
const EDGE_FADE =
  "radial-gradient(115% 90% at 50% 50%, black 30%, transparent 88%)";

/** Apply per section, never per panel — repeated on each box the texture reads
 *  as patterned boxes rather than as a screen you're looking through. */
export const ScanlinePlane = ({
  /** CRT edge darkening, 0–1. Omit for none. */
  vignette,
}: {
  vignette?: number;
} = {}) => (
  <div aria-hidden className="pointer-events-none absolute inset-0 z-20">
    <div
      className="absolute inset-0"
      style={{
        backgroundImage:
          "repeating-linear-gradient(to bottom, var(--scanline-color) 0px, var(--scanline-color) 1px, transparent 1px, transparent var(--scanline-pitch))",
        maskImage: EDGE_FADE,
        WebkitMaskImage: EDGE_FADE,
      }}
    />

    {vignette !== undefined && (
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `radial-gradient(120% 95% at 50% 50%, transparent 50%, rgba(0, 0, 0, ${vignette}) 100%)`,
        }}
      />
    )}
  </div>
);
