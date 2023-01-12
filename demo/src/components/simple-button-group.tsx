import * as React from 'react';


interface Props<T extends string> {
    readonly options: { [K in T]?: { text: string } };
    readonly value: T;
    readonly label: string;
    readonly styles?: { div: React.CSSProperties },
    readonly onChanged?: (key: T) => void;
}


function ButtonGroup<T extends string>(props: Props<T>) {
    const { options, onChanged, value: selectedValue, styles, label } = props;
    const idStr = Math.random().toString();

    function onClick(key: T) {
        return (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
            if (!onChanged) { return; } 
            onChanged(key);
        }
    }

    return (
        <div className='btn-group' style={styles?.div}>
            {/* <span style={{display: 'inline-block'}}>{label}</span> */}
            {Object.entries(options).map(option => {
                const key = option[0] as T;
                const value = option[1] as { text: string };
                return (
                    <button 
                        key={key} 
                        onClick={onClick(key)}
                        style={selectedValue === key ? { backgroundColor: '#3e8e41' } : {} }
                    >
                        {value.text}
                    </button>
                );
            })}
        </div>
    );
}


export { ButtonGroup }
    