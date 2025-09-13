import { useRouter } from "next/navigation";

import { allBlogs } from "contentlayer/generated";
import { slug } from "github-slugger";
import {
  Action,
  KBarAnimator,
  KBarPortal,
  KBarPositioner,
  KBarProvider,
  KBarResults,
  KBarSearch,
  Priority,
  useMatches,
} from "kbar";
import {
  LucideBookOpen,
  LucideCamera,
  LucideHome,
  LucideSearch,
} from "lucide-react";

import { paths } from "@/config/paths";
import { getCoreContent } from "@/lib/helpers";
import { cn } from "@/utils/misc";

const blogPostActions = (router: ReturnType<typeof useRouter>): Action[] =>
  getCoreContent(allBlogs).map(
    (post) =>
      ({
        id: post.slug,
        section: "Blog Posts",
        parent: "search-posts",
        subtitle: post.description,
        name: post.title,
        keywords: `${post.description} ${post.tags.join(" ")}`,
        icon: <LucideBookOpen />,
        perform: () => router.push(paths.post.getPathname(slug(post.slug))),
      }) satisfies Action,
  );

const actions = (router: ReturnType<typeof useRouter>) =>
  [
    {
      id: "home",
      name: "Home",
      shortcut: ["h"],
      keywords: "home root",
      section: {
        name: "Page",
        priority: Priority.HIGH,
      },
      icon: <LucideHome />,
      perform: () => router.push("/"),
    },
    {
      id: "blog",
      name: "Blog",
      shortcut: ["b"],
      keywords: "blog",
      subtitle: "Read my latest blog posts",
      section: {
        name: "Page",
        priority: Priority.HIGH,
      },
      icon: <LucideBookOpen />,
      perform: () => router.push("/blog"),
    },
    {
      id: "gallery",
      name: "Gallery",
      shortcut: ["g"],
      keywords: "photos pictures gallery",
      subtitle: "View photos from my latest adventures!",
      section: {
        name: "Page",
        priority: Priority.HIGH,
      },
      icon: <LucideCamera />,
      perform: () => router.push("/gallery"),
    },
    {
      id: "search-posts",
      name: "Find Posts",
      shortcut: ["s", "p"],
      keywords: "search find posts writing words blog articles",
      subtitle: "Search for specific blog posts by title, tag or description",
      icon: <LucideSearch />,
      section: "Search",
    },
    ...blogPostActions(router),
  ] satisfies Action[];

export const CommandPalette = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();

  return (
    <KBarProvider actions={actions(router)}>
      <KBarPortal>
        <KBarPositioner className="z-50 rounded p-4 backdrop-blur-xl backdrop-filter">
          <KBarAnimator className="min-h-fit w-full max-w-xl overflow-hidden rounded-xl border border-green-900/30 bg-black/80 p-4 shadow-lg shadow-black/30">
            <div className="[&:has(+div)]:pb-4">
              <div className="flex items-center space-x-4 rounded-lg border border-green-800/20 bg-neutral-900/70 p-3">
                <KBarSearch className="h-8 w-full bg-transparent text-neutral-100 placeholder-neutral-500 focus:outline-none" />
                <kbd className="inline-flex items-center justify-center rounded border border-green-800/30 bg-neutral-800/80 px-1.5 py-0.5 text-xs font-medium tracking-wide text-green-400/80">
                  ESC
                </kbd>
              </div>
            </div>
            <RenderResults />
          </KBarAnimator>
        </KBarPositioner>
      </KBarPortal>
      {children}
    </KBarProvider>
  );
};

function RenderResults() {
  const { results } = useMatches();

  return results.length ? (
    <KBarResults
      items={results}
      onRender={({ item, active }) =>
        typeof item === "string" ? (
          <div className="block border-t border-green-900/30 px-4 pt-6 pb-2 text-xs font-semibold text-green-500/70 uppercase">
            {item}
          </div>
        ) : (
          <div
            className={cn(
              "flex cursor-pointer items-center justify-between rounded-md px-4 py-2.5 transition-colors",
              active
                ? "bg-neutral-800/80 text-neutral-100"
                : "bg-transparent text-neutral-400 hover:bg-neutral-900/80",
            )}
          >
            <div className="flex items-center gap-3">
              {item.icon && (
                <div
                  className={cn(
                    "flex items-center justify-center [&_svg]:size-5",
                    active ? "text-green-400" : "text-neutral-500",
                  )}
                >
                  {item.icon}
                </div>
              )}

              <div>
                <span>{item.name}</span>
                {item.subtitle && (
                  <div
                    className={`text-sm ${active ? "text-neutral-400" : "text-neutral-600"}`}
                  >
                    {item.subtitle}
                  </div>
                )}
              </div>
            </div>

            {item.shortcut?.length ? (
              <div
                aria-hidden
                className="flex flex-row items-center justify-center gap-x-2"
              >
                {item.shortcut.map((sc) => (
                  <kbd
                    key={sc}
                    className={cn(
                      "flex size-6 items-center justify-center rounded border text-xs font-medium transition-colors",
                      active
                        ? "border-green-700/50 bg-green-900/20 text-green-400"
                        : "border-neutral-800 bg-neutral-900 text-neutral-500",
                    )}
                  >
                    {sc}
                  </kbd>
                ))}
              </div>
            ) : null}
          </div>
        )
      }
    />
  ) : null;
}
