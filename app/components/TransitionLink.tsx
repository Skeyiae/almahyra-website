"use client";

import Link, { LinkProps } from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

interface TransitionLinkProps extends LinkProps {
    children: React.ReactNode;
    className?: string;
}

export default function TransitionLink({ children, className, ...props }: TransitionLinkProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const handleNavigation = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();

        // 1. Dispatch event instan untuk ProgressBar
        window.dispatchEvent(new CustomEvent("nav-start"));

        // 2. Jalankan navigasi di dalam Transition agar UI tetap responsif
        startTransition(() => {
            router.push(props.href.toString());
        });
    };

    return (
        <Link 
            {...props} 
            onClick={handleNavigation} 
            className={`${className} ${isPending ? "opacity-70 cursor-wait" : ""}`}
        >
            {children}
            {isPending && (
                <span className="ml-2 inline-block w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin shrink-0" />
            )}
        </Link>
    );
}
