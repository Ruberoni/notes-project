import React from 'react'
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
  TextProps
} from "@chakra-ui/react"

import { EmailIcon } from '@chakra-ui/icons'

export interface AboutModalProps extends TextProps {
  modalContentProps?: ModalContentProps,
  modalBodyProps?: ModalBodyProps
}

export default function AboutModal({ modalContentProps, modalBodyProps, ...props }: AboutModalProps): React.ReactElement {
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <>
      <Text as="button" onClick={onOpen} {...props}>About</Text>
      <Modal size="xl" isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent {...modalContentProps}>
          <ModalHeader>About</ModalHeader>
          <ModalCloseButton />
          <ModalBody {...modalBodyProps}>
            <Text>This app was made for learning purposes by Rubén Paredes</Text>
            <Link href='mailto:ruben.pardes25@gmail.com' isExternal>
              <EmailIcon w={5} h={5} mr="12px"/>
              ruben.pardes25@gmail.com
            </Link>
            <br />
            <Link href={'https://github.com/Ruberoni/'} isExternal>
              GitHub: ruberoni
            </Link>
            <Text mt="20px">
            An image from &lt;source&gt; have been used
            </Text>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}