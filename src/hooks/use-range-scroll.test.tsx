import { act, renderHook, waitFor } from "@testing-library/react";
import { useRangeScroll } from "./use-range-scroll";
import { MotionValue } from "motion/react";

describe("useRangeScroll", () => {
  let mockScrollY: MotionValue<number>;
  let onChange: (val: number) => void;

  beforeEach(() => {
    onChange = vi.fn(); // allow for manual invocation
    mockScrollY = {
      on: vi.fn((_, callback) => {
        onChange = callback;
        return () => {};
      }),
      clearListeners: vi.fn(),
    } as unknown as MotionValue<number>;
  });

  it("should initialize visible state based on isMobile prop", () => {
    const { result } = renderHook(() => useRangeScroll("/", true, mockScrollY));
    expect(result.current.shouldBeVisible).toBe(true);

    const { result: desktopResult } = renderHook(() =>
      useRangeScroll("/", false, mockScrollY),
    );
    expect(desktopResult.current.shouldBeVisible).toBe(false);
  });

  it("should toggle visibility based on scroll direction when threshold is reached", async () => {
    const { result } = renderHook(() =>
      useRangeScroll("/", false, mockScrollY, 50),
    );

    // Simulate scrolling down
    act(() => onChange(100));
    await waitFor(() => expect(result.current.shouldBeVisible).toBe(false));

    // Simulate scrolling up
    act(() => onChange(50));
    await waitFor(() => expect(result.current.shouldBeVisible).toBe(true));
  });

  it("should force hide on desktop when below hideScrollYLimit", () => {
    const { result } = renderHook(() =>
      useRangeScroll("/", false, mockScrollY, 50, 100),
    );

    onChange(50);
    expect(result.current.shouldBeVisible).toBe(false);
  });

  it("should reset on pathname change", () => {
    const { rerender, result } = renderHook(
      ({ pathname }) => useRangeScroll(pathname, true, mockScrollY),
      { initialProps: { pathname: "/" } },
    );

    rerender({ pathname: "/new-route" });
    expect(result.current.shouldBeVisible).toBe(true);
  });
});
