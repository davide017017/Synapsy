"use client";

import { Dialog as HDialog, Transition } from "@headlessui/react";
import { Fragment, ReactNode } from "react";

// ==============================
// Tipi Props
// ==============================
type Props = {
    open: boolean;
    onClose: () => void;
    title?: string;
    children: ReactNode;
};

// ╔══════════════════════════════════════════════════════╗
// ║            Dialog — Modale riutilizzabile            ║
// ╚══════════════════════════════════════════════════════╝
export default function Dialog({ open, onClose, title, children }: Props) {
    return (
        <Transition appear show={open} as={Fragment}>
            <HDialog as="div" className="relative z-50" onClose={onClose}>
                {/* ─── Overlay sfocato ─── */}
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-200"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
                </Transition.Child>

                {/* ─── Box modale centrato ─── */}
                <div className="fixed inset-0 overflow-y-auto flex items-center justify-center p-4">
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-200"
                        enterFrom="scale-95 opacity-0"
                        enterTo="scale-100 opacity-100"
                        leave="ease-in duration-100"
                        leaveFrom="scale-100 opacity-100"
                        leaveTo="scale-95 opacity-0"
                    >
                        <HDialog.Panel
                            className="
                                w-full max-w-lg
                                rounded-2xl
                                border border-bg-elevate
                                bg-bg text-text
                                shadow-2xl
                                p-6 space-y-4
                            "
                        >
                            {title && <HDialog.Title className="text-lg font-bold text-primary">{title}</HDialog.Title>}
                            {children}
                        </HDialog.Panel>
                    </Transition.Child>
                </div>
            </HDialog>
        </Transition>
    );
}
