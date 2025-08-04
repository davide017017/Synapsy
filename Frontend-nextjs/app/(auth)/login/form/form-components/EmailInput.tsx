"use client";

import { useState } from "react";
import { Mail } from "lucide-react";

interface Props {
    value: string;
    onChange: (value: string) => void;
}

export default function EmailInput({ value, onChange }: Props) {
    const [touched, setTouched] = useState(false);
    const isValid = /\S+@\S+\.\S+/.test(value);

    return (
        <div className="relative flex flex-col items-center w-full max-w-sm">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
                type="email"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onBlur={() => setTouched(true)}
                required
                placeholder="Email"
                className={`w-full pl-10 pr-4 py-2 rounded-md bg-white text-black placeholder-gray-500 shadow-sm ring-2 ring-transparent focus:outline-none ${
                    touched && !isValid ? "ring-red-400" : "focus:ring-primary"
                } transition`}
            />
            {touched && !isValid && <p className="text-sm text-red-300 mt-1 self-start">Email non valida</p>}
        </div>
    );
}

