import React, { ReactElement } from 'react'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalContentProps,
  ModalHeader,
  ModalBody,
  ModalBodyProps,
  ModalCloseButton,
  Link,
  useDisclosure,
  Text,
  TextProps,
  Heading,
  Kbd
} from "@chakra-ui/react"

import {ReactComponent as GithubIcon} from '../../assets/github_icon.svg'
import { EmailIcon } from '@chakra-ui/icons'
import { SHORTCUTS } from '../../hooks'

const SHORTCUTS_LABELS: Record<keyof typeof SHORTCUTS, string> = {
  CREATE_NOTE: "Create a note",
  FOCUS_SEARCH: "Focus the search notes input",
  FOCUS_NOTE_EDITOR: "Focus the note editor",
  DELETE_NOTE: "Delete the opened note",
  ADD_CATEGORY_NOTE: "Open the menu to add a category in a note"
} as const

export interface AboutModalProps extends TextProps {
  modalContentProps?: ModalContentProps,
  modalBodyProps?: ModalBodyProps
  triggerButton?: ReactElement
}

export default function AboutModal({ modalContentProps, modalBodyProps, triggerButton, ...buttonProps }: AboutModalProps): React.ReactElement {
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <>
      {triggerButton ? React.cloneElement(triggerButton, { onClick: onOpen }) : <Text as="button" onClick={onOpen} {...buttonProps}>About</Text>}
      <Modal size="xl" isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent {...modalContentProps}>
          <ModalHeader>About</ModalHeader>
          <ModalCloseButton />
          <ModalBody fontSize="lg" {...modalBodyProps}>
            <Text mb="10px">This app was made for learning purposes by Rubén Paredes</Text>
            <Link href='mailto:ruben.pardes25@gmail.com' isExternal>
              <EmailIcon w={5} h={5} mr="12px"/>
              ruben.pardes25@gmail.com
            </Link>
            <br />
            <Link href={'https://github.com/Ruberoni/'} isExternal>
            <GithubIcon style={{display: 'inline-block', marginRight: "12px"}} width={20} height={20}/>
              GitHub: ruberoni
            </Link>
            <Heading as='h2' size="md" mt="1em">Shortcuts</Heading>
            {
              Object.entries(SHORTCUTS_LABELS).map(([key, label], i) => {
                return <p key={i}>{renderChakraKbd(SHORTCUTS[key as keyof typeof SHORTCUTS])} - {label}</p>
              })
            }
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}

const renderChakraKbd = (kbdCombination: string) => {
  const separatedKeys = kbdCombination.split('+')
  return separatedKeys.map((key, i) => {
    if (i === 0) {
      return <Kbd>{key}</Kbd>
    }
    return <>+ <Kbd>{key}</Kbd></>
  })
}