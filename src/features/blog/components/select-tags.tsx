"use client";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/select";

import { usePathname, useRouter } from "next/navigation";

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
      <SelectTrigger className="sm:hidden h-[55px]">
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
