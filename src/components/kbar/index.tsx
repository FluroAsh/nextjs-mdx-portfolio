import {
  KBarAnimator,
  KBarPortal,
  KBarPositioner,
  KBarProvider,
  KBarResults,
  KBarSearch,
  useMatches,
} from "kbar";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

// const useRecentActions = () => {
//   //
// };

const actions = (router: ReturnType<typeof useRouter>) => [
  {
    id: "home",
    name: "Home",
    shortcut: ["h"],
    keywords: "root",
    perform: () => router.push("/"),
  },
  {
    id: "blog",
    name: "Blog",
    shortcut: ["b"],
    keywords: "writing words",
    perform: () => router.push("/blog"),
  },
  {
    id: "gallery",
    name: "Gallery",
    shortcut: ["g"],
    keywords: "photos pictures",
    perform: () => router.push("/gallery"),
  },
];

export const CommandBar = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();

  useEffect(() => {
    // const actions = [];
    // create an array of action objects for each post...
  }, []);

  return (
    <KBarProvider actions={actions(router)}>
      <KBarPortal>
        <KBarPositioner>
          <KBarAnimator>
            <KBarSearch />
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

  return (
    <KBarResults
      items={results}
      onRender={({ item, active }) =>
        typeof item === "string" ? (
          <div>{item}</div>
        ) : (
          <div className={`${active ? "bg-green-500/30" : "transparent"}`}>
            {item.name}
          </div>
        )
      }
    />
  );
}
