import {
  LucideBookOpen,
  LucideCamera,
  LucideHome,
  LucideSearch,
} from "lucide-react";
import { useRouter } from "next/navigation";
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

import { allBlogs } from "contentlayer/generated";

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
      section: {
        name: "Page",
        priority: Priority.HIGH,
      },
      icon: <LucideCamera />,
      perform: () => router.push("/gallery"),
    },
    {
      id: "search-posts",
      name: "Blog posts",
      shortcut: ["s", "p"],
      keywords: "search find posts writing words blog articles",
      icon: <LucideSearch />,
      section: "Search",
    },
    ...blogPostActions(router),
  ] satisfies Action[];

export const CommandBar = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();

  return (
    <KBarProvider actions={actions(router)}>
      <KBarPortal>
        <KBarPositioner className="z-10 rounded bg-black/50 p-4 backdrop-blur backdrop-filter">
          <KBarAnimator className="min-h-fit w-full max-w-xl rounded-md bg-black/60 p-4">
            <div className="pb-4">
              <div className="flex items-center space-x-4 rounded-2xl border border-gray-800 bg-gray-900 p-4">
                <KBarSearch className="h-8 w-full bg-transparent text-gray-200 placeholder-gray-500 focus:outline-none" />
                <kbd className="inline-block rounded border border-gray-400 px-1.5 py-0.5 text-xs tracking-wide text-gray-400">
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
          <div className="block border-t border-gray-800 px-4 pt-6 pb-2 text-xs font-semibold text-neutral-500 uppercase">
            {item}
          </div>
        ) : (
          <div
            className={cn(
              "flex cursor-pointer items-center justify-between rounded-md px-4 py-2",
              active
                ? "bg-gray-800 text-gray-100"
                : "bg-transparent text-gray-300",
            )}
          >
            <div className="flex items-center gap-3">
              {item.icon && (
                <div className="flex items-center justify-center text-gray-400 [&_svg]:size-5">
                  {item.icon}
                </div>
              )}

              <div>
                <span>{item.name}</span>
                {item.subtitle && (
                  <div
                    className={`text-sm ${active ? "text-gray-300" : "text-gray-500"}`}
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
                    className={`flex size-7 items-center justify-center rounded-md border text-xs ${
                      active
                        ? "border-gray-600 text-gray-300"
                        : "border-gray-700 text-gray-400"
                    }`}
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
