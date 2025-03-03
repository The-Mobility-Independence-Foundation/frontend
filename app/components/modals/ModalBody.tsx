import React, { ReactNode } from "react"

interface ModalBodyProps {
  children: ReactNode
}

export default function ModalBody({children}: ModalBodyProps) {
  return <div>
    <div className="w-full bg-white rounded-bl-lg rounded-br-lg p-[0.5rem]">
      {children && React.isValidElement(children) 
      ? React.cloneElement(children)
      : "Error parsing Modal Body"  
      }
    </div>
  </div>
}