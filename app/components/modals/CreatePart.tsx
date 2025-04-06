import ModalBody from "./ModalBody";
import ModalHeader from "./ModalHeader";

interface CreatePartModalProps {
  onClose: () => void;
}

export default function CreatePartModal({onClose}: CreatePartModalProps) {
  return <>
    <ModalHeader title="Create New Part" onClose={onClose}/>
    <ModalBody>
      <>
        Create Part Modal!
      </>
    </ModalBody>
  </>
}