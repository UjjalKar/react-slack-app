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

import firebase from '../../firebase';

class Channels extends Component {
    state = {
        user: this.props.currentUser,
        channels: [],
        channelName: '',
        channelDetails: '',
        modal: false,
        channelRef: firebase.database().ref('channels')
    }

    componentDidMount() {
        this.addListeners();
    }

    addListeners = () => {
        let loadedChannels = [];
        this.state.channelRef.on('child_added', snap => {
            loadedChannels.push(snap.val());
            this.setState({ channels: loadedChannels });
        })
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

    addChannel = () => {
        const { channelRef, channelName, channelDetails, user } = this.state;
        const key = channelRef.push().key;

        const newChannel = {
            id: key,
            name: channelName,
            details: channelDetails,
            createdBy: {
                name: user.displayName,
                avatar: user.photoURL
            }
        };

        channelRef
            .child(key)
            .update(newChannel)
            .then(() => {
                this.setState({ channelName: '', channelDetails: '' });
                this.closeModal();
                console.log("channel added!");
            })
            .catch((err) => console.log(err))
    }

    handleChange = event => {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    handleSubmit = (event) => {
        event.preventDefault();
        if (this.isFromValid(this.state)) {

            this.addChannel()

        }
    }

    displayChannels = (channels) => (
        channels.length > 0 && channels.map(channel => (
            <Menu.Item
                key={channel.id}
                onClick={() => console.log(channel)}
                name={channel.name}
                style={{ opacity: '0.7' }}
            >
             # {channel.name}
            </Menu.Item>
        ))
    )

    isFromValid = ({ channelName, channelDetails }) => channelName && channelDetails;

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
                    {this.displayChannels(channels)}
                </Menu.Menu>

                {/* // Add Channel  */}
                <Transition animation="fade up" duration={1000}>


                    <Modal basic open={modal} onClose={this.closeModal}>
                        <Modal.Content>

                            <Form onSubmit={this.handleSubmit}>
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

                            <Button color="green" inverted onClick={this.handleSubmit}>
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