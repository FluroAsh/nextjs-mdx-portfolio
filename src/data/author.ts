import * as SocialIcons from "@/components/icons/social-icons";

export const author = {
  name: "Ashley Thompson",
  socials: [
    {
      handle: "ashleygthompson",
      network: "X",
      Icon: SocialIcons.X,
      href: "https://x.com/ashleygthompson",
    },
    {
      handle: "ashley-thompson-dev",
      network: "LinkedIn",
      Icon: SocialIcons.LinkedIn,
      href: "https://www.linkedin.com/in/ashley-thompson-dev",
    },
    {
      handle: "FluroAsh",
      network: "GitHub",
      Icon: SocialIcons.GitHub,
      href: "https://www.github.com/FluroAsh",
    },
    {
      handle: "being_ashem",
      network: "Instagram",
      Icon: SocialIcons.Instagram,
      href: "https://www.instagram.com/being_ashem",
    },
  ],
} as const;
