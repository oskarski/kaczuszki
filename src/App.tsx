import React, {useEffect, useState} from 'react';
import {withAuthenticator} from "@aws-amplify/ui-react";
import {API, Storage} from 'aws-amplify';
import {listDucks} from "./graphql/queries";
import {createDuck} from "./graphql/mutations";
import {Card, Col, Layout, Menu, Row} from 'antd';
import './App.css'

const {SubMenu} = Menu;
const {Header, Content, Footer, Sider} = Layout;

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
        <Layout>
            <Content style={{padding: '0 50px'}}>

                <Row>
                    <Col span={10}/>
                    <Col span={4}>
                        <img style={{width: '100%'}}
                             src="https://res.cloudinary.com/teepublic/image/private/s--uCiU8vEj--/t_Resized%20Artwork/c_fit,g_north_west,h_954,w_954/co_000000,e_outline:48/co_000000,e_outline:inner_fill:48/co_ffffff,e_outline:48/co_ffffff,e_outline:inner_fill:48/co_bbbbbb,e_outline:3:1000/c_mpad,g_center,h_1260,w_1260/b_rgb:eeeeee/c_limit,f_auto,h_630,q_90,w_630/v1591187946/production/designs/10941037_0.jpg"
                             alt=""/>
                    </Col>
                </Row>

                <br/>
                <br/>
                <br/>
                <br/>

                <Layout className="site-layout-background" style={{padding: '24px 0'}}>
                    <Content style={{padding: '0 24px', minHeight: 280}}>
                        <Row gutter={32}>
                            {ducks.map(duck => (
                                <Col span={8} key={duck.id}>
                                    <Card hoverable={true} cover={(
                                        <div className="duck-image-wrapper">
                                            <div className="duck-image" style={{backgroundImage: `url(${duck.image})`}}>
                                                <img alt={duck.name} src={duck.image}/>
                                            </div>
                                        </div>
                                    )}>
                                        <Card.Meta title={duck.name} description={duck.description}/>
                                    </Card>
                                </Col>
                            ))}
                        </Row>

                        <form action="" onSubmit={onSubmit}>
                            <input type="text" value={name} onChange={e => setName(e.target.value)}
                                   placeholder="Duck name"/>
                            <textarea placeholder="Duck description"
                                      onChange={e => setDescription(e.target.value)}>{description}</textarea>
                            <input type="file" placeholder="Image" onChange={e => {
                                // @ts-ignore
                                setImage(e.target.files[0]);
                            }}/>

                            <button>Add your duck</button>
                        </form>
                    </Content>
                </Layout>
            </Content>
            <Footer style={{textAlign: 'center'}}>Gumowe Kaczuchy 🐤 ©2020</Footer>
        </Layout>
    );
};

export default withAuthenticator(App);
