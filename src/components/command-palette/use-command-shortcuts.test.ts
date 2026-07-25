import { renderHook } from "@testing-library/react";

import { useCommandShortcuts } from "./use-command-shortcuts";

vi.mock("./actions", () => ({
  COMMAND_ACTIONS: [
    { id: "home", name: "Home", href: "/", shortcut: "h" },
    { id: "blog", name: "Blog", href: "/blog", shortcut: "b" },
    { id: "a-post", name: "A Post", href: "/blog/a-post" },
  ],
}));

const setup = (open = false) => {
  const onToggle = vi.fn();
  const onSelect = vi.fn();

  renderHook(() => useCommandShortcuts({ open, onToggle, onSelect }));

  return { onToggle, onSelect };
};

/** Dispatches a keydown that bubbles up to the document-level listener. */
const press = (init: KeyboardEventInit, target: EventTarget = document) => {
  const event = new KeyboardEvent("keydown", {
    bubbles: true,
    cancelable: true,
    ...init,
  });

  target.dispatchEvent(event);

  return event;
};

const appendElement = <T extends HTMLElement>(element: T) => {
  document.body.appendChild(element);
  return element;
};

describe("useCommandShortcuts", () => {
  describe("palette toggle", () => {
    it.each([
      ["meta", { key: "k", metaKey: true }],
      ["ctrl", { key: "k", ctrlKey: true }],
      // Caps Lock reports an uppercase `key` without setting shiftKey.
      ["meta with caps lock", { key: "K", metaKey: true }],
    ])("toggles on %s + k", (_label, init) => {
      const { onToggle } = setup();

      const event = press(init);

      expect(onToggle).toHaveBeenCalledTimes(1);
      expect(event.defaultPrevented).toBe(true);
    });

    it.each([
      ["shift", { key: "K", metaKey: true, shiftKey: true }],
      ["alt", { key: "k", metaKey: true, altKey: true }],
    ])("does not toggle when %s is also held", (_label, init) => {
      const { onToggle } = setup();

      const event = press(init);

      expect(onToggle).not.toHaveBeenCalled();
      expect(event.defaultPrevented).toBe(false);
    });

    it("toggles even while the palette is open", () => {
      const { onToggle } = setup(true);

      press({ key: "k", metaKey: true });

      expect(onToggle).toHaveBeenCalledTimes(1);
    });
  });

  describe("bare key shortcuts", () => {
    it.each([
      ["h", "home"],
      ["b", "blog"],
    ])("selects the action mapped to %s", (key, id) => {
      const { onSelect } = setup();

      const event = press({ key });

      expect(onSelect).toHaveBeenCalledWith(expect.objectContaining({ id }));
      expect(event.defaultPrevented).toBe(true);
    });

    it("still matches when caps lock uppercases the key", () => {
      const { onSelect } = setup();

      press({ key: "H" });

      expect(onSelect).toHaveBeenCalledWith(
        expect.objectContaining({ id: "home" }),
      );
    });

    it.each([
      ["ctrl", { key: "h", ctrlKey: true }],
      ["meta", { key: "h", metaKey: true }],
      ["alt", { key: "h", altKey: true }],
      ["shift", { key: "H", shiftKey: true }],
    ])("ignores %s + h so browser shortcuts keep working", (_label, init) => {
      const { onSelect } = setup();

      const event = press(init);

      expect(onSelect).not.toHaveBeenCalled();
      expect(event.defaultPrevented).toBe(false);
    });

    it("ignores keys with no matching action", () => {
      const { onSelect } = setup();

      const event = press({ key: "z" });

      expect(onSelect).not.toHaveBeenCalled();
      expect(event.defaultPrevented).toBe(false);
    });

    it("ignores shortcuts while the palette is open", () => {
      const { onSelect } = setup(true);

      press({ key: "h" });

      expect(onSelect).not.toHaveBeenCalled();
    });
  });

  describe("typing targets", () => {
    it.each(["input", "textarea"] as const)(
      "ignores shortcuts typed into a %s",
      (tag) => {
        const { onSelect } = setup();
        const element = appendElement(document.createElement(tag));

        press({ key: "h" }, element);

        expect(onSelect).not.toHaveBeenCalled();
      },
    );

    it("ignores shortcuts typed into a contenteditable element", () => {
      const { onSelect } = setup();
      const element = appendElement(document.createElement("div"));
      // jsdom does not derive `isContentEditable` from the attribute.
      Object.defineProperty(element, "isContentEditable", { value: true });

      press({ key: "h" }, element);

      expect(onSelect).not.toHaveBeenCalled();
    });
  });

  it("stops listening once unmounted", () => {
    const onToggle = vi.fn();
    const onSelect = vi.fn();

    const { unmount } = renderHook(() =>
      useCommandShortcuts({ open: false, onToggle, onSelect }),
    );

    unmount();
    press({ key: "h" });
    press({ key: "k", metaKey: true });

    expect(onSelect).not.toHaveBeenCalled();
    expect(onToggle).not.toHaveBeenCalled();
  });
});
