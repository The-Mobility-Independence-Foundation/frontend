import React, { ReactNode } from "react";
import { createPortal } from "react-dom";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

export default function Modal({isOpen, onClose, children}: ModalProps) {
  return isOpen && createPortal(
    <div 
      className="fixed inset-0 z-50 bg-black/50 ease-in-out duration-200">
      {children && React.isValidElement(children) ?
      React.cloneElement(children)
      : "Error parsing Modal"  
    }
    </div>,
    document.body
  )
}