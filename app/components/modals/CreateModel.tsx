import ModalBody from "./ModalBody";
import ModalHeader from "./ModalHeader";

interface CreateModelModalProps {
  onClose: () => void;
}

export default function CreateModelModal({onClose}: CreateModelModalProps) {
  return <>
    <ModalHeader title="Create New Part" onClose={onClose}/>
    <ModalBody>
      <>
        Create Model Modal!
      </>
    </ModalBody>
  </>
}