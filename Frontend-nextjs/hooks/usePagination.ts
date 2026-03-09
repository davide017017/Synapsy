import { useState, useCallback, useMemo } from "react";

// ──────────────────────────────────────────────────────────
// Hook: usePagination
//
// Gestione client-side della paginazione. Usato dai context
// per supportare pagine a scorrimento nelle liste lunghe.
//
// Utilizzo:
//   const pagination = usePagination({ totalItems: 200, perPage: 50 });
//   pagination.currentPage   // pagina corrente (1-based)
//   pagination.totalPages    // numero totale di pagine
//   pagination.goTo(2)       // vai alla pagina 2
//   pagination.next()        // pagina successiva
//   pagination.prev()        // pagina precedente
//   pagination.reset()       // torna alla pagina 1
// ──────────────────────────────────────────────────────────

export interface PaginationState {
    currentPage: number;
    perPage: number;
    totalItems: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
    goTo: (page: number) => void;
    next: () => void;
    prev: () => void;
    reset: () => void;
    setPerPage: (n: number) => void;
    setTotalItems: (n: number) => void;
}

interface UsePaginationOptions {
    initialPage?: number;
    perPage?: number;
    totalItems?: number;
}

export function usePagination({
    initialPage = 1,
    perPage: initialPerPage = 50,
    totalItems: initialTotal = 0,
}: UsePaginationOptions = {}): PaginationState {
    const [currentPage, setCurrentPage] = useState(initialPage);
    const [perPage, setPerPageState] = useState(initialPerPage);
    const [totalItems, setTotalItemsState] = useState(initialTotal);

    const totalPages = useMemo(
        () => Math.max(1, Math.ceil(totalItems / perPage)),
        [totalItems, perPage],
    );

    const hasNext = currentPage < totalPages;
    const hasPrev = currentPage > 1;

    const goTo = useCallback(
        (page: number) => {
            const clamped = Math.max(1, Math.min(page, totalPages));
            setCurrentPage(clamped);
        },
        [totalPages],
    );

    const next = useCallback(() => {
        setCurrentPage((p) => Math.min(p + 1, totalPages));
    }, [totalPages]);

    const prev = useCallback(() => {
        setCurrentPage((p) => Math.max(p - 1, 1));
    }, []);

    const reset = useCallback(() => setCurrentPage(1), []);

    const setPerPage = useCallback((n: number) => {
        setPerPageState(Math.max(1, n));
        setCurrentPage(1); // reset alla prima pagina quando cambia perPage
    }, []);

    const setTotalItems = useCallback((n: number) => {
        setTotalItemsState(Math.max(0, n));
    }, []);

    return {
        currentPage,
        perPage,
        totalItems,
        totalPages,
        hasNext,
        hasPrev,
        goTo,
        next,
        prev,
        reset,
        setPerPage,
        setTotalItems,
    };
}
