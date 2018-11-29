import React, { Component } from 'react'
import {
    Menu,
    Icon,
    Modal,
    Form,
    Input,
    Button,
    Transition
} from 'semantic-ui-react';

class Channels extends Component {
    state = {
        channels: [],
        channelName: '',
        channelDetails: '',
        modal: false
    }

    handleChange = event => {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    closeModal = () => {
        this.setState({
            modal: false
        })
    }

    openmodal = () => {
        this.setState({
            modal: true
        })
    }

    render() {
        const { channels, modal } = this.state;

        return (
            <React.Fragment>
                <Menu.Menu style={{ paddingBottom: '2em' }} >
                    
                    <Menu.Item>

                        <span>

                            <Icon name="exchange" /> CHANNELS

                        </span>{" "}

                        ({channels.length}) <Icon name="add" onClick={this.openmodal} style={{ cursor: 'pointer' }} />

                    </Menu.Item>

                </Menu.Menu>

                {/* // Add Channel  */}
                <Transition animation="fade up">

                
                    <Modal basic open={modal} onClose={this.closeModal}>
                        <Modal.Content>

                            <Form>
                                <Form.Field>
                                    <Input
                                        fluid

                                        label="Name of Channel"

                                        name="channelName"

                                        onChange={this.handleChange}
                                    />
                                </Form.Field>

                                <Form.Field>
                                    <Input
                                        fluid

                                        label="About channel"

                                        name="channelDetails"

                                        onChange={this.handleChange}
                                    />
                                </Form.Field>
                            </Form>

                        </Modal.Content>

                        <Modal.Actions>

                            <Button color="green" inverted>
                                <Icon name="checkmark" /> Add
                            </Button>
                            <Button color="red" inverted onClick={this.closeModal} >
                                <Icon name="remove" /> Cancel
                            </Button>

                        </Modal.Actions>
                    </Modal>
                </Transition>
            </React.Fragment>
            
        );
    }
}

export default Channels;