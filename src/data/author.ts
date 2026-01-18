import * as SocialIcons from "@/components/icons/social-icons";

export const author = {
  name: "Ashley Thompson",
  email: "workashleythompson+blog@gmail.com",
  socials: {
    X: {
      handle: "ashleygthompson",
      network: "X",
      Icon: SocialIcons.X,
      href: "https://x.com/ashleygthompson",
    },
    LinkedIn: {
      handle: "ashley-thompson-dev",
      network: "LinkedIn",
      Icon: SocialIcons.LinkedIn,
      href: "https://www.linkedin.com/in/ashley-thompson-dev",
    },
    Github: {
      handle: "FluroAsh",
      network: "GitHub",
      Icon: SocialIcons.GitHub,
      href: "https://www.github.com/FluroAsh",
    },
    Instagram: {
      handle: "being_ashem",
      network: "Instagram",
      Icon: SocialIcons.Instagram,
      href: "https://www.instagram.com/being_ashem",
    },
  },
} as const;
