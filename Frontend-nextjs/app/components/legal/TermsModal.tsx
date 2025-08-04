"use client";
import Dialog from "@/app/components/ui/Dialog";
import ModalLayout from "@/app/components/ui/ModalLayout";
import TermsContent from "./TermsContent";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function TermsModal({ open, onClose }: Props) {
  return (
    <Dialog open={open} onClose={onClose}>
      <ModalLayout title="Termini di servizio" onClose={onClose}>
        <TermsContent />
      </ModalLayout>
    </Dialog>
  );
}

