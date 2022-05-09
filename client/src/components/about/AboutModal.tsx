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
  TextProps
} from "@chakra-ui/react"

import {ReactComponent as GithubIcon} from '../../assets/github_icon.svg'
import { EmailIcon } from '@chakra-ui/icons'

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
            <Text mt="10px" mb="10px">
            An image from &lt;source&gt; have been used
            </Text>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}