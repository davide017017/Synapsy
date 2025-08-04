import type { ReactNode } from "react";

export type DashboardCardProps = {
    icon: ReactNode;
    title: string;
    value?: ReactNode;
    children?: ReactNode;
    href?: string;
};

export type LoadingSpinnerCardProps = {
    icon: ReactNode;
    title: string;
    message?: string;
};

