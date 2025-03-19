import { FormProvider } from "react-hook-form"
import ModalBody from "./ModalBody"
import ModalHeader from "./ModalHeader"

interface DialogProps {
  text: string
  onClose: (confirm: boolean) => void
  header?: string
  className?: string
}

export default function Dialog({text, onClose, header, className}: DialogProps) {
  return <div className="max-w-[25rem]">
    <ModalHeader 
      onClose={() => onClose(false)}
      title={header || "Confirm"}
    />
    <ModalBody>
      <div className={className}>
        <h5>{text}</h5>
        <div className="flex w-max ml-auto mt-[1.5rem]">
          <button 
            onClick={() => onClose(false)} 
            className="button !bg-[#BBBBBB]"
          >Cancel</button>
          <button 
            type="submit" 
            className="button ml-[1rem]"
            onClick={() => onClose(true)}
          >
            Confirm
          </button>
        </div>
      </div>
    </ModalBody>
  </div>
}