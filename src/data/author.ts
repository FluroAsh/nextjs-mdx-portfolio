import * as SocialIcons from "@/components/icons/social-icons";
import * as siIcon from "react-icons/si";
import * as faIcon from "react-icons/fa";

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

export const skillsList = [
  {
    name: "react",
    label: "React",
    icon: faIcon.FaReact,
    iconStyles: "fill-blue-500",
    containerStyles:
      "hover:bg-blue-500/10 hover:text-blue-500 hover:border-blue-500",
  },
  {
    name: "typescript",
    label: "TypeScript",
    icon: siIcon.SiTypescript,
    iconStyles: "fill-blue-600",
    containerStyles:
      "hover:bg-blue-500/10 hover:text-blue-600 hover:border-blue-600",
  },
  {
    name: "emotioncss",
    label: "EmotionCSS",
    icon: siIcon.SiStyledcomponents, // Changed to styled-components as it's conceptually similar
    iconStyles: "fill-pink-500",
    containerStyles:
      "hover:bg-pink-500/10 hover:text-pink-500 hover:border-pink-500",
  },
  {
    name: "scss",
    label: "SCSS",
    icon: siIcon.SiSass,
    iconStyles: "fill-pink-600",
    containerStyles:
      "hover:bg-pink-500/10 hover:text-pink-600 hover:border-pink-600",
  },
  {
    name: "tailwind",
    label: "Tailwind",
    icon: siIcon.SiTailwindcss,
    iconStyles: "fill-cyan-400",
    containerStyles:
      "hover:bg-cyan-500/10 hover:text-cyan-400 hover:border-cyan-400",
  },
  {
    name: "postgresql",
    label: "PostgreSQL",
    icon: siIcon.SiPostgresql,
    iconStyles: "fill-blue-400",
    containerStyles:
      "hover:bg-blue-500/10 hover:text-blue-400 hover:border-blue-400",
  },
  {
    name: "mongoDB",
    label: "MongoDB",
    icon: siIcon.SiMongodb,
    iconStyles: "fill-green-500",
    containerStyles:
      "hover:bg-green-500/10 hover:text-green-500 hover:border-green-500",
  },
  {
    name: "graphql",
    label: "GraphQL",
    icon: siIcon.SiGraphql,
    iconStyles: "fill-pink-500",
    containerStyles:
      "hover:bg-pink-500/10 hover:text-pink-500 hover:border-pink-500",
  },
  {
    name: "nginx",
    label: "NGINX",
    icon: siIcon.SiNginx,
    iconStyles: "fill-green-600",
    containerStyles:
      "hover:bg-green-500/10 hover:text-green-600 hover:border-green-600",
  },
  {
    name: "docker",
    label: "Docker",
    icon: siIcon.SiDocker,
    iconStyles: "fill-blue-500",
    containerStyles:
      "hover:bg-blue-500/10 hover:text-blue-500 hover:border-blue-500",
  },
  {
    name: "aws",
    label: undefined,
    icon: faIcon.FaAws,
    iconStyles: "fill-orange-500",
    containerStyles:
      "hover:bg-orange-500/10 hover:text-orange-500 hover:border-orange-500",
  },
  {
    name: "nodejs",
    label: "NodeJS",
    icon: faIcon.FaNodeJs,
    iconStyles: "fill-green-600",
    containerStyles:
      "hover:bg-green-500/10 hover:text-green-600 hover:border-green-600",
  },
  {
    name: "prisma",
    label: "Prisma",
    icon: siIcon.SiPrisma,
    iconStyles: "fill-blue-400",
    containerStyles:
      "hover:bg-blue-500/10 hover:text-blue-400 hover:border-blue-400",
  },
  {
    name: "nextjs",
    label: "NextJS",
    icon: siIcon.SiNextdotjs,
    iconStyles: "fill-black dark:fill-white",
    containerStyles:
      "hover:bg-gray-500/10 hover:text-black hover:text-white hover:border-black hover:border-white",
  },
];

export type Skill = (typeof skillsList)[number];
