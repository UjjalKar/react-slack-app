import React, { Component } from "react";
import { connect } from "react-redux";
import { setCurrentChannel, setPrivateChannel } from "../../actions";
import {
  Menu,
  Icon,
  Modal,
  Form,
  Input,
  Button,
  Label
} from "semantic-ui-react";

import firebase from "../../firebase";

class Channels extends Component {
  state = {
    user: this.props.currentUser,
    channels: [],
    channelName: "",
    channelDetails: "",
    modal: false,
    channelRef: firebase.database().ref("channels"),
    firstLoad: true,
    activeChannel: "",
    channel: null,
    messagesRef: firebase.database().ref("messages"),
    notification: []
  };

  componentDidMount() {
    this.addListeners();
  }

  // When componet Unmount we have to remove all listeners
  componentWillUnmount() {
    this.removeListeners();
  }

  addListeners = () => {
    let loadedChannels = [];
    this.state.channelRef.on("child_added", snap => {
      loadedChannels.push(snap.val());
      this.setState({ channels: loadedChannels }, () => this.setFirstChannel());
      this.addNotificationListener(snap.key);
    });
  };

  addNotificationListener = channelId => {
    this.state.messagesRef.child(channelId).on("value", snap => {
      if (this.state.channel) {
        this.handleNotificaton(
          channelId,
          this.state.channel.id,
          this.state.notification,
          snap
        );
      }
    });
  };

  handleNotificaton = (channelId, currentChannelId, notification, snap) => {
    let lastTotal = 0;

    let index = notification.findIndex(
      notification => notification.id === channelId
    );
    if (index !== -1) {
      if (channelId !== currentChannelId) {
        lastTotal = notification[index].total;

        if (snap.numChildren() - lastTotal > 0) {
          notification[index].count = snap.numChildren() - lastTotal;
        }
      }
      notification[index].lastKnownTotal = snap.numChildren();
    } else {
      notification.push({
        id: channelId,
        total: snap.numChildren(),
        lastKnownTotal: snap.numChildren(),
        count: 0
      });
    }
    this.setState({
      notification
    });
  };

  removeListeners = () => {
    this.state.channelRef.off();
  };

  setFirstChannel = () => {
    const firstChannel = this.state.channels[0];
    if (this.state.firstLoad && this.state.channels.length > 0) {
      this.props.setCurrentChannel(firstChannel);
      this.setActiveChannel(firstChannel);
      this.setState({ channel: firstChannel });
    }

    this.setState({ firstLoad: false });
  };

  closeModal = () => {
    this.setState({
      modal: false
    });
  };

  openmodal = () => {
    this.setState({
      modal: true
    });
  };

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
        this.setState({ channelName: "", channelDetails: "" });
        this.closeModal();
        console.log("channel added!");
      })
      .catch(err => console.log(err));
  };

  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  handleSubmit = event => {
    event.preventDefault();
    if (this.isFromValid(this.state)) {
      this.addChannel();
    }
  };

  // v-24
  changeChannel = channel => {
    this.setActiveChannel(channel);
    this.clearNotification();
    this.props.setCurrentChannel(channel);
    this.props.setPrivateChannel(false);
    this.setState({ channel });
  };

  clearNotification = () => {
    let index = this.state.notification.findIndex(
      notification => notification.id === this.state.channel.id
    );

    if (index !== -1) {
      let updateNotification = [...this.state.notification];
      updateNotification[index].total = this.state.notification[
        index
      ].lastKnownTotal;
      updateNotification[index].count = 0;
      this.setState({ notification: updateNotification });
    }
  };

  setActiveChannel = channel => {
    this.setState({ activeChannel: channel.id });
  };

  getNotificationCount = channel => {
    let count = 0;

    this.state.notification.forEach(notification => {
      if (notification.id === channel.id) {
        count = notification.count;
      }
    });

    if (count > 0) return count;
  };

  displayChannels = channels =>
    channels.length > 0 &&
    channels.map(channel => (
      <Menu.Item
        key={channel.id}
        onClick={() => this.changeChannel(channel)}
        name={channel.name}
        style={{ opacity: "0.7" }}
        active={channel.id === this.state.activeChannel}
      >
        {this.getNotificationCount(channel) && (
          <Label color="red">{this.getNotificationCount(channel)}</Label>
        )}
        # {channel.name}
      </Menu.Item>
    ));

  isFromValid = ({ channelName, channelDetails }) =>
    channelName && channelDetails;

  render() {
    const { channels, modal } = this.state;

    return (
      <React.Fragment>
        <Menu.Menu className="menu">
          <Menu.Item>
            <span>
              <Icon name="exchange" /> CHANNELS
            </span>{" "}
            ({channels.length}){" "}
            <Icon
              name="add"
              onClick={this.openmodal}
              style={{ cursor: "pointer" }}
            />
          </Menu.Item>
          {this.displayChannels(channels)}
        </Menu.Menu>

        {/* // Add Channel  */}
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
            <Button color="red" inverted onClick={this.closeModal}>
              <Icon name="remove" /> Cancel
            </Button>
          </Modal.Actions>
        </Modal>
      </React.Fragment>
    );
  }
}

export default connect(
  null,
  { setCurrentChannel, setPrivateChannel }
)(Channels);
