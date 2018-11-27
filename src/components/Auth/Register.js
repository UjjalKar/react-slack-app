import React, { Component } from 'react'
import { 
    Grid, 
    Segment, 
    Button, 
    Header, 
    Message, 
    Icon, 
    Form 
} from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import firebase from '../../firebase';
import md5 from 'md5';
 
class Register extends Component {
    state = {
        username: '',
        email: '',
        password: '',
        passwordConfirmation: '',
        errors: [],
        loading: false,
        userRef: firebase.database().ref('users')
    }

    isFromValid = () => {

        let errors = [];
        let error;

        if(this.isFromEmpty(this.state)) {
            error = { message: 'Fill in all fields' };
            this.setState({ errors: errors.concat(error) });
            return false;

        } else if (!this.isPasswordValid(this.state)){
            error = { message: 'Password is invalid!' };
            this.setState({ errors: errors.concat(error) })
            return false;
        } else {
            // Form is valid
            return true;
        }
    }

    isFromEmpty = ({ username, email, password, passwordConfirmation }) => {
        return !username.length || !email.length || !password.length || !passwordConfirmation.length;
    }

    isPasswordValid = ({ password, passwordConfirmation }) => {
        if(password.length < 6 || passwordConfirmation.length < 6) {
            return false;
        } else if(password !== passwordConfirmation) {
            return false;
        } else {
            return true;
        }
    }

    displayErrors = errors => errors.map((error, i) => <p key={i}>{error.message}</p>)

    handleChange = event => {
        this.setState({ [event.target.name]: event.target.value })
    }

    handleSubmit = event => {
        event.preventDefault();
        if (this.isFromValid()) {
            this.setState({ errors: [], loading: true })
            
            firebase
                .auth()
                .createUserWithEmailAndPassword(this.state.email, this.state.password)
                .then(createUser => {
                    console.log(createUser);
                    createUser.user.updateProfile({
                        displayName: this.state.username,
                        photoURL: `http://gravatar.com/avatar/${md5(createUser.user.email)}?d=identicon`
                    })
                    .then(() => {
                        this.saveUser(createUser).then(() => {
                            console.log('Usser saved!');
                            this.setState({
                                loading: false
                            })
                        })

                    })
                    .catch(err => {
                        console.log(err);
                        this.setState({ errors: this.state.errors.concat(err), loading: false })
                    })
                })
                .catch(err => {
                    console.log(err);
                    this.setState({ 
                        errors: this.state.errors.concat(err), loading: false 
                    })
                })
        }
  
    }

    saveUser = createUser => {
        return this.state.userRef.child(createUser.user.uid).set({
            name: createUser.user.displayName,
            avatar: createUser.user.photoURL
        })
    }

    handelInputError = (errors, inputName) => {
        return errors.some(error => error.message.toLowerCase().includes(inputName)) ? 'error' : ''
    }

    render() {

        const { username, email, password, passwordConfirmation, errors, loading } = this.state;

        return (
            <Grid textAlign="center" verticalAlign="middle" className="app" >
                <Grid.Column style={{ maxWidth: 450  }} >
                    <Header as="h1" icon color="orange" textAlign="center" >
                        <Icon name="puzzle piece" color="orange" />
                        Register for Devchat
                    </Header>
                    <Form onSubmit={this.handleSubmit} size="large">
                        <Segment stacked>
                            <Form.Input 
                                fluid 

                                name="username"

                                value={username}

                                icon="user" 

                                iconPosition="left"

                                placeholder="Username" 

                                onChange={this.handleChange} 

                                type="text" />


                            <Form.Input 
                                fluid 

                                name="email" 

                                value={email}

                                icon="mail" 

                                iconPosition="left" 

                                placeholder="Email Address"

                                onChange={this.handleChange} 

                                className={this.handelInputError(errors, 'email')}

                                type="email" />
                           
                            <Form.Input 
                                fluid 

                                name="password"

                                value={password}

                                icon="lock" 

                                iconPosition="left" 

                                placeholder="Password" 

                                className={this.handelInputError(errors, 'password')}

                                onChange={this.handleChange} 

                                type="password" />

                            <Form.Input 
                                fluid 

                                name="passwordConfirmation"

                                value={passwordConfirmation} 

                                icon="repeat" 

                                iconPosition="left" 

                                placeholder="Confirm password" 
                                
                                className={this.handelInputError(errors, 'passwordConfirmation')}

                                onChange={this.handleChange} 

                                type="password" />


                            <Button 
                                disabled={loading} 
                                className={loading ? 'loading' : ''}
                                color="orange" 
                                fluid size="large">Submit
                                
                            </Button>
                        </Segment>
                    </Form>
                    {errors.length > 0 && (
                        <Message error>
                            <h3>Error</h3>
                            {this.displayErrors(errors)}
                        </Message>
                    )}
                    <Message>Already a User?<Link to="/login" > Login</Link></Message>
                </Grid.Column>
            </Grid>
        )
    }
}

export default Register;