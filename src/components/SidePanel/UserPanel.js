import React, { Component } from 'react';
import { Grid, Header, Icon, Dropdown, Image } from 'semantic-ui-react';
import firebase from '../../firebase';
// import { connect } from 'react-redux';

class UserPanel extends Component {

    state = {
        user: this.props.currentUser,
    }

    // componentWillReceiveProps(nextProps) {
    //     this.setState({
    //         user: nextProps.currentUser
    //     })
    // }

    /** Video 18 */

    // componentDidMount() {
    //     this.setState({
    //         user: this.props.currentUser
    //     })
    // }

    dropdownOptions = () => [
        {
            key: 'user',
            text: <span>Signed is as <strong>{this.state.user.displayName}</strong></span>,
            disabled: true
        },
        {   
            key: 'avatar',
            text: <span>Change Avator</span>
        },
        {
            key: 'signout',
            text: <span onClick={this.handleSignout} >Sign Out</span>
        }
    ];

    handleSignout = () => {
        firebase
            .auth()
            .signOut()
            .then(() => console.log('signed out!'))
    }

    render() {
        
        
        const { user } = this.state;
        console.log(user);
        return (
        <Grid style={{background: '#4c3c4c'}}>
            <Grid.Column>
                <Grid.Row style={{ padding: '1.2em', margin: 0 }}>
                        {/* App Header */}
                        
                    <Header
                        inverted
                        floated="left"
                        as="h2"
                    >
                        <Icon name="code" />
                            
                        <Header.Content>DevChat</Header.Content>
                            
                    </Header>
                        
                
                    
                {/* User Drop down */}
                <Header style={{ padding: '0.25em' }} as="h4" inverted>
                    <Dropdown
                        trigger={
                            <span>
                                <Image src={user.photoURL} spaced="right" avatar />
                                {user.displayName}
                            </span>
                        }
                        options={this.dropdownOptions()}
                    />
                </Header>
            </Grid.Row>
            </Grid.Column>
        </Grid>
        )
    }
}

// const mapStateToProps = state => ({
//     currentUser: state.user.currentUser
// })
// // we can desructure like this
// const mapStateToProps = ({ user }) => ({
//     currentUser: user.currentUser
// })

// export default connect(mapStateToProps)(UserPanel);

export default UserPanel;