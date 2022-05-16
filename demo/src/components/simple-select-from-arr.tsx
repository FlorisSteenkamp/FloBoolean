import * as React from 'react';
import { memo } from 'react';


interface Props {
    readonly options: { key: string, text: string }[];
    readonly value: string;
    readonly styles?: { select: React.CSSProperties },
    readonly onChanged?: (key: string) => void;
}


const Select = memo(function Select(props: Props) {
    const { styles, options, onChanged, value } = props;
    const idStr = Math.random().toString();

    function onChange(event: React.ChangeEvent<HTMLSelectElement>) {
        if (!onChanged) { return; } 
        const key = event.target.value;
        onChanged(key);
    }

    return (
        <select style={styles?.select} onChange={onChange} value={value}>
            {options.map(option => {
                const { key, text } = option;
                return (
                    <option key={key} value={key}>
                        {text}
                    </option>
                );
            })}
        </select>
    );
});


export { Select }
    