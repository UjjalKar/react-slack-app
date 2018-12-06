import React, { Component } from 'react';
import uuidv4 from 'uuid/v4';
import firebase from '../../firebase';
import { Segment, Button, Input } from 'semantic-ui-react';

import FileModal from './FileModal';

class MessageFrom extends Component {
    state = {
        message: '',
        channel: this.props.currentChannel,
        user: this.props.currentUser,
        loading: false,
        errors: [],
        modal: false,
        uploadState: '',
        uploadTask: null,
        storageRef: firebase.storage().ref(),
        percentUpload: 0
    }

    openModal = () => this.setState({ modal: true });

    closeModal = () => this.setState({ modal: false })

    handleChange = event => {
        this.setState({ [event.target.name]: event.target.value })
    }

    createMessage = (fileUrl = null) => {
        const message = {
            timestamp: firebase.database.ServerValue.TIMESTAMP,
            user: {
                id: this.state.user.uid,
                name: this.state.user.displayName,
                avatar: this.state.user.photoURL
            },
            content: this.state.message
        };
        if (fileUrl !== null) {
            message['image'] = fileUrl
            console.log(fileUrl)
        } else {
            message['content'] = this.state.message;
        }

        return message;
    }

    sendMessage = () => {
        const { messagesRef } = this.props;
        const { message, channel } = this.state;

        if (message) {
            // Sent messge 
            this.setState({ loading: true })
            messagesRef
                .child(channel.id)
                .push()
                .set(this.createMessage())
                .then(() => {
                    console.log("Message sent!")
                    this.setState({ loading: false, message: '', errors: [] })
                })
                .catch(err => {
                    console.error(err);
                    this.setState({ 
                        loading: false,
                        errors: this.state.errors.concat(err)
                    })
                })
        } else {
            this.setState({
                errors: this.state.errors.concat({ message: "Add a message!" })
            })
        }
    }

    upLoadFile = (file, metadata) => {
        const pathToUpload = this.state.channel.id;
        const ref = this.props.messagesRef;
        const filePath = `chat/public/${uuidv4()}.jpg`

        this.setState({
            uploadState: 'uploading..',
            uploadTask: this.state.storageRef.child(filePath).put(file, metadata)
        }, () => {
            this.state.uploadTask.on('state_changed', snap => {
                const percentUpload = Math.round((snap.bytesTransferred / snap.totalBytes) * 100);
                this.setState({ percentUpload })
            },
                (err) => {
                    console.log(err);
                    this.setState({
                        errors: this.state.errors.concat(err),
                        uploadState: 'error',
                        uploadTask: null
                    })
                },

                () => {
                    this.state.uploadTask.snapshot.ref.getDownloadURL().then(downloadUrl => {
                        this.sendFileMessage(downloadUrl, ref, pathToUpload);
                    })
                        .catch(err => {
                            console.log(err);
                            this.setState({
                                errors: this.state.errors.concat(err),
                                uploadState: 'error',
                                uploadTask: null
                            })
                        })
                }
            )
        })
    }

    sendFileMessage = (fileUrl, ref, pathToUpload) => {
        ref.child(pathToUpload)
            .push()
            .set(this.createMessage(fileUrl))
            .then(() => {
                this.setState({ uploadState: 'done' })
            })
            .catch(err => {
                console.error(err)
                this.setState({
                    errors: this.state.errors.concat(err)
                })
            })
    }

    render() {

        const { errors, message, loading, modal } = this.state;

        return (
            <Segment className="message__form">
                <Input
                    fluid
                    
                    name="message"

                    style={{ marginBottom: '0.7em' }}

                    label={<Button icon={"add"} />}
                    
                    labelPosition="left"
                    
                    value={message}
                    
                    placeholder="Write your message!"
                    
                    onChange={this.handleChange}
                    
                    className={
                        errors.some(error => error.message.includes('message')) ? 'error' : ''
                    }
                />
                <Button.Group
                    icon 
                    widths="2"
                >
                    <Button
                        onClick={this.sendMessage}
                        color="orange"
                        content="Add Reply"
                        labelPosition="left"
                        icon="edit"
                        disabled={loading}
                    />

                    <Button
                        color="teal"
                        onClick={this.openModal}
                        content="Upload Media"
                        labelPosition="right"
                        icon="cloud upload"
                    />
                    <FileModal
                        modal={modal}
                        closeModal={this.closeModal}
                        upLoadFile={this.upLoadFile}
                    />
                    
                </Button.Group>
            </Segment>
        )
    }
}

export default MessageFrom;