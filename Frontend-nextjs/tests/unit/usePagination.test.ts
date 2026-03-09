// ──────────────────────────────────────────────────────────
// Test: hooks/usePagination
// ──────────────────────────────────────────────────────────

import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { usePagination } from "@/hooks/usePagination";

describe("usePagination", () => {
    it("stato iniziale di default", () => {
        const { result } = renderHook(() => usePagination());
        expect(result.current.currentPage).toBe(1);
        expect(result.current.perPage).toBe(50);
        expect(result.current.totalItems).toBe(0);
        expect(result.current.totalPages).toBe(1);
        expect(result.current.hasNext).toBe(false);
        expect(result.current.hasPrev).toBe(false);
    });

    it("calcola correttamente totalPages", () => {
        const { result } = renderHook(() =>
            usePagination({ totalItems: 100, perPage: 10 })
        );
        expect(result.current.totalPages).toBe(10);
    });

    it("totalPages minimo 1 anche con 0 items", () => {
        const { result } = renderHook(() =>
            usePagination({ totalItems: 0, perPage: 10 })
        );
        expect(result.current.totalPages).toBe(1);
    });

    it("goTo cambia la pagina corrente", () => {
        const { result } = renderHook(() =>
            usePagination({ totalItems: 100, perPage: 10 })
        );
        act(() => { result.current.goTo(3); });
        expect(result.current.currentPage).toBe(3);
    });

    it("goTo non va oltre l'ultima pagina", () => {
        const { result } = renderHook(() =>
            usePagination({ totalItems: 100, perPage: 10 })
        );
        act(() => { result.current.goTo(999); });
        expect(result.current.currentPage).toBe(10);
    });

    it("goTo non va sotto la prima pagina", () => {
        const { result } = renderHook(() =>
            usePagination({ totalItems: 100, perPage: 10, initialPage: 3 })
        );
        act(() => { result.current.goTo(-5); });
        expect(result.current.currentPage).toBe(1);
    });

    it("next incrementa la pagina", () => {
        const { result } = renderHook(() =>
            usePagination({ totalItems: 100, perPage: 10 })
        );
        act(() => { result.current.next(); });
        expect(result.current.currentPage).toBe(2);
    });

    it("next non supera l'ultima pagina", () => {
        const { result } = renderHook(() =>
            usePagination({ totalItems: 100, perPage: 10, initialPage: 10 })
        );
        act(() => { result.current.next(); });
        expect(result.current.currentPage).toBe(10);
    });

    it("prev decrementa la pagina", () => {
        const { result } = renderHook(() =>
            usePagination({ totalItems: 100, perPage: 10, initialPage: 5 })
        );
        act(() => { result.current.prev(); });
        expect(result.current.currentPage).toBe(4);
    });

    it("prev non va sotto la prima pagina", () => {
        const { result } = renderHook(() =>
            usePagination({ totalItems: 100, perPage: 10 })
        );
        act(() => { result.current.prev(); });
        expect(result.current.currentPage).toBe(1);
    });

    it("reset torna a pagina 1", () => {
        const { result } = renderHook(() =>
            usePagination({ totalItems: 100, perPage: 10, initialPage: 7 })
        );
        act(() => { result.current.reset(); });
        expect(result.current.currentPage).toBe(1);
    });

    it("setPerPage cambia perPage e resetta a pagina 1", () => {
        const { result } = renderHook(() =>
            usePagination({ totalItems: 100, perPage: 10, initialPage: 5 })
        );
        act(() => { result.current.setPerPage(25); });
        expect(result.current.perPage).toBe(25);
        expect(result.current.currentPage).toBe(1);
    });

    it("setTotalItems aggiorna il conteggio", () => {
        const { result } = renderHook(() => usePagination({ perPage: 10 }));
        act(() => { result.current.setTotalItems(200); });
        expect(result.current.totalItems).toBe(200);
        expect(result.current.totalPages).toBe(20);
    });

    it("hasNext e hasPrev corretti a metà lista", () => {
        const { result } = renderHook(() =>
            usePagination({ totalItems: 100, perPage: 10, initialPage: 5 })
        );
        expect(result.current.hasNext).toBe(true);
        expect(result.current.hasPrev).toBe(true);
    });
});
