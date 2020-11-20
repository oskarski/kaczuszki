import React, {useEffect, useState} from 'react';
import {withAuthenticator} from "@aws-amplify/ui-react";
import {API, Storage} from 'aws-amplify';
import {listDucks} from "./graphql/queries";
import {createDuck} from "./graphql/mutations";
import {Button, Card, Col, Form, Input, InputNumber, Layout, Modal, Row, Upload} from 'antd';
import './App.css'

const {Content, Footer} = Layout;

window.speechSynthesis.getVoices()

const say = (text: string, rate = 1.4, pitch = 0.7) => {
    let speechSynthesisUtterance = new SpeechSynthesisUtterance(text)
    speechSynthesisUtterance.lang = "en";
    speechSynthesisUtterance.pitch = pitch;
    speechSynthesisUtterance.rate = rate;
    const voices = window.speechSynthesis.getVoices();

    speechSynthesisUtterance.voice = voices.length > 12 ? voices[12] : voices[0];
    window.speechSynthesis.speak(speechSynthesisUtterance);
}

const App = () => {
    const [ducks, setDucks] = useState<any[]>([]);

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState<any>(null);
    const [modalVisible, toggleModalVisible] = useState(false);
    const [speed, setSpeed] = useState(1.4);
    const [pitch, setPitch] = useState(0.7);

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

    const resetForm = () => {
        setName('');
        setImage(null);
        setPitch(0.7);
        setSpeed(1.4);
        setDescription('');
    };

    const onSubmit = async (e: any) => {
        e.preventDefault();
        if (!name || !description || !image || !pitch || !speed) return;

        const res: any = await Storage.put(image.name, image)

        await API.graphql({query: createDuck, variables: {input: {name, description, image: res.key, pitch, speed}}})

        fetchDucks();

        resetForm();
        toggleModalVisible(false);
    }

    const onDuckClick = (duck: any) => () => {
        if (window.speechSynthesis.speaking) return;

        say(duck.description, duck.speed, duck.pitch);
    };

    const onPlayButtonClick = () => {
        if (!description || !pitch || !speed) return;
        if (window.speechSynthesis.speaking) return;

        say(description, speed, pitch);
    }


    const onCancel = () => {
        toggleModalVisible(false);
        resetForm();
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

                <div style={{display: 'flex', justifyContent: 'center'}}>
                    <Button onClick={() => toggleModalVisible(true)} size="large">
                        Add your own duck!
                    </Button>
                </div>

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
                                    )} onClick={onDuckClick(duck)}>
                                        <Card.Meta title={duck.name} description={duck.description}/>
                                    </Card>
                                    <br/>
                                </Col>
                            ))}
                        </Row>


                        <Modal
                            title="Quack quack"
                            visible={modalVisible}
                            onOk={onSubmit}
                            onCancel={onCancel}
                            okText="Add duck"
                        >
                            <Form layout="vertical">
                                <Form.Item label="Name">
                                    <Input type="text" value={name} onChange={e => setName(e.target.value)}/>
                                </Form.Item>

                                <Form.Item label="Quote">
                                    <Input.TextArea value={description} onChange={e => setDescription(e.target.value)}/>
                                </Form.Item>

                                <Row gutter={16}>
                                    <Col>
                                        <Form.Item label="Speech speed">
                                            <InputNumber min={0.1} max={10} value={speed} onChange={val => setSpeed(val as number)} step={0.1} />
                                        </Form.Item>
                                    </Col>

                                    <Col>
                                        <Form.Item label="Speech pitch">
                                            <InputNumber min={0} max={2} value={pitch} onChange={val => setPitch(val as number)} step={0.1} />
                                        </Form.Item>
                                    </Col>

                                    <Col>
                                        <Form.Item label=" "><Button onClick={onPlayButtonClick}>Play</Button></Form.Item>
                                    </Col>
                                </Row>

                                <Form.Item label="Image">
                                    <Upload
                                        showUploadList={false}
                                        customRequest={() => {
                                        }}
                                        onChange={e => setImage(e.file.originFileObj)}
                                    >
                                        {image && <img src={URL.createObjectURL(image)} alt="avatar"
                                                       className="duck-form-image"/>}

                                        <Button type="primary" size="small">
                                            {image ? 'Zmień' : 'Dodaj'} zdjęcie
                                        </Button>
                                    </Upload>
                                </Form.Item>
                            </Form>
                        </Modal>
                    </Content>
                </Layout>
            </Content>
            <Footer style={{textAlign: 'center'}}>Gumowe Kaczuchy 🐤 ©2020</Footer>
        </Layout>
    );
};

export default withAuthenticator(App);
