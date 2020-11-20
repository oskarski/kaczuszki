import React, {useEffect, useState} from 'react';
import {withAuthenticator} from "@aws-amplify/ui-react";
import { API } from 'aws-amplify';
import {listDucks} from "./graphql/queries";
import {createDuck} from "./graphql/mutations";

const App = () => {
    const [ducks, setDucks] = useState<any[]>([]);
    const [refresh, setRefresh] = useState(0);

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');

    useEffect(() => {
        (async () => {
            const apiData = await API.graphql({query: listDucks});

            // @ts-ignore
            setDucks(apiData.data.listDucks.items);
        })()
    }, [refresh]);

    const onSubmit = async (e: any) => {
        e.preventDefault();
        if (!name || !description) return;

        await API.graphql({query: createDuck, variables: {input: {name, description}}})
        setRefresh(refresh  +1);
    }

    return (
        <div className="App">
            <h1>My ducks</h1>

            <ul>
                {ducks.map(duck => (
                    <li key={duck.id}>
                        <h4>{duck.name}</h4>
                        <p>{duck.description}</p>
                    </li>
                ))}
            </ul>

            <form action="" onSubmit={onSubmit}>
                <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Duck name"/>
                <textarea placeholder="Duck description" onChange={e => setDescription(e.target.value)}>{description}</textarea>

                <button>Add your duck</button>
            </form>
        </div>
    );
};

export default withAuthenticator(App);
