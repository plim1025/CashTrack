import React, { Suspense, useState, useEffect } from 'react';

const App2 = React.lazy(() => import(/* webpackChunkName: 'App2' */ './App2'));

// interface Props {}

const App: React.FC = () => {
    const [count, setCount] = useState(5);

    useEffect(() => {
        console.log(count);
    }, []);

    return (
        <Suspense fallback={<div>loading...</div>}>
            <App2 />
        </Suspense>
    );
};

export default App;
