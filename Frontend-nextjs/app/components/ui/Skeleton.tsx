"use client";
import { HTMLAttributes } from "react";
import clsx from "clsx";

export default function Skeleton({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
    return <div className={clsx("bg-zinc-700/50 rounded animate-pulse", className)} {...props} />;
}
