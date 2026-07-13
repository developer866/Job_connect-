import Link from "next/link";
// import { Github, Twitter, Linkedin } from "lucide-react";
import { FaGithub, FaLinkedin, FaXTwitter } from "react-icons/fa6";


export default function Footer() {
  return (
    <footer className="border-t border-[#d4e8c2] bg-[#F1FEC6] py-12 px-6">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-4">
          {/* Brand */}
          <div>
            <h2 className="font-heading text-2xl font-extrabold text-[#496F5D]">
              Job<span className="text-[#1a2e25]">Connect</span>
            </h2>
            <p className="mt-3 font-body text-sm font-light text-[#556b5d] leading-relaxed">
              Nigeria's premier job board connecting junior tech talent with the
              best startups and SMEs.
            </p>
            <div className="mt-4 flex gap-3">
              {[
                { icon: <FaXTwitter size={20} className="h-4 w-4" />, href: "#" },
                { icon: <FaLinkedin size={20} className="h-4 w-4" />, href: "#" },
                {
                  icon: <FaGithub size={20} className="h-4 w-4" />,
                  href: "https://github.com/developer866",
                },
              ].map((social, i) => (
                <a
                  key={i}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#496F5D]/30 text-[#496F5D] hover:bg-[#496F5D] hover:text-[#F1FEC6] transition-all"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* For Job Seekers */}
          <div>
            <h3 className="font-heading text-sm font-bold text-[#1a2e25] mb-4">
              For Job Seekers
            </h3>
            <ul className="space-y-2.5">
              {[
                { name: "Browse Jobs", href: "/jobs" },
                { name: "Create Profile", href: "/register" },
                { name: "My Applications", href: "/jobseeker/applications" },
                { name: "Career Tips", href: "#" },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="font-body text-sm font-light text-[#556b5d] hover:text-[#496F5D] transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* For Employers */}
          <div>
            <h3 className="font-heading text-sm font-bold text-[#1a2e25] mb-4">
              For Employers
            </h3>
            <ul className="space-y-2.5">
              {[
                { name: "Post a Job", href: "/employer/post-job" },
                { name: "Browse Talent", href: "#" },
                { name: "Employer Dashboard", href: "/employer/dashboard" },
                { name: "Pricing", href: "#" },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="font-body text-sm font-light text-[#556b5d] hover:text-[#496F5D] transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-heading text-sm font-bold text-[#1a2e25] mb-4">
              Company
            </h3>
            <ul className="space-y-2.5">
              {[
                { name: "About Us", href: "/about" },
                { name: "Contact", href: "/contact" },
                { name: "Privacy Policy", href: "#" },
                { name: "Terms of Service", href: "#" },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="font-body text-sm font-light text-[#556b5d] hover:text-[#496F5D] transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-10 border-t border-[#d4e8c2] pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-body text-xs font-light text-[#9CA3AF]">
            © 2026 JobConnect.
          </p>
          <p className="font-body text-xs font-light text-[#9CA3AF]">
            Made by{" "}
            <a
              href="https://ayeni-opeyemi.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#496F5D] hover:underline"
            >
              Ayeni Opeyemi
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
