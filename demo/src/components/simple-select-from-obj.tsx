import * as React from 'react';


interface Props<T extends string = any> {
    readonly options: { [K in T]: { text: string } };
    readonly value: T;
    readonly styles?: { select: React.CSSProperties },
    readonly onChanged?: (key: T) => void;
}


function SimpleSelect_FromObj<T extends string>(props: Props<T>) {
    const { styles, options, onChanged } = props;
    const idStr = Math.random().toString();

    function onChange(event: React.ChangeEvent<HTMLSelectElement>) {
        if (!onChanged) { return; } 
        const key = event.target.value;
        onChanged(key as T);
    }

    return (
        <select style={styles?.select} onChange={onChange}>
            {Object.entries(options).map(option => {
                let key = option[0] as T;
                let value = option[1] as { text: string };

                return (
                    <option key={key} value={key}>
                        {value.text}
                    </option>
                );
            })}
        </select>
    );
}


export { SimpleSelect_FromObj }
    