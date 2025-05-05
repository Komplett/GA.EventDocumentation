import { useState, useRef, useEffect, forwardRef } from "react";
import { JsonInput, JsonInputProps } from "@mantine/core";

export interface JsonEditorProps extends Omit<JsonInputProps, 'onChange'> {
    value: string;
    onChange: (value: string) => void;
    onBlur?: () => void;
}

export const JsonEditor = forwardRef<HTMLTextAreaElement, JsonEditorProps>(
    ({ value: externalValue, onChange, onBlur, ...props }) => {
        const [internalValue, setInternalValue] = useState(externalValue);
        const [isFocused, setIsFocused] = useState(false);
        const inputRef = useRef<HTMLTextAreaElement>(null);
        
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
        
        const handleChange = (newValue: string) => {
            setInternalValue(newValue);
            setIsFocused(true);
        };
        
        const handleBlur = () => {
            setIsFocused(false);
            onChange(internalValue);
            if (onBlur) onBlur();
        };
        
        return (
            <JsonInput
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

export default JsonEditor;
