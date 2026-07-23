import type { IconType } from "react-icons";
import {
  FaFacebookF,
  FaGithub,
  FaLinkedinIn,
  FaXTwitter,
} from "react-icons/fa6";
import {
  socialProfiles,
  type SocialProfileId,
} from "../data/portfolioContent";

const iconByProfile: Record<SocialProfileId, IconType> = {
  github: FaGithub,
  linkedin: FaLinkedinIn,
  facebook: FaFacebookF,
  x: FaXTwitter,
};

type SocialLinksProps = {
  compact?: boolean;
};

export function SocialLinks({ compact = false }: SocialLinksProps) {
  return (
    <nav
      className={`social-links ${compact ? "social-links--compact" : ""}`}
      aria-label="Josh McLain social profiles"
    >
      {socialProfiles.map((profile) => {
        const Icon = iconByProfile[profile.id];

        return (
          <a
            href={profile.url}
            key={profile.id}
            target="_blank"
            rel="noreferrer"
            aria-label={`${profile.label}: ${profile.handle}`}
          >
            <Icon aria-hidden="true" />
            <span>{profile.label}</span>
            {compact ? null : <small>{profile.handle}</small>}
          </a>
        );
      })}
    </nav>
  );
}
