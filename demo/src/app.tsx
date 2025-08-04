import * as React from 'react';
import { useState } from 'react';
import { _upd } from './state-control/upd';
import { State } from './state/state';
import { StateControl } from './state-control/state-control';
import { getInitialState } from './state/get-initial-state';
import { defaultTransientState } from './state/default-state';
import { Page } from './page/page';
import { createRoot } from 'react-dom/client';


function App() {
    const [appState, setAppState] = useState(getInitialState);
    //const [transientState, setTransientState] = useState(() => defaultTransientState);
    const [state] = useState((): State => ({ appState }));
    const [{upd, upd$}] = useState(() => _upd(state, setAppState));
    const [stateControl] = useState((): StateControl => ({ 
        state, upd, upd$, transientState: defaultTransientState,
    }));

    const { pageState } = appState;

    return (
        <main>
            <Page
                stateControl={stateControl}
                pageState={pageState}
            />
        </main>
    );
}


createRoot(document.getElementById('app')!).render(<App />)
