import React, { ReactNode, useEffect } from "react";
import { createPortal } from "react-dom";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

export default function Modal({isOpen, onClose, children}: ModalProps) {
  const closeModal = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    if(target.id == "background") onClose();
  }

  useEffect(() => {
    if (typeof window !== "undefined") {
      const handleKeyDown = (event: KeyboardEvent) => {
        if(event.key === "Escape") {
          onClose();
        }
      }
      window.addEventListener("keydown", handleKeyDown);

      return () => window.removeEventListener("keydown", handleKeyDown);
    }
  }, [])
  
  return isOpen && createPortal(
    <div 
      className="fixed inset-0 z-50 bg-black/50 ease-in-out duration-200
                flex justify-center"
      id="background"
      onClick={closeModal}
    >
      {children && React.isValidElement(children) ?
      <div className="mt-[25%]">
        {React.cloneElement(children)}
      </div>
      : "Error parsing Modal"  
    }
    </div>,
    document.body
  )
}