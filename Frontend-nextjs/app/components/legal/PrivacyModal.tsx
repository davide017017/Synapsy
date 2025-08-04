"use client";
import Dialog from "@/app/components/ui/Dialog";
import ModalLayout from "@/app/components/ui/ModalLayout";
import PrivacyContent from "./PrivacyContent";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function PrivacyModal({ open, onClose }: Props) {
  return (
    <Dialog open={open} onClose={onClose}>
      <ModalLayout title="Informativa Privacy" onClose={onClose}>
        <PrivacyContent />
      </ModalLayout>
    </Dialog>
  );
}

