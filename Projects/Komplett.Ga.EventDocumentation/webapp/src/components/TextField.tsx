import { useState, useRef, useEffect, forwardRef } from "react";
import { TextInput, TextInputProps } from "@mantine/core";

export interface TextFieldProps extends Omit<TextInputProps, 'onChange'> {
    value: string;
    onChange: (value: string) => void;
    onBlur?: () => void;
}

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
    ({ value: externalValue, onChange, onBlur, ...props }) => {
        const [internalValue, setInternalValue] = useState(externalValue);
        const [isFocused, setIsFocused] = useState(false);
        const inputRef = useRef<HTMLInputElement>(null);
        
        useEffect(() => {
            if (externalValue !== internalValue) {
                setInternalValue(externalValue);
            }
        }, [externalValue]);
        
        useEffect(() => {
            if (isFocused && inputRef.current) {
                inputRef.current.focus();
                const length = inputRef.current.value.length;
                inputRef.current.setSelectionRange(length, length);
            }
        }, [internalValue, isFocused]);
        
        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            setInternalValue(e.target.value);
            setIsFocused(true);
        };
        
        const handleBlur = () => {
            setIsFocused(false);
            onChange(internalValue);
            if (onBlur) onBlur();
        };
        
        return (
            <TextInput
                ref={inputRef}
                value={internalValue}
                onChange={handleChange}
                onFocus={() => setIsFocused(true)}
                onBlur={handleBlur}
                {...props}
            />
        );
    }
);

export default TextField;