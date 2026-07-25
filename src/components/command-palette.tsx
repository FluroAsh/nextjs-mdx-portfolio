"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useRouter } from "next/navigation";

import {
  Description as DialogDescription,
  Title as DialogTitle,
} from "@radix-ui/react-dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Command } from "cmdk";
import { LucideBookOpen, LucideCamera, LucideHome } from "lucide-react";

import { allBlogContent } from "@/data/content";
import { getCoreContent } from "@/lib/helpers";
import { cn } from "@/utils/misc";

type CommandAction = {
  id: string;
  name: string;
  section: string;
  subtitle?: string;
  shortcut?: string;
  keywords?: string;
  icon?: React.ReactNode;
  perform: () => void;
};

type CommandPaletteContextValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
  toggle: () => void;
};

const CommandPaletteContext = createContext<CommandPaletteContextValue | null>(
  null,
);

export const useCommandPalette = () => {
  const context = useContext(CommandPaletteContext);

  if (!context) {
    throw new Error(
      "useCommandPalette must be used within a CommandPalette provider",
    );
  }

  return context;
};

const blogPostActions = (router: ReturnType<typeof useRouter>): CommandAction[] =>
  getCoreContent(allBlogContent).map((post) => ({
    id: post.slug,
    section: "Blog Posts",
    subtitle: post.description,
    name: post.title,
    keywords: `${post.description} ${post.tags.join(" ")}`,
    icon: <LucideBookOpen />,
    perform: () => router.push(post.url),
  }));

const pageActions = (router: ReturnType<typeof useRouter>): CommandAction[] => [
  {
    id: "home",
    name: "Home",
    shortcut: "h",
    keywords: "home root",
    section: "Page",
    icon: <LucideHome />,
    perform: () => router.push("/"),
  },
  {
    id: "blog",
    name: "Blog",
    shortcut: "b",
    keywords: "blog",
    subtitle: "Read my latest blog posts",
    section: "Page",
    icon: <LucideBookOpen />,
    perform: () => router.push("/blog"),
  },
  {
    id: "gallery",
    name: "Gallery",
    shortcut: "g",
    keywords: "photos pictures gallery",
    subtitle: "View photos from my latest adventures!",
    section: "Page",
    icon: <LucideCamera />,
    perform: () => router.push("/gallery"),
  },
];

export const CommandPalette = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const toggle = useCallback(() => setOpen((current) => !current), []);

  const actions = useMemo(
    () => [...pageActions(router), ...blogPostActions(router)],
    [router],
  );

  const runAction = useCallback(
    (action: CommandAction) => {
      setOpen(false);
      action.perform();
    },
    [],
  );

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const isTypingElsewhere =
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA" ||
        target?.isContentEditable;

      if ((event.metaKey || event.ctrlKey) && event.key === "k") {
        event.preventDefault();
        toggle();
        return;
      }

      if (open || isTypingElsewhere || event.altKey || event.shiftKey) return;

      const shortcutAction = actions.find(
        (action) => action.shortcut === event.key.toLowerCase(),
      );

      if (shortcutAction) {
        event.preventDefault();
        runAction(shortcutAction);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [actions, open, runAction, toggle]);

  const contextValue = useMemo(
    () => ({ open, setOpen, toggle }),
    [open, toggle],
  );

  const sections = useMemo(() => {
    const bySection = new Map<string, CommandAction[]>();
    for (const action of actions) {
      const group = bySection.get(action.section) ?? [];
      group.push(action);
      bySection.set(action.section, group);
    }
    return [...bySection.entries()];
  }, [actions]);

  return (
    <CommandPaletteContext.Provider value={contextValue}>
      <Command.Dialog
        open={open}
        onOpenChange={setOpen}
        label="Command Palette"
        overlayClassName="fixed inset-0 z-50 backdrop-blur-xl backdrop-filter"
        contentClassName="fixed top-[10vh] left-1/2 z-50 min-h-fit w-full max-w-xl -translate-x-1/2 overflow-hidden rounded-xl border border-green-900/30 bg-black/80 p-4 shadow-lg shadow-black/30"
      >
        <VisuallyHidden asChild>
          <DialogTitle>Command Palette</DialogTitle>
        </VisuallyHidden>
        <VisuallyHidden asChild>
          <DialogDescription>
            Search for pages and blog posts, or jump to a section with a
            keyboard shortcut.
          </DialogDescription>
        </VisuallyHidden>
        <div className="[&:has(+div)]:pb-4">
          <div className="flex items-center space-x-4 rounded-lg border border-green-800/20 bg-neutral-900/70 p-3">
            <Command.Input
              autoFocus
              placeholder="Search pages, posts..."
              className="h-8 w-full bg-transparent text-neutral-100 placeholder-neutral-500 focus:outline-none"
            />
            <kbd className="inline-flex items-center justify-center rounded border border-green-800/30 bg-neutral-800/80 px-1.5 py-0.5 text-xs font-medium tracking-wide text-green-400/80">
              ESC
            </kbd>
          </div>
        </div>
        <Command.List className="max-h-80 overflow-y-auto pt-2">
          <Command.Empty className="px-4 py-6 text-center text-sm text-neutral-500">
            No results found.
          </Command.Empty>
          {sections.map(([section, sectionActions]) => (
            <Command.Group
              key={section}
              heading={section}
              className="[&_[cmdk-group-heading]]:block [&_[cmdk-group-heading]]:border-t [&_[cmdk-group-heading]]:border-green-900/30 [&_[cmdk-group-heading]]:px-4 [&_[cmdk-group-heading]]:pt-6 [&_[cmdk-group-heading]]:pb-2 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-semibold [&_[cmdk-group-heading]]:text-green-500/70 [&_[cmdk-group-heading]]:uppercase"
            >
              {sectionActions.map((action) => (
                <Command.Item
                  key={action.id}
                  value={`${action.name} ${action.keywords ?? ""}`}
                  onSelect={() => runAction(action)}
                  className={cn(
                    "group flex cursor-pointer items-center justify-between rounded-md px-4 py-2.5 text-neutral-400 transition-colors",
                    "data-[selected=true]:bg-neutral-800/80 data-[selected=true]:text-neutral-100",
                    "hover:bg-neutral-900/80",
                  )}
                >
                  <div className="flex items-center gap-3">
                    {action.icon && (
                      <div className="flex items-center justify-center text-neutral-500 [&_svg]:size-5 group-data-[selected=true]:text-green-400">
                        {action.icon}
                      </div>
                    )}
                    <div>
                      <span>{action.name}</span>
                      {action.subtitle && (
                        <div className="text-sm text-neutral-600">
                          {action.subtitle}
                        </div>
                      )}
                    </div>
                  </div>

                  {action.shortcut && (
                    <div
                      aria-hidden
                      className="flex flex-row items-center justify-center gap-x-2"
                    >
                      <kbd className="flex size-6 items-center justify-center rounded border border-neutral-800 bg-neutral-900 text-xs font-medium text-neutral-500 transition-colors">
                        {action.shortcut}
                      </kbd>
                    </div>
                  )}
                </Command.Item>
              ))}
            </Command.Group>
          ))}
        </Command.List>
      </Command.Dialog>
      {children}
    </CommandPaletteContext.Provider>
  );
};
