import * as React from 'react';
import { mergeDeepLeft } from 'ramda';


interface Props {
    label?: string;
    placeholder?: string;
    min?: number;
    max?: number;
    step?: number;
    styles?: { 
        div?: React.CSSProperties;
        label?: React.CSSProperties;
        input?: React.CSSProperties;
    };
    //mergeStyles: boolean; // TODO
    value: number;
    onChanged: (value: number) => void;
}


function ValueSelect(props: Props) {
    const { min, max, step, value, onChanged } = props;
    let { styles } = props;
    const label = props.label;
    const placeholder = props.label || '';

    styles = mergeDeepLeft(styles!, {
        div: {
            //padding: '5px', 
            display: 'inline-block',
            width: '200px',
            paddingLeft: '20px'
        },
        label: {
            display: 'inline-block',
            marginRight: '10px'
        },
        input: {
            display: 'inline-block',
            height: '20px',
            width: '60px'
        },
    });


    function onChange(event: React.ChangeEvent<HTMLInputElement>) {
        onChanged(Number(event.target.value));
    }

    return (
        <div style={styles?.div}>
            {label ? 
                <label style={styles?.label}>
                    {label}
                </label> : null
            }
            <input
                type="number" 
                style={styles?.input}
                placeholder={placeholder}
                min={min} 
                max={max}
                step={step}
                value={value}
                onChange={onChange}
            />
        </div>
    );
}


export { ValueSelect }
