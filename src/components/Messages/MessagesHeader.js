import React, { Component } from 'react';
import { 
    Segment, 
    Header, 
    Icon, 
    Input 
} from 'semantic-ui-react';

class MessagesHeader extends Component {
    render() {
        const { 
            channelName, 
            numUniqueUsers, 
            handleSearchChange, 
            searchLoading,
            isPrivateChannel 
        } = this.props;
        return (
            // clearing work likeclear fix
            <Segment clearing>
                
                {/* channel Title */}

                <Header
                    fluid="true"
                    as="h2"
                    floated="left"
                    style={{ marginBottom: 0 }}
                >
                    <span>
                        {channelName}
                        {!isPrivateChannel && <Icon name={"star outline"} color="black" />}
                    </span>

                    <Header.Subheader>{numUniqueUsers}</Header.Subheader>
                </Header>

                {/* Channel Search Input */}
                <Header floated="right">
                    <Input
                        size="mini"
                        icon="search"
                        name="searchTerm"
                        placeholder="Search Message"
                        onChange={handleSearchChange}
                        loading={searchLoading}
                    />
                </Header>

            </Segment>
        )
    }
}

export default MessagesHeader;