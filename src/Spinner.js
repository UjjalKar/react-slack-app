import React from 'react';
import { Loader, Dimmer } from 'semantic-ui-react';

// Dimmer provide a dark background 

const Spinner = () => (
    <Dimmer active>
        <Loader size="huge" content={"Preparing Chat...."} />
    </Dimmer>
)

export default Spinner;