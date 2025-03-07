import { LucideBookOpen, LucideCamera, LucideHome } from "lucide-react";
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
  useMatches,
} from "kbar";

import { allBlogs } from "contentlayer/generated";

import { paths } from "@/config/paths";
import { getCoreContent } from "@/lib/helpers";

const blogPostActions = (router: ReturnType<typeof useRouter>): Action[] =>
  getCoreContent(allBlogs).map(
    (post) =>
      ({
        id: post.slug,
        name: post.title,
        keywords: post.description,
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
      keywords: "root",
      icon: <LucideHome />,
      perform: () => router.push("/"),
    },
    {
      id: "blog",
      name: "Blog",
      shortcut: ["b"],
      keywords: "writing words",
      icon: <LucideBookOpen />,
      perform: () => router.push("/blog"),
    },
    {
      id: "gallery",
      name: "Gallery",
      shortcut: ["g"],
      keywords: "photos pictures",
      icon: <LucideCamera />,
      perform: () => router.push("/gallery"),
    },
    ...blogPostActions(router),
  ] satisfies Action[];

export const CommandBar = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();

  return (
    <KBarProvider actions={actions(router)}>
      <KBarPortal>
        <KBarPositioner className="z-50 overflow-hidden rounded-md bg-black/50 p-4 backdrop-blur backdrop-filter">
          <KBarAnimator className="w-full max-w-xl">
            <div className="overflow-hidden rounded-2xl border border-gray-800 bg-gray-900">
              <div className="flex items-center space-x-4 p-4">
                <KBarSearch className="h-8 w-full bg-transparent text-gray-200 placeholder-gray-500 focus:outline-none" />
                <kbd className="inline-block rounded border border-gray-400 px-1.5 align-middle text-xs leading-4 font-medium tracking-wide whitespace-nowrap text-gray-400">
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
          <div className="text-primary-600 block border-t border-gray-800 px-4 pt-6 pb-2 text-xs font-semibold uppercase">
            {item}
          </div>
        ) : (
          <div
            className={`flex cursor-pointer justify-between px-4 py-2 ${
              active
                ? "bg-primary-600 text-gray-100"
                : "bg-transparent text-gray-700 dark:text-gray-100"
            }`}
          >
            <div className={"flex space-x-2"}>
              <div className="flex items-center gap-4">
                {item.icon && (
                  <div className="self-center [&_svg]:size-5">{item.icon}</div>
                )}
                {item.subtitle && (
                  <div
                    className={`${active ? "text-gray-200" : "text-gray-400"} flex`}
                  >
                    {item.subtitle}
                  </div>
                )}
                <div>{item.name}</div>
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
                    className={`flex h-7 w-6 items-center justify-center rounded border text-xs font-medium ${
                      active
                        ? "border-gray-200 text-gray-200"
                        : "border-gray-400 text-gray-400"
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
  ) : (
    <div className="bg-slate-600 p-8">No results found</div>
  );
}
