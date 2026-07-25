"use client";

import { useRouter } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Description as DialogDescription,
  Title as DialogTitle,
} from "@radix-ui/react-dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Command, defaultFilter } from "cmdk";
import { LucideBookOpen, LucideCamera, LucideHome } from "lucide-react";

import { allBlogContent } from "@/data/content";
import { getCoreContent } from "@/lib/helpers";
import { cn } from "@/utils/misc";

/**
 * Blog posts are the primary target of the palette, so they're capped to keep
 * the list compact and the page shortcuts below them reachable.
 */
const MAX_BLOG_RESULTS = 5;

type CommandAction = {
  id: string;
  name: string;
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

const blogPostActions = (
  router: ReturnType<typeof useRouter>,
): CommandAction[] =>
  getCoreContent(allBlogContent).map((post) => ({
    id: post.slug,
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
    icon: <LucideHome />,
    perform: () => router.push("/"),
  },
  {
    id: "blog",
    name: "Blog",
    shortcut: "b",
    keywords: "blog",
    subtitle: "Read my latest blog posts",
    icon: <LucideBookOpen />,
    perform: () => router.push("/blog"),
  },
  {
    id: "gallery",
    name: "Gallery",
    shortcut: "g",
    keywords: "photos pictures gallery",
    subtitle: "View photos from my latest adventures!",
    icon: <LucideCamera />,
    perform: () => router.push("/gallery"),
  },
];

/**
 * We opt out of cmdk's internal filtering so we can cap results by rank rather
 * than by authoring order, so this reuses the same scorer cmdk would have used.
 */
const rankBySearch = (actions: CommandAction[], search: string) => {
  if (!search) return actions;

  return actions
    .map((action) => ({
      action,
      score: defaultFilter(
        action.name,
        search,
        action.keywords ? [action.keywords] : [],
      ),
    }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .map(({ action }) => action);
};

export const CommandPalette = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const toggle = useCallback(() => setOpen((current) => !current), []);

  const pages = useMemo(() => pageActions(router), [router]);
  const posts = useMemo(() => blogPostActions(router), [router]);
  const actions = useMemo(() => [...pages, ...posts], [pages, posts]);

  // Posts render above the pages so the palette leads with its primary content.
  const groups = useMemo(
    () => [
      {
        heading: "Blog Posts",
        actions: rankBySearch(posts, search).slice(0, MAX_BLOG_RESULTS),
      },
      { heading: "Page", actions: rankBySearch(pages, search) },
    ],
    [pages, posts, search],
  );

  const hasResults = groups.some((group) => group.actions.length > 0);

  const runAction = useCallback((action: CommandAction) => {
    setOpen(false);
    action.perform();
  }, []);

  useEffect(() => {
    if (!open) setSearch("");
  }, [open]);

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

  return (
    <CommandPaletteContext.Provider value={contextValue}>
      <Command.Dialog
        open={open}
        onOpenChange={setOpen}
        shouldFilter={false}
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
              value={search}
              onValueChange={setSearch}
              placeholder="Search pages, posts..."
              className="h-8 w-full bg-transparent text-neutral-100 placeholder-neutral-500 focus:outline-none"
            />
            <kbd className="inline-flex items-center justify-center rounded border border-green-800/30 bg-neutral-800/80 px-1.5 py-0.5 text-xs font-medium tracking-wide text-green-400/80">
              ESC
            </kbd>
          </div>
        </div>
        <Command.List className="max-h-[70vh] overflow-y-auto pt-2">
          {!hasResults && (
            <div className="px-4 py-6 text-center text-sm text-neutral-500">
              No results found.
            </div>
          )}
          {groups.map(({ heading, actions: groupActions }) =>
            groupActions.length ? (
              <Command.Group
                key={heading}
                heading={heading}
                className="[&_[cmdk-group-heading]]:block [&_[cmdk-group-heading]]:border-t [&_[cmdk-group-heading]]:border-green-900/30 [&_[cmdk-group-heading]]:px-4 [&_[cmdk-group-heading]]:pt-6 [&_[cmdk-group-heading]]:pb-2 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-semibold [&_[cmdk-group-heading]]:text-green-500/70 [&_[cmdk-group-heading]]:uppercase"
              >
                {groupActions.map((action) => (
                  <Command.Item
                    key={action.id}
                    value={action.id}
                    onSelect={() => runAction(action)}
                    className={cn(
                      "group flex cursor-pointer items-center justify-between rounded-md px-4 py-2.5 text-neutral-400 transition-colors",
                      "data-[selected=true]:bg-neutral-800/80 data-[selected=true]:text-neutral-100",
                      "data-[selected=false]:hover:bg-neutral-900/80",
                    )}
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      {action.icon && (
                        <div className="flex shrink-0 items-center justify-center text-neutral-500 group-data-[selected=true]:text-green-400 [&_svg]:size-5">
                          {action.icon}
                        </div>
                      )}
                      <div className="min-w-0">
                        <span>{action.name}</span>
                        {action.subtitle && (
                          <div className="line-clamp-1 text-sm text-neutral-600">
                            {action.subtitle}
                          </div>
                        )}
                      </div>
                    </div>

                    {action.shortcut && (
                      <div
                        aria-hidden
                        className="flex shrink-0 flex-row items-center justify-center gap-x-2"
                      >
                        <kbd className="flex size-6 items-center justify-center rounded border border-neutral-800 bg-neutral-900 text-xs font-medium text-neutral-500 transition-colors">
                          {action.shortcut}
                        </kbd>
                      </div>
                    )}
                  </Command.Item>
                ))}
              </Command.Group>
            ) : null,
          )}
        </Command.List>
      </Command.Dialog>
      {children}
    </CommandPaletteContext.Provider>
  );
};
