"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import {
  ChevronDown,
  CircleDollarSign,
  Facebook,
  Grid2X2,
  Headphones,
  Instagram,
  Linkedin,
  Menu,
  Phone,
  Search,
  ShieldCheck,
  ShoppingCart,
  Twitter,
  User,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type NavLink = {
  href: string;
  label: string;
  hasDropdown?: boolean;
};

const TOP_NAV_LINKS: NavLink[] = [
  { href: "/about", label: "About Us" },
  { href: "/account", label: "My Account" },
  { href: "/wishlist", label: "My Wishlist" },
  { href: "/tracking", label: "Order Tracking" },
];

const MAIN_NAV_LINKS: NavLink[] = [
  { href: "/", label: "Home"},
  { href: "/about", label: "About Us" },
  { href: "/shop", label: "Shop", hasDropdown: true },
  { href: "/sellers", label: "Sellers", hasDropdown: true },
  { href: "/blog", label: "Blog", hasDropdown: true },
  { href: "/contact", label: "Contact" },
];

const SOCIAL_LINKS = [
  { label: "Facebook", icon: Facebook },
  { label: "LinkedIn", icon: Linkedin },
  { label: "Instagram", icon: Instagram },
  { label: "Twitter", icon: Twitter },
] as const;

const STICKY_TRIGGER = 80;

