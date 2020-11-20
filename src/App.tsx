import React, {useEffect, useState} from 'react';
import {withAuthenticator} from "@aws-amplify/ui-react";
import { API, Storage } from 'aws-amplify';
import {listDucks} from "./graphql/queries";
import {createDuck} from "./graphql/mutations";

const App = () => {
    const [ducks, setDucks] = useState<any[]>([]);

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState<any>(null);

    const fetchDucks = async () => {
        const apiData = await API.graphql({query: listDucks});
        // @ts-ignore
        const newDucks = await Promise.all(apiData.data.listDucks.items.map(async duck => {
            if (duck.image) {
                const img = await Storage.get(duck.image);
                duck.image = img;
            }

            return duck
        }))

        setDucks(newDucks);
    };

    useEffect(() => {
        fetchDucks();
    }, []);

    const onSubmit = async (e: any) => {
        e.preventDefault();
        if (!name || !description || !image) return;

        const res: any = await Storage.put(image.name, image)

        await API.graphql({query: createDuck, variables: {input: {name, description, image: res.key}}})

        fetchDucks();

        setName('');
        setImage(null);
        setDescription('');
    }

    return (
        <div className="App">
            <h1>My ducks</h1>

            <ul>
                {ducks.map(duck => (
                    <li key={duck.id}>
                        <h4>{duck.name}</h4>
                        <img src={duck.image} alt={duck.name} />
                        <p>{duck.description}</p>
                    </li>
                ))}
            </ul>

            <form action="" onSubmit={onSubmit}>
                <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Duck name"/>
                <textarea placeholder="Duck description" onChange={e => setDescription(e.target.value)}>{description}</textarea>
                <input type="file" placeholder="Image" onChange={e => {
                    // @ts-ignore
                    setImage(e.target.files[0]);
                }} />

                <button>Add your duck</button>
            </form>
        </div>
    );
};

export default withAuthenticator(App);
