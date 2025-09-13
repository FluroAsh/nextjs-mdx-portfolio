"use client";

import { usePathname, useRouter } from "next/navigation";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type SelectComponentProps = {
  items: {
    title: string;
    slug: string;
  }[];
};

export const MobileSelectNavigation = ({ items }: SelectComponentProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const [firstSegment, secondSegment] = pathname.split("/").filter(Boolean);

  const handleSelection = (value: string) => {
    const path = value === "all-posts" ? "/blog" : `/tags/${value}`;
    router.push(path);
  };

  return (
    <Select
      defaultValue={firstSegment === "blog" ? "all-posts" : secondSegment}
      onValueChange={handleSelection}
    >
      <SelectTrigger className="h-[55px] sm:hidden">
        <SelectValue />
      </SelectTrigger>

      <SelectContent>
        {items.map((item) => (
          <SelectItem key={item.slug} value={item.slug}>
            {item.title}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