function TopStripDropdown({ label, items }: { label: string; items: string[] }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="inline-flex items-center gap-1 text-xs text-white/95 transition-colors hover:text-white"
        aria-label={label}
      >
        {label}
        <ChevronDown className="size-3.5" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="min-w-32" sideOffset={10}>
        {items.map((item) => (
          <DropdownMenuItem key={item}>{item}</DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function DesktopNavItem({ item }: { item: NavLink }) {
  if (!item.hasDropdown) {
    return (
      <a
        href={item.href}
        className="text-sm font-semibold text-zinc-900 transition-colors hover:text-teal-700"
      >
        {item.label}
      </a>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="inline-flex items-center gap-1 text-sm font-semibold text-zinc-900 transition-colors hover:text-teal-700">
        {item.label}
        <ChevronDown className="size-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="min-w-40" sideOffset={12}>
        <DropdownMenuItem>Overview</DropdownMenuItem>
        <DropdownMenuItem>Featured</DropdownMenuItem>
        <DropdownMenuItem>Latest</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function MobileMenuPanel({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-60 lg:hidden" role="dialog" aria-modal="true">
      <button
        className="absolute inset-0 bg-zinc-900/40"
        aria-label="Close menu"
        onClick={onClose}
        type="button"
      />

      <aside className="relative h-full w-[88%] max-w-sm bg-white px-5 py-5 shadow-2xl">
        <div className="mb-8 flex items-center justify-between">
          <Link href="/" className="inline-flex items-center gap-1.5 text-teal-700" onClick={onClose}>
            <CircleDollarSign className="size-7" />
            <span className="text-4xl font-black tracking-tight sm:text-5xl">NextShop</span>
          </Link>
          <Button
            variant="ghost"
            size="icon-sm"
            className="rounded-full"
            aria-label="Close menu"
            onClick={onClose}
          >
            <X className="size-4" />
          </Button>
        </div>

        <nav className="mb-8 border-t border-zinc-200">
          {MAIN_NAV_LINKS.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className={cn(
                "flex h-12 items-center justify-between border-b border-zinc-200 text-xl font-medium text-zinc-600",
                item.label === "Home" && "text-teal-700",
              )}
              onClick={onClose}
            >
              <span>{item.label}</span>
              {item.hasDropdown ? <ChevronDown className="size-4 text-zinc-400" /> : null}
            </a>
          ))}
        </nav>

        <div className="mb-8 rounded-2xl border border-zinc-200 p-4">
          <a href="/account" className="mb-3 flex items-center gap-3 text-2xl text-zinc-600" onClick={onClose}>
            <span className="inline-flex size-9 items-center justify-center rounded-full bg-amber-400">
              <User className="size-4" />
            </span>
            log in / Sign Up
          </a>
          <a href="tel:888777999" className="flex items-center gap-3 text-2xl text-zinc-600" onClick={onClose}>
            <span className="inline-flex size-9 items-center justify-center rounded-full bg-amber-400">
              <Phone className="size-4" />
            </span>
            888-777-999
          </a>
        </div>

        <p className="mb-4 text-3xl font-semibold text-zinc-900">Follow us</p>
        <div className="flex items-center gap-3">
          {SOCIAL_LINKS.map(({ label, icon: Icon }) => (
            <a
              key={label}
              href="#"
              aria-label={label}
              className="inline-flex size-10 items-center justify-center rounded-full bg-teal-700 text-white"
            >
              <Icon className="size-4" />
            </a>
          ))}
        </div>
      </aside>
    </div>
  );
}

export default function Header() {
  const [isCompact, setIsCompact] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsCompact(window.scrollY > STICKY_TRIGGER);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    if (!isMobileMenuOpen) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white/95 backdrop-blur-sm">
        <div className="bg-teal-700 text-white lg:hidden">
          <div className="mx-auto flex h-14 w-full max-w-410 items-center justify-center gap-2 px-4 text-sm font-medium">
            <ShieldCheck className="size-4" />
            Fashion Category
            <span className="rounded-full bg-amber-300 px-2 py-0.5 text-xs font-semibold text-zinc-900">
              25% OFF
            </span>
            Today
          </div>
        </div>

        <div className="border-b border-zinc-200 px-3 py-3 lg:hidden">
          <div className="mx-auto flex w-full max-w-410 items-center justify-between gap-3">
            <Button
              variant="outline"
              size="icon"
              className="size-12 rounded-full border-zinc-300 bg-transparent"
              aria-label="Open menu"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="size-6" />
            </Button>

            <Link href="/" className="inline-flex items-center gap-1.5 text-teal-700">
              <CircleDollarSign className="size-6" />
              <span className="text-4xl font-black tracking-tight">Sellzy</span>
            </Link>

            <Button variant="ghost" size="icon" className="size-12 rounded-full bg-amber-300" aria-label="Cart">
              <ShoppingCart className="size-6 text-zinc-900" />
            </Button>
          </div>

          <div className="mx-auto mt-3 max-w-410">
            <div className="relative">
              <Input
                type="search"
                placeholder="Search for the Items"
                className="h-12 rounded-full border-zinc-300 bg-white pl-4 pr-12 text-sm"
                aria-label="Search products"
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 size-8 -translate-y-1/2 rounded-full"
                aria-label="Search"
              >
                <Search className="size-5 text-zinc-500" />
              </Button>
            </div>
          </div>
        </div>

        <div
          className={cn(
            "overflow-hidden border-b border-zinc-200 transition-all duration-300 ease-out",
            isCompact ? "lg:max-h-0 lg:-translate-y-2 lg:opacity-0" : "lg:max-h-56 lg:translate-y-0 lg:opacity-100",
          )}
        >
          <div className="hidden bg-teal-700 text-white lg:block">
            <div className="mx-auto flex h-12 w-full max-w-410 items-center justify-between px-6 xl:px-10">
              <div className="flex items-center gap-6 text-xs font-medium">
                <p className="inline-flex items-center gap-2">
                  <Headphones className="size-3.5" />
                  Need Support?
                  <span>Call Us</span>
                  <span className="rounded-full bg-amber-300 px-2 py-0.5 text-[11px] font-semibold text-zinc-900">
                    (480) 555-0103
                  </span>
                </p>
                <div className="flex items-center gap-4 border-l border-white/30 pl-5">
                  <TopStripDropdown label="English" items={["English", "Spanish", "French"]} />
                  <TopStripDropdown label="USD" items={["USD", "EUR", "GBP"]} />
                </div>
              </div>

              <div className="flex items-center gap-5 text-xs font-medium">
                <span className="inline-flex items-center gap-2">
                  <ShieldCheck className="size-3.5" />
                  Fashion Category
                  <span className="rounded-full bg-amber-300 px-2 py-0.5 text-[11px] font-semibold text-zinc-900">
                    25% OFF
                  </span>
                  Today
                </span>
                <nav className="flex items-center gap-5 border-l border-white/30 pl-5">
                  {TOP_NAV_LINKS.map((link) => (
                    <a key={link.href} href={link.href} className="transition-colors hover:text-zinc-100">
                      {link.label}
                    </a>
                  ))}
                </nav>
              </div>
            </div>
          </div>

          <div className="hidden lg:block">
            <div className="mx-auto flex h-24 w-full max-w-410 items-center gap-8 px-6 xl:px-10">
              <Link href="/" className="inline-flex items-center gap-3 text-teal-700">
                <span className="inline-flex size-11 items-center justify-center rounded-full bg-teal-700 text-white">
                  <CircleDollarSign className="size-6" />
                </span>
                <span className="text-5xl font-black tracking-tight">Sellzy</span>
              </Link>

              <div className="relative flex-1">
                <Input
                  type="search"
                  placeholder="Search for the items"
                  className="h-14 rounded-full border-zinc-300 bg-white pl-6 pr-14 text-base"
                  aria-label="Search products"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-3 top-1/2 size-10 -translate-y-1/2 rounded-full"
                  aria-label="Search"
                >
                  <Search className="size-5 text-zinc-500" />
                </Button>
              </div>

              <div className="flex items-center gap-6 text-zinc-900">
                <a href="/account" className="inline-flex items-center gap-3">
                  <span className="inline-flex size-11 items-center justify-center rounded-full bg-amber-400">
                    <User className="size-5" />
                  </span>
                  <span className="flex flex-col text-sm font-medium leading-tight">
                    <span className="text-zinc-500">Account</span>
                    <span>Log In</span>
                  </span>
                </a>
                <a href="/cart" className="inline-flex items-center gap-3">
                  <span className="inline-flex size-11 items-center justify-center rounded-full bg-amber-400">
                    <ShoppingCart className="size-5" />
                  </span>
                  <span className="flex flex-col text-sm font-medium leading-tight">
                    <span className="text-zinc-500">Cart</span>
                    <span>0 - Items</span>
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="hidden bg-white lg:block">
          <div className="mx-auto flex h-20 w-full max-w-410 items-center justify-between gap-4 px-6 xl:px-10">
            <Button className="h-12 rounded-xl bg-teal-700 px-5 text-base font-semibold text-white hover:bg-teal-800">
              <Grid2X2 className="size-4" />
              Explore All Categories
              <ChevronDown className="size-4" />
            </Button>

            <nav className="flex items-center gap-8">
              {MAIN_NAV_LINKS.map((item) => (
                <DesktopNavItem key={item.label} item={item} />
              ))}
            </nav>

            <div className="flex items-center gap-3">
              <span className="inline-flex size-10 items-center justify-center rounded-full bg-zinc-100">
                <Headphones className="size-5 text-zinc-700" />
              </span>
              <div className="flex flex-col leading-tight">
                <span className="text-sm text-zinc-500">24/7 Support</span>
                <span className="text-3xl font-semibold tracking-tight text-zinc-900">888-777-999</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {isMobileMenuOpen ? <MobileMenuPanel onClose={() => setIsMobileMenuOpen(false)} /> : null}
    </>
  );
}
