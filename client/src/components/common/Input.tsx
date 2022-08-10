import React, { ReactElement } from "react";
import {
  Input as ChakraInput,
  InputProps as ChakraInputProps,
  InputGroup,
  InputGroupProps,
  InputLeftAddon,
  InputRightElement,
  useColorModeValue,
  Button,
  CSSObject
} from "@chakra-ui/react";
import { CloseIcon, SearchIcon } from "@chakra-ui/icons";

export interface SearchInputProps extends InputGroupProps {
  value?: ChakraInputProps['value']
  onChangeText?: (v: string) => void
  disabled?: boolean
}

const SearchInput = ({value, onChangeText, disabled, ...props}: SearchInputProps): ReactElement => {
  const handleInputChange: React.ChangeEventHandler<HTMLInputElement> = (event) => onChangeText?.(event.target.value)
  const clearInput = () => onChangeText?.('')

  const isActive = Boolean(value)
  const borderColor = useColorModeValue("#143A51", "text");
  const searchIconActiveBackground = useColorModeValue("#143A51", "white");
  const searchIconActiveColor = useColorModeValue("white", "#143A51");
  
  const disabledStyles: CSSObject = {
    cursor: "not-allowed",
    opacity: 0.4
  }

  return (
    <InputGroup borderColor={borderColor} _hover={{ opacity: isActive ? 0.9 : 0.8 }} {...props}>
      <InputLeftAddon
        h="30px"
        w="30px"
        p='0'
        justifyContent="center"
        bg={isActive ? searchIconActiveBackground : "transparent"}
        sx={disabled ? disabledStyles : undefined}
        transition='all 0.1s linear'
        borderColor={borderColor}
      >
        <SearchIcon color={isActive ? searchIconActiveColor : borderColor} w="13px"  />
      </InputLeftAddon>
      <ChakraInput
        disabled={disabled}
        value={value}
        onChange={handleInputChange}
        h="30px"
        pl="7px"
        pr="18px"
        _hover={{ opacity: 0.8 }}
        borderLeft="none"
        placeholder="Search notes by title"
        fontSize='14px'
      />
      <InputRightElement h="100%" w='23px'>
        <Button
          disabled={disabled}
          onClick={clearInput}
          bg="transparent"
          h="10px"
          w="10px"
          borderRadius='50%'
          p='0'
          minW="0"
        >
          <CloseIcon color={borderColor} w="7px" />
        </Button>
      </InputRightElement>
    </InputGroup>
  );
};

export default SearchInput;
